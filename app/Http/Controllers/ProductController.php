<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Support\InventoryQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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

    public function store(Request $request): RedirectResponse
    {
        Product::create($this->attributes($this->validated($request)));

        return back()->with('success', 'Product added successfully.');
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($this->attributes($this->validated($request)));

        return back()->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('success', 'Product deleted successfully.');
    }

   
    private function validated(Request $request): array
    {
        return $request->validate([
            'productName'       => ['required', 'string', 'max:255'],
            'categoryName'      => ['required', 'string', 'max:100'],
            'supplierName'      => ['required', 'string', 'max:100'],
            'stockQty'          => ['required', 'integer', 'min:0'],
            'price'             => ['required', 'numeric', 'gt:0'],
            'lowStockThreshold' => ['nullable', 'integer', 'min:0'],
        ]);
    }

   
    private function attributes(array $data): array
    {
        return [
            'product_name'        => $data['productName'],
            'category_id'         => Category::firstOrCreate(['category_name' => $data['categoryName']])->category_id,
            'supplier_id'         => Supplier::firstOrCreate(['supplier_name' => $data['supplierName']])->supplier_id,
            'stock_qty'           => $data['stockQty'],
            'price'               => $data['price'],
            'low_stock_threshold' => $data['lowStockThreshold'] ?? 10,
        ];
    }
}
