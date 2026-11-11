/**
 * ProjectionWindow — digital interface window (Ref 4 style chrome bar)
 * for the "layar raksasa / jendela kokpit" beat. Hosts B-roll or a screen
 * recording-like image; chrome dots + address strip; border solidifies
 * with a boot animation and can expand to full-bleed via progress prop.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { OffthreadVideo } from "remotion";
import { staticFile } from "remotion";
import { COLORS, FONT_PRIMARY } from "../../projects/interstellar/theme";

export type ProjectionWindowProps = {
  src: string;
  enterFrame: number;
  x: number;
  y: number;
  width: number;
  aspect: number;
  /** 0..1 — expanding morph (window -> full-bleed) progress */
  expand?: number;
  label?: string;
};

export const ProjectionWindow: React.FC<ProjectionWindowProps> = ({
  src,
  enterFrame,
  x,
  y,
  width,
  aspect,
  expand = 0,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.7 },
  });

  const w = width * interpolate(pop, [0, 1], [0.9, 1]);
  const h = w / aspect;
  const left = x;
  const top = y;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: w,
        opacity: interpolate(frame - enterFrame, [0, 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(12, 20, 44, 0.92)",
          borderRadius: interpolate(expand, [0, 1], [14, 0]),
          border: "2px solid rgba(199,215,255,0.35)",
          overflow: "hidden",
          height: h,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 60px rgba(5,10,24,0.6)",
        }}
      >
        {/* chrome bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            backgroundColor: "rgba(199,215,255,0.08)",
            borderBottom: "1px solid rgba(199,215,255,0.2)",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === 0 ? COLORS.red : "rgba(199,215,255,0.4)",
              }}
            />
          ))}
          {label ? (
            <div
              style={{
                marginLeft: 10,
                fontFamily: FONT_PRIMARY,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "0.22em",
                color: "rgba(199,215,255,0.75)",
                textTransform: "uppercase",
              }}
            >
              {label}
            </div>
          ) : null}
        </div>
        {/* screen */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <OffthreadVideo
            muted
            src={staticFile(src)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* scanline sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "repeating-linear-gradient(0deg, rgba(199,215,255,0.030) 0px, rgba(199,215,255,0.03) 2px, transparent 2px, transparent 5px)",
            }}
          />
        </div>
      </div>
    </div>
  );
};
