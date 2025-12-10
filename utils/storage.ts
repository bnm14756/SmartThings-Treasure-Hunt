
// Storage Logic Removed via User Request
// This file now contains dummy functions to prevent errors in other files that import them.
// The game will not save progress.

export const requestStorageAccess = async (): Promise<boolean> => {
  return true; // Dummy return
};

export const saveGameState = (state: any) => {
  // Do nothing
};

export const loadGameState = () => {
  return null; // Always return null to force fresh start
};

export const clearGameState = () => {
  // Do nothing
};

export const generateSaveCode = (state: any): string => {
  return "";
};

export const parseSaveCode = (code: string): any | null => {
  return null;
};
