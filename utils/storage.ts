// Module-level flag to track verified permission status
let hasStoragePermission = false;

/**
 * 저장소 접근 권한을 요청하고, 허용되면 true를 반환합니다.
 * MUST be called inside a user gesture (e.g., click event handler).
 */
export async function requestStorageAccess(): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  // 1. API 지원 여부 확인
  // @ts-ignore
  if (!document.requestStorageAccess) {
    return true;
  }

  // 2. 이미 권한이 있는지 확인
  try {
    // @ts-ignore
    if (await document.hasStorageAccess()) {
      hasStoragePermission = true;
      return true;
    }
  } catch (e) {
    console.warn("hasStorageAccess 검사 중 오류, 권한 요청 시도");
  }

  // 3. 권한 요청
  try {
    // **주의**: 이 요청은 사용자 상호 작용(클릭 등)이 있을 때 성공률이 높습니다.
    // @ts-ignore
    await document.requestStorageAccess();
    console.log("Storage Access: 권한 승인됨.");
    hasStoragePermission = true;
    return true;
  } catch (error) {
    console.error("Storage Access: 권한 거부됨. 서드파티 iFrame 차단.");
    hasStoragePermission = false;
    return false;
  }
}

const STORAGE_KEY = 'st_treasure_hunt_save_v1';

export const saveGameState = (state: any) => {
  // Guard: Only save if we have verified permission
  if (!hasStoragePermission) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save game state:", e);
    // If saving fails (e.g. quota exceeded or permission revoked), mark as lost
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'SecurityError')) {
        hasStoragePermission = false;
    }
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