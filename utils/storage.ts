export const tryToAccessStorage = async (): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  // Check if the API is available
  if ('hasStorageAccess' in document && 'requestStorageAccess' in document) {
    try {
      // Check if we already have access
      // @ts-ignore - TypeScript might not recognize hasStorageAccess in all envs yet
      const hasAccess = await document.hasStorageAccess();
      if (!hasAccess) {
        // Request access - must be called inside a user gesture (click handler)
        // @ts-ignore
        await document.requestStorageAccess();
        console.log("Storage access granted via requestStorageAccess");
      }
      return true;
    } catch (error) {
      console.warn("Storage access denied or failed:", error);
      // In a real app, you might fallback to in-memory storage here
      return false;
    }
  }
  
  // API not supported, assume access is allowed (standard behavior)
  return true;
};

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

export const saveGameState = (state: any) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
  }
};

export const loadGameState = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load game state:", e);
    return null;
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear game state:", e);
  }
};