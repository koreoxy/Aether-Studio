/**
 * FlashTransition — high-intensity camera flash transition with camera shutter.
 * Fills or strongly brightens frame at peak, hides cut, then rapidly fades.
 * Duration: typically 4-8 frames at 30fps.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";

export type FlashTransitionProps = {
  flashFrame: number;
  durationFrames?: number;
  color?: string;
};

export const FlashTransition: React.FC<FlashTransitionProps> = ({
  flashFrame,
  durationFrames = 6,
  color = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const half = Math.floor(durationFrames / 2);

  if (frame < flashFrame - half || frame > flashFrame + half) {
    return null;
  }

  // Rapid rise to full white, snappy fade out
  const opacity = interpolate(
    frame,
    [flashFrame - half, flashFrame, flashFrame + half],
    [0, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: color,
        opacity,
        zIndex: 999,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
};
