const path = require("path");
const fs = require("fs");
const { transcribe, toCaptions } = require("@remotion/install-whisper-cpp");

const to = path.join(process.cwd(), "whisper.cpp");
const inputFile = path.join(process.cwd(), "whisper-input", "voice-fight-club-16k.wav");

(async () => {
  if (!fs.existsSync(inputFile)) {
    throw new Error("Missing " + inputFile);
  }

  console.log("Transcribing Fight Club narration...");
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

  const outDir = path.join(process.cwd(), "src", "projects", "fight-club");
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
