import UserRepository from '../repositories/UserRepository';
import LoginView from '../views/LoginView';

export default class LoginController {

    constructor(
        private view: LoginView,
        private userRepo: UserRepository
    ) {}

    init() {
        this.userRepo.clear();
        this.view.onLogin = async (username: string, password: string) => {
            try {
                const user = await this.userRepo.authenticate(username, password);
                if (user) {
                    window.location.href = '/rooms';
                } else {
                    this.view.showLoginError("Invalid username or password");
                }
            } catch (error) {
                console.error('Login failed:', error);
                this.view.showLoginError("An error occurred during login");
            }
        };
    }
}
