import { router } from '@inertiajs/react';

export default function Hello() {
    return (
        <div className="p-3">
            <h1>React is working</h1>
            <button onClick={() => router.post('/logout')}>Logout</button>
        </div>
    );
}