/**
 * SubtitleLayerKeramat — karaoke-style phrase captions.
 *
 * The whole phrase is displayed while it is spoken (readable at a glance):
 *   - already-sung words stay lit (light blue / red for EMPHASIS_WORDS)
 *   - the current word pops white with a glow (red + glow when emphasized)
 *     and settles with a subtle scale bump
 *   - upcoming words sit dimmed until they are spoken
 * One dark card, centered in the shared platform safe zone, wraps to 2 lines.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK_THEME, FONT_SUBTITLE } from "../../projects/keramat/theme";
import {
  EMPHASIS_WORDS,
  SUBTITLE_PHRASES,
  NARRATION_OFFSET_MS,
} from "../../projects/keramat/subtitles";

export type SubtitleLayerKeramatProps = {
  narrationOffsetMs?: number;
  width: number;
  height: number;
  /** center Y of the caption card (px) */
  baselineY?: number;
  fontSize?: number;
  /** keep the last phrase on screen after its final word, in ms */
  tailHoldMs?: number;
};

export const SubtitleLayerKeramat: React.FC<SubtitleLayerKeramatProps> = ({
  narrationOffsetMs = NARRATION_OFFSET_MS,
  width,
  height,
  baselineY = 1330,
  fontSize = 58,
  tailHoldMs = 350,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioMs = (frame * 1000) / fps - narrationOffsetMs;

  /* active phrase = the LAST phrase that has started speaking.
   * (first-match would let a previous phrase linger through its tail-hold
   *  while the next phrase is already being spoken — reads as "delay") */
  let phrase = null;
  for (const p of SUBTITLE_PHRASES) {
    if (audioMs >= p.startMs) phrase = p;
  }
  /* tail hold only applies across real pauses; past it the card leaves */
  if (phrase && audioMs >= phrase.endMs + tailHoldMs) phrase = null;
  if (!phrase) return null;

  /* card entry / exit */
  const enter = interpolate(audioMs - phrase.startMs, [0, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
  const exit = interpolate(audioMs - (phrase.endMs + tailHoldMs), [0, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardOpacity = Math.min(enter, exit);
  const cardScale = interpolate(enter, [0, 1], [0.96, 1]);

  /* current word = last word whose start has passed */
  let cur = 0;
  phrase.words.forEach((w, i) => {
    if (audioMs >= w.startMs) cur = i;
  });

  const y = baselineY ?? Math.round(height * 0.7);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: y,
        width,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
        zIndex: 50,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          maxWidth: 830,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 15,
          rowGap: 4,
          backgroundColor: "rgba(10, 18, 40, 0.74)",
          border: "1px solid rgba(199, 215, 255, 0.14)",
          borderRadius: 18,
          padding: "12px 28px",
          boxShadow: "0 8px 26px rgba(0, 0, 0, 0.4)",
          opacity: cardOpacity,
          transform: `translateY(-50%) scale(${cardScale})`,
          transformOrigin: "center",
        }}
      >
        {phrase.words.map((word, i) => {
          const emph = EMPHASIS_WORDS.has(word.text);
          const past = i < cur;
          const active = i === cur;
          const bump = active
            ? interpolate(audioMs - word.startMs, [0, 60], [1.07, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: (t) => 1 - Math.pow(1 - t, 3),
              })
            : 1;
          const color = !past && !active
            ? "rgba(199, 215, 255, 0.30)" // upcoming — dimmed
            : emph
              ? DARK_THEME.accent // emphasized words read red
              : active
                ? "#FFFFFF" // current word pops
                : DARK_THEME.text; // sung — full color
          const glow = active
            ? emph
              ? "0 0 18px rgba(232, 67, 58, 0.55)"
              : "0 0 14px rgba(255, 255, 255, 0.35)"
            : emph && past
              ? "0 0 12px rgba(232, 67, 58, 0.35)"
              : "none";
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: FONT_SUBTITLE,
                fontWeight: 600,
                fontSize,
                lineHeight: 1.25,
                color,
                textShadow: glow,
                transform: `scale(${bump})`,
                transformOrigin: "center bottom",
                whiteSpace: "nowrap",
              }}
            >
              {word.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
