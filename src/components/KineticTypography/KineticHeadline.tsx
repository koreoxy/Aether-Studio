/**
 * KineticHeadline — stacked editorial headlines for the Interstellar
 * production. Montserrat ExtraBold/Black, small kicker above, optional
 * red rule. Lines reveal with a mask-slide + settling scale.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK_THEME, FONT_PRIMARY } from "../../projects/interstellar/theme";

export type KineticHeadlineProps = {
  lines: string[];
  /** smaller kicker line rendered above (e.g. "KARYA") */
  kicker?: string;
  /** absolute frame the headline appears at (relative to parent Sequence) */
  enterFrame?: number;
  size?: number;
  /* multi-line: each entry can carry its own pop delay in frames */
  stagger?: number;
  align?: "left" | "center";
  color?: string;
  kickerColor?: string;
  /** red underline bar below the last line */
  redRule?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
};

export const KineticHeadline: React.FC<KineticHeadlineProps> = ({
  lines,
  kicker,
  enterFrame = 0,
  size = 92,
  stagger = 5,
  align = "left",
  color = DARK_THEME.text,
  kickerColor = DARK_THEME.text,
  redRule = false,
  letterSpacing = -0.02,
  lineHeight = 1.02,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineAnim = (idx: number) => {
    const l = enterFrame + idx * stagger;
    const slide = interpolate(frame - l, [0, 14], [110, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: (e) => 1 - Math.pow(1 - e, 3),
    });
    const scale = spring({
      frame: frame - l,
      fps,
      config: { damping: 14, stiffness: 130, mass: 0.6 },
    });
    return { slide: interpolate(frame - l, [-1, 0], [110, 110]), y: slide, scale };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : "flex-start",
        gap: 6,
      }}
    >
      {kicker ? (
        <div
          style={{
            fontFamily: FONT_PRIMARY,
            fontWeight: 600,
            fontSize: 30,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: kickerColor,
            opacity: interpolate(frame - enterFrame, [0, 10], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {kicker}
        </div>
      ) : null}
      {lines.map((line, idx) => {
        const { y, scale } = lineAnim(idx);
        return (
          <div
            key={idx}
            style={{
              overflow: "hidden",
              display: "block",
              textAlign: align === "center" ? "center" : "left",
            }}
          >
            <div
              style={{
                transform: `translateY(${y}%) scale(${0.94 + scale * 0.06})`,
                transformOrigin: "left bottom",
                fontFamily: FONT_PRIMARY,
                fontWeight: 800,
                fontSize: size,
                letterSpacing: `${letterSpacing}em`,
                lineHeight,
                color,
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          </div>
        );
      })}
      {redRule ? (
        <div
          style={{
            width: interpolate(
              frame - enterFrame - lines.length * stagger,
              [0, 12],
              [0, 160],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
            height: 10,
            backgroundColor: DARK_THEME.accent,
            marginTop: 10,
          }}
        />
      ) : null}
    </div>
  );
};
