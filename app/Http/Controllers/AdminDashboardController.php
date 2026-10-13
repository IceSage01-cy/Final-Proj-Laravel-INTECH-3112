<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Supplier;
use App\Support\InventoryQueries;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'summary'           => InventoryQueries::summary(),
            'totalCategories'   => Category::count(),
            'totalSuppliers'    => Supplier::count(),
            'categoryBreakdown' => InventoryQueries::categoryBreakdown(),
            'supplierStats'     => InventoryQueries::supplierStats(),
            'restockNeeded'     => InventoryQueries::restockNeeded(),
        ]);
    }
}