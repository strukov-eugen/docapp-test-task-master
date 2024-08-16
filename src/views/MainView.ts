import { loadTemplate } from '../utils/templateUtils';

export default class MainView {
    private element?: HTMLElement;

    async renderTemplate(schemeName: string) {
        const template = await loadTemplate(schemeName);
        this.element = document.createElement('div');
        this.element.innerHTML = template;
        document.body.innerHTML = '';
        document.body.appendChild(this.element);
    }

    destroy() {
        if (this.element) {
            // Очистите любые добавленные события или ресурсы
            this.element.remove();
        }
    }
}