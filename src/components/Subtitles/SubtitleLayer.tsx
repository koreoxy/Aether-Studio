/**
 * SubtitleLayer — Full phrase karaoke captions synchronized with voiceover.
 * Displays all spoken words in natural sentence/clause units with real-time
 * word-by-word karaoke highlighting.
 */
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK_THEME, FONT_SUBTITLE } from "../../projects/interstellar/theme";
import { EMPHASIS_WORDS, SUBTITLE_PHRASES } from "../../projects/interstellar/subtitles";

export type SubtitleLayerProps = {
  /** ms offset of the narration inside the composition */
  narrationOffsetMs: number;
  /** canvas size */
  width: number;
  height: number;
  /** subtitle anchor: center-x, baseline-y (absolute canvas px) */
  baselineY?: number;
  fontSize?: number;
};

export const SubtitleLayer: React.FC<SubtitleLayerProps> = ({
  narrationOffsetMs,
  width,
  height,
  baselineY,
  fontSize = 46,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioMs = (frame * 1000) / fps - narrationOffsetMs;

  // Find active phrase
  const activeIndex = SUBTITLE_PHRASES.findIndex((p, idx) => {
    const next = SUBTITLE_PHRASES[idx + 1];
    const holdUntil = next && next.startMs - p.endMs < 450 ? next.startMs : p.endMs + 200;
    return audioMs >= p.startMs - 50 && audioMs < holdUntil;
  });

  if (activeIndex === -1) return null;

  const phrase = SUBTITLE_PHRASES[activeIndex];
  const nextPhrase = SUBTITLE_PHRASES[activeIndex + 1];
  const holdUntil =
    nextPhrase && nextPhrase.startMs - phrase.endMs < 450
      ? nextPhrase.startMs
      : phrase.endMs + 200;

  // Entry and exit transitions for the phrase card
  const entryProgress = interpolate(audioMs - phrase.startMs, [0, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exitProgress = interpolate(audioMs - (holdUntil - 70), [0, 70], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phraseOpacity = Math.min(entryProgress, exitProgress);
  const phraseScale = interpolate(entryProgress, [0, 1], [0.96, 1.0]);

  // Position: lower third safe zone
  const y = baselineY ?? Math.round(height * 0.71); // ~1363px on 1920
  const maxWidth = Math.min(width - 160, 920);

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
          maxWidth,
          backgroundColor: "rgba(10, 18, 40, 0.78)",
          borderRadius: 22,
          padding: "12px 28px",
          border: "1.5px solid rgba(199, 215, 255, 0.18)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px 12px",
          opacity: phraseOpacity,
          transform: `scale(${phraseScale})`,
          transition: "transform 0.08s ease-out",
        }}
      >
        {phrase.words.map((w, wIdx) => {
          const isActive = audioMs >= w.startMs - 30 && audioMs < w.endMs + 30;
          const isPast = audioMs >= w.endMs;
          const isEmphasized = EMPHASIS_WORDS.has(w.text);

          let color: string = DARK_THEME.text;
          let weight = 600;
          let opacity = 0.65;
          let bg = "transparent";
          let scale = 1.0;
          let textShadow = "none";

          if (isActive) {
            color = isEmphasized ? DARK_THEME.accent : "#FFFFFF";
            weight = 800;
            opacity = 1.0;
            bg = isEmphasized ? "rgba(232, 67, 58, 0.28)" : "rgba(255, 255, 255, 0.16)";
            scale = 1.08;
            textShadow = isEmphasized
              ? "0 0 14px rgba(232, 67, 58, 0.6)"
              : "0 0 12px rgba(255, 255, 255, 0.45)";
          } else if (isPast) {
            color = isEmphasized ? DARK_THEME.accent : "#FFFFFF";
            weight = 700;
            opacity = 0.95;
          }

          return (
            <span
              key={`${phrase.id}-${wIdx}-${w.text}`}
              style={{
                fontFamily: FONT_SUBTITLE,
                fontWeight: weight,
                fontSize,
                lineHeight: 1.25,
                color,
                opacity,
                backgroundColor: bg,
                borderRadius: 8,
                padding: "2px 8px",
                transform: `scale(${scale})`,
                textShadow,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
