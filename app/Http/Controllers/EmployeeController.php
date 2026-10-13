<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class EmployeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/employees', [
            'employees' => User::where('role', 'employee')
                ->latest()
                ->get(['user_id', 'username', 'created_at']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'username' => ['required', 'string', 'max:50', 'unique:users,username'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        User::create([
            'username' => $data['username'],
            'password' => $data['password'],
            'role'     => 'employee',
        ]);

        return back()->with('success', 'Employee account created successfully.');
    }

    public function destroy(User $employee): RedirectResponse
    {
        if ($employee->role !== 'employee') {
            return back()->with('error', 'Only employee accounts can be deleted.');
        }

        $employee->delete();

        return back()->with('success', 'Employee account deleted.');
    }
}
