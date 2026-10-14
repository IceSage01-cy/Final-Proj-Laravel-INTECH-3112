import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import ProductForm from '../../inventory/ProductForm';

export default function Create({ categories, suppliers }) {
    return (
        <>
            <Head title="Add Product" />
            <AppLayout title="Add Product" subtitle="Create a new inventory record"
                actions={<Link href="/products" className="btn btn-outline-light">Inventory</Link>}>
                <div className="card"><div className="card-body">
                    <ProductForm categories={categories} suppliers={suppliers} />
                </div></div>
            </AppLayout>
        </>
    );
}
