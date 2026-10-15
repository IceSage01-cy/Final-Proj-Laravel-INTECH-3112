<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

// The list page holds the add / rename form, so no create, show or edit pages.
Route::resource('categories', CategoryController::class)
    ->except(['create', 'show', 'edit']);
