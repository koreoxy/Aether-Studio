#!/usr/bin/env bash
# ============================================================
# prepare-broll.sh — Keramat video production
# Cuts the required B-roll segments from the raw film trailer
# into short H.264 files for reliable Remotion playback.
#
# Inputs : public/assets/keramat/*.mkv|*.mp4  (originals untouched)
# Output : public/assets/keramat/processed/*.mp4
#
# Framings:
#   FB   = full-bleed vertical (center-cropped to 1080x1920)
#   CARD = editorial card (16:9 kept as-is, used inside collage)
#
# NOTE: AV1 source -> -ss is placed AFTER -i (output seeking)
#       for frame-accurate starts (input seeking snaps to keyframes).
# ============================================================
set -e
cd "$(dirname "$0")/.."

RAW="public/assets/keramat"
OUT="$RAW/processed"
mkdir -p "$OUT"

# Center-crop window for full-bleed vertical (2048x1080 -> 9:16 = 608px wide)
FB="crop=608:1080:720:0,scale=1080:1920:flags=lanczos"
SHARP="unsharp=5:5:0.55"

ENC="-c:v libx264 -crf 16 -preset veryfast -pix_fmt yuv420p -an -sn"

T="$RAW/Film Keramat - trailer.mkv"

cut() { # $1=src $2=ss $3=dur $4=filter $5=out
  ffmpeg -y -v error -i "$1" -ss "$2" -t "$3" -vf "$4" $ENC "$5"
}

# --- SCENE 1 HOOK (0-5.4s): corridor walk (10.2-13.4s) + frightened women (15.8-20.4s)
cut "$T" 10.2 3.2 "$FB,$SHARP" "$OUT/fullbleed-hook-enter.mp4"
cut "$T" 15.8 4.6 "$FB,$SHARP" "$OUT/fullbleed-hook-women.mp4"

# --- SCENE 2 PENGENALAN: "MEREKAM" title card (21.4-23.7s) + red title (99.6-102.6s)
cut "$T" 21.4 2.3 "scale=1600:-1:flags=lanczos" "$OUT/card-merekam.mp4"
cut "$T" 99.6 3.0 "scale=1600:-1:flags=lanczos" "$OUT/card-title-keramat.mp4"

# --- SCENE 3 SINOPSIS (12.2-26.2s): train platform card (28.0-29.2s),
#     crew moving through house FB (35.6-39.0s), anomaly/praying FB (47.9-50.6s)
cut "$T" 28.0 1.2 "scale=1600:-1:flags=lanczos" "$OUT/card-train.mp4"
cut "$T" 35.6 3.4 "crop=608:1080:700:0,scale=1080:1920:flags=lanczos,$SHARP" "$OUT/fullbleed-crew-house.mp4"
cut "$T" 47.9 2.7 "crop=608:1080:1000:0,scale=1080:1920:flags=lanczos,$SHARP" "$OUT/fullbleed-anomaly.mp4"

# --- SCENE 4 KENAPA BAGUS (26.2-41.8s): camcorder walk FB (11.0-14.0s),
#     candle-room stillness FB (43.2-46.4s)
cut "$T" 11.0 3.0 "crop=608:1080:760:0,scale=1080:1920:flags=lanczos,$SHARP" "$OUT/fullbleed-camcorder-walk.mp4"
cut "$T" 43.2 3.2 "crop=608:1080:820:0,scale=1080:1920:flags=lanczos,$SHARP" "$OUT/fullbleed-candle-room.mp4"

# --- SCENE 5 RASA NGERI (41.8-53.7s): ghost reveal FB (88.5-90.9s),
#     panic-run through dark FB (92.0-97.0s), dark-doorway B-roll (already 1080x1920)
cut "$T" 88.5 2.4 "$FB,$SHARP" "$OUT/fullbleed-ghost.mp4"
cut "$T" 92.0 5.0 "$FB,$SHARP" "$OUT/fullbleed-panic-run.mp4"
ffmpeg -y -v error -i "$RAW/Camera_pans_toward_dark_doorway_1080p.mp4" \
  -vf "scale=1080:1920:flags=lanczos,$SHARP" $ENC "$OUT/fullbleed-dark-doorway.mp4"

# --- SCENE 6 PENUTUP (53.7-60s): quiet candle room FB (58.0-61.0s)
cut "$T" 58.0 3.0 "crop=608:1080:820:0,scale=1080:1920:flags=lanczos,$SHARP" "$OUT/fullbleed-quiet-room.mp4"

echo "---- results ----"
ls -la "$OUT"/*.mp4
