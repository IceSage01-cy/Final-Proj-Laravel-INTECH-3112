<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

// Employee: own monthly reports
Route::prefix('reports/monthly')->name('reports.monthly.')->middleware('role:employee')
    ->controller(ReportController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::post('/{report}/submit', 'submit')->name('submit');
        Route::delete('/{report}', 'destroy')->name('destroy');
    });

// Product manager: everyone's monthly reports
Route::prefix('admin/reports')->name('admin.reports.')->middleware('role:product-manager')
    ->controller(ReportController::class)->group(function () {
        Route::get('/', 'adminIndex')->name('index');
        Route::post('/{report}/review', 'review')->name('review');
    });
