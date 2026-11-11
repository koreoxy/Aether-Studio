/**
 * Scene 6 — CTA (frames 0–208 relative; abs 1621–1829)
 * "Jadi menurutmu, adegan Interstellar mana yang paling membekas?
 *  Tulis di komentar."
 *
 * Papercut astronaut-gazing art full-bleed; RATING PRIBADI stamp;
 * question headline; red CTA chip with gentle pulse on the tail hold.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { KineticHeadline } from "../../components/KineticTypography/KineticHeadline";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { DARK_THEME } from "../../projects/interstellar/theme";

const fb = CONFIG.assets.fullBleed;

const R = {
  rating: 10, // 54.4s
  question: 30, // 55.16s "adegan"
  cta: 110, // 57.7s "tulis di komentar"
  end: 209,
} as const;

export const Scene6Cta: React.FC = () => {
  const frame = useCurrentFrame();

  // gentle pulse on the CTA chip during the tail hold
  const pulse = 1 + 0.03 * Math.sin(((frame - R.cta) / 9) * Math.PI);

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      <FilmClip
        src={fb.gargantua}
        durationFrames={R.end}
        enterFrame={0}
        fadeInFrames={16}
        push
        pushScale={0.07}
      />
      {/* legibility guard over the footage */}
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(20,30,60,0.62) 0%, rgba(20,30,60,0.35) 45%, rgba(20,30,60,0.66) 100%)",
        }}
      />

      {/* RATING PRIBADI stamp */}
      <div style={{ position: "absolute", left: 70, top: 300 }}>
        <StampChip
          text="RATING PRIBADI"
          enterFrame={R.rating}
          variant="solid"
          bg={DARK_THEME.text}
          color={DARK_THEME.navy}
          fontSize={36}
          rotate={-1.2}
          tracking={6}
        />
      </div>

      {/* question headline */}
      <div style={{ position: "absolute", left: 70, top: 620, width: 830 }}>
        <KineticHeadline
          kicker="MENURUTMU"
          lines={["ADEGAN MANA YANG", "PALING", "MEMBEKAS?"]}
          enterFrame={R.question}
          size={84}
          redRule
        />
      </div>

      {/* red CTA chip, lands on "tulis di komentar." */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1120,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          transform: `scale(${pulse})`,
        }}
      >
        <StampChip
          text="TULIS DI KOMENTAR ↓"
          enterFrame={R.cta}
          variant="solid"
          bg={DARK_THEME.accent}
          color="#FFFFFF"
          fontSize={46}
          tracking={5}
        />
      </div>
    </AbsoluteFill>
  );
};
