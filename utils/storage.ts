// SECURITY FIX: 
// Browsers in strict iframe environments (like AI Studio previews) block access to localStorage.
// Attempting to access window.localStorage causes a "SecurityError" or "Access to storage is not allowed".
// To ensure the app runs 100% of the time without crashing, we force the use of In-Memory storage only.
// Note: Progress will reset when the page is reloaded, but the app will not crash.

const memoryStore: Record<string, string> = {};
const STORAGE_KEY = 'st_treasure_hunt_save_v1';

export const saveGameState = (state: any) => {
  try {
    const json = JSON.stringify(state);
    memoryStore[STORAGE_KEY] = json;
  } catch (e) {
    // Ignore errors
  }
};

export const loadGameState = () => {
  try {
    const data = memoryStore[STORAGE_KEY];
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const clearGameState = () => {
  try {
    delete memoryStore[STORAGE_KEY];
  } catch (e) {
    // Ignore errors
  }
};

// --- Manual Save Code System ---
export const generateSaveCode = (state: any): string => {
  try {
    const json = JSON.stringify(state);
    // Encode to Base64 (handling UTF-8 strings properly)
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Failed to generate save code", e);
    return "";
  }
};

export const parseSaveCode = (code: string): any | null => {
  try {
    // Decode from Base64
    const json = decodeURIComponent(escape(atob(code)));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to parse save code", e);
    return null;
  }
};