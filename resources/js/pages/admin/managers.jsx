import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';

export default function Managers({ managers }) {
    const { data, setData, post, processing, errors, reset } = useForm({ username: '', email: '', password: '' });

    function submit(e) {
        e.preventDefault();
        post('/admin/managers', { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title="Manage Product Managers" />
            <AppLayout title="Manage Product Managers" subtitle="Create and manage product manager accounts"
                actions={<Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>}>
                <div className="row g-4">
                    <div className="col-lg-4"><div className="card"><div className="card-body">
                        <h5 className="section-title">Add Product Manager</h5>
                        <form onSubmit={submit}>
                            <input className="form-control mb-2" placeholder="Username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                            {errors.username && <div className="text-danger small mb-2">{errors.username}</div>}
                            <input type="email" className="form-control mb-2" placeholder="Email (optional)" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <div className="text-danger small mb-2">{errors.email}</div>}
                            <input type="password" className="form-control mb-3" placeholder="Password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <div className="text-danger small mb-2">{errors.password}</div>}
                            <button className="btn btn-primary" disabled={processing}>Create Product Manager</button>
                        </form>
                    </div></div></div>
                    <div className="col-lg-8"><div className="card"><div className="card-body">
                        <h5 className="section-title">Product Manager Accounts</h5>
                        <table className="table table-bordered align-middle"><thead className="table-primary"><tr><th>Username</th><th>Email</th><th>Created</th><th>Action</th></tr></thead>
                            <tbody>
                                {managers.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No product manager accounts yet.</td></tr>}
                                {managers.map((manager) => (
                                    <tr key={manager.user_id}>
                                        <td>{manager.username}</td>
                                        <td>{manager.email || '—'}</td>
                                        <td>{new Date(manager.created_at).toLocaleDateString()}</td>
                                        <td><Link as="button" method="delete" href={`/admin/managers/${manager.user_id}`} className="btn btn-sm btn-outline-danger">Delete</Link></td>
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
