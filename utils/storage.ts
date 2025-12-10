// Module-level in-memory fallback
const memoryStorage: Record<string, string> = {};
let useMemoryOnly = false;
const STORAGE_KEY = 'st_treasure_hunt_save_v1';

/**
 * Safely checks if localStorage is available.
 * In some sandboxed environments, just accessing window.localStorage throws a SecurityError.
 * We catch everything here to prevent "Uncaught Error" and default to memory.
 */
function checkStorageAvailability(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    
    // Accessing the property itself can throw
    const storage = window.localStorage;
    if (!storage) return false;

    const testKey = '__storage_test__';
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return true;
  } catch (e) {
    // If we are here, strict privacy settings or iframe restrictions are active.
    // Return false to use in-memory fallback.
    return false;
  }
}

// Initialize immediately (Synchronous)
const isAvailable = checkStorageAvailability();
useMemoryOnly = !isAvailable;

if (useMemoryOnly) {
  console.warn("Storage restricted. Using in-memory storage.");
}

/**
 * Synchronous initialization helper. 
 * Returns true if persistent storage is active.
 */
export function initializeStorage(): boolean {
  return !useMemoryOnly;
}

export const saveGameState = (state: any) => {
  const json = JSON.stringify(state);

  if (!useMemoryOnly) {
    try {
      window.localStorage.setItem(STORAGE_KEY, json);
      return;
    } catch (e) {
      console.warn("Save failed, switching to memory:", e);
      useMemoryOnly = true;
    }
  }

  memoryStorage[STORAGE_KEY] = json;
};

export const loadGameState = () => {
  if (!useMemoryOnly) {
    try {
      const data = window.localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.warn("Load failed, switching to memory:", e);
      useMemoryOnly = true;
    }
  }

  const data = memoryStorage[STORAGE_KEY];
  return data ? JSON.parse(data) : null;
};

export const clearGameState = () => {
  if (!useMemoryOnly) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }
  delete memoryStorage[STORAGE_KEY];
};