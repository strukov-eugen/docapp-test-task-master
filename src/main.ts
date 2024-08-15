import { Router } from './router';

async function init() {

    const router = new Router();

    // Registering Routes Using a Scheme
    router.registerRoutes(['/', '/index.html', '/login'], 'login');
    router.registerRoute('/rooms', 'rooms');

    // Depending on the current path, we launch the corresponding route
    const currentPath = window.location.pathname;
    router.navigate(currentPath);
}

init();
