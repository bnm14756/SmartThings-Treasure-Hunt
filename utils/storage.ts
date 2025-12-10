// 1. Define a safe Memory Storage implementation
class MemoryStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

// 2. Singleton instance
const memoryStore = new MemoryStorage();
const STORAGE_KEY = 'st_treasure_hunt_save_v1';

// 3. Helper to get the best available storage without throwing errors
function getStorage(): Storage | MemoryStorage {
  try {
    // If window is undefined (SSR) or we are in a sandboxed iframe, this might throw
    if (typeof window === 'undefined') return memoryStore;
    
    // Accessing localStorage property itself can throw SecurityError
    const storage = window.localStorage;
    
    // Test write permission
    const testKey = '__test_perm__';
    storage.setItem(testKey, '1');
    storage.removeItem(testKey);

    return storage;
  } catch (e) {
    // If ANY error occurs (SecurityError, QuotaExceeded, etc.), fallback to memory
    return memoryStore;
  }
}

export const saveGameState = (state: any) => {
  try {
    const json = JSON.stringify(state);
    getStorage().setItem(STORAGE_KEY, json);
  } catch (e) {
    console.warn("Save failed silently:", e);
  }
};

export const loadGameState = () => {
  try {
    const data = getStorage().getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearGameState = () => {
  try {
    getStorage().removeItem(STORAGE_KEY);
  } catch (e) {
    // ignore
  }
};