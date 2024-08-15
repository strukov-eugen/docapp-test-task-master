export default class User {
    id: string = '';
    username: string = '';
    role: 'admin' | 'user' = 'user';

    constructor(params: Partial<User> = {}) {
        Object.assign(this, params);
    }
}