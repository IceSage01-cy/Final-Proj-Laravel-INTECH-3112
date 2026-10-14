import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors } = useForm({
        token, email: email ?? '', password: '', password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/reset-password');
    }

    const field = (id, label, type = 'text') => (
        <div className="mb-3">
            <label className="form-label" htmlFor={id}>{label}</label>
            <input id={id} type={type} className={`form-control ${errors[id] ? 'is-invalid' : ''}`}
                value={data[id]} onChange={(e) => setData(id, e.target.value)} />
            {errors[id] && <div className="invalid-feedback">{errors[id]}</div>}
        </div>
    );

    return (
        <>
            <Head title="Reset Password" />
            <div className="login-page"><div className="container"><div className="row justify-content-center">
                <div className="col-md-5 col-lg-4"><div className="login-card shadow-sm bg-white">
                    <div className="login-header text-white"><h2 className="fw-bold mb-1">Reset password</h2></div>
                    <form className="p-4" onSubmit={submit}>
                        {field('email', 'Email', 'email')}
                        {field('password', 'New password', 'password')}
                        {field('password_confirmation', 'Confirm password', 'password')}
                        <div className="d-grid"><button className="btn btn-primary" disabled={processing}>Reset password</button></div>
                    </form>
                </div></div>
            </div></div></div>
        </>
    );
}