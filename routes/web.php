<?php

use Illuminate\Support\Facades\Route;

// Fortify registers /login, /register, /logout and the password reset routes.
// Everything below needs a logged-in user; each controller then guards its own
// actions with the permission each role is given in RolesAndPermissionsSeeder.
Route::middleware('auth')->group(function () {
    Route::redirect('/', '/products');

    require __DIR__.'/products.php';
    require __DIR__.'/categories.php';
    require __DIR__.'/suppliers.php';
    require __DIR__.'/reports.php';
    require __DIR__.'/admin.php';
});
