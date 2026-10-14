<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\MonthlyReport;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryCrudTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RolesAndPermissionsSeeder::class);
    }

    private function userWithRole(string $role): User
    {
        return tap(User::factory()->create())->assignRole($role);
    }

    private function product(): Product
    {
        return Product::create([
            'product_name' => 'Stapler',
            'category_id' => Category::create(['category_name' => 'Stationery'])->category_id,
            'supplier_id' => Supplier::create(['supplier_name' => 'OfficePlus'])->supplier_id,
            'stock_qty' => 20,
            'price' => 450,
            'low_stock_threshold' => 5,
        ]);
    }

    private function payload(Product $product, array $overrides = []): array
    {
        return array_merge([
            'product_name' => 'Hole Punch',
            'category_id' => $product->category_id,
            'supplier_id' => $product->supplier_id,
            'stock_qty' => 3,
            'price' => 99.5,
            'low_stock_threshold' => 2,
        ], $overrides);
    }

    public function test_manager_can_create_update_and_delete_products(): void
    {
        $manager = $this->userWithRole('product-manager');
        $product = $this->product();

        $this->actingAs($manager)->post('/products', $this->payload($product))
            ->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['product_name' => 'Hole Punch']);

        $this->actingAs($manager)->put("/products/{$product->product_id}", $this->payload($product, ['product_name' => 'Renamed']))
            ->assertRedirect('/products');
        $this->assertDatabaseHas('products', ['product_id' => $product->product_id, 'product_name' => 'Renamed']);

        $this->actingAs($manager)->delete("/products/{$product->product_id}")->assertRedirect('/products');
        $this->assertDatabaseMissing('products', ['product_id' => $product->product_id]);
    }

    public function test_product_validation_errors_are_returned(): void
    {
        $manager = $this->userWithRole('product-manager');

        $this->actingAs($manager)->post('/products', ['price' => -1])
            ->assertSessionHasErrors(['product_name', 'category_id', 'supplier_id', 'price']);
    }

    public function test_employee_has_no_inventory_access(): void
    {
        $employee = $this->userWithRole('employee');
        $product = $this->product();

        $this->actingAs($employee)->get('/')->assertRedirect('/reports/monthly');
        $this->actingAs($employee)->get('/products')->assertForbidden();
        $this->actingAs($employee)->get("/products/{$product->product_id}")->assertForbidden();
        $this->actingAs($employee)->post('/products', $this->payload($product))->assertForbidden();
        $this->actingAs($employee)->delete("/products/{$product->product_id}")->assertForbidden();
        $this->actingAs($employee)->get('/categories')->assertForbidden();
        $this->actingAs($employee)->get('/suppliers')->assertForbidden();
    }

    public function test_admin_has_every_product_manager_operation(): void
    {
        $admin = $this->userWithRole('admin');
        $product = $this->product();

        $this->actingAs($admin)->get('/')->assertRedirect('/products');
        $this->actingAs($admin)->post('/products', $this->payload($product))->assertRedirect('/products');
        $this->actingAs($admin)->put("/products/{$product->product_id}", $this->payload($product, ['product_name' => 'Renamed']))
            ->assertRedirect('/products');
        $this->actingAs($admin)->delete("/products/{$product->product_id}")->assertRedirect('/products');
        $this->assertDatabaseMissing('products', ['product_id' => $product->product_id]);

        $this->actingAs($admin)->post('/categories', ['category_name' => 'Gadgets'])->assertSessionHasNoErrors();
        $this->actingAs($admin)->post('/suppliers', ['supplier_name' => 'Acme'])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', ['category_name' => 'Gadgets']);
        $this->assertDatabaseHas('suppliers', ['supplier_name' => 'Acme']);
    }

    public function test_admin_and_manager_can_delete_employee_reports_but_employees_cannot(): void
    {
        $employee = $this->userWithRole('employee');
        $report = fn () => MonthlyReport::create([
            'user_id' => $employee->user_id,
            'report_year' => 2026,
            'report_month' => random_int(1, 12),
            'accomplishments' => 'Did things',
            'hours_worked' => 40,
            'status' => 'submitted',
        ]);

        $this->actingAs($this->userWithRole('admin'))->get('/admin/reports')->assertOk();
        $this->actingAs($this->userWithRole('product-manager'))->get('/admin/reports')->assertOk();

        $first = $report();
        $this->actingAs($employee)->delete("/admin/reports/{$first->id}")->assertForbidden();
        $this->assertDatabaseHas('monthly_reports', ['id' => $first->id]);

        $this->actingAs($this->userWithRole('admin'))->delete("/admin/reports/{$first->id}");
        $this->assertDatabaseMissing('monthly_reports', ['id' => $first->id]);

        $second = MonthlyReport::create([...$first->only(['user_id', 'accomplishments', 'hours_worked']),
            'report_year' => 2025, 'report_month' => 1, 'status' => 'reviewed']);
        $this->actingAs($this->userWithRole('product-manager'))->delete("/admin/reports/{$second->id}");
        $this->assertDatabaseMissing('monthly_reports', ['id' => $second->id]);
    }

    public function test_employee_can_delete_own_drafts_but_not_submitted_reports(): void
    {
        $employee = $this->userWithRole('employee');
        $other = $this->userWithRole('employee');
        $make = fn (User $user, int $month, string $status) => MonthlyReport::create([
            'user_id' => $user->user_id,
            'report_year' => 2026,
            'report_month' => $month,
            'accomplishments' => 'Did things',
            'hours_worked' => 40,
            'status' => $status,
        ]);

        $draft = $make($employee, 1, 'draft');
        $submitted = $make($employee, 2, 'submitted');
        $othersDraft = $make($other, 1, 'draft');

        $this->actingAs($employee)->delete("/reports/monthly/{$draft->id}");
        $this->assertDatabaseMissing('monthly_reports', ['id' => $draft->id]);

        $this->actingAs($employee)->delete("/reports/monthly/{$submitted->id}")->assertSessionHas('error');
        $this->assertDatabaseHas('monthly_reports', ['id' => $submitted->id]);

        $this->actingAs($employee)->delete("/reports/monthly/{$othersDraft->id}")->assertForbidden();
        $this->assertDatabaseHas('monthly_reports', ['id' => $othersDraft->id]);
    }

    public function test_managers_cannot_reach_admin_only_pages(): void
    {
        $manager = $this->userWithRole('product-manager');

        $this->actingAs($manager)->get('/admin/managers')->assertForbidden();
        $this->actingAs($manager)->get('/admin/employees')->assertForbidden();
    }

    public function test_category_names_are_unique_and_categories_with_products_are_kept(): void
    {
        $manager = $this->userWithRole('product-manager');
        $product = $this->product();

        $this->actingAs($manager)->post('/categories', ['category_name' => 'Stationery'])
            ->assertSessionHasErrors('category_name');

        $this->actingAs($manager)->delete("/categories/{$product->category_id}")
            ->assertSessionHas('error');
        $this->assertDatabaseHas('categories', ['category_id' => $product->category_id]);
    }

    public function test_supplier_can_be_renamed_and_empty_supplier_deleted(): void
    {
        $manager = $this->userWithRole('product-manager');
        $supplier = Supplier::create(['supplier_name' => 'Old Name']);

        $this->actingAs($manager)->put("/suppliers/{$supplier->supplier_id}", ['supplier_name' => 'New Name'])
            ->assertSessionHasNoErrors();
        $this->assertDatabaseHas('suppliers', ['supplier_name' => 'New Name']);

        $this->actingAs($manager)->delete("/suppliers/{$supplier->supplier_id}");
        $this->assertDatabaseMissing('suppliers', ['supplier_id' => $supplier->supplier_id]);
    }

    public function test_report_and_account_routes_keep_their_permission_guards(): void
    {
        $employee = $this->userWithRole('employee');
        $manager = $this->userWithRole('product-manager');
        $admin = $this->userWithRole('admin');

        $this->actingAs($employee)->get('/reports/monthly')->assertOk();
        $this->actingAs($employee)->get('/admin/reports')->assertForbidden();
        $this->actingAs($employee)->get('/admin/managers')->assertForbidden();
        $this->actingAs($manager)->get('/reports/monthly')->assertForbidden();
        $this->actingAs($admin)->get('/admin/managers')->assertOk();
        $this->actingAs($admin)->get('/admin/employees')->assertOk();
    }

    public function test_dashboard_and_reports_are_built_from_eloquent_relationships(): void
    {
        $admin = $this->userWithRole('admin');
        $manager = $this->userWithRole('product-manager');
        $product = $this->product();                                  // 20 in stock @ 450, threshold 5
        $product->replicate()->fill(['product_name' => 'Low', 'stock_qty' => 2, 'price' => 100])->save();
        $product->replicate()->fill(['product_name' => 'Out', 'stock_qty' => 0, 'price' => 10])->save();

        $this->actingAs($admin)->get('/admin')->assertOk()->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->where('summary.totalProducts', 3)
            ->where('summary.totalValue', 9200)
            ->where('summary.lowStockCount', 1)
            ->where('summary.outOfStockCount', 1)
            ->where('categoryBreakdown.0.productCount', 3)
            ->where('supplierStats.0.lowStockCount', 2)
            ->has('restockNeeded', 2)
            ->where('restockNeeded.0.suggested_reorder', 10));

        $this->actingAs($manager)->get('/admin/reports?view=products')->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/reports')->has('newProducts', 3));

        // product managers are not admins
        $this->actingAs($manager)->get('/admin')->assertForbidden();
    }

    public function test_manager_accounts_follow_the_same_password_rules_as_registration(): void
    {
        $admin = $this->userWithRole('admin');

        $this->actingAs($admin)->post('/admin/managers', ['username' => 'weak', 'password' => '12345'])
            ->assertSessionHasErrors('password');

        $this->actingAs($admin)->post('/admin/managers', ['username' => 'mgr', 'password' => 'a-Strong-pass-123'])
            ->assertSessionHasNoErrors();
        $this->assertTrue(User::where('username', 'mgr')->first()->hasRole('product-manager'));
    }
}
