import { Router } from "router";

export default class NavigationHandler {
    private router: Router;
    private originalPushState: typeof history.pushState;
    private originalReplaceState: typeof history.replaceState;

    constructor(router: Router) {
        this.router = router;

        // Сохранение оригинальных методов
        this.originalPushState = history.pushState;
        this.originalReplaceState = history.replaceState;

        this.addListeners();
    }

    private addListeners() {
        // Переопределение методов pushState и replaceState
        history.pushState = (data: any, title: string, url?: string | URL) => {
            this.originalPushState.call(history, data, title, url);
            this.handleNavigation();
        };

        history.replaceState = (data: any, title: string, url?: string | URL) => {
            this.originalReplaceState.call(history, data, title, url);
            this.handleNavigation();
        };

        // Добавление обработчиков событий
        window.addEventListener('popstate', this.handleNavigation.bind(this));
        document.addEventListener('click', this.linkClickListener.bind(this));
    }

    private linkClickListener(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.tagName === 'A' && target.getAttribute('href')) {
            event.preventDefault(); // Предотвращаем стандартное поведение ссылки
            const href = (target as HTMLAnchorElement).href;
            this.router.navigate(href, false); // Навигация через Router
        }
    }

    private handleNavigation() {
        const currentUrl = window.location.pathname;
        console.log(`Navigated to ${currentUrl}`);
        this.router.navigate(currentUrl, false); // Навигация через Router
    }

    public removeListeners() {
        window.removeEventListener('popstate', this.handleNavigation.bind(this));
        document.removeEventListener('click', this.linkClickListener.bind(this));

        // Восстановление оригинальных методов
        history.pushState = this.originalPushState;
        history.replaceState = this.originalReplaceState;
    }
}
