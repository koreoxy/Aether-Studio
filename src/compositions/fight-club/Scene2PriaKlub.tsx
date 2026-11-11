/**
 * Scene 2 — PRIA & KLUB
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { KineticHeadline } from "../../components/KineticTypography/KineticHeadline";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { DARK_THEME } from "../../projects/fight-club/theme";

export const Scene2PriaKlub: React.FC = () => {

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.basement}
        durationFrames={230}
        enterFrame={0}
        push
        pushScale={0.08}
      />
      
      <div
        style={{
          position: "absolute",
          left: 90,
          top: 350,
          width: 900,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CollageCard
          src={CONFIG.assets.images.bradEdward}
          enterFrame={20}
          width={700}
          aspect={1.2}
          frameBg="#FFFFFF"
          framePad={16}
          rotate={-2}
          from="pop"
          drift={3}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 1020, width: 830 }}>
        <KineticHeadline
          kicker="MEMBENTUK"
          lines={["KLUB", "PERTARUNGAN."]}
          enterFrame={45}
          size={90}
        />
      </div>
    </AbsoluteFill>
  );
};
