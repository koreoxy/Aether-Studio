/**
 * qa-stills.mjs — Interstellar visual QA
 * Bundles once, renders a storyboard of key frames as PNGs (50% scale)
 * into the probe folder for frame-by-frame inspection.
 * Run: node scripts/qa-stills.mjs [subsetName1,subsetName2,...]
 */
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { getCompositions, openBrowser, renderStill } from "@remotion/renderer";

const ROOT = process.cwd();
const OUT = "C:/Users/rayss/AppData/Local/Temp/opencode/interstellar-probe/stills";

/** absolute frames covering every scene + the connected wipe */
const FRAMES = [
  // S1 hook — Saturn hard-in, Endurance card, giant NYATA x2
  { frame: 8, name: "s1-saturn-hardin" },
  { frame: 34, name: "s1-endurance-card" },
  { frame: 62, name: "s1-giant-nyata1" },
  { frame: 100, name: "s1-nyata2-red" },
  // S2 — poster slam, Nolan line, MUSIK/MEMUKAU, wipe entry
  { frame: 165, name: "s2-poster-slam" },
  { frame: 205, name: "s2-nolan-line" },
  { frame: 300, name: "s2-musiknya" },
  { frame: 335, name: "s2-cinematografi" },
  { frame: 426, name: "s2-wipe-enter" },
  { frame: 450, name: "s2-wipe-cover" },
  { frame: 480, name: "s3-reveal" },
  // S3 — cream editorial, kisah/ayah, Cooper, clock math, watch handover
  { frame: 500, name: "s3-dibalik" },
  { frame: 565, name: "s3-ayah-anak" },
  { frame: 620, name: "s3-cooper" },
  { frame: 700, name: "s3-demi" },
  { frame: 800, name: "s3-satujam" },
  { frame: 835, name: "s3-tahun-flip" },
  { frame: 905, name: "s3-watch-card" },
  // S4 — minim chip, CGI strike, corn, mini lander, window, swap, collapse
  { frame: 975, name: "s4-chip-minim" },
  { frame: 995, name: "s4-cgi-strike" },
  { frame: 1055, name: "s4-corn-stamp" },
  { frame: 1135, name: "s4-mini-stamp" },
  { frame: 1230, name: "s4-window-blueprint" },
  { frame: 1305, name: "s4-kokpit-swap" },
  { frame: 1365, name: "s4-window-collapse" },
  // S5 — organ rise, Zimmer slam, montage cuts, EMOSIONAL
  { frame: 1475, name: "s5-organ-rise" },
  { frame: 1495, name: "s5-zimmer-slam" },
  { frame: 1525, name: "s5-montage-1" },
  { frame: 1560, name: "s5-montage-cuts" },
  { frame: 1600, name: "s5-emosional" },
  // S6 — rating chip, question, CTA chip, tail hold
  { frame: 1640, name: "s6-rating" },
  { frame: 1680, name: "s6-question" },
  { frame: 1745, name: "s6-cta-chip" },
  { frame: 1800, name: "s6-tail-hold" },
];

const only = process.argv[2] ? process.argv[2].split(",").map((s) => s.trim()) : null;
const picked = only ? FRAMES.filter((f) => only.includes(f.name)) : FRAMES;

console.log("Bundling…");
const serveUrl = await bundle({
  entryPoint: path.join(ROOT, "src", "index.ts"),
  rspack: true,
  onProgress: () => {},
});
console.log("Bundle done:", serveUrl);

const compositions = await getCompositions(serveUrl);
const comp = compositions.find((c) => c.id === "interstellar");
if (!comp) throw new Error("composition 'interstellar' not found");

const browser = await openBrowser();

for (const { frame, name } of picked) {
  const out = path.join(OUT, `${name}.png`);
  await renderStill({
    composition: comp,
    serveUrl,
    frame,
    output: out,
    imageFormat: "png",
    overwrite: true,
    scale: 0.5,
    puppeteerInstance: browser,
  });
  process.stdout.write(`rendered ${name}\n`);
}

await browser.close({ silent: true });
console.log(`Done — ${picked.length} stills in ${OUT}`);
