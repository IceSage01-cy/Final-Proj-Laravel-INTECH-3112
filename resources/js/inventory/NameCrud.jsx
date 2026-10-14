import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from './AppLayout';
import { useCan } from './permissions';

// Single-field list page (categories, suppliers): add, rename and delete in place.
// `resource` is both the URL prefix and the permission prefix, e.g. "categories".
export default function NameCrud({ resource, singular, items, idKey, nameKey }) {
    const can = useCan();
    const add = useForm({ [nameKey]: '' });
    const rename = useForm({ [nameKey]: '' });
    const [editingId, setEditingId] = useState(null);
    const heading = `Manage ${resource.charAt(0).toUpperCase()}${resource.slice(1)}`;

    function startEdit(item) {
        rename.setData(nameKey, item[nameKey]);
        rename.clearErrors();
        setEditingId(item[idKey]);
    }

    function remove(item) {
        if (window.confirm(`Delete ${singular} "${item[nameKey]}"?`)) {
            router.delete(`/${resource}/${item[idKey]}`, { preserveScroll: true });
        }
    }

    return (
        <>
            <Head title={heading} />
            <AppLayout title={heading} subtitle={`Add, rename and remove ${resource}`}
                actions={<Link href="/products" className="btn btn-outline-light">Inventory</Link>}>
                <div className="row g-4 p-3">
                    {can(`${resource}.create`) && (
                        <div className="col-lg-4"><div className="card border"><div className="card-body">
                            <h5 className="section-title">Add {singular}</h5>
                            <form onSubmit={(e) => { e.preventDefault(); add.post(`/${resource}`, { onSuccess: () => add.reset() }); }}>
                                <input className={`form-control ${add.errors[nameKey] ? 'is-invalid' : ''}`} placeholder="Name"
                                    value={add.data[nameKey]} onChange={(e) => add.setData(nameKey, e.target.value)} />
                                {add.errors[nameKey] && <div className="invalid-feedback d-block">{add.errors[nameKey]}</div>}
                                <button className="btn btn-primary mt-3" disabled={add.processing}>Add {singular}</button>
                            </form>
                        </div></div></div>
                    )}
                    <div className="col-lg-8"><div className="card border"><div className="card-body">
                        <table className="table table-bordered align-middle mb-0">
                            <thead className="table-primary"><tr><th>Name</th><th>Products</th><th>Action</th></tr></thead>
                            <tbody>
                                {items.length === 0 && <tr><td colSpan={3} className="text-center text-muted">No {resource} yet.</td></tr>}
                                {items.map((item) => (
                                    <tr key={item[idKey]}>
                                        <td>
                                            {editingId === item[idKey] ? (
                                                <>
                                                    <form className="d-flex gap-2" onSubmit={(e) => {
                                                        e.preventDefault();
                                                        rename.put(`/${resource}/${item[idKey]}`, { preserveScroll: true, onSuccess: () => setEditingId(null) });
                                                    }}>
                                                        <input className={`form-control form-control-sm ${rename.errors[nameKey] ? 'is-invalid' : ''}`}
                                                            value={rename.data[nameKey]} onChange={(e) => rename.setData(nameKey, e.target.value)} autoFocus />
                                                        <button className="btn btn-sm btn-primary" disabled={rename.processing}>Save</button>
                                                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)}>Cancel</button>
                                                    </form>
                                                    {rename.errors[nameKey] && <div className="invalid-feedback d-block">{rename.errors[nameKey]}</div>}
                                                </>
                                            ) : item[nameKey]}
                                        </td>
                                        <td>{item.products_count}</td>
                                        <td className="text-nowrap">
                                            {can(`${resource}.update`) && <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(item)}>Rename</button>}
                                            {can(`${resource}.delete`) && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(item)}>Delete</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div></div></div>
                </div>
            </AppLayout>
        </>
    );
}
