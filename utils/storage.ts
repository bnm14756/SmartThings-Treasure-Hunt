// Module-level flag to track permission status
let hasStoragePermission = false;

export const tryToAccessStorage = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  let granted = false;

  // 1. Check for Storage Access API availability
  if ('hasStorageAccess' in document && 'requestStorageAccess' in document) {
    try {
      // @ts-ignore - TypeScript definition might be missing in some envs
      const hasAccess = await document.hasStorageAccess();
      if (!hasAccess) {
        // Request access - must be called inside a user gesture (e.g., click handler)
        // @ts-ignore
        await document.requestStorageAccess();
        console.log("Storage access granted via requestStorageAccess");
      }
      granted = true;
    } catch (error) {
      console.warn("Storage access API denied or failed:", error);
      // Even if API fails, we might still have access in some contexts (or not), 
      // so we don't return false immediately, but proceed to verification.
      granted = false;
    }
  } else {
    // API not supported (standard/legacy browsers), assume we might have access
    granted = true;
  }
  
  // 2. Verification Test: Actually try to use localStorage
  // This is the most reliable way to check if 'Access to storage is not allowed' will happen.
  try {
      const TEST_KEY = 'st_storage_test';
      localStorage.setItem(TEST_KEY, '1');
      localStorage.removeItem(TEST_KEY);
      
      // If we reached here without error, we have access
      hasStoragePermission = true;
      console.log("Storage verification successful.");
      return true;
  } catch (e) {
      console.warn("LocalStorage verification failed. Running in memory-only mode.", e);
      hasStoragePermission = false;
      return false;
  }
};

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

export const saveGameState = (state: any) => {
  // Guard: Do not attempt if we don't have verified permission
  if (!hasStoragePermission) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
  }
};

export const loadGameState = () => {
  // Guard: Do not attempt if we don't have verified permission
  if (!hasStoragePermission) return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load game state:", e);
    return null;
  }
};

export const clearGameState = () => {
  // Guard: Do not attempt if we don't have verified permission
  if (!hasStoragePermission) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear game state:", e);
  }
};