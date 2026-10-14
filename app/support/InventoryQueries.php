<?php

namespace App\Support;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * Read-only inventory figures for the product list, dashboard and reports.
 * Everything goes through the Eloquent models and their relationships.
 */
class InventoryQueries
{
    // Every product with its category and supplier name
    public static function products(): Collection
    {
        return self::withNames(Product::query())
            ->orderByRaw('CASE WHEN stock_qty <= low_stock_threshold THEN 1 ELSE 2 END')
            ->orderByDesc('product_id')
            ->get()
            ->map(fn (Product $p) => self::flat($p, ['category_id', 'supplier_id', 'created_at', 'low_stock_threshold']));
    }

    public static function summary(): object
    {
        return (object) [
            'totalProducts' => Product::count(),
            'totalValue' => (float) Product::sum(DB::raw('stock_qty * price')),
            'lowStockCount' => Product::lowStock()->count(),
            'outOfStockCount' => Product::outOfStock()->count(),
        ];
    }

    // Products first added in the given month
    public static function newProducts(int $month, int $year): Collection
    {
        return self::withNames(Product::query())
            ->whereMonth('created_at', $month)
            ->whereYear('created_at', $year)
            ->latest('created_at')
            ->get()
            ->map(fn (Product $p) => self::flat($p, ['created_at']));
    }

    // Products at or below their threshold, with a suggested order of up to twice the threshold
    public static function restockNeeded(): Collection
    {
        return self::withNames(Product::needsRestock())
            ->orderBy('stock_qty')
            ->get()
            ->map(fn (Product $p) => self::flat($p, ['low_stock_threshold']) + [
                'suggested_reorder' => max($p->low_stock_threshold * 2 - $p->stock_qty, 0),
            ]);
    }

    public static function categoryBreakdown(): Collection
    {
        return Category::with('products:product_id,category_id,stock_qty,price')
            ->orderBy('category_name')
            ->get()
            ->map(fn (Category $c) => ['category_name' => $c->category_name] + self::totals($c->products));
    }

    public static function supplierStats(): Collection
    {
        return Supplier::with('products:product_id,supplier_id,stock_qty,price,low_stock_threshold')
            ->orderBy('supplier_name')
            ->get()
            ->map(fn (Supplier $s) => [
                'supplier_id' => $s->supplier_id,
                'supplier_name' => $s->supplier_name,
            ] + self::totals($s->products) + [
                'lowStockCount' => $s->products->filter(fn (Product $p) => $p->stock_qty <= $p->low_stock_threshold)->count(),
            ]);
    }

    private static function withNames($query)
    {
        return $query->with(['category:category_id,category_name', 'supplier:supplier_id,supplier_name']);
    }

    private static function flat(Product $p, array $extra = []): array
    {
        $row = [
            'product_id' => $p->product_id,
            'product_name' => $p->product_name,
            'category_name' => $p->category?->category_name,
            'supplier_name' => $p->supplier?->supplier_name,
            'stock_qty' => $p->stock_qty,
            'price' => $p->price,
        ];

        foreach ($extra as $attribute) {
            $row[$attribute] = $p->{$attribute};
        }

        return $row;
    }

    private static function totals(Collection $products): array
    {
        return [
            'productCount' => $products->count(),
            'totalStock' => $products->sum('stock_qty'),
            'totalValue' => $products->sum(fn (Product $p) => $p->stock_qty * $p->price),
        ];
    }
}
