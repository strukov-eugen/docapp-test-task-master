import ConsentFormTabs from './ConsentFormTabs';

export default class ConsentForms {
    private formContainer: HTMLElement;

    constructor() {
        this.formContainer = document.querySelector('.consent-forms-container')!;
    }

    renderForms(consentForms: any[]) {
        this.formContainer.innerHTML = this.generateFormsHTML(consentForms);
        this.initEventListeners();
    }

    private generateFormsHTML(consentForms: any[]): string {
        return `
            <div class="consent-forms">
                <div class="select-all">
                    <input type="checkbox" id="selectAll" />
                    <label for="selectAll">Select/Deselect All</label>
                </div>
                <ul>
                    ${consentForms.map(this.generateFormItemHTML).join('')}
                </ul>
                <button id="signButton" style="display: none;">Sign</button>
            </div>
        `;
    }

    private generateFormItemHTML = (form: any): string => `
        <li>
            <input type="checkbox" class="consent-form-checkbox" value="${form.code}" data-form-id="${form.code}" />
            <label>${form.title}</label>
        </li>
    `;

    private initEventListeners() {
        const checkboxes = document.querySelectorAll('.consent-form-checkbox');
        const selectAllCheckbox = document.getElementById('selectAll')!;
        const signButton = document.getElementById('signButton')!;
    
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSignButtonVisibility(checkboxes, signButton));
        });
    
        selectAllCheckbox.addEventListener('change', () => {
            const isChecked = (selectAllCheckbox as HTMLInputElement).checked;
            checkboxes.forEach(checkbox => {
                (checkbox as HTMLInputElement).checked = isChecked;
            });
            this.updateSignButtonVisibility(checkboxes, signButton);
        });

        signButton.addEventListener('click', () => {
            const selectedFormCodes = this.getSelectedFormCodes();
            this.renderConsentFormTabs(selectedFormCodes);
        });
    }

    private updateSignButtonVisibility(checkboxes: NodeListOf<Element>, signButton: HTMLElement): void {
        const checkboxesArray = Array.from(checkboxes) as HTMLInputElement[];
        const hasCheckedCheckboxes = checkboxesArray.some(checkbox => checkbox.checked && checkbox.id !== 'selectAll');
        signButton.style.display = hasCheckedCheckboxes ? 'block' : 'none';
        if (!hasCheckedCheckboxes) {
            const selectAllCheckbox = document.querySelector('#selectAll') as HTMLInputElement;
            if (selectAllCheckbox && selectAllCheckbox.checked) {
                selectAllCheckbox.checked = false;
            }
            const consentFormTabs = new ConsentFormTabs();
            consentFormTabs.clearContentsContainer();
        }
    }

    private getSelectedFormCodes(): string[] {
        return Array.from(this.formContainer.querySelectorAll('input[type="checkbox"]:checked'))
            .filter(checkbox => (checkbox as HTMLInputElement).id !== 'selectAll')
            .map(checkbox => (checkbox as HTMLInputElement).value);
    }

    private async renderConsentFormTabs(formCodes: string[]) {
        const consentFormTabs = new ConsentFormTabs();
        await consentFormTabs.renderTabs(formCodes);
    }

}
