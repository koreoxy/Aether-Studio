/**
 * refine-keramat-subtitles.mjs — silence-anchored word-timing refinement.
 *
 * Problem: whisper.cpp word timestamps drift EARLY across pauses (DTW stretch):
 * a phrase that actually starts at 13.07s gets a startMs of 12.20s, so
 * word-by-word captions appear while the VO is still silent.
 *
 * Fix (deterministic, audio-driven):
 *  1. decode narration-normalized.wav to PCM, compute a 10ms RMS envelope
 *  2. detect true speech segments (silence threshold + min pause duration)
 *  3. assign every caption word to the speech segment with max energy overlap
 *     (search window ±700ms around the whisper span to absorb drift)
 *  4. re-map each group of words linearly onto its true segment span
 *     (preserves in-phrase pacing, pins phrase start/end to the audio)
 *  4b. snap INTERNAL word boundaries (both words in the same speech segment)
 *      to the local energy dip — the true inter-word transition in continuous
 *      speech (fixes whisper's linear pacing, e.g. a stretched "di" delaying
 *      the next word's pop)
 *  5. clamp the final word to the file end, enforce monotonic spans
 *
 * Input : src/projects/keramat/captions.whisper-raw.json when present
 *         (fallback: captions.json) — never re-refines an already-refined file
 * Output: src/projects/keramat/captions.json  (refined)
 * Then re-run scripts/generate-keramat-subtitles.mjs to rebuild subtitles.ts.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const CAPS = path.join(ROOT, "src/projects/keramat/captions.json");
const RAW = path.join(ROOT, "src/projects/keramat/captions.whisper-raw.json");
/* KERAMAT_WAV / KERAMAT_SILENCE_DB: overrides for a different narration take.
 * The radio-effect VO (narration-radio-normalized.wav) lowers inter-syllable
 * RMS mid-speech, so its pass needs a LOWER silence threshold (−46) — at the
 * default −42 a 230ms dip at ~45.0s (mid-sentence in the clean take) would be
 * misdetected as a pause. Measured on the processed file: extra dips max
 * 100–120ms continuous below −46 (never reach MIN_PAUSE_MS), real pauses stay
 * ≥260ms. Defaults keep the original clean-VO behaviour. */
const WAV = path.join(ROOT, process.env.KERAMAT_WAV || "public/assets/keramat/processed/narration-normalized.wav");

/* ---------- config ---------- */
const HOP_MS = 10;
const SR = 16000; // decode at 16k mono — plenty for a 10ms envelope
const SILENCE_DB = Number(process.env.KERAMAT_SILENCE_DB || -42); // speech sits ≈ -16 dB RMS; noise floor ≈ -80
const MIN_PAUSE_MS = 140; // real pauses ≥ this (matches silencedetect 0.16)
const MERGE_GAP_MS = 80; // merge silences separated by < this
const SEARCH_MS = 700; // ± window when assigning a word to a segment

/* ---------- 1-2. envelope + speech segments ---------- */
const raw = spawnSync(
  "ffmpeg",
  ["-v", "error", "-i", WAV, "-f", "f32le", "-ac", "1", "-ar", String(SR), "pipe:1"],
  { encoding: "buffer", maxBuffer: 64 * 1024 * 1024 },
);
if (!raw.stdout || raw.stdout.length < SR * 4) {
  console.error("failed to decode narration PCM");
  process.exit(1);
}
const f32 = new Float32Array(raw.stdout.buffer, raw.stdout.byteOffset, Math.floor(raw.stdout.length / 4));

const hop = (SR * HOP_MS) / 1000; // 160 samples
const nFrames = Math.floor(f32.length / hop);
const db = new Float32Array(nFrames);
for (let i = 0; i < nFrames; i++) {
  let sum = 0;
  for (let j = 0; j < hop; j++) {
    const v = f32[i * hop + j];
    sum += v * v;
  }
  const rms = Math.sqrt(sum / hop);
  db[i] = rms > 0 ? 20 * Math.log10(rms) : -96;
}

/* silences: envelope below threshold for ≥ MIN_PAUSE_MS */
const silences = [];
let sStart = -1;
for (let i = 0; i < nFrames; i++) {
  const silent = db[i] < SILENCE_DB;
  if (silent && sStart < 0) sStart = i;
  if ((!silent || i === nFrames - 1) && sStart >= 0) {
    const dur = (i - sStart) * HOP_MS;
    if (dur >= MIN_PAUSE_MS) silences.push([sStart * HOP_MS, i * HOP_MS]);
    sStart = -1;
  }
}
/* merge silences separated by tiny speech blips */
const merged = [];
for (const [a, b] of silences) {
  if (merged.length && a - merged[merged.length - 1][1] < MERGE_GAP_MS) {
    merged[merged.length - 1][1] = b;
  } else merged.push([a, b]);
}
/* true speech segments = complement of merged silences */
const totalMs = Math.round(f32.length * 1000) / SR;
const speech = [];
let cursor = 0;
for (const [a, b] of merged) {
  if (a - cursor > 40) speech.push([cursor, a]);
  cursor = b;
}
if (totalMs - cursor > 40) speech.push([cursor, Math.round(totalMs)]);

console.log("detected silences:", merged.length);
merged.forEach(([a, b], i) => console.log(`  S${String(i).padStart(2, "0")} ${a}–${b} ms (${((b - a) / 1000).toFixed(2)}s)`));
console.log("speech segments:", speech.length);
speech.forEach(([a, b], i) => console.log(`  T${String(i).padStart(2, "0")} ${a}–${b} ms (${((b - a) / 1000).toFixed(2)}s)`));

/* ---------- 3. assign words to speech segments ---------- */
/* always refine from the RAW whisper timings; refining an already-refined
 * file would shear it a second time */
const INPUT = fs.existsSync(RAW) ? RAW : CAPS;
const caps = JSON.parse(fs.readFileSync(INPUT, "utf-8"));
console.log(`input: ${path.relative(ROOT, INPUT)}`);
const audioEndMs = Math.round(totalMs);

const overlapOf = (w, [a, b]) => Math.max(0, Math.min(w.endMs, b) - Math.max(w.startMs, a));
const searchOf = (w, [a, b]) => Math.max(0, Math.min(w.endMs + SEARCH_MS, b) - Math.max(w.startMs - SEARCH_MS, a));

const assign = caps.map((w) => {
  let best = -1;
  let bestScore = 0;
  for (let i = 0; i < speech.length; i++) {
    const score = overlapOf(w, speech[i]) + 0.35 * searchOf(w, speech[i]);
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
});

/* repair words whisper crammed entirely INTO a silence (zero overlap with
 * every segment): the search bonus can pull them to the WRONG side of the
 * pause (e.g. "Semuanya" displayed 1.2s before it is spoken). A crammed word
 * attaches to the side its IN-ORDER neighbour demonstrably lives on: if the
 * next word's whisper span overlaps the segment AFTER the pause by ≥100ms,
 * the crammed word belongs after it too. One-directional on purpose — cases
 * where the truth is the previous segment already resolve correctly via the
 * overlap+search score, and "repairing" towards the previous segment has no
 * acoustic evidence to stand on. */
let repaired = 0;
for (let i = 0; i < caps.length; i++) {
  if (speech.some(([a, b]) => Math.min(caps[i].endMs, b) - Math.max(caps[i].startMs, a) > 0)) continue;
  const sil = merged.findIndex(([a, b]) => caps[i].startMs >= a - 80 && caps[i].endMs <= b + 80);
  if (sil < 0 || sil >= speech.length - 1) continue;
  const nextW = caps[i + 1];
  if (nextW && overlapOf(nextW, speech[sil + 1]) >= 100 && assign[i] !== sil + 1) {
    console.log(`  repair crammed "${caps[i].text.trim()}": seg ${assign[i]} -> ${sil + 1} (next word "${nextW.text.trim()}" overlaps segment after pause)`);
    assign[i] = sil + 1;
    repaired++;
  }
}
console.log(`crammed words repaired: ${repaired}`);

/* group consecutive words sharing a segment */
const groups = [];
for (let i = 0; i < caps.length; i++) {
  const seg = assign[i];
  if (groups.length && groups[groups.length - 1].seg === seg) {
    groups[groups.length - 1].idx.push(i);
  } else groups.push({ seg, idx: [i] });
}

/* ---------- 4. linear re-map per group ---------- */
const refined = caps.map((w) => ({ ...w }));
for (const g of groups) {
  const wFirst = caps[g.idx[0]];
  const wLast = caps[g.idx[g.idx.length - 1]];
  const spanA = wFirst.startMs;
  const spanB = Math.max(wLast.endMs, wFirst.startMs + 200);
  if (g.seg < 0) continue; // unassigned — keep whisper times
  const [segA, segB] = speech[g.seg];
  const scale = (segB - segA) / (spanB - spanA);
  console.log(
    `  group T${String(g.seg).padStart(2, "0")}: "${wFirst.text.trim()}".."${wLast.text.trim()}" (${g.idx.length}w) ` +
    `span ${spanA}-${spanB} -> seg ${segA}-${segB} scale ${scale.toFixed(3)}`,
  );
  for (const i of g.idx) {
    const w = caps[i];
    refined[i].startMs = Math.round(segA + (w.startMs - spanA) * scale);
    refined[i].endMs = Math.round(segA + (w.endMs - spanA) * scale);
  }
}

/* ---------- 4b. snap internal word boundaries to energy dips ---------- */
/* Linear shear pins phrase EDGES but keeps whisper's within-phrase pacing,
 * which can stretch one word over the next (e.g. "di" swallowing the onset
 * of "tengah"). In continuous speech the real inter-word transition shows as
 * a dip in the energy envelope: snap every boundary that sits INSIDE a
 * speech segment (both neighbours share a segment) to an energy dip, judged
 * by (a) depth ≥ DIP_DB below the speech on BOTH sides of the dip, and
 * (b) the strength of the syllable onset right AFTER the dip (a plosive
 * onset like the [t] of "tengah" rises much harder than a mid-word
 * aspiration) — that onset strength is what separates a true word boundary
 * from a mid-word closure. Boundaries that follow a crammed first word get
 * a wider window: whisper smears those words across the preceding pause, so
 * the sheared boundary can sit several hundred ms off. Consecutive
 * boundaries must stay ≥ MIN_GAP_MS apart so two boundaries can never
 * collapse onto one dip. */
const ERODE_FRAMES = 1; // ±frames min-filter: keeps 40–50ms closures, kills spikes
const SNAP_MS = 160; // search window around the sheared boundary
const SNAP_MS_WIDE = 300; // …after a crammed first word
const FLANK_MS = 60; // local flank radius for the depth test
const RISE_MS = 70; // onset window after the dip for the rise score
const DIP_DB = 5; // dip must sit ≥ this below BOTH local flanks
const MIN_GAP_MS = 90; // min distance between neighbouring boundaries

const dbE = new Float32Array(nFrames);
for (let i = 0; i < nFrames; i++) {
  let m = Infinity;
  for (let k = -ERODE_FRAMES; k <= ERODE_FRAMES; k++) {
    const j = Math.max(0, Math.min(nFrames - 1, i + k));
    if (db[j] < m) m = db[j];
  }
  dbE[i] = m;
}
const erAt = (ms) => dbE[Math.max(0, Math.min(nFrames - 1, Math.round(ms / HOP_MS)))];
/* max eroded level over [ms1, ms2] */
const erMax = (ms1, ms2) => {
  let m = -96;
  for (let ms = ms1; ms <= ms2; ms += HOP_MS) m = Math.max(m, erAt(ms));
  return m;
};

/* which words did whisper cram into a silence (zero overlap everywhere) */
const crammed = caps.map((w) => !speech.some(([a, b]) => Math.min(w.endMs, b) - Math.max(w.startMs, a) > 0));

let snapped = 0;
for (let i = 0; i < refined.length - 1; i++) {
  if (assign[i] < 0 || assign[i] !== assign[i + 1]) continue; // internal boundaries only
  const t0 = Math.round((refined[i].endMs + refined[i + 1].startMs) / 2);
  /* wide window only when word i is the first word of its group AND whisper
   * crammed it into the preceding pause (its sheared span is inflated) */
  const isGroupFirst = i === 0 || assign[i] !== assign[i - 1];
  const win = crammed[i] && isGroupFirst ? SNAP_MS_WIDE : SNAP_MS;
  const cands = [];
  const fLo = Math.max(1, Math.floor((t0 - win) / HOP_MS));
  const fHi = Math.min(nFrames - 2, Math.ceil((t0 + win) / HOP_MS));
  for (let f = fLo; f <= fHi; f++) {
    if (dbE[f] > dbE[f - 1] || dbE[f] > dbE[f + 1]) continue; // not a valley
    const dT = f * HOP_MS;
    const depth = Math.min(erMax(dT - FLANK_MS, dT - 10), erMax(dT + 10, dT + FLANK_MS)) - dbE[f];
    if (depth < DIP_DB) continue;
    const rise = erMax(dT + 10, dT + RISE_MS) - dbE[f];
    cands.push({ t: dT, depth, rise });
  }
  /* strongest onset first, then closest to the sheared position */
  cands.sort((a, b) => b.rise - a.rise || Math.abs(a.t - t0) - Math.abs(b.t - t0));
  const prevPos = refined[i].startMs; // where boundary i-1 landed
  const hit = cands.find((c) => c.t - prevPos >= MIN_GAP_MS);
  if (!hit) continue;
  refined[i].endMs = hit.t;
  refined[i + 1].startMs = hit.t;
  snapped++;
  const shift = hit.t - t0;
  console.log(`  snap ${refined[i].text} | ${refined[i + 1].text}: ${shift >= 0 ? "+" : ""}${shift}ms -> ${hit.t} (rise ${hit.rise.toFixed(1)}dB, depth ${hit.depth.toFixed(1)}dB)`);
}
console.log(`internal boundaries snapped to energy dips: ${snapped}`);

/* ---------- 5. clamps: file end + monotonicity ---------- */
refined[refined.length - 1].endMs = Math.min(refined[refined.length - 1].endMs, audioEndMs - 40);
/* min-duration BEFORE the overlap check: a snapped boundary can push a word's
 * start past its linearly sheared end (real dip onset > sheared end, e.g.
 * "yang" 45160/45062) — expanding the end first, then pushing the next word's
 * start to that end, keeps spans ordered without re-inverting them (an
 * average of an inverted pair would leave start > end). Each push is
 * re-checked on the next iteration, so cascades resolve forward. */
for (let i = 0; i < refined.length - 1; i++) {
  if (refined[i].endMs - refined[i].startMs < 60) refined[i].endMs = refined[i].startMs + 60;
  if (refined[i + 1].startMs < refined[i].endMs) {
    refined[i + 1].startMs = refined[i].endMs;
  }
}
const lastW = refined[refined.length - 1];
if (lastW.endMs - lastW.startMs < 60) lastW.endMs = Math.min(lastW.startMs + 60, audioEndMs - 40);

/* ---------- report: phrase-boundary accuracy vs audio ---------- */
console.log("\n=== phrase-boundary check (refined) ===");
let bad = 0;
for (const [a, b] of merged) {
  const nextWord = refined.find((w) => w.startMs >= a - 30);
  const prevWord = [...refined].reverse().find((w) => w.endMs <= b + 30);
  if (nextWord && prevWord) {
    const lateStart = nextWord.startMs - b; // positive = word appears after speech resumes
    const earlyEnd = b - prevWord.endMs;
    const flag = lateStart > 120 || lateStart < -60 ? "  <-- CHECK" : "";
    if (flag) bad++;
    console.log(
      `pause ${a}-${b}: next "${nextWord.text}" +${lateStart}ms | prev "${prevWord.text}" gap ${earlyEnd}ms${flag}`,
    );
  }
}
console.log(bad === 0 ? "all phrase boundaries anchored ✓" : `${bad} boundaries need attention`);

/* ---------- report: words displayed entirely inside a silence ---------- */
const inSilence = refined.filter((w) =>
  merged.some(([a, b]) => w.startMs >= a + 40 && w.endMs <= b - 40),
);
if (inSilence.length) {
  inSilence.forEach((w) => console.log(`  !! "${w.text.trim()}" ${w.startMs}-${w.endMs} sits entirely inside a detected silence`));
} else {
  console.log("no words displayed inside silences ✓");
}

/* ---------- backup + write ---------- */
fs.writeFileSync(
  path.join(ROOT, "src/projects/keramat/captions.whisper-raw.json"),
  JSON.stringify(caps, null, 1),
);
fs.writeFileSync(CAPS, JSON.stringify(refined, null, 1));
console.log("\nrefined captions.json written; raw whisper saved to captions.whisper-raw.json");
