import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../inventory/AppLayout';
import { useCan } from '../../inventory/permissions';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_BADGE = { draft: 'bg-secondary', submitted: 'bg-warning text-dark', reviewed: 'bg-success' };

function ReportForm({ year, month, report }) {
    const can = useCan();
    const { data, setData, post, processing, errors } = useForm({
        period: `${year}-${String(month).padStart(2, '0')}`,
        accomplishments: report?.accomplishments || '',
        hours_worked: report?.hours_worked || '',
        notes: report?.notes || '',
    });
    const [period, setPeriod] = useState(data.period);
    const locked = report?.status === 'reviewed';
    const canSave = can(report ? 'reports.update' : 'reports.create');

    function save(e) {
        e.preventDefault();
        post('/reports/monthly');
    }

    function changePeriod(e) {
        setPeriod(e.target.value);
        router.get('/reports/monthly', { period: e.target.value });
    }

    return (
        <div className="card mb-4">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="section-title mb-0">Employee Report</h5>
                    <input type="month" className="form-control w-auto" value={period} onChange={changePeriod} />
                </div>
                {report && <p className="mb-3">Status: <span className={`badge ${STATUS_BADGE[report.status] || 'bg-secondary'}`}>{report.status}</span></p>}
                {locked && <div className="alert alert-info">This report has been reviewed and can no longer be edited.</div>}
                <form onSubmit={save}>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="accomplishments">Accomplishments</label>
                        <textarea id="accomplishments" className="form-control" rows="6" disabled={locked}
                            value={data.accomplishments} onChange={(e) => setData('accomplishments', e.target.value)} />
                        {errors.accomplishments && <div className="text-danger small">{errors.accomplishments}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="hours_worked">Hours Worked</label>
                        <input id="hours_worked" type="number" min="0" max="744" step="0.25" className="form-control" disabled={locked}
                            value={data.hours_worked} onChange={(e) => setData('hours_worked', e.target.value)} />
                        {errors.hours_worked && <div className="text-danger small">{errors.hours_worked}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label" htmlFor="notes">Notes</label>
                        <textarea id="notes" className="form-control" rows="4" disabled={locked}
                            value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        {errors.notes && <div className="text-danger small">{errors.notes}</div>}
                    </div>
                    {!locked && canSave && (
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary" disabled={processing}>Save Draft</button>
                            {report?.status === 'draft' && (
                                <button type="button" className="btn btn-success" onClick={() => post(`/reports/monthly/${report.id}/submit`)} disabled={processing}>
                                    Submit for Review
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

function History({ history }) {
    const can = useCan();

    function remove(entry) {
        if (window.confirm(`Delete your draft for ${MONTHS[entry.report_month - 1]} ${entry.report_year}?`)) {
            router.delete(`/reports/monthly/${entry.id}`, { preserveScroll: true });
        }
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="section-title">My Past Reports</h5>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle mb-0">
                        <thead className="table-primary">
                            <tr><th>Period</th><th>Hours</th><th>Status</th><th>Last Updated</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {history.length === 0 && (
                                <tr><td colSpan="5" className="text-center text-muted py-4">You have not saved any reports yet.</td></tr>
                            )}
                            {history.map((entry) => {
                                const period = `${entry.report_year}-${String(entry.report_month).padStart(2, '0')}`;
                                return (
                                    <tr key={entry.id}>
                                        <td>{MONTHS[entry.report_month - 1]} {entry.report_year}</td>
                                        <td>{entry.hours_worked}</td>
                                        <td><span className={`badge ${STATUS_BADGE[entry.status] || 'bg-secondary'}`}>{entry.status}</span></td>
                                        <td>{new Date(entry.updated_at).toLocaleDateString()}</td>
                                        <td className="d-flex gap-2">
                                            <button type="button" className="btn btn-sm btn-outline-primary"
                                                onClick={() => router.get('/reports/monthly', { period })}>
                                                {entry.status === 'draft' ? 'Edit' : 'View'}
                                            </button>
                                            {entry.status === 'draft' && can('reports.delete-own') && (
                                                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(entry)}>Delete</button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function Monthly({ year, month, report, history }) {
    return (
        <>
            <Head title="My Monthly Report" />
            <AppLayout
                title="My Monthly Report"
                subtitle="Prepare and submit your monthly accomplishments"
            >
                {/* key remounts the form when the period or report changes, so stale text never lingers */}
                <ReportForm key={`${year}-${month}-${report?.id ?? 'new'}-${report?.status ?? ''}`} year={year} month={month} report={report} />
                <History history={history} />
            </AppLayout>
        </>
    );
}
