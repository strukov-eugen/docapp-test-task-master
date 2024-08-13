import User from '../models/User';
import { getFromStorage, saveToStorage } from '../utils/storageUtils';

export default class UserRepository {
    private storageKey = 'currentUser';

    async authenticate(username: string, password: string): Promise<User | null> {
        // Simplified authentication logic
        if (username === 'admin' && password === 'admin') {
            return new User(1, username, 'Admin User', 'fake-jwt-token');
        }
        return null;
    }

    saveUser(user: User) {
        saveToStorage(this.storageKey, user);
    }

    getUser(): User | null {
        return getFromStorage(this.storageKey);
    }

    // Метод проверки, авторизован ли пользователь
    isUserAuthenticated(): boolean {
        const user = localStorage.getItem(this.storageKey);
        return user !== null;
    }

    // Метод очистки данных пользователя
    clear() {
        localStorage.removeItem(this.storageKey);
    }

}
