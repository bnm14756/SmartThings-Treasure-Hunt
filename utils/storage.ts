// Module-level flag to track verified permission status
let hasStoragePermission = false;

/**
 * Attempts to request storage access from the browser.
 * This must be called inside a user gesture (e.g., click event handler).
 */
export const tryToAccessStorage = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  console.log("Requesting storage access...");

  // 1. Check if Storage Access API is supported
  // @ts-ignore
  const apiSupported = typeof document.hasStorageAccess === 'function' && typeof document.requestStorageAccess === 'function';
  
  if (apiSupported) {
    try {
      // 2. Check if we already have access
      // @ts-ignore
      const hasAccess = await document.hasStorageAccess().catch((e) => {
          console.warn("hasStorageAccess check failed:", e);
          return false;
      });
      
      if (hasAccess) {
        console.log("Storage access already active.");
      } else {
        // 3. Request access (requires user gesture)
        // @ts-ignore
        await document.requestStorageAccess();
        console.log("Storage access granted via requestStorageAccess API.");
      }
    } catch (error) {
      // 4. Handle denial or error - returning false prevents using storage and avoids crashing
      console.warn("Storage access denied or failed:", error);
      hasStoragePermission = false;
      return false;
    }
  } else {
      console.log("Storage Access API not supported in this browser. Attempting direct access.");
  }

  // 5. Verification: Actually try to use localStorage
  // This catches cases where the API isn't supported but storage is blocked,
  // or where the API said "yes" but it still fails (e.g., private browsing).
  try {
    const TEST_KEY = 'st_access_check';
    localStorage.setItem(TEST_KEY, 'verified');
    localStorage.removeItem(TEST_KEY);
    
    console.log("LocalStorage verification successful.");
    hasStoragePermission = true;
    return true;
  } catch (e) {
    console.error("LocalStorage verification failed. Running in non-persistent mode.", e);
    hasStoragePermission = false;
    return false;
  }
};

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

export const saveGameState = (state: any) => {
  // Guard: Only save if we have verified permission
  if (!hasStoragePermission) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
    // If saving fails (e.g. quota exceeded or permission revoked), mark as lost
    hasStoragePermission = false;
  }
};

export const loadGameState = () => {
  // Guard: Only load if we have verified permission
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
  // Guard: Only clear if we have verified permission
  if (!hasStoragePermission) return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear game state:", e);
  }
};