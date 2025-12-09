// Module-level flag to track permission status
let hasStoragePermission = false;

export const tryToAccessStorage = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

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
    } catch (error) {
      console.warn("Storage access API denied or failed:", error);
      // CRITICAL FIX: If request fails, we MUST return false immediately.
      // Attempting to access localStorage after a denied request causes 
      // "Error: Access to storage is not allowed from this context"
      hasStoragePermission = false;
      return false;
    }
  }
  
  // 2. Verification Test: Actually try to use localStorage
  // Only reached if hasStorageAccess was true or requestStorageAccess succeeded (or API not supported)
  try {
      const TEST_KEY = 'st_storage_test';
      localStorage.setItem(TEST_KEY, '1');
      localStorage.removeItem(TEST_KEY);
      
      // If we reached here without error, we have access
      hasStoragePermission = true;
      console.log("Storage verification successful.");
      return true;
  } catch (e) {
      // This catches the actual "Access to storage is not allowed" error if it happens here
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