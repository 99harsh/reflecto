import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private isBrowser: boolean;
    private memoryStorage = new Map<string, string>(); // Fallback for SSR

    constructor(@Inject(PLATFORM_ID) platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    getItem(key: string): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(key);
        }
        return this.memoryStorage.get(key) ?? null;
    }

    setItem(key: string, value: string): void {
        if (this.isBrowser) {
            localStorage.setItem(key, value);
        } else {
            this.memoryStorage.set(key, value);
        }
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        } else {
            this.memoryStorage.delete(key);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.clear();
        } else {
            this.memoryStorage.clear();
        }
    }
}
