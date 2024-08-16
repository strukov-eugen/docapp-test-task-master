import MainView from './views/MainView';

export class LifecycleManager {
    private currentMainView: MainView | null = null;
    private currentMainViewSchemeName: string | null = null;  // Добавлен для проверки схемы
    private currentControllers: { [key: string]: any } = {};

    async unloadMainView() {
        if (this.currentMainView) {
            this.currentMainView.destroy();
            this.currentMainView = null;
            this.currentMainViewSchemeName = null;
        }
    }

    async unloadControllers() {
        for (const key in this.currentControllers) {
            const controller = this.currentControllers[key];
            if (controller) {
                if (typeof controller.destroy === 'function') {
                    controller.destroy();
                }
                this.currentControllers[key] = null;
            }
        }
    }

    async loadMainView(schemeName: string) {
        if (this.currentMainViewSchemeName !== schemeName) {
            await this.unloadMainView();
            this.currentMainView = new MainView();
            await this.currentMainView.renderTemplate(schemeName);
            this.currentMainViewSchemeName = schemeName;
        }
    }

    async loadControllers(controllerConfigs: any[]) {
        await this.unloadControllers();
        for (const controllerConfig of controllerConfigs) {
            const [View, repositories, Controller] = await Promise.all([
                loadModule(`./views/${controllerConfig.view}.ts`),
                loadRepositories(controllerConfig.repositories),
                loadModule(`./controllers/${controllerConfig.name}.ts`)
            ]);

            const view = new View();
            const controller = new Controller(view, ...repositories);
            this.currentControllers[controllerConfig.name] = controller;
            controller.init();
        }
    }
}

const moduleCache: Map<string, any> = new Map();

export async function loadModule(modulePath: string) {
    if (moduleCache.has(modulePath)) {
        return moduleCache.get(modulePath);
    }

    try {
        const module = await import(/* webpackChunkName: "module-[request]" */ `${modulePath}`);
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