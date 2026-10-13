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
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <header className="border-b-4 border-gold bg-navy px-6 py-8 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{title}</h1>
                            {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {actions}
                            <button
                                type="button"
                                className="rounded border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-navy"
                                onClick={() => router.post('/logout')}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {message && !dismissed && (
                    <div
                        className={`flex items-start justify-between gap-3 border-b px-6 py-3 text-sm ${
                            isError
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-green-200 bg-green-50 text-green-800'
                        }`}
                    >
                        <span>{message}</span>
                        <button
                            type="button"
                            aria-label="Close"
                            className="text-lg leading-none opacity-60 hover:opacity-100"
                            onClick={() => setDismissed(true)}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="bg-paper p-6">{children}</div>
            </div>
        </div>
    );
}
