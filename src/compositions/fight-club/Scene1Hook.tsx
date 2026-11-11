/**
 * Scene 1 — HOOK (Fight Club)
 * "The first rule of Fight Club..."
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { DARK_THEME } from "../../projects/fight-club/theme";

export const Scene1Hook: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.punch}
        durationFrames={186}
        enterFrame={0}
        push
        pushScale={0.12}
      />
      
      {/* Editorial stamp */}
      <div style={{ position: "absolute", left: 70, top: 250 }}>
        <StampChip
          text="FIGHT CLUB • 1999"
          enterFrame={0}
          variant="bracket"
          fontSize={28}
          tracking={6}
          color={DARK_THEME.text}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 800,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="FIGHT CLUB."
          enterFrame={37}
          size={130}
          accentColor={DARK_THEME.accent}
          burst
        />
      </div>
    </AbsoluteFill>
  );
};
