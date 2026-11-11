/**
 * Scene 1 — HOOK (Keramat)
 * "Pernah nonton film horor yang bikin kamu lupa kalau itu cuma film?
 *  Nah, Keramat itu salah satunya."
 * Full-bleed camcorder night footage + red kinetic splash + stamp chips.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME, FONT_SECONDARY } from "../../projects/keramat/theme";
import { F } from "../../projects/keramat/scenes";

export const Scene1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.hookWomen}
        durationFrames={F.scene1}
        enterFrame={0}
        push
        pushScale={0.1}
        fadeOutFrames={0}
      />

      {/* vignette for text readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.55) 0%, rgba(10,18,40,0) 26%, rgba(10,18,40,0) 55%, rgba(10,18,40,0.6) 100%)",
        }}
      />

      {/* editorial stamp — inside safe zone */}
      <div style={{ position: "absolute", left: 70, top: 270 }}>
        <StampChip
          text="REVIEW FILM HOROR"
          enterFrame={6}
          variant="bracket"
          fontSize={26}
          tracking={5}
          color={DARK_THEME.text}
        />
      </div>

      {/* kinetic splash — the hook word */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 620,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="HOROR."
          enterFrame={30}
          size={150}
          accentColor={DARK_THEME.accent}
          redWord
        />
      </div>

      {/* answer stamp appears on "Nah, Keramat itu salah satunya" */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1010,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StampChip
          text="KERAMAT (2009)"
          enterFrame={F.hookTurn + 4}
          variant="solid"
          accentBg={DARK_THEME.accent}
          color="#FFFFFF"
          fontSize={34}
          tracking={4}
        />
      </div>

      {/* handwritten aside */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1120,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT_SECONDARY,
          fontSize: 40,
          color: "rgba(199, 215, 255, 0.85)",
          transform: "rotate(-2deg)",
        }}
      >
        found footage horor Indonesia
      </div>
    </AbsoluteFill>
  );
};
