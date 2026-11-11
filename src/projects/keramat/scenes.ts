import type { SubtitleWord } from "./subtitles";

export type SfxCue = {
  key: "shutter" | "uiPop" | "movementWoosh" | "whooshLow" | "writingPencil";
  frame: number;
  volumeMultiplier?: number;
};

const ms = (m: number) => Math.round((m * 30) / 1000);

export const WORD_MS = {
  hookStart: 0,
  hookTurn: 3100, // "Nah, Keramat itu salah satunya."
  scene2: 5420, // "Keramat itu film found footage..."
  scene3: 12200, // "Ceritanya tentang..."
  scene3b: 16520, // "Awalnya biasa aja..."
  scene3c: 19600, // "Tapi di tengah perjalanan..."
  scene4: 26180, // "Menurutku film ini bagus."
  scene4b: 28470, // "Karena bukan sekadar direkam mentah..."
  scene4c: 34560, // "Goyangannya, sudut pandangnya..."
  scene5: 41840, // "Makanya film ini salah satu film Indonesia..."
  scene5b: 46280, // "Karena kamu cuma bisa lihat apa yang dilihat kamera."
  scene5c: 48840, // "Sempit, terbatas, dan kamu nggak pernah tahu..."
  scene6: 53720, // "Jadi kamu cuma bisa ikut nonton."
  scene6b: 56360, // "sambil berharap kameranya nggak nengok..."
  narrationEnd: 58880,
} as const;

export const F = {
  scene1: ms(WORD_MS.scene2),
  scene2: ms(WORD_MS.scene3),
  scene3: ms(WORD_MS.scene4),
  scene4: ms(WORD_MS.scene5),
  scene5: ms(WORD_MS.scene6),
  cta: ms(WORD_MS.narrationEnd) + 34, // ~1.1s tail hold
  narrationEnd: ms(WORD_MS.narrationEnd),
  // internal beats
  hookTurn: ms(WORD_MS.hookTurn),
  s3b: ms(WORD_MS.scene3b),
  s3c: ms(WORD_MS.scene3c),
  s4b: ms(WORD_MS.scene4b),
  s4c: ms(WORD_MS.scene4c),
  s5b: ms(WORD_MS.scene5b),
  s5c: ms(WORD_MS.scene5c),
  s6b: ms(WORD_MS.scene6b),
} as const;

export const DURATION_IN_FRAMES = 60 * 30; // 60.0s

export type SceneId = 1 | 2 | 3 | 4 | 5 | 6;

export const SCENE_RANGES: Record<SceneId, [number, number]> = {
  1: [0, F.scene1],
  2: [F.scene1, F.scene2],
  3: [F.scene2, F.scene3],
  4: [F.scene3, F.scene4],
  5: [F.scene4, F.scene5],
  6: [F.scene5, DURATION_IN_FRAMES],
};

function f(sec: number) {
  return Math.round(sec * 30);
}

export const SFX_CUES: SfxCue[] = [
  // Exact flash boundary frames for shutter SFX (one clean capture per cut)
  { key: "shutter", frame: F.scene1, volumeMultiplier: 1.0 },
  { key: "shutter", frame: F.scene2, volumeMultiplier: 1.0 },
  { key: "shutter", frame: F.scene3, volumeMultiplier: 1.0 },
  { key: "shutter", frame: F.scene4, volumeMultiplier: 1.0 },
  { key: "shutter", frame: F.scene5, volumeMultiplier: 1.0 },
  // card / chip pops
  { key: "uiPop", frame: f(6.4), volumeMultiplier: 0.5 }, // S2 poster chips
  { key: "uiPop", frame: f(7.6), volumeMultiplier: 0.4 }, // S2 fact chips
  { key: "uiPop", frame: f(13.2), volumeMultiplier: 0.5 }, // S3 route line
  { key: "uiPop", frame: f(28.0), volumeMultiplier: 0.45 }, // S4 "MENURUTKU" stamp
  { key: "uiPop", frame: f(36.4), volumeMultiplier: 0.4 }, // S4 technique chips
  // B-roll swaps / texture moments
  { key: "movementWoosh", frame: F.s3b, volumeMultiplier: 1.4 }, // crew-house swap
  { key: "movementWoosh", frame: F.s3c, volumeMultiplier: 1.4 }, // anomaly swap
  { key: "whooshLow", frame: F.s4c, volumeMultiplier: 0.8 }, // technique beat
  { key: "movementWoosh", frame: F.s5b, volumeMultiplier: 1.2 }, // viewfinder swap
  { key: "whooshLow", frame: ms(WORD_MS.scene6) + 10, volumeMultiplier: 0.8 }, // S6 logo
];

export const sceneSubtitleSlice = (words: SubtitleWord[], scene: SceneId) => {
  const [fromMs, toMs] = SCENE_RANGES[scene];
  return words.filter(
    (w) => w.startMs >= (fromMs / 30) * 1000 - 30 && w.endMs <= (toMs / 30) * 1000 + 30,
  );
};
