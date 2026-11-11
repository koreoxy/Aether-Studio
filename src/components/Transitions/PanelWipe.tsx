/**
 * PanelWipe — connected scene-transition:
 * a full-frame panel in the target scene's background color slides in
 * from an edge, covers the cut between scenes, then continues out on the
 * other side revealing the next scene (S2 -> S3, cream, upward).
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type PanelWipeProps = {
  enterFrame: number;
  exitFrame: number;
  color: string;
  direction?: "up" | "down" | "left" | "right";
  width?: number;
  height?: number;
  /** frames each phase lasts */
  span?: number;
};

export const PanelWipe: React.FC<PanelWipeProps> = ({
  enterFrame,
  exitFrame,
  color,
  direction = "up",
  width = 1080,
  height = 1920,
  span = 14,
}) => {
  const frame = useCurrentFrame();
  if (frame === 8) console.log("PANEL_WIPE_FRAME8 enter", enterFrame, exitFrame);
  const quad = (e: number) => 1 - Math.pow(1 - e, 4);

  const inP = interpolate(frame, [enterFrame, enterFrame + span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: quad,
  });
  const outP = interpolate(frame, [exitFrame, exitFrame + span], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: quad,
  });

  // piecewise travel: enters from the edge, exits on the other side
  const travel =
    frame < exitFrame ? (1 - inP) * height : -outP * height;

  if (frame < enterFrame || frame > exitFrame + span) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 900,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {direction === "up" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            backgroundColor: color,
            transform: `translateY(${travel}px)`,
          }}
        />
      ) : direction === "down" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            backgroundColor: color,
            transform: `translateY(${-travel}px)`,
          }}
        />
      ) : direction === "left" ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            backgroundColor: color,
            transform: `translateX(${-travel}px)`,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            backgroundColor: color,
            transform: `translateX(${travel}px)`,
          }}
        />
      )}
    </div>
  );
};
