import { loadTemplate } from '../utils/templateUtils';

export default class MainView {
    async renderTemplate(schemeName: string) {
        const template = await loadTemplate(schemeName);
        document.body.innerHTML = template;
    }
}