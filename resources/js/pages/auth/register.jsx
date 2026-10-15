import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        username: '', email: '', password: '', password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/register', {
            onFinish: () => setData({ ...data, password: '', password_confirmation: '' }),
        });
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
            <Head title="Create Employee account" />
            <div className="login-page"><div className="container"><div className="row justify-content-center">
                <div className="col-md-5 col-lg-4"><div className="login-card shadow-sm bg-white">
                    <div className="login-header text-white"><h2 className="fw-bold mb-1">Create Employee account</h2></div>
                    <form className="p-4" onSubmit={submit}>
                        {field('username', 'Username')}
                        {field('email', 'Email', 'email')}
                        {field('password', 'Password', 'password')}
                        {field('password_confirmation', 'Confirm password', 'password')}
                        <div className="d-grid"><button className="btn btn-primary" disabled={processing}>Register</button></div>
                        <p className="mt-3 mb-0 text-center"><Link href="/login">Already have an account?</Link></p>
                    </form>
                </div></div>
            </div></div></div>
        </>
    );
}