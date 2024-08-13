export function saveToStorage(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getFromStorage(key: string): any | null {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

export function removeFromStorage(key: string): void {
    localStorage.removeItem(key);
}