#!/usr/bin/env bash
# ============================================================
# prepare-audio.sh — Keramat video production
# 1. Loudness-normalizes the narration (voiceover dominant)
# 2. Synthesizes a dark found-footage horror drone bed locally
#    (low drone + tape hiss + slow pulse, ffmpeg synthesis)
# 3. Converts narration to 16k mono for whisper transcription
# 4. Measures every supplied SFX peak -> prints gain guidance
#
# Inputs : public/assets/keramat/**  (originals untouched)
# Output : public/assets/keramat/processed/**
# ============================================================
set -e
cd "$(dirname "$0")/.."

RAW="public/assets/keramat"
OUT="$RAW/processed"
mkdir -p "$OUT"

# ------------------------------------------------------------
# 1) Narration: normalize to ≈ -14 LUFS / TP=-1.5
#    NOTE: this source is very dynamic (I=-20.96, TP=-2.18), so one-pass
#    loudnorm only reaches ≈ -15.8 and pure linear gain is TP-capped.
#    Measured fix: loudnorm, then +2.7 dB and true-peak-limit to -1.5 dBFS
#    (limiter only touches the loudest transients).
# ------------------------------------------------------------
ffmpeg -y -v error -i "$RAW/Voice-over.wav" \
  -af "loudnorm=I=-14:TP=-1.2:LRA=11,volume=2.7dB,alimiter=limit=0.8414:attack=5:release=50:level=false" \
  -ar 48000 -c:a pcm_s16le \
  "$OUT/narration-normalized.wav"
echo "narration-normalized.wav written (target I≈-14.5 LUFS / TP -1.5)"

# ------------------------------------------------------------
# 2) 16k mono copy for whisper.cpp transcription
# ------------------------------------------------------------
ffmpeg -y -v error -i "$RAW/Voice-over.wav" -ar 16000 -ac 1 \
  "whisper-input/voice-keramat-16k.wav"
echo "whisper-input/voice-keramat-16k.wav written"

# ------------------------------------------------------------
# 3) Found-footage horror drone bed, 61.0s, 48kHz stereo
#    C1 32.7Hz + C2 65.4Hz pedal + mistuned detune layer,
#    faint G2 fifth, 5-second dread pulse swell,
#    pink-noise "tape hiss" layer (camcorder VHS feel),
#    slow 0.09Hz breathing swells, lowpass dark, wide echo.
# ------------------------------------------------------------
SECS=61
L='0.40*sin(2*PI*32.7*t)+0.34*sin(2*PI*65.41*t)+0.30*sin(2*PI*65.3*t)+0.20*sin(2*PI*98*t)+0.30*pow(max(0\,sin(2*PI*t/5))\,12)*sin(2*PI*41.2*t)'
R='0.40*sin(2*PI*32.7*t)+0.34*sin(2*PI*65.41*t)+0.30*sin(2*PI*65.7*t)+0.20*sin(2*PI*98*t)+0.30*pow(max(0\,sin(2*PI*t/5+PI))\,12)*sin(2*PI*41.2*t)'

ffmpeg -y -v error -f lavfi \
  -i "aevalsrc=${L}|${R}:s=48000:d=${SECS}:c=stereo" \
  -f lavfi -i "anoisesrc=color=pink:amplitude=0.05:duration=${SECS}:sample_rate=48000" \
  -filter_complex "\
  [0:a]lowpass=f=2400,aecho=0.4:0.45:260|540|1100:0.42|0.3|0.16[drone];\
  [1:a]highpass=f=1800,lowpass=f=6500,volume=0.5[hiss];\
  [drone][hiss]amix=inputs=2:duration=first:weights=1 0.16,\
  volume=0.5,\
  afade=t=in:st=0:d=2.4,\
  afade=t=out:st=56.5:d=4.5" \
  -c:a pcm_s16le "$OUT/music-horror-bed-raw.wav"

# measure and normalize raw bed to peak -12 dB
PEAK=$(ffmpeg -i "$OUT/music-horror-bed-raw.wav" -af volumedetect -f null - 2>&1 | \
  grep -oE "max_volume: [-0-9.]+ dB" | grep -oE "[-0-9.]+ dB" | grep -oE "^-?[0-9.]+" )
echo "raw bed peak: $PEAK dB"
GAIN=$(python -c "print(round(-12 - float('$PEAK'), 2))")
echo "applying gain ${GAIN} dB"
ffmpeg -y -v error -i "$OUT/music-horror-bed-raw.wav" \
  -af "volume=${GAIN}dB" -c:a pcm_s16le "$OUT/music-horror-bed.wav"
rm "$OUT/music-horror-bed-raw.wav"

# ------------------------------------------------------------
# 4) SFX peak measurement table (shared SFX folder)
# ------------------------------------------------------------
echo ""
echo "==== SFX PEAKS (gain intent: per-hit volume multiplier = 10^(-target/20) / 10^(peak/20)) ===="
python - <<'EOF'
import os, subprocess, re
folder = "public/assets/Audio Sound Effect"
for f in sorted(os.listdir(folder)):
    p = os.path.join(folder, f)
    r = subprocess.run(["ffmpeg","-i",p,"-af","volumedetect","-f","null","-"],
                       capture_output=True, text=True)
    m = re.search(r"max_volume: (-?\d+(?:\.\d+)?) dB", r.stderr)
    m2 = re.search(r"mean_volume: (-?\d+(?:\.\d+)?) dB", r.stderr)
    peak = m.group(1) if m else "?"
    mean = m2.group(1) if m2 else "?"
    gain_to_minus6 = round(-6 - float(peak), 1) if m else "?"
    print(f"{f:55s} peak {peak:>7s} dB  mean {mean:>7s} dB  gain_to_-6dB {gain_to_minus6}")
EOF
echo "audio prep complete"
