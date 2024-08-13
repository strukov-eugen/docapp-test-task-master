import User from '../models/User';

export default class LoginView {
    onLogin!: (username: string, password: string) => void;

    constructor(private model: User) {
        this.init();
    }

    init() {
        const form = document.getElementById('login-form') as HTMLFormElement;
        form.onsubmit = (event) => {
            event.preventDefault();
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            this.onLogin(username, password);
        };
    }

    showLoginError(message: string) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.innerText = message;
        document.getElementById('auth')?.appendChild(errorDiv);
    }
}