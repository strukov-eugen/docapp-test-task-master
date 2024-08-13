import User from '../models/User';
import UserRepository from '../repositories/UserRepository';
import LoginView from '../views/LoginView';

export default class LoginController {

    constructor(
        private model: User,
        private view: LoginView,
        private userRepo: UserRepository
    ) {}

    init() {
        this.userRepo.clear();
        this.view.onLogin = async (username: string, password: string) => {

            console.log(this.userRepo.authenticate);
            
            const user = await this.userRepo.authenticate(username, password);
            if (user) {
                this.userRepo.saveUser(user);
                window.location.href = '/rooms';
            } else {
                this.view.showLoginError("Invalid username or password");
            }
        };
    }
}
