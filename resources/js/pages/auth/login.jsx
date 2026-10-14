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
                </div>
            </div>
        </>
    );
}