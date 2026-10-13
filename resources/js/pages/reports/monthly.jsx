import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '../../inventory/AppLayout';

export default function Monthly({ year, month, report }) {
    const { data, setData, post, processing, errors } = useForm({
        period: `${year}-${String(month).padStart(2, '0')}`,
        accomplishments: report?.accomplishments || '',
        hours_worked: report?.hours_worked || '',
        notes: report?.notes || '',
    });
    const [period, setPeriod] = useState(data.period);
    const locked = report?.status === 'reviewed';

    function save(e) {
        e.preventDefault();
        post('/reports/monthly');
    }

    function changePeriod(e) {
        setPeriod(e.target.value);
        window.location.href = `/reports/monthly?period=${e.target.value}`;
    }

    return (
        <>
            <Head title="My Monthly Report" />
            <AppLayout
                title="My Monthly Report"
                subtitle="Prepare and submit your monthly accomplishments"
                actions={<a href="/" className="btn btn-outline-light">Inventory</a>}
            >
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="section-title mb-0">Employee Report</h5>
                            <input type="month" className="form-control w-auto" value={period} onChange={changePeriod} />
                        </div>
                        {report && <p className="mb-3">Status: <span className="badge bg-secondary">{report.status}</span></p>}
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
                            {!locked && (
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
            </AppLayout>
        </>
    );
}
