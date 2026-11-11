/**
 * verify-audio-keramat.mjs — Keramat post-render audio QA recipe.
 * Usage: node scripts/verify-audio-keramat.mjs out/<file>.mp4
 *
 * Checks:
 *  1. stream layout (H.264 video / AAC audio) + duration
 *  2. integrated loudness (target ≈ -14 LUFS), LRA, true peak
 *  3. SFX window spot checks — RMS bump right after each cue
 *  4. narration dominance vs music-only tail
 */
import { spawnSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/verify-audio-keramat.mjs <mp4>");
  process.exit(1);
}

const probe = (args) => {
  const r = spawnSync("ffprobe", args, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });
  return (r.stdout || "") + (r.stderr || "");
};

/** runs ffmpeg and returns COMBINED stdout+stderr (ffmpeg writes stats to stderr) */
const run = (args) => {
  const r = spawnSync("ffmpeg", args, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });
  return (r.stdout || "") + "\n" + (r.stderr || "");
};

/* ---- 1. streams + duration ---- */
console.log("=== STREAMS ===");
console.log(probe([
  "-v", "error", "-show_entries",
  "stream=codec_name,width,height,r_frame_rate,duration,sample_rate,channels",
  "-show_entries", "format=duration",
  "-of", "default=noprint_wrappers=1", file,
]));

/* ---- 2. integrated loudness (summary lives on stderr) ---- */
console.log("=== EBU R128 (full mix) ===");
{
  const out = run([
    "-hide_banner", "-nostats", "-i", file,
    "-filter_complex", "ebur128=peak=true",
    "-f", "null", "-",
  ]);
  const lines = out.split("\n").filter((l) => /I:|LRA:|Peak:/.test(l));
  console.log(lines.join("\n") || "(no summary line found)");
}

/* ---- 3. SFX window spot checks (frames / 30 from SFX_CUES) ---- */
const windows = [
  // camera-shutter hits at the 5 scene boundaries (5.433, 12.2, 26.167, 41.833, 53.733)
  { name: "5.43s shutter S1->S2", from: 5.40, to: 6.10 },
  { name: "12.20s shutter S2->S3", from: 12.17, to: 12.87 },
  { name: "26.17s shutter S3->S4", from: 26.13, to: 26.83 },
  { name: "41.83s shutter S4->S5", from: 41.80, to: 42.50 },
  { name: "53.73s shutter S5->S6", from: 53.70, to: 54.40 },
  // ui pops
  { name: "6.40s poster chips", from: 6.35, to: 7.05 },
  { name: "7.60s fact chips", from: 7.55, to: 8.25 },
  { name: "13.20s route line", from: 13.15, to: 13.85 },
  { name: "28.00s MENURUTKU stamp", from: 27.95, to: 28.65 },
  { name: "36.40s technique chips", from: 36.35, to: 37.05 },
  // b-roll swaps / texture
  { name: "16.53s crew-house woosh", from: 16.50, to: 17.20 },
  { name: "19.60s anomaly woosh", from: 19.57, to: 20.27 },
  { name: "34.57s whoosh-low S4c", from: 34.53, to: 35.23 },
  { name: "46.27s viewfinder woosh", from: 46.23, to: 46.93 },
  { name: "54.07s S6 logo whoosh-low", from: 54.03, to: 54.73 },
];
console.log("=== SFX WINDOWS (RMS mean) ===");
for (const w of windows) {
  const out = run([
    "-hide_banner", "-nostats",
    "-ss", String(w.from), "-t", String(w.to - w.from), "-i", file,
    "-map", "0:a", "-af", "astats=measure_overall=RMS_level:measure_perchannel=none",
    "-f", "null", "-",
  ]);
  const m = out.split("\n").find((l) => /RMS level/.test(l));
  console.log(`${w.name}: ${m ? m.trim() : "(no rms)"}`);
}

/* ---- 4. narration dominance vs music-only tail ---- */
console.log("=== NARRATION vs MUSIC-ONLY ===");
const dominance = [
  { name: "narration peak window (2.0-3.0s hook)", from: 2.0, to: 3.0 },
  { name: "narration mid window (44.0-45.0s S5)", from: 44.0, to: 45.0 },
  { name: "music-only tail (59.2-59.9s, post VO)", from: 59.2, to: 59.9 },
];
for (const w of dominance) {
  const out = run([
    "-hide_banner", "-nostats",
    "-ss", String(w.from), "-t", String(w.to - w.from), "-i", file,
    "-map", "0:a", "-af", "astats=measure_overall=RMS_level:measure_perchannel=none",
    "-f", "null", "-",
  ]);
  const rms = out.split("\n").find((l) => /RMS level/.test(l));
  const pk = out.split("\n").find((l) => /Peak level/.test(l));
  console.log(`${w.name}: ${rms ? rms.trim() : "?"} | ${pk ? pk.trim() : "?"}`);
}
console.log("done.");
