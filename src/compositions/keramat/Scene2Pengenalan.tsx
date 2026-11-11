/**
 * Scene 2 — PENGENALAN (Keramat)
 * "Keramat itu film found footage horror Indonesia, rilis tahun 2009,
 *  dan di-direct oleh Monty Tiwa."
 * Poster collage card + sequential fact chips + MEREKAM tape card.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME } from "../../projects/keramat/theme";

/** fact chips appear as the narration lists them */
const FACT_CHIPS: Array<{
  text: string;
  enter: number;
  variant: "box" | "bracket" | "solid";
}> = [
  { text: "FOUND FOOTAGE", enter: 30, variant: "box" },
  { text: "HOROR • INDONESIA", enter: 58, variant: "box" },
  { text: "2009", enter: 86, variant: "solid" },
  { text: "MONTY TIWA", enter: 122, variant: "bracket" },
];

export const Scene2Pengenalan: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* faint collage texture from the poster red */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px 700px at 22% 18%, rgba(139,26,20,0.28), rgba(33,48,87,0) 62%)",
        }}
      />

      <div style={{ position: "absolute", left: 70, top: 270 }}>
        <StampChip
          text="REVIEW • FILM INDONESIA"
          enterFrame={4}
          variant="bracket"
          fontSize={24}
          tracking={4}
          color={DARK_THEME.textSecondary}
        />
      </div>

      {/* poster collage card (380x562 source) */}
      <div style={{ position: "absolute", left: 70, top: 372 }}>
        <CollageCard
          src={CONFIG.assets.images.poster}
          enterFrame={10}
          width={356}
          aspect={380 / 562}
          frameBg="#C7D7FF"
          framePad={20}
          rotate={-3}
          from="up"
          drift={2.4}
          caption={{ text: "poster • 2009", color: "rgba(199, 215, 255, 0.85)" }}
        />
      </div>

      {/* fact chips stack — right column inside safe zone */}
      <div
        style={{
          position: "absolute",
          left: 502,
          top: 420,
          display: "flex",
          flexDirection: "column",
          gap: 34,
          alignItems: "flex-start",
        }}
      >
        {FACT_CHIPS.map((chip) => (
          <StampChip
            key={chip.text}
            text={chip.text}
            enterFrame={chip.enter}
            variant={chip.variant}
            accentBg={DARK_THEME.accent}
            color={
              chip.variant === "solid"
                ? "#FFFFFF"
                : chip.variant === "bracket"
                  ? DARK_THEME.textSecondary
                  : DARK_THEME.text
            }
            fontSize={33}
            tracking={3}
          />
        ))}
      </div>

      {/* MEREKAM tape card — the found-footage concept, pre-cut trailer loop,
       * centered; caption runs as a single line toward the right */}
      <div
        style={{
          position: "absolute",
          left: 289,
          top: 962,
        }}
      >
        <CollageCard
          src={CONFIG.assets.cards.merekam}
          enterFrame={132}
          width={470}
          aspect={16 / 9}
          frameBg={DARK_THEME.navy}
          framePad={16}
          rotate={2}
          from="pop"
          drift={1.6}
          captionNowrap
          caption={{ text: "semua itu terekam kamera", color: "rgba(199, 215, 255, 0.85)" }}
        />
      </div>
    </AbsoluteFill>
  );
};
