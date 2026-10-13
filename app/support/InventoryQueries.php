<?php

namespace App\Support;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class InventoryQueries
{
    // Every product with its category and supplier name (old Product::getAll)
    public static function products(): Collection
    {
        return DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.category_id')
            ->leftJoin('suppliers as s', 'p.supplier_id', '=', 's.supplier_id')
            ->orderByRaw('CASE WHEN p.stock_qty <= p.low_stock_threshold THEN 1 ELSE 2 END')
            ->orderByDesc('p.product_id')
            ->get([
                'p.product_id', 'p.product_name', 'p.category_id', 'c.category_name',
                'p.supplier_id', 's.supplier_name', 'p.stock_qty', 'p.price',
                'p.created_at', 'p.low_stock_threshold',
            ]);
    }

        // The four numbers at the top of the dashboard (old Product::getSummary)
    public static function summary(): object
    {
        return DB::table('products')->selectRaw(
            'COUNT(*) AS totalProducts,
             COALESCE(SUM(stock_qty * price), 0) AS totalValue,
             COALESCE(SUM(CASE WHEN stock_qty > 0 AND stock_qty <= low_stock_threshold THEN 1 ELSE 0 END), 0) AS lowStockCount,
             COALESCE(SUM(CASE WHEN stock_qty = 0 THEN 1 ELSE 0 END), 0) AS outOfStockCount'
        )->first();
    }

    // Products added in a given month (old Product::getNewProducts)
    public static function newProducts(int $month, int $year): Collection
    {
        return DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.category_id')
            ->leftJoin('suppliers as s', 'p.supplier_id', '=', 's.supplier_id')
            ->whereMonth('p.created_at', $month)
            ->whereYear('p.created_at', $year)
            ->orderByDesc('p.created_at')
            ->get([
                'p.product_id', 'p.product_name', 'c.category_name', 's.supplier_name',
                'p.stock_qty', 'p.price', 'p.created_at',
            ]);
    }

    // Products at or below their low-stock number, with a suggested reorder (old Product::getRestockNeeded)
    public static function restockNeeded(): Collection
    {
        return DB::table('products as p')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.category_id')
            ->leftJoin('suppliers as s', 'p.supplier_id', '=', 's.supplier_id')
            ->whereColumn('p.stock_qty', '<=', 'p.low_stock_threshold')
            ->orderBy('p.stock_qty')
            ->get([
                'p.product_id', 'p.product_name', 'c.category_name', 's.supplier_name',
                'p.stock_qty', 'p.low_stock_threshold',
                DB::raw('GREATEST((p.low_stock_threshold * 2) - p.stock_qty, 0) AS suggested_reorder'),
            ]);
    }

        // Product count and stock value per category (old Product::getCategoryBreakdown)
    public static function categoryBreakdown(): Collection
    {
        return DB::table('categories as c')
            ->leftJoin('products as p', 'p.category_id', '=', 'c.category_id')
            ->groupBy('c.category_id', 'c.category_name')
            ->orderBy('c.category_name')
            ->get([
                'c.category_name',
                DB::raw('COUNT(p.product_id) AS productCount'),
                DB::raw('COALESCE(SUM(p.stock_qty), 0) AS totalStock'),
                DB::raw('COALESCE(SUM(p.stock_qty * p.price), 0) AS totalValue'),
            ]);
    }

    // The same per supplier, plus how many of their items are low (old Supplier::getAllWithStats)
    public static function supplierStats(): Collection
    {
        return DB::table('suppliers as s')
            ->leftJoin('products as p', 'p.supplier_id', '=', 's.supplier_id')
            ->groupBy('s.supplier_id', 's.supplier_name')
            ->orderBy('s.supplier_name')
            ->get([
                's.supplier_id', 's.supplier_name',
                DB::raw('COUNT(p.product_id) AS productCount'),
                DB::raw('COALESCE(SUM(p.stock_qty), 0) AS totalStock'),
                DB::raw('COALESCE(SUM(p.stock_qty * p.price), 0) AS totalValue'),
                DB::raw('COALESCE(SUM(CASE WHEN p.stock_qty <= p.low_stock_threshold THEN 1 ELSE 0 END), 0) AS lowStockCount'),
            ]);
    }
}