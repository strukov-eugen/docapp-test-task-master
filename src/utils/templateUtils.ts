export function wrapWithTemplate(string: string): string {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = string;
    return templateElement.innerHTML;
}

export async function loadTemplate(name: string): Promise<string> {
    const template = await import(`../templates/${name}.template.ts`);
    return template.default;
}
