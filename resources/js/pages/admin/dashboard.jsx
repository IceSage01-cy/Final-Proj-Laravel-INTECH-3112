import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';
import { useCan } from '../../inventory/permissions';

function Stat({ label, value, color }) {
    return (
        <div className="col-6 col-md-2">
            <div className="stat-card">
                <small className="text-muted">{label}</small>
                <h3 style={color ? { color } : undefined}>{value}</h3>
            </div>
        </div>
    );
}

export default function Dashboard({
    summary,
    totalCategories,
    totalSuppliers,
    categoryBreakdown,
    supplierStats,
    restockNeeded,
    pendingReports,
}) {
    const can = useCan();

    return (
        <>
            <Head title="Admin Dashboard" />

            <AppLayout
                title="Admin Dashboard"
                subtitle="Monitoring overview for the whole system"
                actions={<>
                    {can('reports.view-all') && <>
                        <Link href="/admin/reports?view=employees" className="btn btn-outline-light position-relative">
                            Employee Reports
                            {pendingReports > 0 && <span className="unread-dot" title={`${pendingReports} report${pendingReports === 1 ? '' : 's'} awaiting review`} aria-label={`${pendingReports} unread employee reports`} />}
                        </Link>
                        <Link href="/admin/reports?view=products" className="btn btn-outline-light">Product Reports</Link>
                    </>}
                    {can('employees.view') && <Link href="/admin/employees" className="btn btn-outline-light">Manage Employees</Link>}
                    {can('products.view') && <Link href="/" className="btn btn-outline-light">Products</Link>}
                </>}
            >
                <div className="card">
                    <div className="card-body">
                        <div className="row g-3 mb-4">
                            <Stat label="Products" value={summary.totalProducts} />
                            <Stat label="Categories" value={totalCategories} />
                            <Stat label="Suppliers" value={totalSuppliers} />
                            <Stat label="Inventory Value" value={peso(summary.totalValue)} />
                            <Stat label="Low Stock" value={summary.lowStockCount} color="#D97706" />
                            <Stat label="Out of Stock" value={summary.outOfStockCount} color="#DC3545" />
                        </div>

                        <h5 className="mb-2 section-title">Products per Category</h5>
                        <div className="table-responsive mb-4">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Category</th>
                                        <th>Product Count</th>
                                        <th>Total Stock</th>
                                        <th>Total Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryBreakdown.length === 0 && (
                                        <tr><td colSpan={4} className="text-center text-muted py-3">No categories found.</td></tr>
                                    )}
                                    {categoryBreakdown.map((c) => (
                                        <tr key={c.category_name}>
                                            <td>{c.category_name}</td>
                                            <td>{c.productCount}</td>
                                            <td>{c.totalStock}</td>
                                            <td>{peso(c.totalValue)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h5 className="mb-2 section-title">Supplier Monitoring</h5>
                        <div className="table-responsive mb-4">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Supplier</th>
                                        <th>Products Supplied</th>
                                        <th>Total Stock</th>
                                        <th>Total Value</th>
                                        <th>Low Stock Items</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplierStats.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-muted py-3">No suppliers found.</td></tr>
                                    )}
                                    {supplierStats.map((s) => (
                                        <tr key={s.supplier_id}>
                                            <td><strong>{s.supplier_name}</strong></td>
                                            <td>{s.productCount}</td>
                                            <td>{s.totalStock}</td>
                                            <td>{peso(s.totalValue)}</td>
                                            <td className="text-center">
                                                {Number(s.lowStockCount) > 0
                                                    ? <span className="badge badge-status-low">{s.lowStockCount}</span>
                                                    : <span className="text-muted">0</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h5 className="mb-2 section-title">Needs Restocking</h5>
                        <div className="table-responsive">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Supplier</th>
                                        <th>Current Qty</th>
                                        <th>Suggested Reorder</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {restockNeeded.length === 0 && (
                                        <tr><td colSpan={5} className="text-center text-muted py-3">No items currently need restocking.</td></tr>
                                    )}
                                    {restockNeeded.map((p) => (
                                        <tr key={p.product_id} className={Number(p.stock_qty) === 0 ? 'critical-stock-row' : 'low-stock-row'}>
                                            <td>{p.product_name}</td>
                                            <td>{p.category_name || 'N/A'}</td>
                                            <td>{p.supplier_name || 'N/A'}</td>
                                            <td>{p.stock_qty}</td>
                                            <td>{p.suggested_reorder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}