/**
 * Fight Club production — main configuration.
 */
import type { Platform } from "./safeZones";
import { DARK_THEME } from "./theme";

const BASE = "assets/fight-club";
const PROC = `${BASE}/processed`;

export type SafeZoneToggle = {
  enabled: boolean;
  showGuides: boolean;
};

export const fightClubConfig = {
  id: "fight-club",
  title: "Fight Club (1999) — Film Tentang Kekosongan dan Identitas",
  width: 1080,
  height: 1920,
  fps: 30,
  durationInFrames: 46 * 30,
  platform: "all" as Platform,
  theme: DARK_THEME,
  assets: {
    narration: `${PROC}/narration-normalized.wav`,
    narrationOffsetMs: 0,
    music: `${PROC}/music-bed.wav`,
    musicVolume: 0.18,
    fullBleed: {
      punch: `${PROC}/clip-hook-punch.mp4`,
      basement: `${PROC}/clip-basement.mp4`,
      movement: `${PROC}/clip-movement.mp4`,
      mirror: `${PROC}/clip-mirror.mp4`,
    },
    images: {
      poster: `${BASE}/poster-film.jpg`,
      bradpit: `${BASE}/fight-club-brad-pit.jpg`,
      bradEdward: `${BASE}/bradpit-and-edward-norton.jpg`,
      logo: `${BASE}/logo-fight-club.png`,
      crowd: `${BASE}/Crowd_of_men_turning_identical_5c60b519.jpg`,
    },
    sfx: {
      shutter: {
        src: `${PROC}/shutter-trimmed.wav`,
        volume: 0.35,
      },
      uiPop: {
        src: `assets/Audio Sound Effect/ui_pop_up.mp3`,
        volume: 0.4,
      },
      movementWoosh: {
        src: `assets/Audio Sound Effect/movement-woosh.wav`,
        volume: 0.6,
      },
      whooshLow: {
        src: `assets/Audio Sound Effect/whoosh-low.wav`,
        volume: 0.5,
      },
      cartonMove: {
        src: `assets/Audio Sound Effect/carton_move_10.wav`,
        volume: 0.5,
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

export type FightClubConfig = typeof fightClubConfig;