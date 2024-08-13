export default class User {
    constructor(
        public id: number,
        public username: string,
        public fullName: string,
        public token: string
    ) {}
}
