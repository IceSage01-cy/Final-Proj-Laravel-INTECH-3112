<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ManagerController;
use Illuminate\Support\Facades\Route;

// Super admin only. The role gate blocks everyone else outright; each controller
// still checks the specific permission for its action.
Route::prefix('admin')->name('admin.')->middleware('role:super-admin')->group(function () {
    // Analytics dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

    // Create / view / delete product manager accounts
    Route::resource('managers', ManagerController::class)
        ->only(['index', 'store', 'destroy']);

    // View / delete employee accounts (employees register themselves)
    Route::resource('employees', EmployeeController::class)
        ->only(['index', 'destroy']);
});
