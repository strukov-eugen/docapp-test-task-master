import { EventEmitter } from 'events';

export default class Repository<T> extends EventEmitter {
    protected storageKey: string;

    constructor(storageKey: string) {
        super();
        this.storageKey = storageKey;
    }

    getAll(): T[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }

    save(data: T[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
        this.emit('change');
    }
}
