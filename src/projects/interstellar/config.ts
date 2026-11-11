/**
 * Interstellar production — main configuration.
 * Everything specific to THIS video lives here; reusable components stay generic.
 * Assets directory: public/assets/interstellar/ (confirmed for this production).
 */
import type { Platform } from "./safeZones";
import { DARK_THEME } from "./theme";

const BASE = "assets/interstellar";
const PROC = `${BASE}/processed`;

export type SafeZoneToggle = {
  enabled: boolean;
  /** guides are rendered by `SafeZoneGuides` and must only be used in preview */
  showGuides: boolean;
};

export const interstellarConfig = {
  id: "interstellar",
  title: "Interstellar: Film Luar Angkasa yang Terasa Nyata",

  width: 1080,
  height: 1920,
  fps: 30,
  /** 61.0s — narration is 58.59s + CTA hold tail */
  durationInFrames: 61 * 30,

  platform: "all" as Platform,

  theme: DARK_THEME,

  assets: {
    narration: `${PROC}/narration-normalized.wav`,
    narrationOffsetMs: 0,
    music: `${PROC}/music-organ-bed.wav`,
    /** music bed is felt, not heard */
    musicVolume: 0.16,

    /** pre-cut full-bleed vertical clips (1080x1920) */
    fullBleed: {
      hookSaturn: `${PROC}/fullbleed-hook-saturn.mp4`,
      hookDrift: `${PROC}/fullbleed-hook-drift.mp4`,
      gargantua: `${PROC}/fullbleed-gargantua.mp4`,
      helmetCooper: `${PROC}/fullbleed-helmet-cooper.mp4`,
      helmetBrand: `${PROC}/fullbleed-helmet-brand.mp4`,
      instrumentPanels: `${PROC}/fullbleed-instrument-panels.mp4`,
      oldMurphBed: `${PROC}/fullbleed-oldmurph-bed.mp4`,
    },
    /** pre-cut editorial card clips (letterboxed wide) */
    cards: {
      hookEndurance: `${PROC}/card-hook-endurance.mp4`,
      dustStorm: `${PROC}/card-dust-storm.mp4`,
      cockpitHud: `${PROC}/card-cockpit-hud.mp4`,
      enduranceModule: `${PROC}/card-endurance-module.mp4`,
      blueprintScreen: `${PROC}/card-blueprint-screen.mp4`,
      farewellTalk: `${PROC}/card-farewell-talk.mp4`,
      farewellHug: `${PROC}/card-farewell-hug.mp4`,
      watchHandover: `${PROC}/card-watch-handover.mp4`,
    },
    images: {
      posterFilm: `${BASE}/poster-film.jpg`,
      houseCorn: `${BASE}/house-corn-interstellar.jpg`,
      miniLanderBts: `${BASE}/pesawat-miniatur-interstellar.jpg`,
      papercutClock: `${BASE}/Woman_and_astronaut_near_clock_c8315d1a.jpg`,
      papercutOrgan: `${BASE}/Pipe_organ_in_cosmic_sky_a332806c.jpg`,
      papercutGazing: `${BASE}/Astronaut_gazing_at_distant_planet_fd05f42a.jpg`,
      cockpitPhoto: `${BASE}/interstellar-kokpit.jpg`,
      /** ASCII-safe copies (originals keep their unicode … names, untouched) */
      papercutSpacecraft: `${PROC}/papercut-spacecraft.jpg`,
      papercutCornHug: `${PROC}/papercut-corn-hug.jpg`,
    },
    /** measured SFX (peaks recorded in scripts/prepare-audio.sh output) */
    sfx: {
      bookPage: {
        src: `${BASE}/audio/book-page-turn-01.wav`,
        volume: 0.5,
      },
      cartonMove: {
        src: `${BASE}/audio/carton_move_10.wav`,
        volume: 0.55,
      },
      movementWoosh: {
        src: `${BASE}/audio/movement-woosh.wav`,
        volume: 1.5,
      },
      shutter: {
        src: `${BASE}/audio/shutter-01-camera.wav`,
        volume: 0.22,
      },
      uiPop: {
        src: `${BASE}/audio/ui_pop_up.mp3`,
        volume: 0.35,
      },
      whooshLow: {
        src: `${BASE}/audio/whoosh-low.wav`,
        volume: 0.5,
      },
      wooshMetal: {
        src: `${BASE}/audio/woosh-metal-tea-strainer-4-slowed-down.wav`,
        volume: 0.28,
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

export type InterstellarConfig = typeof interstellarConfig;
