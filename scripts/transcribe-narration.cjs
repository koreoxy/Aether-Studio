/**
 * Transcribes the Interstellar narration with word-level timestamps.
 * Output: src/projects/interstellar/captions.json
 * Model: whisper.cpp "small" (multilingual) for Indonesian narration.
 * One-off production tool for the interstellar video project.
 */
const path = require("path");
const fs = require("fs");
const {
  installWhisperCpp,
  downloadWhisperModel,
  transcribe,
  toCaptions,
} = require("@remotion/install-whisper-cpp");

const to = path.join(process.cwd(), "whisper.cpp");
const inputFile = path.join(process.cwd(), "whisper-input", "voice-16k.wav");

(async () => {
  if (!fs.existsSync(inputFile)) {
    throw new Error("Missing " + inputFile + " — run ffmpeg conversion first.");
  }

  console.log("Installing whisper.cpp 1.5.5...");
  await installWhisperCpp({ to, version: "1.5.5", printOutput: false });

  console.log("Downloading model 'small'...");
  await downloadWhisperModel({ model: "small", folder: to, printOutput: false });

  console.log("Transcribing (token-level timestamps, language=id)...");
  const whisperCppOutput = await transcribe({
    model: "small",
    whisperPath: to,
    whisperCppVersion: "1.5.5",
    inputPath: inputFile,
    tokenLevelTimestamps: true,
    language: "id",
    splitOnWord: true,
    printOutput: false,
  });

  const { captions } = toCaptions({ whisperCppOutput });

  const outDir = path.join(process.cwd(), "src", "projects", "interstellar");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "captions.json"),
    JSON.stringify(captions, null, 2),
  );
  console.log("Captions written:", captions.length, "captions");
})().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
