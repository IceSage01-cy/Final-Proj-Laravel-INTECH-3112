<?php

use App\Http\Controllers\SupplierController;
use Illuminate\Support\Facades\Route;

// The list page holds the add / rename form, so no create, show or edit pages.
Route::resource('suppliers', SupplierController::class)
    ->except(['create', 'show', 'edit']);
