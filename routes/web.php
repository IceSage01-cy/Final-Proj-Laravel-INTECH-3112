<?php

use Illuminate\Support\Facades\Route;

// Fortify registers /login, /register, /logout and the password reset routes.
// Everything below needs a logged-in user; each controller then guards its own
// actions with the permission each role is given in RolesAndPermissionsSeeder.
Route::middleware('auth')->group(function () {
    // Employees have no inventory access; their home is the monthly report page.
    Route::get('/', fn () => to_route(
        auth()->user()->can('products.view') ? 'products.index' : 'reports.monthly.index'
    ));

    require __DIR__.'/products.php';
    require __DIR__.'/categories.php';
    require __DIR__.'/suppliers.php';
    require __DIR__.'/reports.php';
    require __DIR__.'/admin.php';
});
