import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    title: (title) => title || 'Inventory Management System',

    // Pages are code-split: each one is only downloaded when it is first visited.
    resolve: (name) => resolvePageComponent(
        `./pages/${name}.jsx`,
        import.meta.glob('./pages/**/*.jsx'),
    ),

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
