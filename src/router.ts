import MainView from './views/MainView';
import UserRepository from './repositories/UserRepository';

export class Router {
    private routes: { [key: string]: Function } = {};
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    registerRoute(path: string, schemeName: string) {
        this.routes[path] = async () => {
            if (this.shouldRedirect(path)) {
                this.handleRedirection(path);
                return;
            }

            const scheme = await loadModule(`./schemes/${schemeName}-scheme.ts`);

            // Rendering the main template based on the schema
            const mainView = new MainView();
            await mainView.renderTemplate(schemeName);

            // Initializing controllers based on the schema
            for (const controllerConfig of scheme.controllers) {
                const Model = await loadModule(`./models/${controllerConfig.model}.ts`);
                const View = await loadModule(`./views/${controllerConfig.view}.ts`);
                const repositories = await loadRepositories(controllerConfig.repositories);

                const model = new Model();
                const view = new View(model);
                const Controller = await loadModule(`./controllers/${controllerConfig.name}.ts`);
                const controller = new Controller(model, view, ...repositories);

                controller.init();
            }
        };
    }

    navigate(path: string) {
        if (this.routes[path]) {
            this.routes[path]();
        } else {
            console.error(`Route ${path} not found.`);
        }
    }

    private shouldRedirect(path: string): boolean {
        return (path === '/' || path === '/index.html' || path === '/rooms') && !this.userRepository.isUserAuthenticated();
    }

    private handleRedirection(path: string) {
        if (path === '/login') {
            // Do nothing for /login
            return;
        }

        if (path === '/' || path === '/index.html') {
            // Redirect to /login
            this.navigate('/login');
        } else if (path === '/rooms' && !this.userRepository.isUserAuthenticated()) {
            // Redirect to /login if not authenticated
            this.navigate('/login');
        }
    }


}

export async function loadModule(modulePath: string) {
    try {
        const module = await import(/* webpackChunkName: "module-[request]" */`${modulePath}`);
        return module.default ? module.default : module;
    } catch (error) {
        console.error(`Failed to load module at ${modulePath}:`, error);
        throw error;
    }
}

export async function loadRepositories(repositoryNames: string[]) {
    const repositories: any[] = [];
    for (const name of repositoryNames) {
        const Repository = await loadModule(`./repositories/${name}.ts`);
        repositories.push(new Repository());
    }
    return repositories;
}


