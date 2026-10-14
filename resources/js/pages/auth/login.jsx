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
            <div className="login-page">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="login-card shadow-sm bg-white">
                                <div className="login-header text-white">
                                    <h2 className="fw-bold mb-1">Inventory System</h2>
                                    <small>Sign in to continue</small>
                                </div>

                                <form className="p-4" onSubmit={submit}>
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

                                    <div className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <label className="form-label mb-0" htmlFor="password">Password</label>
                                            <Link href="/forgot-password" className="small text-decoration-none text-muted">
                                                Forgot password?
                                            </Link>
                                        </div>
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

                                    <div className="text-center mt-3 pt-2 border-top">
                                        <p className="small text-muted mb-0">
                                            Don't have an account?{' '}
                                            <Link href="/register" className="text-decoration-none fw-semibold">
                                                Create Employee account
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}