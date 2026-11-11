#!/usr/bin/env bash
# ============================================================
# prepare-broll.sh — Interstellar video production
# Cuts the required B-roll segments from the raw film clips
# into short H.264 files for reliable Remotion playback.
#
# Inputs : public/assets/interstellar/*.mkv  (untouched originals)
# Output : public/assets/interstellar/processed/*.mp4
#
# Two framings:
#   FB = full-bleed vertical (pre-cropped to 1080x1920)
#   WIDE = editorial card (16:9 / letterboxed kept as-is)
# ============================================================
set -e
cd "$(dirname "$0")/.."

RAW="public/assets/interstellar"
OUT="$RAW/processed"
mkdir -p "$OUT"

# Center-crop windows for full-bleed vertical (from cropdetect):
TRAILER_FB="crop=450:800:735:140"      # 1920x800 content @ y=140 -> 9:16
GARGANTUA_FB="crop=608:1080:656:0"      # full-frame 16:9 -> 9:16
OLDMURPH_FB="crop=496:884:712:140"      # 1920x884 content @ y=140 -> 9:16
SQAURE_FILL="unsharp=5:5:0.55"

ENC="-c:v libx264 -crf 16 -preset veryfast -pix_fmt yuv420p -an -sn"

cut() { enc=$1; from=$2; dur=$3; src=$4; shift; "$@"; }
# (simple explicit commands below for clarity)

# --- TRAILER (1920x1080, 25fps, VP9) ---
T="$RAW/Interstellar - Trailer - Official Warner Bros..mkv"

# WIDE card: Endurance ring station in space (hook beat 1)
ffmpeg -y -v error -ss 110.0 -i "$T" -t 1.5 -vf "scale=1600:-1:flags=lanczos" $ENC "$OUT/card-hook-endurance.mp4"

# FB vertical: Saturn close-up (hook beat 2)
ffmpeg -y -v error -ss 111.4 -i "$T" -t 1.9 -vf "$TRAILER_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-hook-saturn.mp4"

# FB vertical: tiny Endurance drifting in dark space (hook beat 3)
ffmpeg -y -v error -ss 116.2 -i "$T" -t 2.4 -vf "$TRAILER_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-hook-drift.mp4"

# WIDE cards: music/sinematography montage
ffmpeg -y -v error -ss 96.0 -i "$T" -t 6.0 -vf "scale=1600:-1:flags=lanczos" $ENC "$OUT/card-dust-storm.mp4"
ffmpeg -y -v error -ss 105.0 -i "$T" -t 6.0 -vf "scale=1600:-1:flags=lanczos" $ENC "$OUT/card-cockpit-hud.mp4"
ffmpeg -y -v error -ss 125.4 -i "$T" -t 3.8 -vf "scale=1600:-1:flags=lanczos" $ENC "$OUT/card-endurance-module.mp4"

# --- CLIP-BLACK-HOLE-GARGANTUA (1920x1080, 23.976fps, AV1, full frame) ---
G="$RAW/clip-black-hole-Gargantua.mkv"

# FB vertical: Gargantua black hole money shot (S5 climax)
ffmpeg -y -v error -ss 0.2 -i "$G" -t 4.2 -vf "$GARGANTUA_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-gargantua.mp4"

# FB vertical: Cooper helmet face-up close-up ("aktor bereaksi")
ffmpeg -y -v error -ss 4.6 -i "$G" -t 5.0 -vf "$GARGANTUA_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-helmet-cooper.mp4"

# FB vertical: Brand helmet close-up
ffmpeg -y -v error -ss 44.5 -i "$G" -t 5.0 -vf "$GARGANTUA_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-helmet-brand.mp4"

# FB vertical: cockpit instrument panels ("layar raksasa" b-roll)
ffmpeg -y -v error -ss 109.5 -i "$G" -t 5.0 -vf "$GARGANTUA_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-instrument-panels.mp4"

# WIDE card: Endurance blueprint schematic screen (interface element)
ffmpeg -y -v error -ss 29.5 -i "$G" -t 5.5 -vf "scale=1600:-1:flags=lanczos" $ENC "$OUT/card-blueprint-screen.mp4"

# --- CLIP-OLD-MURPH (1920x1080, 23.976fps, H264) ---
O="$RAW/clip-Old-Murph.mkv"
ffmpeg -y -v error -ss 1.0 -i "$O" -t 8.0 -vf "$OLDMURPH_FB,scale=1080:1920:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/fullbleed-oldmurph-bed.mp4"

# --- CLIP-COOPER-LEAVES MURPH (1280x720, 23.976fps, AV1) ---
C="$RAW/clip-Cooper-Leaves Murph-Scene.mkv"

# WIDE cards (3.6x vertical crop too lossy -> keep letterboxed cards)
ffmpeg -y -v error -ss 91.0 -i "$C" -t 6.2 -vf "scale=1280:-1:flags=lanczos" $ENC "$OUT/card-farewell-talk.mp4"
ffmpeg -y -v error -ss 103.0 -i "$C" -t 10.2 -vf "scale=1280:-1:flags=lanczos" $ENC "$OUT/card-farewell-hug.mp4"

# SQUARE card: watch handover close-up (536x536 center of content)
ffmpeg -y -v error -ss 117.6 -i "$C" -t 5.4 -vf "crop=536:536:372:92,scale=720:720:flags=lanczos,$SQAURE_FILL" $ENC "$OUT/card-watch-handover.mp4"

echo "---- results ----"
ls -la "$OUT"
