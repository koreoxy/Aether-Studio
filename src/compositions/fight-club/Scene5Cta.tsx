/**
 * Scene 5 — CTA
 */
import React from "react";
import { AbsoluteFill, staticFile } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { DARK_THEME } from "../../projects/fight-club/theme";

export const Scene5Cta: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.punch}
        durationFrames={400}
        enterFrame={0}
        push
        pushScale={0.05}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      
      <div style={{ position: "absolute", left: 0, top: 240, width: "100%", display: "flex", justifyContent: "center" }}>
        <img src={staticFile(CONFIG.assets.images.logo)} style={{ width: 500 }} />
      </div>

      <div style={{ position: "absolute", left: 0, top: 1050, width: "100%", display: "flex", justifyContent: "center" }}>
        <WordSplash
          word="WATCH NOW."
          enterFrame={180}
          size={95}
          accentColor={DARK_THEME.accent}
          redWord
        />
      </div>
    </AbsoluteFill>
  );
};
