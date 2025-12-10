// In-memory fallback
const memoryStorage: Record<string, string> = {};
let isMemoryMode = false;
const STORAGE_KEY = 'st_treasure_hunt_save_v1';

/**
 * Helper to safely get the storage object.
 * Returns null if access is denied, forcing the caller to use memory fallback.
 */
function getStorageSafe(): Storage | null {
  if (isMemoryMode) return null;
  
  try {
    // Accessing window.localStorage can throw a SecurityError in strict iframes immediately.
    // We do NOT check this at module load time anymore. We check only when needed.
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // Access denied
    isMemoryMode = true;
  }
  return null;
}

export const saveGameState = (state: any) => {
  const json = JSON.stringify(state);
  const storage = getStorageSafe();

  if (storage) {
    try {
      storage.setItem(STORAGE_KEY, json);
      return;
    } catch (e) {
      // Quota exceeded or permission changed
      isMemoryMode = true;
    }
  }
  
  // Fallback
  memoryStorage[STORAGE_KEY] = json;
};

export const loadGameState = () => {
  const storage = getStorageSafe();
  
  if (storage) {
    try {
      const data = storage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      isMemoryMode = true;
    }
  }

  // Fallback
  const data = memoryStorage[STORAGE_KEY];
  return data ? JSON.parse(data) : null;
};

export const clearGameState = () => {
  const storage = getStorageSafe();
  
  if (storage) {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }
  delete memoryStorage[STORAGE_KEY];
};

// No export function initializeStorage needed anymore. 
// We handle it lazily.