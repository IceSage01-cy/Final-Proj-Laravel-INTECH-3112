<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Roles and permissions for the system. Safe to re-run: it only creates what
 * is missing and re-syncs each role's permission list.
 */
class RolesAndPermissionsSeeder extends Seeder
{
    public const ADMIN = 'admin';
    public const PRODUCT_MANAGER = 'product-manager';
    public const EMPLOYEE = 'employee';

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // Everything the product manager can do, so the admin can do too.
        $inventory = [
            'products.view',
            'products.create',
            'products.update',
            'products.delete',
            'categories.view',
            'categories.create',
            'categories.update',
            'categories.delete',
            'suppliers.view',
            'suppliers.create',
            'suppliers.update',
            'suppliers.delete',
            // view / review / delete the monthly reports employees make
            'reports.view-all',
            'reports.review',
            'reports.delete',
        ];

        $matrix = [
            self::ADMIN => [
                ...$inventory,
                'dashboard.view',
                'managers.view',
                'managers.create',
                'managers.delete',
                'employees.view',
                'employees.delete',
            ],
            self::PRODUCT_MANAGER => $inventory,
            // Employees only write and read their own monthly reports (and may
            // delete their own drafts, never a submitted one).
            self::EMPLOYEE => [
                'reports.view-own',
                'reports.create',
                'reports.update',
                'reports.delete-own',
            ],
        ];

        foreach (array_unique(array_merge(...array_values($matrix))) as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // DatabaseSeeder uses WithoutModelEvents, so Spatie's automatic cache
        // refresh never fires. Flush by hand or the new permissions look missing.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        // The role used to be called "super-admin"; rename it in place so the
        // users already holding it keep their access.
        $legacy = Role::where('name', 'super-admin')->where('guard_name', 'web')->first();
        if ($legacy && ! Role::where('name', self::ADMIN)->where('guard_name', 'web')->exists()) {
            $legacy->update(['name' => self::ADMIN]);
        }

        foreach ($matrix as $role => $permissions) {
            Role::findOrCreate($role, 'web')->syncPermissions($permissions);
        }

        // Employees register themselves, so the admin no longer creates them.
        Permission::where('name', 'employees.create')->delete();

        $this->seedAccounts();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Give the demo accounts from InventorySeeders their roles. Any other user
     * without a role (e.g. an older account) becomes an employee.
     */
    private function seedAccounts(): void
    {
        $demoAccounts = [
            'Admin' => self::ADMIN,
            'Manager' => self::PRODUCT_MANAGER,
            'Employee' => self::EMPLOYEE,
        ];

        foreach ($demoAccounts as $username => $role) {
            User::where('username', $username)->first()?->syncRoles($role);
        }

        User::doesntHave('roles')->get()->each(
            fn (User $user) => $user->assignRole(self::EMPLOYEE)
        );
    }
}
