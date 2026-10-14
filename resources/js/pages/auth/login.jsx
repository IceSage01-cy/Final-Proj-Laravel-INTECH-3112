import { Head, Link, useForm } from '@inertiajs/react';
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
            <div className="login-split">
                <div className="login-aside">
                    <div className="fs-5 fw-semibold">Inventory System</div>
                    <div>
                        <h1>Track stock.<br />Stay ahead of shortages.</h1>
                        <p className="mt-4 mb-0 opacity-75">
                            Manage products, suppliers, and low-stock alerts in one place.
                        </p>
                    </div>
                    <small className="opacity-75">INTECH 3112 Final Project</small>
                </div>

                <div className="login-main">
                    <div className="login-form-wrap">
                        <h2 className="fw-bold mb-1">Welcome back</h2>
                        <p className="text-secondary mb-4">Sign in to continue</p>

                        <form onSubmit={submit}>
                            {error && <div className="alert alert-danger">{error}</div>}

                            <div className="mb-3">
                                <label className="form-label" htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter username"
                                    autoFocus
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                            </div>

                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-primary" disabled={processing}>
                                            Login
                                        </button>
                                    </div>
                                        <div className="d-flex justify-content-between mt-3">
                                        <Link href="/register">Create Employee account</Link>
                                        <Link href="/forgot-password">Forgot password?</Link>
                                    </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
   );
}