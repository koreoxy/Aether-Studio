/**
 * verify-audio.mjs — Interstellar post-render audio QA recipe.
 * Usage: node scripts/verify-audio.mjs out/<file>.mp4
 *
 * Checks:
 *  1. stream layout (H.264 video / AAC audio) + duration
 *  2. integrated loudness (target ≈ -14 LUFS), LRA, true peak
 *  3. SFX window spot checks — RMS bump right after the big cue hits
 */
import { execFileSync } from "node:child_process";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/verify-audio.mjs <mp4>");
  process.exit(1);
}

const run = (args) =>
  execFileSync("ffmpeg", args, { encoding: "utf-8", stdio: ["ignore", "pipe", "pipe"] });

/* ---- 1. streams + duration ---- */
console.log("=== STREAMS ===");
try {
  const probe = execFileSync("ffprobe", [
    "-v", "error", "-show_entries",
    "stream=codec_name,width,height,r_frame_rate,duration,sample_rate,channels",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1", file,
  ], { encoding: "utf-8" });
  console.log(probe);
} catch (e) {
  console.log(e.stdout || e.message);
}

/* ---- 2. integrated loudness (last 8 lines contain the summary) ---- */
console.log("=== EBU R128 (full mix) ===");
try {
  const out = run([
    "-hide_banner", "-nostats", "-i", file,
    "-filter_complex", "ebur128=peak=true",
    "-f", "null", "-",
  ]);
  const lines = out.split("\n").filter((l) => /Integrated loudness|Loudness range|True peak|I:|LRA:|Peak:/i.test(l));
  console.log(lines.slice(-6).join("\n"));
} catch (e) {
  // ffmpeg prints the summary on stderr
  const err = e.stderr || "";
  const lines = err.split("\n").filter((l) => /I:|LRA:|Peak:/.test(l));
  console.log(lines.join("\n") || "(no summary line found)");
}

/* ---- 3. SFX window spot checks ---- */
const windows = [
  { name: "5.0s poster-slam woosh", from: 5.0, to: 5.6 },
  { name: "14.2s panel-wipe whoosh", from: 14.2, to: 14.9 },
  { name: "25.2s clock-arrival", from: 25.2, to: 25.8 },
  { name: "48.9s ZIMMER slam", from: 48.91, to: 49.5 },
  { name: "52.9s EMOSIONAL burst", from: 52.92, to: 53.5 },
  { name: "57.7s CTA chip", from: 57.7, to: 58.3 },
];
console.log("=== SFX WINDOWS (RMS mean) ===");
for (const w of windows) {
  try {
    const out = run([
      "-hide_banner", "-nostats",
      "-ss", String(w.from), "-t", String(w.to - w.from), "-i", file,
      "-map", "0:a", "-af", "astats=measure_overall=RMS_level:measure_perchannel=none",
      "-f", "null", "-",
    ]);
    const m = out.split("\n").find((l) => /RMS level/.test(l));
    console.log(`${w.name}: ${m ? m.trim() : "(no rms)"}`);
  } catch (e) {
    const err = (e.stderr || "") + "\n" + (e.stdout || "");
    const m = err.split("\n").find((l) => /RMS level/.test(l));
    console.log(`${w.name}: ${m ? m.trim() : "(no rms)"}`);
  }
}
console.log("done.");
