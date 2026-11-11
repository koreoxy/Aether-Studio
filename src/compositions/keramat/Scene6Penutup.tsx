/**
 * Scene 6 — PENUTUP (Keramat)
 * "Jadi kamu cuma bisa ikut nonton, sambil berharap kameranya nggak
 *  nengok ke arah yang salah."
 * Tape backdrop (the SCENE 06 tape) + logo + handwritten closing line.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME, FONT_SECONDARY } from "../../projects/keramat/theme";
import { F } from "../../projects/keramat/scenes";

export const Scene6Penutup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoPop = spring({
    frame: frame - 12,
    fps,
    config: { damping: 13, stiffness: 120, mass: 0.8 },
  });
  const logoScale = interpolate(logoPop, [0, 1], [0.9, 1]);
  const logoOpacity = interpolate(frame - 12, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const noteEnter = F.s6b - F.scene5; // local frame of "sambil berharap..."
  const noteOpacity = interpolate(frame - noteEnter + 4, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* the SCENE 06 tape as backdrop */}
      <FilmClip
        src={CONFIG.assets.fullBleed.doorwayEarly}
        durationFrames={CONFIG.durationInFrames - F.scene5}
        enterFrame={0}
        push
        pushScale={0.08}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(10, 18, 40, 0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.4) 0%, rgba(10,18,40,0.05) 34%, rgba(10,18,40,0.6) 100%)",
        }}
      />

      <div style={{ position: "absolute", left: 70, top: 270 }}>
        <StampChip
          text="REVIEW • KERAMAT (2009)"
          enterFrame={18}
          variant="bracket"
          fontSize={26}
          tracking={5}
          color={DARK_THEME.text}
        />
      </div>

      {/* logo end card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 560,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
        }}
      >
        <Img
          src={staticFile(CONFIG.assets.images.logo)}
          style={{ width: 620, height: "auto", display: "block" }}
        />
      </div>

      {/* handwritten closing line appears with the narration */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1070,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT_SECONDARY,
          fontSize: 48,
          lineHeight: 1.3,
          color: "rgba(199, 215, 255, 0.95)",
          transform: "rotate(-2deg)",
          opacity: noteOpacity,
        }}
      >
        {"berharap kameranya nggak\nnengok ke arah yang salah."}
      </div>
    </AbsoluteFill>
  );
};
