import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';

export default function Employees({ employees }) {
    const { data, setData, post, processing, errors, reset } = useForm({ username: '', password: '' });

    function submit(e) {
        e.preventDefault();
        post('/admin/employees', { onSuccess: () => reset() });
    }

    return (
        <>
            <Head title="Manage Employees" />
            <AppLayout title="Manage Employees" subtitle="Create and manage employee accounts"
                actions={<Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>}>
                <div className="row g-4">
                    <div className="col-lg-4"><div className="card"><div className="card-body">
                        <h5 className="section-title">Add Employee</h5>
                        <form onSubmit={submit}>
                            <input className="form-control mb-2" placeholder="Username" value={data.username} onChange={(e) => setData('username', e.target.value)} />
                            {errors.username && <div className="text-danger small mb-2">{errors.username}</div>}
                            <input type="password" className="form-control mb-3" placeholder="Password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <div className="text-danger small mb-2">{errors.password}</div>}
                            <button className="btn btn-primary" disabled={processing}>Create Employee</button>
                        </form>
                    </div></div></div>
                    <div className="col-lg-8"><div className="card"><div className="card-body">
                        <h5 className="section-title">Employee Accounts</h5>
                        <table className="table table-bordered align-middle"><thead className="table-primary"><tr><th>Username</th><th>Created</th><th>Action</th></tr></thead>
                            <tbody>{employees.map((employee) => <tr key={employee.user_id}><td>{employee.username}</td><td>{new Date(employee.created_at).toLocaleDateString()}</td><td><Link as="button" method="delete" href={`/admin/employees/${employee.user_id}`} className="btn btn-sm btn-outline-danger">Delete</Link></td></tr>)}</tbody>
                        </table>
                    </div></div></div>
                </div>
            </AppLayout>
        </>
    );
}
