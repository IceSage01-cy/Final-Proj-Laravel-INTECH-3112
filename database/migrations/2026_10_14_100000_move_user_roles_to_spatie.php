<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\PermissionRegistrar;

/**
 * Replaces the users.role enum with Spatie roles. Existing users keep their
 * access: admin -> super-admin, employee -> employee.
 */
return new class extends Migration
{
    private const MAP = ['admin' => 'super-admin', 'employee' => 'employee'];

    public function up(): void
    {
        $tables = config('permission.table_names');
        $morphKey = config('permission.column_names.model_morph_key');
        $now = now();

        foreach (self::MAP as $old => $roleName) {
            DB::table($tables['roles'])->insertOrIgnore([
                'name' => $roleName, 'guard_name' => 'web', 'created_at' => $now, 'updated_at' => $now,
            ]);

            $roleId = DB::table($tables['roles'])
                ->where('name', $roleName)->where('guard_name', 'web')->value('id');

            DB::table('users')->where('role', $old)->pluck('user_id')->each(
                fn ($userId) => DB::table($tables['model_has_roles'])->insertOrIgnore([
                    'role_id' => $roleId,
                    'model_type' => 'App\\Models\\User',
                    $morphKey => $userId,
                ])
            );
        }

        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('role'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function down(): void
    {
        $tables = config('permission.table_names');
        $morphKey = config('permission.column_names.model_morph_key');

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'employee'])->default('employee')->after('password');
        });

        $adminRoleId = DB::table($tables['roles'])->where('name', 'super-admin')->value('id');

        if ($adminRoleId) {
            $adminIds = DB::table($tables['model_has_roles'])
                ->where('role_id', $adminRoleId)->pluck($morphKey);

            DB::table('users')->whereIn('user_id', $adminIds)->update(['role' => 'admin']);
        }
    }
};
