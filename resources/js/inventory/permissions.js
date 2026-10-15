import { usePage } from '@inertiajs/react';

// Returns can('some.permission'), based on what the server shared for the signed-in user.
export function useCan() {
    const permissions = usePage().props.auth?.user?.permissions ?? [];

    return (permission) => permissions.includes(permission);
}
