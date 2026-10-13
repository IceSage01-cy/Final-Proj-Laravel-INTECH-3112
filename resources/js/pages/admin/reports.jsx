import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';

function EmptyRow({ colSpan, children = 'No records found.' }) {
    return <tr><td colSpan={colSpan} className="text-center text-muted py-3">{children}</td></tr>;
}

export default function Reports({ year, month, view, reports, pendingReports, inventorySummary, newProducts, restockNeeded }) {
    const period = `${year}-${String(month).padStart(2, '0')}`;
    const changeView = (nextView) => router.get('/admin/reports', { period, view: nextView });

    return (
        <>
            <Head title="Monthly Reports" />
            <AppLayout title="Monthly Reports" subtitle="Review employee submissions"
                actions={<Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>}>
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="section-title mb-0">Reports for {period}</h5>
                            <input type="month" className="form-control w-auto" value={period}
                                onChange={(e) => router.get('/admin/reports', { period: e.target.value, view })} />
                        </div>

                        <div className="report-tabs mb-4" role="tablist" aria-label="Monthly report type">
                            <button type="button" className={`btn ${view === 'employees' ? 'btn-primary' : 'btn-outline-secondary'} position-relative`}
                                onClick={() => changeView('employees')} role="tab" aria-selected={view === 'employees'}>
                                Employee Reports
                                {pendingReports > 0 && <span className="unread-dot" title={`${pendingReports} report${pendingReports === 1 ? '' : 's'} awaiting review`} aria-label={`${pendingReports} unread employee reports`} />}
                            </button>
                            <button type="button" className={`btn ${view === 'products' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                onClick={() => changeView('products')} role="tab" aria-selected={view === 'products'}>
                                Product Reports
                            </button>
                        </div>

                        {view === 'products' && <>
                        <h5 className="section-title">Product Reports</h5>
                        <div className="row g-3 mb-4">
                            <div className="col-6 col-md-3"><div className="stat-card"><small className="text-muted">Total Products</small><h3>{inventorySummary.totalProducts}</h3></div></div>
                            <div className="col-6 col-md-3"><div className="stat-card"><small className="text-muted">Inventory Value</small><h3>{peso(inventorySummary.totalValue)}</h3></div></div>
                            <div className="col-6 col-md-3"><div className="stat-card"><small className="text-muted">Low Stock</small><h3 className="text-warning">{inventorySummary.lowStockCount}</h3></div></div>
                            <div className="col-6 col-md-3"><div className="stat-card"><small className="text-muted">Out of Stock</small><h3 className="text-danger">{inventorySummary.outOfStockCount}</h3></div></div>
                        </div>
                        </>}

                        {view === 'products' && <>
                        <h6 className="mb-2">Products Added During {period}</h6>
                        <div className="table-responsive mb-4">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-primary"><tr><th>Product</th><th>Category</th><th>Supplier</th><th>Stock Qty</th><th>Price</th><th>Added</th></tr></thead>
                                <tbody>
                                    {newProducts.length === 0 && <EmptyRow colSpan={6} />}
                                    {newProducts.map((product) => (
                                        <tr key={product.product_id}>
                                            <td><strong>{product.product_name}</strong></td>
                                            <td>{product.category_name || 'N/A'}</td>
                                            <td>{product.supplier_name || 'N/A'}</td>
                                            <td>{product.stock_qty}</td>
                                            <td>{peso(product.price)}</td>
                                            <td>{new Date(product.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>}

                        {view === 'products' && <>
                        <h6 className="mb-2">Current Low-Stock Status</h6>
                        <div className="table-responsive mb-5">
                            <table className="table table-sm table-bordered table-hover align-middle">
                                <thead className="table-primary"><tr><th>Product</th><th>Category</th><th>Supplier</th><th>Current Qty</th><th>Suggested Reorder</th></tr></thead>
                                <tbody>
                                    {restockNeeded.length === 0 && <EmptyRow colSpan={5}>No products currently need restocking.</EmptyRow>}
                                    {restockNeeded.map((product) => (
                                        <tr key={product.product_id} className={Number(product.stock_qty) === 0 ? 'critical-stock-row' : 'low-stock-row'}>
                                            <td>{product.product_name}</td>
                                            <td>{product.category_name || 'N/A'}</td>
                                            <td>{product.supplier_name || 'N/A'}</td>
                                            <td>{product.stock_qty}</td>
                                            <td>{product.suggested_reorder}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>}

                        {view === 'employees' && <>
                        <h5 className="section-title">Employee Reports</h5>
                        {pendingReports > 0 && <div className="alert alert-warning py-2">There {pendingReports === 1 ? 'is' : 'are'} {pendingReports} employee report{pendingReports === 1 ? '' : 's'} waiting for review.</div>}
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">
                                <thead className="table-primary"><tr><th>Employee</th><th>Hours</th><th>Accomplishments</th><th>Notes</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {reports.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">No reports found.</td></tr>}
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td>{report.employee?.username}</td>
                                            <td>{report.hours_worked}</td>
                                            <td className="text-wrap" style={{ minWidth: 220 }}>{report.accomplishments}</td>
                                            <td className="text-wrap">{report.notes || '—'}</td>
                                            <td><span className="badge bg-secondary">{report.status}</span></td>
                                            <td>{report.status === 'submitted' && <button className="btn btn-sm btn-success" onClick={() => router.post(`/admin/reports/${report.id}/review`)}>Mark Reviewed</button>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        </>}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
