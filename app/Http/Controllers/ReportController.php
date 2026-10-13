<?php

namespace App\Http\Controllers;

use App\Support\InventoryQueries;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function monthly(Request $request): Response
    {
        $parts = explode('-', (string) $request->query('month', now()->format('Y-m')));

        $year  = (int) ($parts[0] ?? 0) ?: now()->year;
        $month = (int) ($parts[1] ?? 0);

        if ($month < 1 || $month > 12) {
            $month = now()->month;
        }

        return Inertia::render('reports/monthly', [
            'month'         => $month,
            'year'          => $year,
            'summary'       => InventoryQueries::summary(),
            'newProducts'   => InventoryQueries::newProducts($month, $year),
            'restockNeeded' => InventoryQueries::restockNeeded(),
        ]);
    }
}
