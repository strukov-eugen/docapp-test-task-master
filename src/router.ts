import MainView from './views/MainView';
import UserRepository from './repositories/UserRepository';
import NavigationHandler from './navigationHandler';

export class Router {
    private routes: { [key: string]: Function } = {};
    private userRepository: UserRepository;
    private currentUrl: string | undefined;
    private currentMainView: string | null = null;
    private navigationHandler: NavigationHandler;

    constructor() {
        this.userRepository = new UserRepository();
        this.navigationHandler = new NavigationHandler(this);
    }

    registerRoute(path: string, schemeName: string) {
        this.routes[path] = async () => {

            const scheme = await loadModule(`./schemes/${schemeName}-scheme.ts`);

            if (!this.checkAccess(scheme.access.role)) {
                this.handleRedirection();
                return;
            }

            this.currentUrl = window.location.pathname;

            // Render the main template only if the scheme names are different
            if (this.currentMainView !== scheme.mainView) {
                const mainView = new MainView();
                await mainView.renderTemplate(schemeName);
                this.currentMainView = scheme.mainView;

            }

            // Initializing controllers based on the schema
            for (const controllerConfig of scheme.controllers) {
                const [View, repositories, Controller] = await Promise.all([
                    loadModule(`./views/${controllerConfig.view}.ts`),
                    loadRepositories(controllerConfig.repositories),
                    loadModule(`./controllers/${controllerConfig.name}.ts`)
                ]);

                const view = new View();
                const controller = new Controller(view, ...repositories);

                controller.init();
            }
        };
    }

    registerRoutes(paths: string[], schemeName: string) {
        paths.forEach(path => this.registerRoute(path, schemeName));
    }

    private checkAccess(requiredRole?: string): boolean {
        if (!requiredRole || requiredRole === 'user' ) {
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

const moduleCache: Map<string, any> = new Map();

async function loadModule(modulePath: string) {
    // Check cache first
    if (moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath);
    }

    try {
        const module = await import(/* webpackChunkName: "module-[request]" */`${modulePath}`);
        const defaultExport = module.default ? module.default : module;
        moduleCache.set(modulePath, defaultExport);
        return defaultExport;
    } catch (error) {
        console.error(`Failed to load module at ${modulePath}:`, error);
        throw error;
    }
}

async function loadRepositories(repositoryNames: string[]) {
    const repositories: any[] = [];
    for (const name of repositoryNames) {
        const Repository = await loadModule(`./repositories/${name}.ts`);
        repositories.push(new Repository());
    }
    return repositories;
}


