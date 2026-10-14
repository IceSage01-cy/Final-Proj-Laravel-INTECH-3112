<?php

namespace App\Http\Controllers;

use App\Models\MonthlyReport;
use App\Support\InventoryQueries;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('permission:reports.view-own', only: ['index']),
            new Middleware('permission:reports.create|reports.update', only: ['store']),
            new Middleware('permission:reports.update', only: ['submit']),
            new Middleware('permission:reports.delete-own', only: ['destroyOwn']),
            new Middleware('permission:reports.view-all', only: ['adminIndex']),
            new Middleware('permission:reports.delete', only: ['destroy']),
            new Middleware('permission:reports.review', only: ['review']),
        ];
    }

    public function index(Request $request): Response
    {
        [$year, $month] = $this->period($request);
        $report = MonthlyReport::where('user_id', $request->user()->user_id)
            ->where('report_year', $year)
            ->where('report_month', $month)
            ->first();

        $history = MonthlyReport::where('user_id', $request->user()->user_id)
            ->orderByDesc('report_year')
            ->orderByDesc('report_month')
            ->get(['id', 'report_year', 'report_month', 'hours_worked', 'status', 'updated_at']);

        return Inertia::render('reports/monthly', compact('year', 'month', 'report', 'history'));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        [$year, $month] = $this->period($request);
        $existing = MonthlyReport::where('user_id', $request->user()->user_id)
            ->where('report_year', $year)
            ->where('report_month', $month)
            ->first();

        // Creating a new report and editing an existing one are separate permissions.
        abort_unless($request->user()->can($existing ? 'reports.update' : 'reports.create'), 403);

        if ($existing?->status === 'submitted' || $existing?->status === 'reviewed') {
            return back()->with('error', 'Submitted and reviewed reports cannot be edited.');
        }

        MonthlyReport::updateOrCreate(
            ['user_id' => $request->user()->user_id, 'report_year' => $year, 'report_month' => $month],
            [...$data, 'status' => 'draft', 'reviewed_at' => null],
        );

        return back()->with('success', 'Monthly report saved as a draft.');
    }

    public function submit(Request $request, MonthlyReport $report): RedirectResponse
    {
        $this->ensureOwner($request, $report);

        if ($report->status === 'reviewed') {
            return back()->with('error', 'A reviewed report cannot be submitted again.');
        }

        $report->update(['status' => 'submitted']);

        return back()->with('success', 'Monthly report submitted for review.');
    }

    public function destroyOwn(Request $request, MonthlyReport $report): RedirectResponse
    {
        $this->ensureOwner($request, $report);

        if ($report->status !== 'draft') {
            return back()->with('error', 'Only draft reports can be deleted.');
        }

        $report->delete();

        return back()->with('success', 'Draft report deleted.');
    }

    public function destroy(MonthlyReport $report): RedirectResponse
    {
        $report->delete();

        return back()->with('success', 'Monthly report deleted.');
    }

    public function adminIndex(Request $request): Response
    {
        $period = (string) $request->query('period', now()->format('Y-m'));
        $view = (string) $request->query('view', 'employees');
        [$year, $month] = array_pad(explode('-', $period), 2, null);
        $year = (int) $year ?: now()->year;
        $month = (int) $month;
        $view = in_array($view, ['employees', 'products'], true) ? $view : 'employees';

        if ($month < 1 || $month > 12) {
            $month = now()->month;
        }

        $reports = MonthlyReport::with('employee:user_id,username')
            ->where('report_year', $year)
            ->where('report_month', $month)
            ->latest('updated_at')
            ->get();

        return Inertia::render('admin/reports', [
            'year' => $year,
            'month' => $month,
            'view' => $view,
            'reports' => $reports,
            'pendingReports' => MonthlyReport::where('status', 'submitted')->count(),
            'inventorySummary' => InventoryQueries::summary(),
            'newProducts' => InventoryQueries::newProducts($month, $year),
            'restockNeeded' => InventoryQueries::restockNeeded(),
        ]);
    }

    public function review(MonthlyReport $report): RedirectResponse
    {
        if ($report->status !== 'submitted') {
            return back()->with('error', 'Only submitted reports can be marked as reviewed.');
        }

        $report->update(['status' => 'reviewed', 'reviewed_at' => now()]);

        return back()->with('success', 'Report marked as reviewed.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'accomplishments' => ['required', 'string', 'max:10000'],
            'hours_worked' => ['required', 'numeric', 'min:0', 'max:744'],
            'notes' => ['nullable', 'string', 'max:10000'],
        ]);
    }

    private function period(Request $request): array
    {
        $value = (string) $request->input('period', now()->format('Y-m'));
        [$year, $month] = array_pad(explode('-', $value), 2, null);
        $year = (int) $year ?: now()->year;
        $month = (int) $month;

        return [$year, $month >= 1 && $month <= 12 ? $month : now()->month];
    }

    private function ensureOwner(Request $request, MonthlyReport $report): void
    {
        abort_unless($report->user_id === $request->user()->user_id, 403);
    }
}
