<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Supplier;
use App\Support\InventoryQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:products.view', only: ['index', 'show']),
            new Middleware('permission:products.create', only: ['create', 'store']),
            new Middleware('permission:products.update', only: ['edit', 'update']),
            new Middleware('permission:products.delete', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => InventoryQueries::products(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/create', $this->formOptions());
    }

    public function store(Request $request): RedirectResponse
    {
        Product::create($this->validated($request));

        return to_route('products.index')->with('success', 'Product added successfully.');
    }

    public function show(Product $product): Response
    {
        return Inertia::render('products/show', [
            'product' => $product->load(['category', 'supplier']),
        ]);
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => $product,
            ...$this->formOptions(),
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $product->update($this->validated($request));

        return to_route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return to_route('products.index')->with('success', 'Product deleted successfully.');
    }

    private function formOptions(): array
    {
        return [
            'categories' => Category::orderBy('category_name')->get(['category_id', 'category_name']),
            'suppliers' => Supplier::orderBy('supplier_name')->get(['supplier_id', 'supplier_name']),
        ];
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'product_name'        => ['required', 'string', 'max:255'],
            'category_id'         => ['required', 'integer', 'exists:categories,category_id'],
            'supplier_id'         => ['required', 'integer', 'exists:suppliers,supplier_id'],
            'stock_qty'           => ['required', 'integer', 'min:0'],
            'price'               => ['required', 'numeric', 'gt:0', 'max:99999999.99'],
            'low_stock_threshold' => ['required', 'integer', 'min:0'],
        ]);
    }
}
