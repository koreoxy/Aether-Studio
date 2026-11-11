/**
 * StampChip — boxed label (Reference 1 style) and bracket-stat style.
 * Used for stamps like [COOPER], [1 JAM], chips like "DITANAM ASLI".
 * Appears with a quick scale-settle + optional rotation like a real stamp.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DARK_THEME, FONT_PRIMARY } from "../../projects/interstellar/theme";

export type StampChipProps = {
  text: React.ReactNode;
  enterFrame: number;
  variant?: "box" | "bracket" | "solid";
  color?: string;
  bg?: string;
  accentBg?: string;
  fontSize?: number;
  rotate?: number;
  tracking?: number;
};

export const StampChip: React.FC<StampChipProps> = ({
  text,
  enterFrame,
  variant = "box",
  color = DARK_THEME.text,
  bg = "transparent",
  accentBg,
  fontSize = 30,
  rotate = 0,
  tracking = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 12, stiffness: 170, mass: 0.5 },
  });
  const scale = interpolate(pop, [0, 1], [1.35, 1.0]);
  const opacity = interpolate(frame - enterFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isBracket = variant === "bracket";
  const filler = accentBg ?? bg;

  const style: React.CSSProperties =
    variant === "solid"
      ? {
          backgroundColor: filler,
          color,
        }
      : {
          border: isBracket ? "none" : `3px solid ${color}`,
          color,
          backgroundColor: bg,
        };

  return (
    <div
      style={{
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        opacity,
        display: "inline-flex",
        alignItems: "baseline",
        padding: variant === "solid" ? "8px 18px" : "6px 14px",
        fontFamily: FONT_PRIMARY,
        fontWeight: 800,
        fontSize,
        letterSpacing: `${tracking / fontSize}em`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {isBracket ? <span style={{ fontWeight: 400, marginRight: 8 }}>[</span> : null}
      {text}
      {isBracket ? <span style={{ fontWeight: 400, marginLeft: 8 }}>]</span> : null}
    </div>
  );
};
