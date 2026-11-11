/**
 * Keramat production — platform safe-zone system.
 * Shared conservative zone for Instagram Reels + TikTok + YouTube Shorts.
 * Values are design-guideline starts (px on a 1080x1920 canvas), adjustable.
 */
export type Platform = "instagram" | "tiktok" | "youtube" | "all";

export type SafeZoneConfig = {
  /** px kept free at the top (platform navigation) */
  top: number;
  /** px kept free at the bottom (captions / description / UI) */
  bottom: number;
  /** px kept free at the left */
  left: number;
  /** px kept free at the right (interaction buttons column) */
  right: number;
};

export const sharedSafeZones: Record<Platform, SafeZoneConfig> = {
  instagram: { top: 250, bottom: 420, left: 70, right: 180 },
  tiktok: { top: 250, bottom: 420, left: 70, right: 180 },
  youtube: { top: 250, bottom: 420, left: 70, right: 180 },
  all: { top: 250, bottom: 420, left: 70, right: 180 },
};

/**
 * Computes the safe content rectangle on the composition canvas,
 * with optional per-production margin overrides.
 */
export const safeRect = (
  platform: Platform,
  width: number,
  height: number,
  override?: Partial<SafeZoneConfig>,
): { x: number; y: number; width: number; height: number } => {
  const z = { ...sharedSafeZones[platform], ...(override ?? {}) };
  return {
    x: z.left,
    y: z.top,
    width: width - z.left - z.right,
    height: height - z.top - z.bottom,
  };
};
