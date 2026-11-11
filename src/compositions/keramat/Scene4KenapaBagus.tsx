/**
 * Scene 4 — KENAPA BAGUS (Keramat)
 * "Menurutku film ini bagus, karena bukan sekadar direkam mentah pakai
 *  kamera. Kelihatan banget mereka paham cara merekam dengan kamera itu.
 *  Goyangannya, sudut pandangnya, momen kamera telat nyorot sesuatu,
 *  semuanya kerasa kayak beneran dipegang orang."
 * Three beats: typography verdict -> camcorder footage + image card ->
 * technique chips over the locked candle-room shot.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME, FONT_SECONDARY } from "../../projects/keramat/theme";
import { F } from "../../projects/keramat/scenes";

const B2 = F.s4b - F.scene3; // "Karena bukan sekadar..."
const B3 = F.s4c - F.scene3; // "Goyangannya, sudut pandangnya..."

const TECH_CHIPS: Array<{ text: string; enter: number }> = [
  { text: "GOYANGANNYA", enter: 8 },
  { text: "SUDUT PANDANGNYA", enter: 46 },
  { text: "TELAT NYOROT", enter: 86 },
];

export const Scene4KenapaBagus: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* beat 1 — the verdict, pure typography */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 700,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT_SECONDARY,
          fontSize: 52,
          color: "rgba(199, 215, 255, 0.9)",
          transform: "rotate(-2.4deg)",
        }}
      >
        menurutku,
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
          word="BAGUS."
          enterFrame={18}
          size={160}
          accentColor={DARK_THEME.accent}
          redWord
          burst
        />
      </div>

      {/* beat 2 — camcorder footage + camcorder image collage */}
      <FilmClip
        src={CONFIG.assets.fullBleed.camcorderSleep}
        durationFrames={B3 - B2}
        enterFrame={B2}
        push
        pushScale={0.09}
        fadeInFrames={8}
      />
      {/* camcorder image — centered horizontally in the safe zone */}
      <div style={{ position: "absolute", left: 375, top: 350 }}>
        <CollageCard
          src={CONFIG.assets.images.camcorder}
          enterFrame={B2 + 14}
          width={330}
          aspect={768 / 1376}
          frameBg={DARK_THEME.navy}
          framePad={16}
          rotate={3}
          from="left"
          drift={2.2}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1060,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StampChip
          text="BUKAN MENTAH-MENTAHAN"
          enterFrame={B2 + 30}
          variant="bracket"
          fontSize={28}
          tracking={4}
          color={DARK_THEME.text}
        />
      </div>

      {/* beat 3 — technique chips over the locked candle-room shot */}
      <FilmClip
        src={CONFIG.assets.fullBleed.candleRoom}
        durationFrames={F.scene4 - F.scene3 - B3}
        enterFrame={B3}
        push
        pushScale={0.07}
        fadeInFrames={8}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.42) 0%, rgba(10,18,40,0.08) 40%, rgba(10,18,40,0.5) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 700,
          width: 1080,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          alignItems: "center",
        }}
      >
        {TECH_CHIPS.map((chip) => (
          <StampChip
            key={chip.text}
            text={chip.text}
            enterFrame={B3 + chip.enter}
            variant="box"
            color={DARK_THEME.text}
            fontSize={34}
            tracking={4}
          />
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1120,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT_SECONDARY,
          fontSize: 42,
          color: "rgba(199, 215, 255, 0.9)",
          transform: "rotate(-1.8deg)",
          opacity: interpolate(
            frame - B3 - 100,
            [0, 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
        }}
      >
        kerasa kayak beneran dipegang orang
      </div>
    </AbsoluteFill>
  );
};
