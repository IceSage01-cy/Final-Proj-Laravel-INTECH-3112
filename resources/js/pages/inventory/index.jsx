import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';

const pill = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white';

function stockInfo(p) {
    const qty = parseInt(p.stock_qty, 10) || 0;
    const threshold = Number(p.low_stock_threshold ?? 10);

    if (qty === 0) {
        return { qty, threshold, rowClass: 'bg-red-50', edge: 'border-red-500', badge: <span className={`${pill} bg-red-600`}>Out of stock</span> };
    }
    if (qty <= threshold) {
        return { qty, threshold, rowClass: 'bg-amber-50/60', edge: 'border-amber-500', badge: <span className={`${pill} bg-amber-600`}>Low stock</span> };
    }
    return { qty, threshold, rowClass: '', edge: 'border-transparent', badge: <span className={`${pill} bg-emerald-600`}>In stock</span> };
}

export default function Index({ products }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdmin = user?.role === 'admin';

    const counts = useMemo(() => {
        let low = 0;
        let out = 0;
        products.forEach((p) => {
            const { qty, threshold } = stockInfo(p);
            if (qty === 0) out++;
            else if (qty <= threshold) low++;
        });
        return { low, out };
    }, [products]);

    return (
        <>
            <Head title="Inventory Management System" />

            <AppLayout
                title="Inventory Management System"
                subtitle={user ? `Signed in as ${user.username} (${user.role})` : null}
                actions={isAdmin && (<Link href="/admin" className="rounded border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy">Admin Dashboard</Link>)}
            >
                <div className="card">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Inventory Records</h5>
                        <div>
                            <span className="badge bg-secondary">Total: {products.length}</span>
                            <span className="badge badge-status-low ms-2">Low Stock: {counts.low}</span>
                            <span className="badge badge-status-out ms-2">Out of Stock: {counts.out}</span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover table-bordered align-middle mb-0">
                            <thead className="table-primary">
                                <tr className="text-center">
                                    <th>ID</th>
                                    <th>Product Name</th>
                                    <th>Category</th>
                                    <th>Supplier</th>
                                    <th>Stock Qty</th>
                                    <th>Threshold</th>
                                    <th>Status</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-muted py-4">
                                            No product records found.
                                        </td>
                                    </tr>
                                )}

                                {products.map((p) => {
                                    const { qty, threshold, rowClass, badge } = stockInfo(p);
                                    return (
                                        <tr key={p.product_id} className={rowClass}>
                                            <td>{p.product_id}</td>
                                            <td><strong>{p.product_name}</strong></td>
                                            <td>{p.category_name || 'N/A'}</td>
                                            <td>{p.supplier_name || 'N/A'}</td>
                                            <td className={`text-center fw-bold ${qty <= threshold ? 'text-danger' : ''}`}>{qty}</td>
                                            <td><span className="badge badge-threshold threshold-badge">Min {threshold}</span></td>
                                            <td className="text-center">{badge}</td>
                                            <td>{peso(p.price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}