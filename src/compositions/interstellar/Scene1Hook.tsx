/**
 * Scene 1 — HOOK (frames 0–142 relative)
 * "Film luar angkasa ini terasa begitu nyata, karena sebagian besar
 *  memang dibuat nyata."
 *
 * Cinematic cold-open, three beats:
 *   A. full-bleed Saturn close-up (hard in)
 *   B. Endurance ring station editorial band card (slides in)
 *   C. Gargantua money shot full-bleed + giant "NYATA." splash
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { HOOK_CUTS } from "../../projects/interstellar/scenes";
import { DARK_THEME } from "../../projects/interstellar/theme";

const fb = CONFIG.assets.fullBleed;
const cards = CONFIG.assets.cards;

const clampN = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));

export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // BEAT B visibility (after Saturn, before Gargantua)
  const beatBIn = clampN((frame - HOOK_CUTS.endurance) / 4);
  const beatBOut = 1 - clampN((frame - HOOK_CUTS.gargantua) / 4);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* BEAT A — Saturn close-up, full-bleed with faster zoom */}
      <FilmClip
        src={fb.hookSaturn}
        durationFrames={HOOK_CUTS.endurance}
        enterFrame={0}
        push
        pushScale={0.22}
      />

      {/* opening stamp badge so start is never blank */}
      <div style={{ position: "absolute", left: 70, top: 220 }}>
        <StampChip
          text="INTERSTELLAR • NYATA"
          enterFrame={0}
          variant="bracket"
          fontSize={28}
          tracking={6}
          color={DARK_THEME.text}
        />
      </div>

      {/* BEAT B — Endurance editorial band with dynamic zoom */}
      <AbsoluteFill style={{ opacity: beatBIn * beatBOut }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 650,
            width: 1080,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CollageCard
            src={cards.hookEndurance}
            enterFrame={HOOK_CUTS.endurance}
            width={920}
            aspect={2.42}
            frameBg="transparent"
            framePad={0}
            from="zoom"
            drift={2}
            shadow={false}
          />
          <div
            style={{
              position: "absolute",
              right: 80,
              bottom: 30,
              fontFamily: "Montserrat",
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: "0.3em",
              color: "#FFFFFF",
              textShadow: "0 4px 20px rgba(0,0,0,0.8)",
              opacity: clampN((frame - HOOK_CUTS.endurance - 10) / 8),
            }}
          >
            ENDURANCE — ORBIT SATURNUS
          </div>
        </div>
      </AbsoluteFill>

      {/* BEAT C — Gargantua full-bleed with massive scale push */}
      <FilmClip
        src={fb.gargantua}
        durationFrames={143 - HOOK_CUTS.gargantua}
        enterFrame={HOOK_CUTS.gargantua}
        fadeInFrames={3}
        push
        pushScale={0.15}
      />

      {/* giant brand line, lands on the spoken word with earlier punch */}
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
          word="NYATA."
          enterFrame={55}
          size={240}
          accentColor={DARK_THEME.accent}
          burst
        />
      </div>
    </AbsoluteFill>
  );
};
