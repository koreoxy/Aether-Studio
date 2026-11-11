/**
 * WordSplash — one giant kinetic word (interjection moments).
 * Scale-in 0.96 -> 1.04 overshoot -> settle 1.0 with spring.
 * Optional red period, red full word, and radial hairline burst
 * (Reference 1 style crosshair lines) behind the word.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK_THEME, FONT_PRIMARY } from "../../projects/interstellar/theme";

export type WordSplashProps = {
  word: string;
  enterFrame: number;
  size?: number;
  color?: string;
  accentColor: string;
  /** color the FULL word in accent red instead of the punctuation only */
  redWord?: boolean;
  /** draw hairline burst behind */
  burst?: boolean;
  align?: "center" | "left";
  letterSpacing?: number;
  fontFamilyExpression?: string;
};

export const WordSplash: React.FC<WordSplashProps> = ({
  word,
  enterFrame,
  size = 190,
  color = DARK_THEME.text,
  accentColor,
  redWord = false,
  burst = false,
  align = "center",
  letterSpacing = -0.03,
  fontFamilyExpression = FONT_PRIMARY,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 11, stiffness: 150, mass: 0.7 },
  });
  const scale = interpolate(pop, [0, 1], [0.96, 1.02]);
  const settle = interpolate(
    frame - enterFrame,
    [10, 26],
    [1.02, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = interpolate(frame - enterFrame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // split trailing punctuation for the red dot treatment
  const punct = /^[^.,!?]*([.,!?]+)$/.exec(word);
  const main = punct ? word.slice(0, punct[1].length ? -punct[1].length : word.length) : word;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: align === "center" ? "center" : "flex-start",
        width: "100%",
      }}
    >
      {burst ? (
        <div
          style={{
            position: "absolute",
            inset: -44,
            transform: `scale(${interpolate(
              frame - enterFrame,
              [0, 22],
              [0.7, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )})`,
            opacity,
          }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i * Math.PI) / 8 + 0.25;
              const [x1, y1] = [50 + 48 * Math.cos(a), 50 + 48 * Math.sin(a)];
              const [x2, y2] = [50 + 96 * Math.cos(a), 50 + 96 * Math.sin(a)];
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={DARK_THEME.text}
                  strokeOpacity={0.35}
                  strokeWidth={0.5}
                />
              );
            })}
          </svg>
        </div>
      ) : null}
      <div
        style={{
          transform: `scale(${frame - enterFrame > 26 ? settle : scale})`,
          transformOrigin: "center",
          fontFamily: fontFamilyExpression,
          fontWeight: 900,
          fontSize: size,
          letterSpacing: `${letterSpacing}em`,
          lineHeight: 1,
          opacity,
          color: redWord ? accentColor : color,
          whiteSpace: "nowrap",
          textAlign: align === "center" ? "center" : "left",
        }}
      >
        {main}
        {punct ? (
          <span
            style={{
              color: redWord ? color : accentColor,
            }}
          >
            {punct[1]}
          </span>
        ) : null}
      </div>
    </div>
  );
};
