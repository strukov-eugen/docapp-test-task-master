import { Router } from './router';

async function init() {

    const router = new Router();

    // Registering Routes Using a Scheme
    router.registerRoute('/', 'login');
    router.registerRoute('/index.html', 'login'); 
    router.registerRoute('/login', 'login');
    router.registerRoute('/rooms', 'rooms');

    // Depending on the current path, we launch the corresponding route
    const currentPath = window.location.pathname;
    router.navigate(currentPath);
}

init();
