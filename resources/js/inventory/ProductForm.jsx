import { Link, useForm } from '@inertiajs/react';

// Shared by products/create and products/edit. `product` is set when editing.
export default function ProductForm({ product, categories, suppliers }) {
    const form = useForm({
        product_name: product?.product_name ?? '',
        category_id: product?.category_id ?? '',
        supplier_id: product?.supplier_id ?? '',
        stock_qty: product?.stock_qty ?? 0,
        price: product?.price ?? '',
        low_stock_threshold: product?.low_stock_threshold ?? 10,
    });
    const { data, setData, processing, errors } = form;

    function submit(e) {
        e.preventDefault();
        if (product) {
            form.put(`/products/${product.product_id}`);
        } else {
            form.post('/products');
        }
    }

    const field = (name, label, input) => (
        <div className="col-md-6">
            <label htmlFor={name} className="form-label">{label}</label>
            {input}
            {errors[name] && <div className="invalid-feedback d-block">{errors[name]}</div>}
        </div>
    );
    const cls = (name) => `form-control ${errors[name] ? 'is-invalid' : ''}`;
    const select = (name, options, idKey, labelKey, placeholder) => (
        <select id={name} className={`form-select ${errors[name] ? 'is-invalid' : ''}`}
            value={data[name]} onChange={(e) => setData(name, e.target.value)}>
            <option value="">{placeholder}</option>
            {options.map((o) => <option key={o[idKey]} value={o[idKey]}>{o[labelKey]}</option>)}
        </select>
    );

    return (
        <form className="row g-3" onSubmit={submit} noValidate>
            {field('product_name', 'Product name',
                <input id="product_name" className={cls('product_name')} value={data.product_name}
                    onChange={(e) => setData('product_name', e.target.value)} />)}
            {field('category_id', 'Category', select('category_id', categories, 'category_id', 'category_name', 'Select a category'))}
            {field('supplier_id', 'Supplier', select('supplier_id', suppliers, 'supplier_id', 'supplier_name', 'Select a supplier'))}
            {field('price', 'Price',
                <input id="price" type="number" step="0.01" className={cls('price')} value={data.price}
                    onChange={(e) => setData('price', e.target.value)} />)}
            {field('stock_qty', 'Stock quantity',
                <input id="stock_qty" type="number" className={cls('stock_qty')} value={data.stock_qty}
                    onChange={(e) => setData('stock_qty', e.target.value)} />)}
            {field('low_stock_threshold', 'Low stock threshold',
                <input id="low_stock_threshold" type="number" className={cls('low_stock_threshold')} value={data.low_stock_threshold}
                    onChange={(e) => setData('low_stock_threshold', e.target.value)} />)}
            <div className="col-12 d-flex gap-2">
                <button className="btn btn-primary" disabled={processing}>{product ? 'Save changes' : 'Add product'}</button>
                <Link href="/products" className="btn btn-outline-secondary">Cancel</Link>
            </div>
        </form>
    );
}
