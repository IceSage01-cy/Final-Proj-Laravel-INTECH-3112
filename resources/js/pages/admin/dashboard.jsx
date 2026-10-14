import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';

function Panel({ title, note, children, className = '' }) {
    return (
        <section className={`overflow-hidden rounded-md border border-slate-200 bg-white ${className}`}>
            <header className="flex items-baseline justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
                <h2 className="border-l-2 border-gold pl-3 text-lg font-semibold text-navy">{title}</h2>
                {note && <p className="text-sm text-slate-500">{note}</p>}
            </header>
            {children}
        </section>
    );
}

function Empty({ children }) {
    return <p className="px-5 py-8 text-center text-sm text-slate-500">{children}</p>;
}

function StatItem({ label, value, tone }) {
    const valueColor =
        tone === 'warn' ? 'text-amber-600' : tone === 'danger' ? 'text-red-600' : 'text-navy';
    return (
        <div className="px-5 py-4">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 font-serif text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
    );
}

export default function Dashboard({
    pendingReports,
    summary,
    totalCategories,
    totalSuppliers,
    categoryBreakdown,
    supplierStats,
    restockNeeded,
}) {
    const maxCategoryValue = Math.max(1, ...categoryBreakdown.map((c) => Number(c.totalValue) || 0));
    const outCount = Number(summary.outOfStockCount) || 0;
    const lowCount = Number(summary.lowStockCount) || 0;
    return (
        <>
            <Head title="Admin Dashboard" />

            <AppLayout
                title="Admin Dashboard"
                subtitle="Monitoring overview for the whole system"
                 actions={
                        <>
                            <Link
                                href="/admin/reports"
                                className="rounded border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy"
                            >
                                Monthly Reports{pendingReports > 0 && ` (${pendingReports})`}
                            </Link>
                            <Link
                                href="/admin/employees"
                                className="rounded border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy"
                            >
                                Manage Employees
                            </Link>
                            <Link
                                href="/"
                                className="rounded border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy"
                            >
                                Back to Inventory
                            </Link>
                        </>
                    }
            >
                <div className="space-y-6">
                <div className="grid grid-cols-2 divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
                    <StatItem label="Products" value={summary.totalProducts} />
                    <StatItem label="Categories" value={totalCategories} />
                    <StatItem label="Suppliers" value={totalSuppliers} />
                    <StatItem label="Inventory value" value={peso(summary.totalValue)} />
                    <StatItem label="Low stock" value={lowCount} tone={lowCount > 0 ? 'warn' : undefined} />
                    <StatItem label="Out of stock" value={outCount} tone={outCount > 0 ? 'danger' : undefined} />
            </div>

            <div className="grid gap-6 xl:grid-cols-5">
                <Panel
                    title="Needs restocking"
                    note={restockNeeded.length > 0 ? `${restockNeeded.length} item${restockNeeded.length === 1 ? '' : 's'} below threshold` : null}
                    className="xl:col-span-3"
                >
                    {restockNeeded.length === 0 ? (
                    <Empty>Every product is above its threshold. Nothing to reorder.</Empty>
                    ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-navy text-white">
                                <tr>
                                    <th className="px-5 py-2.5 font-medium">Product</th>
                                    <th className="px-3 py-2.5 font-medium">Supplier</th>
                                    <th className="px-3 py-2.5 text-right font-medium">In stock</th>
                                    <th className="px-5 py-2.5 text-right font-medium">Reorder</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {restockNeeded.map((p) => {
                                    const out = Number(p.stock_qty) === 0;
                                    return (
                                        <tr key={p.product_id} className={out ? 'bg-red-50' : 'bg-amber-50/60'}>
                                            <td className={`border-l-4 px-5 py-3 ${out ? 'border-red-500' : 'border-amber-500'}`}>
                                                <p className="font-medium text-slate-900">{p.product_name}</p>
                                                <p className="text-xs text-slate-500">{p.category_name || 'No category'}</p>
                                            </td>
                                            <td className="px-3 py-3 text-slate-700">{p.supplier_name || 'N/A'}</td>
                                            <td className="px-3 py-3 text-right">
                                                <span className={`font-semibold ${out ? 'text-red-600' : 'text-amber-700'}`}>
                                                    {p.stock_qty}
                                                </span>
                                                {out && (
                                                    <span className="ml-2 rounded bg-red-600 px-1.5 py-0.5 text-xs font-medium text-white">
                                                        Out
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-right font-semibold text-navy">
                                                +{p.suggested_reorder}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Panel>

            <Panel title="Value by category" note="Bar length shows share of top category" className="xl:col-span-2">
                {categoryBreakdown.length === 0 ? (
                    <Empty>No categories yet. Add one to see it here.</Empty>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {categoryBreakdown.map((c) => {
                            const pct = Math.max(2, ((Number(c.totalValue) || 0) / maxCategoryValue) * 100);
                            return (
                                <li key={c.category_name} className="px-5 py-3">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <span className="font-medium text-slate-900">{c.category_name}</span>
                                        <span className="text-sm font-semibold text-navy">{peso(c.totalValue)}</span>
                                    </div>
                                    <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                                        <div className="h-1.5 rounded-full bg-navy" style={{ width: `${pct}%` }} />
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        {c.productCount} product{Number(c.productCount) === 1 ? '' : 's'}, {c.totalStock} units in stock
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </Panel>
        </div>

        <Panel title="Supplier monitoring">
            {supplierStats.length === 0 ? (
                <Empty>No suppliers yet. Add one to start tracking.</Empty>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-navy text-white">
                            <tr>
                                <th className="px-5 py-2.5 font-medium">Supplier</th>
                                <th className="px-3 py-2.5 text-right font-medium">Products</th>
                                <th className="px-3 py-2.5 text-right font-medium">Units in stock</th>
                                <th className="px-3 py-2.5 text-right font-medium">Total value</th>
                                <th className="px-5 py-2.5 text-right font-medium">Low stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {supplierStats.map((s) => (
                                <tr key={s.supplier_id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3 font-medium text-slate-900">{s.supplier_name}</td>
                                    <td className="px-3 py-3 text-right">{s.productCount}</td>
                                    <td className="px-3 py-3 text-right">{s.totalStock}</td>
                                    <td className="px-3 py-3 text-right">{peso(s.totalValue)}</td>
                                    <td className="px-5 py-3 text-right">
                                        {Number(s.lowStockCount) > 0 ? (
                                            <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                                                {s.lowStockCount}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">0</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Panel>
        </div>
        </AppLayout>
        </>
    );
}