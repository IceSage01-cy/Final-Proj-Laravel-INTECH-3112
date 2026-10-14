<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:suppliers.view', only: ['index']),
            new Middleware('permission:suppliers.create', only: ['store']),
            new Middleware('permission:suppliers.update', only: ['update']),
            new Middleware('permission:suppliers.delete', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('suppliers/index', [
            'suppliers' => Supplier::withCount('products')->orderBy('supplier_name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Supplier::create($request->validate([
            'supplier_name' => ['required', 'string', 'max:100', 'unique:suppliers,supplier_name'],
        ]));

        return back()->with('success', 'Supplier added successfully.');
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $supplier->update($request->validate([
            'supplier_name' => [
                'required', 'string', 'max:100',
                Rule::unique('suppliers', 'supplier_name')->ignore($supplier->supplier_id, 'supplier_id'),
            ],
        ]));

        return back()->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier): RedirectResponse
    {
        // products.supplier_id cascades on delete, so refuse rather than wipe products.
        if ($supplier->products()->exists()) {
            return back()->with('error', 'Cannot delete a supplier that still has products.');
        }

        $supplier->delete();

        return back()->with('success', 'Supplier deleted successfully.');
    }
}
