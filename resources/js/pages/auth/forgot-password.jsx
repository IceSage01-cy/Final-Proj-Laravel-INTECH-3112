import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({ email: '' });
    const [sent, setSent] = useState(false);

    function submit(e) {
        e.preventDefault();
        post('/forgot-password', { onSuccess: () => setSent(true) });
    }

    return (
        <>
            <Head title="Forgot Password" />
            <div className="login-page"><div className="container"><div className="row justify-content-center">
                <div className="col-md-5 col-lg-4"><div className="login-card shadow-sm bg-white">
                    <div className="login-header text-white"><h2 className="fw-bold mb-1">Forgot password</h2></div>
                    <form className="p-4" onSubmit={submit}>
                        {sent && <div className="alert alert-success">Reset link sent. Check your email.</div>}
                        <div className="mb-3">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input id="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="d-grid"><button className="btn btn-primary" disabled={processing}>Send reset link</button></div>
                        <p className="mt-3 mb-0 text-center"><Link href="/login">Back to login</Link></p>
                    </form>
                </div></div>
            </div></div></div>
        </>
    );
}