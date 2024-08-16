import { LifecycleManager, loadModule } from './LifecycleManager';
import UserRepository from './repositories/UserRepository';
import NavigationHandler from './navigationHandler';

export class Router {
    private routes: { [key: string]: Function } = {};
    private userRepository: UserRepository;
    private navigationHandler: NavigationHandler;
    private lifecycleManager: LifecycleManager;
    private currentUrl: string | undefined;

    constructor() {
        this.userRepository = new UserRepository();
        this.navigationHandler = new NavigationHandler(this);
        this.lifecycleManager = new LifecycleManager();
    }

    registerRoute(path: string, schemeName: string) {
        this.routes[path] = async () => {
            const scheme = await loadModule(`./schemes/${schemeName}-scheme.ts`);

            if (!this.checkAccess(scheme.access.role)) {
                this.handleRedirection();
                return;
            }

            this.currentUrl = window.location.pathname;

            await this.lifecycleManager.loadMainView(schemeName);
            await this.lifecycleManager.loadControllers(scheme.controllers);
        };
    }

    registerRoutes(paths: string[], schemeName: string) {
        paths.forEach(path => this.registerRoute(path, schemeName));
    }

    private checkAccess(requiredRole?: string): boolean {
        if (!requiredRole || requiredRole === 'user') {
            return true;
        }
        const currentUser = this.userRepository.getCurrentUser();
        return currentUser?.role === 'admin';
    }

    private handleRedirection() {
        if (this.currentUrl !== window.location.pathname) {
            this.navigate(window.location.pathname, false);
        } else {
            this.navigate('/', false);
        }
    }

    navigate(path: string, addToHistory: boolean = true) {
        if (this.routes[path]) {
            if (addToHistory) {
                history.pushState({}, '', path);
            }
            this.routes[path]();
        } else {
            console.error(`Route ${path} not found.`);
        }
    }
}