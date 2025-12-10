// Module-level in-memory fallback
const memoryStorage: Record<string, string> = {};
let useMemoryOnly = false;

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

/**
 * Checks if localStorage is actually available for use.
 * Returns false immediately if access is denied to prevent errors.
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
 * Initializes storage. 
 * Safely determines if we can use localStorage or must fallback to memory.
 * Does NOT try to use the Storage Access API to avoid "Uncaught (in promise)" errors in sandboxed iframes.
 */
export async function initializeStorage(): Promise<boolean> {
  // 1. Check if we have access implicitly
  if (isLocalStorageAvailable()) {
    useMemoryOnly = false;
    return true;
  }

  // 2. If not available, fallback immediately to memory without error
  console.warn("LocalStorage unavailable (likely due to iframe restrictions). Switching to in-memory storage.");
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
      // Silent failover
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
      // Silent failover
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
      // Ignore
    }
  }
  delete memoryStorage[STORAGE_KEY];
};