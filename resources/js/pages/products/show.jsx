import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import { peso } from '../../inventory/format';
import { useCan } from '../../inventory/permissions';

export default function Show({ product }) {
    const can = useCan();
    const rows = [
        ['Category', product.category?.category_name ?? 'N/A'],
        ['Supplier', product.supplier?.supplier_name ?? 'N/A'],
        ['Price', peso(product.price)],
        ['Stock quantity', product.stock_qty],
        ['Low stock threshold', product.low_stock_threshold],
        ['Added', new Date(product.created_at).toLocaleDateString()],
    ];

    return (
        <>
            <Head title={product.product_name} />
            <AppLayout title={product.product_name} subtitle={`Product #${product.product_id}`}
                actions={<Link href="/products" className="btn btn-outline-light">Inventory</Link>}>
                <div className="card"><div className="card-body">
                    <table className="table table-bordered mb-3"><tbody>
                        {rows.map(([label, value]) => (
                            <tr key={label}><th className="w-25 table-light">{label}</th><td>{value}</td></tr>
                        ))}
                    </tbody></table>
                    {can('products.update') && (
                        <Link href={`/products/${product.product_id}/edit`} className="btn btn-primary">Edit product</Link>
                    )}
                </div></div>
            </AppLayout>
        </>
    );
}
