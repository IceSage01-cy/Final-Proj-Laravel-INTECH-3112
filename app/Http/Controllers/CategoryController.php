<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:categories.view', only: ['index']),
            new Middleware('permission:categories.create', only: ['store']),
            new Middleware('permission:categories.update', only: ['update']),
            new Middleware('permission:categories.delete', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('categories/index', [
            'categories' => Category::withCount('products')->orderBy('category_name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Category::create($request->validate([
            'category_name' => ['required', 'string', 'max:100', 'unique:categories,category_name'],
        ]));

        return back()->with('success', 'Category added successfully.');
    }

    public function update(Request $request, Category $category): RedirectResponse
    {
        $category->update($request->validate([
            'category_name' => [
                'required', 'string', 'max:100',
                Rule::unique('categories', 'category_name')->ignore($category->category_id, 'category_id'),
            ],
        ]));

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // products.category_id cascades on delete, so refuse rather than wipe products.
        if ($category->products()->exists()) {
            return back()->with('error', 'Cannot delete a category that still has products.');
        }

        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
