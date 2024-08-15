import { EventEmitter } from 'events';

export default class Repository<T> extends EventEmitter {
    private _items: Map<string, T> = new Map();
    private model: new (...args: any[]) => T;

    constructor(model: new (...args: any[]) => T) {
        super();
        this.model = model;
        this.loadFromLocalStorage();
    }

    getItems(): Map<string, T> {
        return this._items;
    }

    addOrUpdateItem(key: string, item: T): void {
        if (!(item instanceof this.model)) {
            throw new TypeError('Must be an instance of ' + this.model.name);
        }
        this._items.set(key, item);
        this.saveToLocalStorage();
    }

    set(items: Array<{ key: string, item: T }>): void {
        const newItemsMap = new Map<string, T>();

        // Проверяем каждый элемент списка
        for (const { key, item } of items) {
            if (!(item instanceof this.model)) {
                throw new TypeError('All items must be instances of ' + this.model.name);
            }
            newItemsMap.set(key, item);
        }

        // Если все элементы валидны, перезаписываем _items
        this._items = newItemsMap;
        this.saveToLocalStorage();
    }

    protected saveToLocalStorage(): void {
        try {
            const dataToSave = {
                _items: JSON.stringify(Array.from(this._items.entries()))
            };
            localStorage.setItem(this.constructor.name, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Failed to save data to localStorage:', error);
        }
    }

    protected loadFromLocalStorage(): void {
        try {
            const savedData = localStorage.getItem(this.constructor.name);
            if (savedData) {
                const { _items } = JSON.parse(savedData);
                this._items = new Map(JSON.parse(_items));
            }
        } catch (error) {
            console.error('Failed to load data from localStorage:', error);
        }
    }
}