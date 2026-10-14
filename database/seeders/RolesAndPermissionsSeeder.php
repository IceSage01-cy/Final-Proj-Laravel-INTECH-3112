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
    public const SUPER_ADMIN = 'super-admin';
    public const PRODUCT_MANAGER = 'product-manager';
    public const EMPLOYEE = 'employee';

    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $matrix = [
            self::SUPER_ADMIN => [
                'dashboard.view',
                'employees.view',
                'employees.create',
                'employees.delete',
                'products.view',
            ],
            self::PRODUCT_MANAGER => [
                'products.view',
                'products.create',
                'reports.view-all',
                'reports.review',
            ],
            self::EMPLOYEE => [
                'products.view',
                'reports.view-own',
                'reports.create',
                'reports.update',
                'reports.delete',
            ],
        ];

        foreach (array_unique(array_merge(...array_values($matrix))) as $permission) {
            Permission::findOrCreate($permission, 'web');
        }

        // DatabaseSeeder uses WithoutModelEvents, so Spatie's automatic cache
        // refresh never fires. Flush by hand or the new permissions look missing.
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        foreach ($matrix as $role => $permissions) {
            Role::findOrCreate($role, 'web')->syncPermissions($permissions);
        }

        $this->seedAccounts();

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * Give the seeded accounts a role. Anyone without a role becomes an employee.
     */
    private function seedAccounts(): void
    {
        // Demo product manager (only created if missing; change this password).
        User::firstOrCreate(
            ['username' => 'manager'],
            ['email' => 'manager@example.com', 'password' => 'manager123'],
        );

        $named = [
            'admin' => self::SUPER_ADMIN,
            'manager' => self::PRODUCT_MANAGER,
        ];

        User::doesntHave('roles')->get()->each(
            fn (User $user) => $user->assignRole($named[$user->username] ?? self::EMPLOYEE)
        );
    }
}
