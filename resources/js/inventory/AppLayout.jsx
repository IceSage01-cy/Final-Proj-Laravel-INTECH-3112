import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AppLayout({ title, subtitle, actions, children }) {
    const { flash } = usePage().props;
    const [dismissed, setDismissed] = useState(false);

    // a new message should show again
    useEffect(() => setDismissed(false), [flash]);

    const message = flash?.error || flash?.success;
    const isError = Boolean(flash?.error);

    return (
        <div className="container py-5">
            <div className="app-panel shadow-sm">
                <div className="card app-header">
                    <div className="card-body text-white">
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                            <div>
                                <h2 className="fw-bold mb-1">{title}</h2>
                                {subtitle && <small>{subtitle}</small>}
                            </div>
                            <div className="d-flex gap-2 flex-wrap">
                                {actions}
                                <button
                                    type="button"
                                    className="btn btn-outline-light"
                                    onClick={() => router.post('/logout')}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {message && !dismissed && (
                    <div className="bg-white px-3 pt-3">
                        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} alert-dismissible mb-0`}>
                            {message}
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => setDismissed(true)} />
                        </div>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}
