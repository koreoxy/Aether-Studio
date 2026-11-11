/**
 * Interstellar production — scene choreography.
 * Scene boundaries are locked to the narrated word timings from
 * scripts generate-subtitles output (whisper word level), so every
 * visual beat lands exactly when it is spoken.
 *
 * Timing convention: absolute frames in the 61s @ 30fps composition.
 */
import type { SubtitleWord } from "./subtitles";

export type SfxCue = {
  /** audio key in interstellarConfig.assets.sfx */
  key:
    | "bookPage"
    | "cartonMove"
    | "movementWoosh"
    | "shutter"
    | "uiPop"
    | "whooshLow"
    | "wooshMetal";
  /** absolute frame at which the hit fires */
  frame: number;
  /** optional multiplier on the file volume from config (default 1) */
  volumeMultiplier?: number;
};

const ms = (m: number) => Math.round((m * 30) / 1000);

/* ------------------------------------------------------------------ */
/* Narration-locked word timestamps (ms)                              */
/* ------------------------------------------------------------------ */
export const WORD_MS = {
  hookStart: 0,
  // scene boundaries (from whisper word starts)
  pembuka: 4760, // "Interstellar,"
  ceritaInti: 14840, // "Di balik"
  sisiNyata: 31680, // "Nolan"
  musik: 48080, // "ditambah"
  cta: 54040, // "Jadi"
  narrationEnd: 58660,
} as const;

/* beat words (absolute ms) */
export const W = {
  hookNyata1: 1980, // "nyata,"
  hookMemang: 3480, // "memang"
  hookNyata2: 4160, // "nyata."
  posterSlam: 4760, // "Interstellar," (start of scene 2)
  nolanWord: 6340, // "Christopher"
  favoritku: 9400, // "favoritku."
  musikIndah: 10040, // "Musiknya"
  memukau: 11080, // "cinematografinya"
  ceritanya: 12810, // "dan ceritanya"
  panelWipe: 14200, // cream panel slides up over scene 2
  diBalik: 14840, // scene 3 opens on cream panel
  kisah: 18030, // "kisah"
  ayah: 18350, // "ayah"
  anak: 19080, // "anak."
  cooper: 19400, // "Cooper"
  program: 21000, // "dan meninggalkan"
  murph: 22400, // "Murph,"
  hugCard: 21950, // farewell-hug card takes over the talk card
  demiManusia: 22880, // "Demi menyelamatkan"
  timeStart: 25200, // "Di planet tertentu" -> clock art begins
  satuJam: 26600, // "[1 JAM]"
  berarti: 27230, // "="
  tahunTahun: 27720, // "[TAHUN]" flips
  bumi: 28490, // "di bumi."
  bayangkan: 29330, // "Bayangkan..."
  watchCard: 29560, // watch handover card enters
  nolanMinim: 31680, // scene 4 opens on navy
  cgi: 33020, // "CGI," giant splash + red strike
  cornCard: 34220, // ladang jagung card
  ditanam: 34940, // "ditanam," stamp ASLI
  miniaturCard: 36390, // BTS mini lander photo card
  miniaturStamp: 37610, // "miniatur besar." stamp
  layarLayar: 38980, // "Dan layar-layar..." -> blueprint window in
  kokpit: 43430, // "langsung ke jendela kokpit." -> window expands
  aktor: 45140, // "para aktor bereaksi"
  hansZimmer: 48910, // giant HANS ZIMMER splash
  organRise: 48080, // pipe organ papercut rises
  gbrIndah: 50330, // "gambar yang indah" -> 3-cut montage
  montageCut2: 51020,
  montageCut3: 51990,
  emosional: 52920, // "EMOSIONAL." burst
  ctaStart: 54040, // scene 6 opens
  pertanyaan: 55160, // "adegan Interstellar mana..."
  komentar: 57700, // "tulis di komentar." -> red CTA chip
} as const;

/* frames */
export const F = {
  pembuka: ms(WORD_MS.pembuka), // 143
  ceritaInti: ms(WORD_MS.ceritaInti), // 445
  sisiNyata: ms(WORD_MS.sisiNyata), // 950
  musik: ms(WORD_MS.musik), // 1442
  cta: ms(WORD_MS.cta), // 1621
  narrationEnd: ms(WORD_MS.narrationEnd), // 1760
} as const;

/** hook sub-cut boundaries (beat-locked) */
const f = (x: number) => Math.round(x * 30);
export const HOOK_CUTS = {
  saturn: f(0.0), // Saturn close-up hard in
  endurance: f(0.5), // Endurance ring card comes in sooner and punchier
  gargantua: f(2.0), // black hole full-bleed earlier for massive impact
} as const;

/** S2 -> S3 connected transition: cream panel wipes up */
export const PANEL_WIPE_FRAME = f(14.2);

/* ------------------------------------------------------------------ */
/* per-scene SFX cues                                                 */
/* ------------------------------------------------------------------ */
export type SceneId = 1 | 2 | 3 | 4 | 5 | 6;

export const SCENE_RANGES: Record<SceneId, [number, number]> = {
  1: [0, F.ceritaInti],
  2: [F.pembuka, F.ceritaInti],
  3: [F.ceritaInti, F.sisiNyata],
  4: [F.sisiNyata, F.musik],
  5: [F.musik, F.cta],
  6: [F.cta, 61 * 30],
};

export const SFX_CUES: SfxCue[] = [
  // S1 — restrained: music bed carries the hook
  { key: "uiPop", frame: f(3.19), volumeMultiplier: 0.8 }, // giant NYATA lands
  // S2
  { key: "movementWoosh", frame: f(5.0), volumeMultiplier: 1.0 }, // poster slam-in
  { key: "uiPop", frame: f(8.44), volumeMultiplier: 1.0 }, // handwritten favoritku
  { key: "uiPop", frame: f(10.04), volumeMultiplier: 1.0 }, // MUSIK beat
  { key: "uiPop", frame: f(11.08), volumeMultiplier: 1.0 }, // MEMUKAU beat
  { key: "whooshLow", frame: f(14.2), volumeMultiplier: 1.0 }, // cream panel wipe
  // S3
  { key: "uiPop", frame: f(18.03), volumeMultiplier: 1.0 }, // kisah note underline
  { key: "uiPop", frame: f(19.4), volumeMultiplier: 1.0 }, // [COOPER]
  { key: "uiPop", frame: f(22.4), volumeMultiplier: 1.0 }, // [MURPH]
  { key: "cartonMove", frame: f(25.2), volumeMultiplier: 1.0 }, // clock art arrives
  { key: "whooshLow", frame: f(26.6), volumeMultiplier: 1.0 }, // 1 JAM
  { key: "whooshLow", frame: f(27.72), volumeMultiplier: 1.2 }, // TAHUN flips
  // S4
  { key: "bookPage", frame: f(34.22), volumeMultiplier: 1.0 }, // corn photo card
  { key: "uiPop", frame: f(34.94), volumeMultiplier: 1.0 }, // ASLI stamp
  { key: "bookPage", frame: f(36.39), volumeMultiplier: 1.0 }, // BTS photo card
  { key: "uiPop", frame: f(39.0), volumeMultiplier: 1.0 }, // projection window boots
  { key: "wooshMetal", frame: f(42.94), volumeMultiplier: 1.0 }, // window expands
  // S5
  { key: "uiPop", frame: f(48.91), volumeMultiplier: 1.0 }, // HANS ZIMMER slam
  { key: "movementWoosh", frame: f(52.92), volumeMultiplier: 1.1 }, // EMOSIONAL burst
  // S6
  { key: "uiPop", frame: f(54.04), volumeMultiplier: 1.0 }, // RATING PRIBADI chip
  { key: "cartonMove", frame: f(57.7), volumeMultiplier: 1.0 }, // CTA chip lands
];

/* ------------------------------------------------------------------ */
/* helpers for subtitle rendering                                     */
/* ------------------------------------------------------------------ */
export const sceneSubtitleSlice = (words: SubtitleWord[], scene: SceneId) => {
  const [fromMs, toMs] = SCENE_RANGES[scene];
  return words.filter(
    (w) => w.startMs >= (fromMs / 30) * 1000 - 30 && w.endMs <= (toMs / 30) * 1000 + 30,
  );
};
