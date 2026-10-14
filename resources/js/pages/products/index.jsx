import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';

const pill = 'inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white';
import { useCan } from '../../inventory/permissions';

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
        const can = useCan();
    const canEdit = can('products.update');
    const canDelete = can('products.delete');
    const showActions = canEdit || canDelete;

    function remove(product) {
        if (window.confirm(`Delete "${product.product_name}"?`)) {
            router.delete(`/products/${product.product_id}`, { preserveScroll: true });
        }
    }
    const isAdmin = user?.role === 'admin';
    const form = useForm({
        productName: '', categoryName: '', supplierName: '', stockQty: 0, price: '', lowStockThreshold: 10,
    });

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
                actions={<>
                    {can('dashboard.view') && <Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>}
                    {can('reports.view-all') && <Link href="/admin/reports" className="btn btn-outline-light">Monthly Reports</Link>}
                    {can('reports.view-own') && <Link href="/reports/monthly" className="btn btn-outline-light">My Monthly Report</Link>}
                    {can('categories.view') && <Link href="/categories" className="btn btn-outline-light">Categories</Link>}
                    {can('suppliers.view') && <Link href="/suppliers" className="btn btn-outline-light">Suppliers</Link>}
                </>    
                    isAdmin
                    ? <Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>
                    : <Link href="/reports/monthly" className="btn btn-outline-light">My Monthly Report</Link>}
            >
                {isAdmin && (
                    <div className="card mb-4">
                        <div className="card-body">
                            <h5 className="section-title">Add Product</h5>
                            <form className="row g-2" onSubmit={(e) => { e.preventDefault(); form.post('/products', { onSuccess: () => form.reset() }); }}>
                                <div className="col-md-3"><input className="form-control" placeholder="Product name" value={form.data.productName} onChange={(e) => form.setData('productName', e.target.value)} required /></div>
                                <div className="col-md-2"><input className="form-control" placeholder="Category" value={form.data.categoryName} onChange={(e) => form.setData('categoryName', e.target.value)} required /></div>
                                <div className="col-md-2"><input className="form-control" placeholder="Supplier" value={form.data.supplierName} onChange={(e) => form.setData('supplierName', e.target.value)} required /></div>
                                <div className="col-md-1"><input type="number" min="0" className="form-control" placeholder="Qty" value={form.data.stockQty} onChange={(e) => form.setData('stockQty', e.target.value)} required /></div>
                                <div className="col-md-2"><input type="number" min="0.01" step="0.01" className="form-control" placeholder="Price" value={form.data.price} onChange={(e) => form.setData('price', e.target.value)} required /></div>
                                <div className="col-md-2"><button className="btn btn-primary w-100" disabled={form.processing}>Add Product</button></div>
                            </form>
                        </div>
                    </div>
                )}
                <div className="card">
                    <div className="card-header bg-white d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Inventory Records</h5>
                        <div className="d-flex align-items-center gap-2">
                            {can('products.create') && <Link href="/products/create" className="btn btn-sm btn-primary">Add Product</Link>}
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
                                    {showActions && <th>Actions</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={showActions ? 9 : 8} className="text-center text-muted py-4">
                                            No product records found.
                                        </td>
                                    </tr>
                                )}

                                {products.map((p) => {
                                    const { qty, threshold, rowClass, badge } = stockInfo(p);
                                    return (
                                        <tr key={p.product_id} className={rowClass}>
                                            <td>{p.product_id}</td>
                                            <td><Link href={`/products/${p.product_id}`} className="fw-bold text-decoration-none">{p.product_name}</Link></td>
                                            <td>{p.category_name || 'N/A'}</td>
                                            <td>{p.supplier_name || 'N/A'}</td>
                                            <td className={`text-center fw-bold ${qty <= threshold ? 'text-danger' : ''}`}>{qty}</td>
                                            <td><span className="badge badge-threshold threshold-badge">Min {threshold}</span></td>
                                            <td className="text-center">{badge}</td>
                                            <td>{peso(p.price)}</td>
                                            {showActions && (
                                                <td className="text-nowrap">
                                                    {canEdit && <Link href={`/products/${p.product_id}/edit`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>}
                                                    {canDelete && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(p)}>Delete</button>}
                                                </td>
                                            )}
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