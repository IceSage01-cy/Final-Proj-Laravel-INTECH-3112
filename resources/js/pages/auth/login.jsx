import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });
    const [clientError, setClientError] = useState('');

    function submit(e) {
        e.preventDefault();

        if (!data.username.trim() || !data.password.trim()) {
            setClientError('Please enter both username and password.');
            return;
        }

        setClientError('');
        post('/login', { onFinish: () => setData('password', '') });
    }

    const error = clientError || errors.username || errors.password;

        return (
        <>
            <Head title="Login" />
            <div className="flex min-h-screen bg-paper">
                <div className="hidden w-1/2 flex-col justify-between bg-navy p-12 text-white lg:flex">
                    <div className="text-xl font-semibold">Inventory System</div>
                    <div>
                        <h1 className="text-4xl font-bold leading-tight">
                            Track stock.<br />Stay ahead of shortages.
                        </h1>
                        <p className="mt-4 max-w-md text-white/80">
                            Manage products, suppliers, and low-stock alerts in one place.
                        </p>
                    </div>
                    <p className="text-sm text-white/60">INTECH 3112 Final Project</p>
                </div>

                <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
                    <div className="w-full max-w-sm">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
                        <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>

                        <form className="mt-8 space-y-5" onSubmit={submit}>
                            {error && (
                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                                    placeholder="Enter username"
                                    autoFocus
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-navy focus:ring-2 focus:ring-navy/20"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-lg bg-navy px-4 py-2.5 font-medium text-white transition hover:bg-navy-dark disabled:opacity-60"
                            >
                                {processing ? 'Signing in...' : 'Login'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}