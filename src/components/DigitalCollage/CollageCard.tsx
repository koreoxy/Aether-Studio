/**
 * CollageCard — digital-collage editorial card (Reference 3 style).
 * Image inside a mounted frame (cream or navy) with:
 *  - drop shadow + thin border
 *  - slow continuous drift (paper float)
 *  - pop-in spring
 *  - optional handwritten strip caption below in Architects Daughter
 *  - optional stamp chip anchored to the card corner
 */
import React from "react";
import {
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { DARK_THEME, FONT_SECONDARY, FONT_PRIMARY } from "../../projects/interstellar/theme";

export type CollageCardProps = {
  src: string;
  enterFrame: number;
  width: number;
  aspect: number; // width / height
  frameBg?: string;
  framePad?: number;
  rotate?: number;
  /** enters from this direction: "up" | "down" | "left" | "right" | "pop" */
  from?: "up" | "down" | "left" | "right" | "pop";
  /** floating drift amplitude in px */
  drift?: number;
  caption?: {
    text: string;
    color?: string;
  };
  /** render the caption on ONE line, overflowing past the card's right edge */
  captionNowrap?: boolean;
  shadow?: boolean;
};

const DIRECTION: Record<NonNullable<CollageCardProps["from"]> | "zoom", { x: number; y: number }> = {
  up: { x: 0, y: 140 },
  down: { x: 0, y: -140 },
  left: { x: 260, y: 0 },
  right: { x: -260, y: 0 },
  pop: { x: 0, y: 0 },
  zoom: { x: 0, y: 0 },
};

/** video extensions — a card can host a pre-cut film loop instead of a photo */
const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".mkv"];
const isVideoSrc = (src: string) =>
  VIDEO_EXTS.some((e) => src.toLowerCase().endsWith(e));

export const CollageCard: React.FC<CollageCardProps> = ({
  src,
  enterFrame,
  width,
  aspect,
  frameBg = "#C7D7FF",
  framePad = 22,
  rotate = 0,
  from = "pop",
  drift = 0,
  caption,
  captionNowrap = false,
  shadow = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.9 },
  });
  const dir = DIRECTION[from];
  const slide = interpolate(pop, [0, 1], [1, 0]);
  const scale = interpolate(pop, [0, 1], [0.92, 1]);
  const t = frame - enterFrame;
  const settle = interpolate(t, [12, 28], [1.035, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const wobble = drift
    ? Math.sin((frame - enterFrame) / 26) * drift
    : 0;
  const driftY = drift ? Math.cos((frame - enterFrame) / 34) * drift * 0.7 : 0;

  return (
    <div
      style={{
        transform: `translate(${dir.x * slide}px, ${dir.y * slide + driftY}px)
          rotate(${rotate}deg) scale(${frame - enterFrame > 28 ? settle : scale})`,
        width,
        opacity: interpolate(frame - enterFrame, [0, 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        filter: shadow ? "drop-shadow(0 18px 30px rgba(8,14,32,0.5))" : undefined,
      }}
    >
      <div
        style={{
          backgroundColor: frameBg,
          padding: framePad,
          boxShadow: "inset 0 0 0 1px rgba(10,18,40,0.18)",
        }}
      >
        {isVideoSrc(src) ? (
          <OffthreadVideo
            muted
            src={staticFile(src)}
            style={{
              width: "100%",
              aspectRatio: `${aspect}`,
              objectFit: "cover",
              display: "block",
              transform: `scale(${interpolate(
                t,
                [0, 240],
                [1.045, 1.0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )})`,
              transformOrigin: "center",
            }}
          />
        ) : (
          <Img
            src={staticFile(src)}
            style={{
              width: "100%",
              aspectRatio: `${aspect}`,
              objectFit: "cover",
              display: "block",
              transform: `scale(${interpolate(
                t,
                [0, 240],
                [1.045, 1.0],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )})`,
              transformOrigin: "center",
            }}
          />
        )}
      </div>
      {caption ? (
        <div
          style={{
            // slight continuous wobble of the handwritten strip
            transform: `rotate(${wobble * 0.16}deg)`,
            marginTop: 12,
            fontFamily: FONT_SECONDARY,
            fontSize: 40,
            fontWeight: 400,
            color: caption.color ?? DARK_THEME.navy,
            letterSpacing: "0.01em",
            whiteSpace: captionNowrap ? "nowrap" : "pre-wrap",
            textAlign: "left",
            lineHeight: 1.1,
          }}
        >
          {caption.text}
        </div>
      ) : null}
    </div>
  );
};

/** Montserrat caption strip (non-handwritten) under card, UI-label style */
export const CardLabel: React.FC<{ text: string; color?: string; enterFrame: number }> = ({
  text,
  color = DARK_THEME.navy,
  enterFrame,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame - enterFrame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        marginTop: 10,
        fontFamily: FONT_PRIMARY,
        fontWeight: 600,
        fontSize: 22,
        letterSpacing: "0.14em",
        color,
        opacity,
        textTransform: "uppercase",
      }}
    >
      {text}
    </div>
  );
};
