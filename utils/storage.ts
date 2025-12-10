// Module-level in-memory fallback
const memoryStorage: Record<string, string> = {};
let useMemoryOnly = false;

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

/**
 * Checks if localStorage is actually available for use.
 * Some browsers throw SecurityError when accessing localStorage in iframes.
 */
function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Attempts to initialize storage access.
 * Returns true if persistence (localStorage) is available.
 * Returns false if falling back to in-memory storage.
 */
export async function requestStorageAccess(): Promise<boolean> {
  // 1. Check if we already have access implicitly
  if (isLocalStorageAvailable()) {
    return true;
  }

  // 2. Try the Storage Access API if available
  if (typeof document !== 'undefined' && 'requestStorageAccess' in document) {
    try {
      // @ts-ignore
      await document.requestStorageAccess();
      if (isLocalStorageAvailable()) {
        return true;
      }
    } catch (e) {
      console.warn("Storage Access API request failed or denied:", e);
    }
  }

  // 3. Fallback to memory
  console.warn("LocalStorage unavailable. Falling back to in-memory storage (session only).");
  useMemoryOnly = true;
  return false;
}

export const saveGameState = (state: any) => {
  const json = JSON.stringify(state);

  if (!useMemoryOnly) {
    try {
      localStorage.setItem(STORAGE_KEY, json);
      return;
    } catch (e) {
      console.warn("Save failed, switching to memory storage:", e);
      useMemoryOnly = true;
    }
  }

  // Fallback
  memoryStorage[STORAGE_KEY] = json;
};

export const loadGameState = () => {
  if (!useMemoryOnly) {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("Load failed, switching to memory storage:", e);
      useMemoryOnly = true;
    }
  }

  // Fallback
  const data = memoryStorage[STORAGE_KEY];
  return data ? JSON.parse(data) : null;
};

export const clearGameState = () => {
  if (!useMemoryOnly) {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Clear failed:", e);
    }
  }
  delete memoryStorage[STORAGE_KEY];
};
