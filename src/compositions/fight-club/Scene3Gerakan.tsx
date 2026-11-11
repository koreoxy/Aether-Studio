/**
 * Scene 3 — GERAKAN
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { DARK_THEME } from "../../projects/fight-club/theme";

const R = {
  tyler: 15,
  crowd: 185,
  ideologi: 180,
  gerakan: 210,
};

export const Scene3Gerakan: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={CONFIG.assets.fullBleed.movement}
        durationFrames={384}
        enterFrame={0}
        push
        pushScale={0.1}
      />

      {/* BEAT 1: Tyler Durden */}
      {frame < R.crowd ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 260,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <CollageCard
              src={CONFIG.assets.images.bradpit}
              enterFrame={R.tyler}
              width={520}
              aspect={0.7}
              frameBg={DARK_THEME.panelAlt}
              framePad={12}
              rotate={0}
              from="pop"
              drift={2}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "Montserrat",
                fontWeight: 900,
                fontSize: 48,
                color: "#FFFFFF",
                textShadow: "0 4px 16px rgba(0,0,0,0.85)",
                letterSpacing: "0.08em",
              }}
            >
              TYLER DURDEN
            </div>
          </div>
        </div>
      ) : (
        /* BEAT 2: Crowd */
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 220,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CollageCard
            src={CONFIG.assets.images.crowd}
            enterFrame={R.crowd}
            width={480}
            aspect={0.558}
            frameBg="#FFFFFF"
            framePad={14}
            rotate={-1.5}
            from="pop"
            drift={2.5}
          />
        </div>
      )}

      <div style={{ position: "absolute", left: 70, top: 1020 }}>
        <StampChip
          text="IDEOLOGI"
          enterFrame={R.ideologi}
          variant="solid"
          bg={DARK_THEME.accent}
          color="#FFFFFF"
          fontSize={40}
          tracking={8}
        />
      </div>

      <div style={{ position: "absolute", left: 70, top: 1120, width: 830 }}>
        <WordSplash
          word="GERAKAN."
          enterFrame={R.gerakan}
          size={130}
          accentColor={DARK_THEME.accent}
          align="left"
        />
      </div>
    </AbsoluteFill>
  );
};
