/**
 * FilmClip — B-roll renderer for the Interstellar production.
 * Uses OffthreadVideo for deterministic frame-accurate rendering.
 * All processed clips are pre-cut so playback starts at the intended moment.
 *
 *  - full-bleed vertical files render 1080x1920 as-is
 *  - letterboxed card files render inside an editorial window
 */
import React from "react";
import {
  OffthreadVideo,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
} from "remotion";

export type FilmClipProps = {
  src: string;
  /** plays from file start; must be true for pre-cut segments */
  srcMeta?: undefined;
  style?: React.CSSProperties;
  /** subtle ken-burns push over the clip's duration */
  push?: boolean;
  pushScale?: number;
  /** opacity fade-in / fade-out in frames */
  fadeInFrames?: number;
  fadeOutFrames?: number;
  durationFrames: number;
  enterFrame?: number;
};

export const FilmClip: React.FC<FilmClipProps> = ({
  src,
  style,
  push = true,
  pushScale = 0.06,
  fadeInFrames = 0,
  fadeOutFrames = 0,
  durationFrames,
  enterFrame = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - enterFrame;
  const opacity =
    interpolateOpacity(t, fadeInFrames, durationFrames, fadeOutFrames);
  const scale = push
    ? 1 + pushScale * clamp01(t / Math.max(durationFrames, 1))
    : 1;
  const intro = spring({
    frame: t,
    fps,
    config: { damping: 15, stiffness: 110, mass: 0.8 },
  });
  const introScale = interpolate(intro, [0, 1], [1.03, 1.0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity,
        ...style,
      }}
    >
      <OffthreadVideo
        muted
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${push ? scale * introScale : introScale})`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
};

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

const interpolateOpacity = (
  t: number,
  fadeIn: number,
  total: number,
  fadeOut: number,
): number => {
  if (t < 0) return 0;
  const inO = fadeIn > 0 ? clamp01(t / fadeIn) : 1;
  const outO = fadeOut > 0 ? clamp01((total - t) / fadeOut) : 1;
  return Math.min(inO, outO);
};
