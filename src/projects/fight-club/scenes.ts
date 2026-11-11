import type { SubtitleWord } from "./subtitles";

export type SfxCue = {
  key: "shutter" | "uiPop" | "movementWoosh" | "whooshLow" | "cartonMove";
  frame: number;
  volumeMultiplier?: number;
};

const ms = (m: number) => Math.round((m * 30) / 1000);

export const WORD_MS = {
  hookStart: 0,
  scene2: 6200, // "Dua orang pria..."
  scene3: 13880, // "Tapi klub itu..."
  scene4: 26680, // "Fight Club bukan..."
  scene5: 35760, // "A film with a twist..."
  narrationEnd: 43680,
} as const;

export const F = {
  scene1: ms(WORD_MS.scene2),
  scene2: ms(WORD_MS.scene3),
  scene3: ms(WORD_MS.scene4),
  scene4: ms(WORD_MS.scene5),
  cta: ms(WORD_MS.narrationEnd) + 30, // 1 second tail hold
  narrationEnd: ms(WORD_MS.narrationEnd),
} as const;

export type SceneId = 1 | 2 | 3 | 4 | 5;

export const SCENE_RANGES: Record<SceneId, [number, number]> = {
  1: [0, F.scene1],
  2: [F.scene1, F.scene2],
  3: [F.scene2, F.scene3],
  4: [F.scene3, F.scene4],
  5: [F.scene4, 46 * 30],
};

function f(sec: number) {
  return Math.round(sec * 30);
}

export const SFX_CUES: SfxCue[] = [
  // Exact flash boundary frames for shutter SFX
  { key: "shutter", frame: F.scene1 - 2, volumeMultiplier: 1.2 },
  { key: "shutter", frame: F.scene2 - 2, volumeMultiplier: 1.2 },
  { key: "shutter", frame: F.scene3 - 2, volumeMultiplier: 1.2 },
  { key: "shutter", frame: F.scene4 - 2, volumeMultiplier: 1.2 },
  { key: "uiPop", frame: f(1.24), volumeMultiplier: 0.8 },
  { key: "uiPop", frame: 601, volumeMultiplier: 1.0 }, // Crowd pop in Scene 3
  { key: "uiPop", frame: f(35.82), volumeMultiplier: 0.8 },
];

export const sceneSubtitleSlice = (words: SubtitleWord[], scene: SceneId) => {
  const [fromMs, toMs] = SCENE_RANGES[scene];
  return words.filter(
    (w) => w.startMs >= (fromMs / 30) * 1000 - 30 && w.endMs <= (toMs / 30) * 1000 + 30,
  );
};
