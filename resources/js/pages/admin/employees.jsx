import { Head, Link } from '@inertiajs/react';
import AppLayout from '../../inventory/AppLayout';

export default function Employees({ employees }) {
    return (
        <>
            <Head title="Manage Employees" />
            <AppLayout title="Manage Employees" subtitle="View and remove employee accounts. Employees create their own accounts on the register page."
                actions={<Link href="/admin" className="btn btn-outline-light">Admin Dashboard</Link>}>
                <div className="card"><div className="card-body">
                    <h5 className="section-title">Employee Accounts</h5>
                    <table className="table table-bordered align-middle"><thead className="table-primary"><tr><th>Username</th><th>Email</th><th>Created</th><th>Action</th></tr></thead>
                        <tbody>
                            {employees.length === 0 && <tr><td colSpan={4} className="text-center text-muted">No employee accounts yet.</td></tr>}
                            {employees.map((employee) => (
                                <tr key={employee.user_id}>
                                    <td>{employee.username}</td>
                                    <td>{employee.email || '—'}</td>
                                    <td>{new Date(employee.created_at).toLocaleDateString()}</td>
                                    <td><Link as="button" method="delete" href={`/admin/employees/${employee.user_id}`} className="btn btn-sm btn-outline-danger">Delete</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div></div>
            </AppLayout>
        </>
    );
}
