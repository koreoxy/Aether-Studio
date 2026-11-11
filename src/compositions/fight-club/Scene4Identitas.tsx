/**
 * Scene 4 — IDENTITAS
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { KineticHeadline } from "../../components/KineticTypography/KineticHeadline";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { DARK_THEME } from "../../projects/fight-club/theme";

export const Scene4Identitas: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.mirror}
        durationFrames={272}
        enterFrame={0}
        push
        pushScale={0.15}
      />

      <div
        style={{
          position: "absolute",
          left: 90,
          top: 300,
          width: 900,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CollageCard
          src={CONFIG.assets.images.poster}
          enterFrame={10}
          width={500}
          aspect={0.67}
          frameBg="#FFFFFF"
          framePad={14}
          rotate={-1.2}
          from="pop"
          drift={2}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 1080, width: 830 }}>
        <KineticHeadline
          kicker="BUKAN SEKADAR"
          lines={["KEKOSONGAN &", "IDENTITAS."]}
          enterFrame={107}
          size={64}
          redRule
        />
      </div>
    </AbsoluteFill>
  );
};
