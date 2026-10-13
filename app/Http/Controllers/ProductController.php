<?php

namespace App\Http\Controllers;

use App\Support\InventoryQueries;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('inventory/index', [
            'products' => InventoryQueries::products(),
        ]);
    }
}