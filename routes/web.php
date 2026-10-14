<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Login / logout
// Route::middleware('guest')->group(function () {
//     Route::get('/login', [AuthController::class, 'create'])->name('login');
//     Route::post('/login', [AuthController::class, 'store']);
// });

// Route::post('/logout', [AuthController::class, 'destroy'])
//     ->middleware('auth')
//     ->name('logout');

// Everything below needs a logged-in user
Route::middleware('auth')->group(function () {
    // Inventory page: admins and employees
    Route::get('/', [ProductController::class, 'index'])->name('products.index');

    Route::middleware('role:employee')->group(function () {
        Route::get('/reports/monthly', [ReportController::class, 'index'])->name('reports.monthly');
        Route::post('/reports/monthly', [ReportController::class, 'store']);
        Route::post('/reports/monthly/{report}/submit', [ReportController::class, 'submit']);
    });

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
        Route::get('/admin/reports', [ReportController::class, 'adminIndex'])->name('admin.reports');
        Route::post('/admin/reports/{report}/review', [ReportController::class, 'review']);
        Route::get('/admin/employees', [EmployeeController::class, 'index'])->name('admin.employees');
        Route::post('/admin/employees', [EmployeeController::class, 'store']);
        Route::delete('/admin/employees/{employee}', [EmployeeController::class, 'destroy']);
        Route::post('/products', [ProductController::class, 'store']);
    });
});