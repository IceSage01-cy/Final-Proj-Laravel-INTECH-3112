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

// Everything below needs a logged-in user. Access is decided by the
// permission each role is given in RolesAndPermissionsSeeder.
Route::middleware('auth')->group(function () {
    // Inventory
    Route::get('/', [ProductController::class, 'index'])
        ->middleware('permission:products.view')
        ->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])
        ->middleware('permission:products.create');

    // Employee: own monthly reports
    Route::get('/reports/monthly', [ReportController::class, 'index'])
        ->middleware('permission:reports.view-own')
        ->name('reports.monthly');
    Route::post('/reports/monthly', [ReportController::class, 'store'])
        ->middleware('permission:reports.create|reports.update');
    Route::post('/reports/monthly/{report}/submit', [ReportController::class, 'submit'])
        ->middleware('permission:reports.update');
    Route::delete('/reports/monthly/{report}', [ReportController::class, 'destroy'])
        ->middleware('permission:reports.delete');

    // Product manager: everyone's monthly reports
    Route::get('/admin/reports', [ReportController::class, 'adminIndex'])
        ->middleware('permission:reports.view-all')
        ->name('admin.reports');
    Route::post('/admin/reports/{report}/review', [ReportController::class, 'review'])
        ->middleware('permission:reports.review');

    // Super admin: analytics dashboard and employee accounts
    Route::get('/admin', [AdminDashboardController::class, 'index'])
        ->middleware('permission:dashboard.view')
        ->name('admin.dashboard');
    Route::get('/admin/employees', [EmployeeController::class, 'index'])
        ->middleware('permission:employees.view')
        ->name('admin.employees');
    Route::post('/admin/employees', [EmployeeController::class, 'store'])
        ->middleware('permission:employees.create');
    Route::delete('/admin/employees/{employee}', [EmployeeController::class, 'destroy'])
        ->middleware('permission:employees.delete');
});
