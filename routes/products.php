<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// products.index, .create, .store, .show, .edit, .update, .destroy
Route::resource('products', ProductController::class);
