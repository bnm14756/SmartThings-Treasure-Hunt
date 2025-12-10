
// SECURITY FIX: 
// Browsers in strict iframe environments (like AI Studio previews) block access to localStorage.
// We implement the Storage Access API to request permission gracefully.
// If denied, we fallback to an in-memory store so the game never crashes.

const memoryStore: Record<string, string> = {};
const STORAGE_KEY = 'st_treasure_hunt_save_v1';

/**
 * Requests storage access from the browser.
 * MUST be called inside a user gesture event handler (e.g., click).
 */
export const requestStorageAccess = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  // If API is not supported, we assume standard behavior (or it will fail in try/catch later)
  if (!document.requestStorageAccess) return true;

  try {
    // Check if we already have access
    if (await document.hasStorageAccess()) {
      return true;
    }
    // Request access (triggers browser prompt or auto-grant)
    await document.requestStorageAccess();
    return true;
  } catch (e) {
    console.warn("Storage Access API: Permission denied. Using In-Memory fallback.");
    return false;
  }
};

export const saveGameState = (state: any) => {
  const json = JSON.stringify(state);

  // 1. Always save to Memory Store (Safe fallback)
  memoryStore[STORAGE_KEY] = json;

  // 2. Try saving to LocalStorage
  try {
    window.localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    // Silent fail - memory store handles it
  }
};

export const loadGameState = () => {
  // 1. Try LocalStorage first
  try {
    const localData = window.localStorage.getItem(STORAGE_KEY);
    if (localData) return JSON.parse(localData);
  } catch (e) {
    // Access denied or empty
  }

  // 2. Fallback to Memory Store
  try {
    const memData = memoryStore[STORAGE_KEY];
    if (memData) return JSON.parse(memData);
  } catch (e) {
    return null;
  }
  
  return null;
};

export const clearGameState = () => {
  try {
    delete memoryStore[STORAGE_KEY];
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Ignore errors
  }
};

// --- Manual Save Code System ---
export const generateSaveCode = (state: any): string => {
  try {
    const json = JSON.stringify(state);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Failed to generate save code", e);
    return "";
  }
};

export const parseSaveCode = (code: string): any | null => {
  try {
    const json = decodeURIComponent(escape(atob(code)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse save code", e);
    return null;
  }
};
