export default class ConsentFormTabs {
    private container: HTMLElement;

    constructor() {
        this.container = document.querySelector('.consent-form-tabs')!;
    }

    async renderTabs(formCodes: string[]) {
        const tabsHtml = this.generateTabsHTML(formCodes);
        const contentsHtml = await this.generateContentsHTML(formCodes);

        this.container.innerHTML = `
            <div class="tabs-container">
                ${tabsHtml}
            </div>
            <div class="contents-container">
                ${contentsHtml.join('')}
            </div>
        `;

        this.initEventListeners();
    }

    public clearContentsContainer() {
        this.container.innerHTML = `
            <div class="tabs-container">
            </div>
            <div class="contents-container">
            </div>
        `;
    }


    private generateTabsHTML(formCodes: string[]): string {
        return formCodes.map((code, index) => `
            <button class="tab-button${index === 0 ? ' active' : ''}" data-form="${code}">
                ${code}
            </button>
        `).join('');
    }

    private async generateContentsHTML(formCodes: string[]): Promise<string[]> {
        return Promise.all(formCodes.map(async (code) => {
            const details = await loadConsentFormDetails(code);
            return this.generateContentHTML(code, details, formCodes);
        }));
    }

    private generateContentHTML(formCode: string, details: any[], formCodes: string[]): string {
        const contentHtml = details.map(item => `
            <li>
                ${item.need_initials 
                    ? `<input type="checkbox" class="initials-checkbox" data-content="${item.content}" /> ${item.content}`
                    : item.content
                }
            </li>
        `).join('');

        return `
            <div class="tab-content${formCode === formCodes[0] ? ' show' : ''}" data-form="${formCode}">
                <ul>
                    ${contentHtml}
                </ul>
            </div>
        `;
    }

    private initEventListeners() {
        this.container.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => this.switchTab(button as HTMLButtonElement));
        });

        this.container.querySelectorAll('.initials-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => this.handleCheckboxChange(event.target as HTMLInputElement));
        });
    }

    private switchTab(button: HTMLButtonElement) {
        this.container.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        this.container.querySelectorAll('.tab-content').forEach(content => content.classList.remove('show'));

        button.classList.add('active');
        const formCode = button.dataset.form!;
        this.container.querySelector(`.tab-content[data-form="${formCode}"]`)!.classList.add('show');
    }

    private handleCheckboxChange(checkbox: HTMLInputElement) {
        if (checkbox.checked) {
            checkbox.parentElement!.innerHTML = `<strong>${this.getPatientInitials()}</strong> ${checkbox.getAttribute('data-content')}`;
        }
    }

    private getPatientInitials(): string {
        const patient = { first_name: 'John', last_name: 'Smith' }; // Replace with actual patient data
        return `${patient.first_name[0]}${patient.last_name[0]}`;
    }
}

export async function loadConsentFormDetails(formCode: string): Promise<any[]> {
    try {
        const response = await fetch(`./data/consent-form-details/${formCode}.json`);
        return await response.json();
    } catch (error) {
        console.error(`Failed to load consent form details for ${formCode}:`, error);
        return [];
    }
}