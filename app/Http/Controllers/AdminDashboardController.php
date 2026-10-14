<?php

namespace App\Http\Controllers;

use App\Models\MonthlyReport;
use App\Models\Category;
use App\Models\Supplier;
use App\Support\InventoryQueries;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:dashboard.view'),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'summary'           => InventoryQueries::summary(),
            'totalCategories'   => Category::count(),
            'totalSuppliers'    => Supplier::count(),
            'categoryBreakdown' => InventoryQueries::categoryBreakdown(),
            'supplierStats'     => InventoryQueries::supplierStats(),
            'restockNeeded'     => InventoryQueries::restockNeeded(),
            'pendingReports'    => MonthlyReport::where('status', 'submitted')->count(),
        ]);
    }
}