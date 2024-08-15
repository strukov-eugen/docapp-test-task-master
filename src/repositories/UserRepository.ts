import User from '../models/User';
import Repository from './Repository';

export default class UserRepository extends Repository<User> {
    private currentUserIdKey = 'currentUserId';

    constructor() {
        super(User);
        this.loadCurrentUser();
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        // Упрощенная логика аутентификации
        if (username === 'admin' && password === 'admin') {
            const user = new User({ id: '1', username, role: 'admin' });
            this.addOrUpdateItem(user.id, user);
            this.setCurrentUser(user.id);
            return user;
        }
        return null;
    }

    private setCurrentUser(userId: string): void {
        localStorage.setItem(this.currentUserIdKey, userId);
        this.emit('change');
    }

    getCurrentUser(): User | null {
        const userId = localStorage.getItem(this.currentUserIdKey);
        if (userId) {
            return this.getItems().get(userId) || null;
        }
        return null;
    }

    isUserAuthenticated(): boolean {
        return localStorage.getItem(this.currentUserIdKey) !== null;
    }

    clear(): void {
        localStorage.removeItem(this.currentUserIdKey);
        this.getItems().clear();
        this.saveToLocalStorage();
    }

    private loadCurrentUser(): void {
        const userId = localStorage.getItem(this.currentUserIdKey);
        if (userId) {
            const user = this.getItems().get(userId);
            if (user) {
                this.setCurrentUser(userId);
            }
        }
    }
}