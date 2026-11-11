/**
 * Keramat production — main configuration.
 * Review film short: "Keramat (2009) — Found Footage Horror Indonesia".
 * All assets isolated under public/assets/keramat/.
 */
import type { Platform } from "./safeZones";
import { DARK_THEME } from "./theme";
import { DURATION_IN_FRAMES } from "./scenes";

const BASE = "assets/keramat";
const PROC = `${BASE}/processed`;

export type SafeZoneToggle = {
  enabled: boolean;
  showGuides: boolean;
};

export const keramatConfig = {
  id: "keramat",
  title: "Keramat (2009) — Review Film Found Footage Horror Indonesia",
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: DURATION_IN_FRAMES,
  platform: "all" as Platform,
  theme: DARK_THEME,
  assets: {
    narration: `${PROC}/narration-radio-normalized.wav`,
    narrationOffsetMs: 0,
    music: `${PROC}/music-horror-bed.wav`,
    musicVolume: 0.5, // bed I=-22.2 LUFS -> effective ≈ -28.2 LUFS (≈14 LU under VO, felt not heard)
    fullBleed: {
      hookWomen: `${PROC}/fullbleed-hook-women.mp4`,
      crewHouse: `${PROC}/fullbleed-crew-house.mp4`,
      anomaly: `${PROC}/fullbleed-anomaly.mp4`,
      camcorderSleep: `${PROC}/fullbleed-camcorder-sleep.mp4`,
      candleRoom: `${PROC}/fullbleed-candle-room.mp4`,
      ghost: `${PROC}/fullbleed-ghost.mp4`,
      panicRun: `${PROC}/fullbleed-panic-run.mp4`,
      doorwayEarly: `${PROC}/fullbleed-doorway-early.mp4`,
      doorwayLate: `${PROC}/fullbleed-doorway-late.mp4`,
      doorwayGlitch: `${PROC}/fullbleed-doorway-glitch.mp4`,
      quietRoom: `${PROC}/fullbleed-quiet-room.mp4`,
    },
    cards: {
      merekam: `${PROC}/card-merekam.mp4`,
      titleKeramat: `${PROC}/card-title-keramat.mp4`,
      train: `${PROC}/card-train.mp4`,
    },
    images: {
      poster: `${BASE}/poster-film.jpg`,
      logo: `${BASE}/logo-keramat.png`,
      camcorder: `${BASE}/Person_holding_old_camcorder_14144ca6.jpg`,
      silhouette: `${BASE}/Silhouette_hiding_in_dark_room_0f513a13.jpg`,
      paleHands: `${BASE}/Pale_hands_and_eyes_surrounding_275259ff.jpg`,
      doorwayStill: `${BASE}/Camera_turning_toward_dark_doorway_164c668c.jpg`,
    },
    sfx: {
      shutter: {
        src: `assets/Audio Sound Effect/shutter-trimmed.wav`,
        volume: 3.2, // source peak -18.1 dB -> ~-7.9 dB effective
      },
      uiPop: {
        src: `assets/Audio Sound Effect/ui_pop_up.mp3`,
        volume: 0.5, // source peak -3.0 dB
      },
      movementWoosh: {
        src: `assets/Audio Sound Effect/movement-woosh.wav`,
        volume: 1.6, // source peak -16.4 dB
      },
      whooshLow: {
        src: `assets/Audio Sound Effect/whoosh-low.wav`,
        volume: 0.8, // source peak -9.0 dB
      },
      writingPencil: {
        src: `assets/Audio Sound Effect/writing-pencil-wide.wav`,
        volume: 1.8, // source peak -22.7 dB
      },
    },
  },
  typography: {
    primary: "Montserrat",
    secondary: "Architects Daughter",
    subtitle: "Poppins",
  },
  safeZone: {
    enabled: true,
    showGuides: false,
  } satisfies SafeZoneToggle,
};

export type KeramatConfig = typeof keramatConfig;
