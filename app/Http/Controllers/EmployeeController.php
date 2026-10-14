<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super admin: view / delete employee accounts. Employees create their own
 * accounts on the register page, so there is no create action here.
 */
class EmployeeController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:employees.view', only: ['index']),
            new Middleware('permission:employees.delete', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        return Inertia::render('admin/employees', [
            'employees' => User::role('employee')
                ->latest()
                ->get(['user_id', 'username', 'email', 'created_at']),
        ]);
    }

    public function destroy(User $employee): RedirectResponse
    {
        if (! $employee->hasRole('employee')) {
            return back()->with('error', 'Only employee accounts can be deleted here.');
        }

        $employee->delete();

        return back()->with('success', 'Employee account deleted.');
    }
}
