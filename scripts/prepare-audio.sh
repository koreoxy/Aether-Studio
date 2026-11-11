#!/usr/bin/env bash
# ============================================================
# prepare-audio.sh — Interstellar video production
# 1. Loudness-normalizes the narration (voiceover dominant)
# 2. Synthesizes a Hans-Zimmer-style organ drone bed locally
#    (no ElevenLabs key available -> ffmpeg synthesis)
# 3. Measures every supplied SFX peak -> prints gain guidance
#
# Inputs : public/assets/interstellar/**  (originals untouched)
# Output : public/assets/interstellar/processed/**
# ============================================================
set -e
cd "$(dirname "$0")/.."

RAW="public/assets/interstellar"
OUT="$RAW/processed"
mkdir -p "$OUT"

# ------------------------------------------------------------
# 1) Narration: normalize to I=-14 LUFS / TP=-1.2
# ------------------------------------------------------------
ffmpeg -y -v error -i "$RAW/Voice.mp3" \
  -af "loudnorm=I=-14:TP=-1.2:LRA=11" -ar 48000 -c:a pcm_s16le \
  "$OUT/narration-normalized.wav"
echo "narration-normalized.wav written"

# ------------------------------------------------------------
# 2) Organ drone bed, 61.0s, 48kHz stereo
#    C2 65.41Hz pedal + mistuned detune layer,
#    C3 130.81Hz + G2 98Hz fifth + faint 196Hz overtone,
#    sub C1 32.7Hz, 4-second heartbeat swell (Zimmer pulse motif),
#    slow 0.11Hz breathing swells, lowpass dark, cavernous echo.
# ------------------------------------------------------------
SECS=61
L='0.5*sin(2*PI*65.41*t)+0.42*sin(2*PI*65.6*t)+0.34*sin(2*PI*130.81*t)+0.24*sin(2*PI*98*t)+0.10*sin(2*PI*196*t)+0.34*pow(max(0\,sin(2*PI*t/4))\,12)*sin(2*PI*41.2*t)'
R='0.5*sin(2*PI*65.41*t)+0.42*sin(2*PI*65.9*t)+0.34*sin(2*PI*130.81*t)+0.24*sin(2*PI*98*t)+0.10*sin(2*PI*196*t)+0.34*pow(max(0\,sin(2*PI*t/4+PI))\,12)*sin(2*PI*41.2*t)'

ffmpeg -y -v error -f lavfi \
  -i "aevalsrc=${L}|${R}:s=48000:d=${SECS}:c=stereo" \
  -af "\
  lowpass=f=3600,\
  aecho=0.35:0.42:180|420|960:0.4|0.3|0.18,\
  volume=0.55,\
  afade=t=in:st=0:d=2.2,\
  afade=t=out:st=56.5:d=4.5" \
  -c:a pcm_s16le "$OUT/music-organ-bed-raw.wav"

# measure and normalize raw bed to peak -12 dB
PEAK=$(ffmpeg -i "$OUT/music-organ-bed-raw.wav" -af volumedetect -f null - 2>&1 | \
  grep -oE "max_volume: [-0-9.]+ dB" | grep -oE "[-0-9.]+ dB" | grep -oE "^-?[0-9.]+" )
echo "raw bed peak: $PEAK dB"
GAIN=$(python -c "print(round(-12 - float('$PEAK'), 2))")
echo "applying gain ${GAIN} dB"
ffmpeg -y -v error -i "$OUT/music-organ-bed-raw.wav" \
  -af "volume=${GAIN}dB" -c:a pcm_s16le "$OUT/music-organ-bed.wav"
rm "$OUT/music-organ-bed-raw.wav"

# ------------------------------------------------------------
# 3) SFX peak measurement table
# ------------------------------------------------------------
echo ""
echo "==== SFX PEAKS (gain intent: per-hit volume multiplier = 10^(-target/20) / 10^(peak/20)) ===="
python - <<'EOF'
import os, subprocess, re
folder = "public/assets/interstellar/Audio Sound Effect"
for f in sorted(os.listdir(folder)):
    p = os.path.join(folder, f)
    r = subprocess.run(["ffmpeg","-i",p,"-af","volumedetect","-f","null","-"],
                       capture_output=True, text=True)
    m = re.search(r"max_volume: (-?\d+(?:\.\d+)?) dB", r.stderr)
    m2 = re.search(r"mean_volume: (-?\d+(?:\.\d+)?) dB", r.stderr)
    peak = m.group(1) if m else "?"
    mean = m2.group(1) if m2 else "?"
    # dB gain to reach -6 dB peak (hot enough for short hits)
    gain_to_minus6 = round(-6 - float(peak), 1) if m else "?"
    print(f"{f:55s} peak {peak:>7s} dB  mean {mean:>7s} dB  gain_to_-6dB {gain_to_minus6}")
EOF
echo "audio prep complete"
