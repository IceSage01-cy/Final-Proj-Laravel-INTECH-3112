import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';
import ProductForm from '../../inventory/ProductForm';

export default function Edit({ product, categories, suppliers }) {
    return (
        <>
            <Head title={`Edit ${product.product_name}`} />
            <AppLayout title="Edit Product" subtitle={product.product_name}
                actions={<Link href="/products" className="btn btn-outline-light">Inventory</Link>}>
                <div className="card"><div className="card-body">
                    <ProductForm product={product} categories={categories} suppliers={suppliers} />
                </div></div>
            </AppLayout>
        </>
    );
}
