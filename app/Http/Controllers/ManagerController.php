<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super admin: create / view / delete product manager accounts. Managers are
 * never created through the public register page (that is employees only).
 */
class ManagerController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:managers.view', only: ['index']),
            new Middleware('permission:managers.create', only: ['store']),
            new Middleware('permission:managers.delete', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('admin/managers', [
            'managers' => User::role('product-manager')
                ->latest()
                ->get(['user_id', 'username', 'email', 'created_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'email'    => ['nullable', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', Password::default()],
        ]);

        User::create([
            'username' => $data['username'],
            'email'    => $data['email'] ?? null,
            'password' => $data['password'],
        ])->assignRole('product-manager');

        return back()->with('success', 'Product manager account created successfully.');
    }

    public function destroy(User $manager): RedirectResponse
    {
        if (! $manager->hasRole('product-manager')) {
            return back()->with('error', 'Only product manager accounts can be deleted here.');
        }

        $manager->delete();

        return back()->with('success', 'Product manager account deleted.');
    }
}
