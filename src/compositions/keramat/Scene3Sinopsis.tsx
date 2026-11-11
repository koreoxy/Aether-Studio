/**
 * Scene 3 — SINOPSIS (Keramat)
 * "Ceritanya tentang sebuah kru film yang berangkat ke Yogyakarta untuk
 *  syuting. Awalnya biasa aja, cuma kerja dan ngerekam. Tapi di tengah
 *  perjalanan, mulai ada hal-hal aneh yang nggak mereka mau. Dan semua itu
 *  kerekam kamera."
 * Three beats: journey card + route line -> crew full-bleed -> anomaly + red splash.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME, FONT_PRIMARY } from "../../projects/keramat/theme";
import { F } from "../../projects/keramat/scenes";

const B2 = F.s3b - F.scene2; // local frame of "Awalnya biasa aja..."
const B3 = F.s3c - F.scene2; // local frame of "Tapi di tengah perjalanan..."

/** Beat 1 — journey: train card + animated route line (unmounts at B2) */
const Beat1Journey: React.FC = () => {
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, top: 270 }}>
        <StampChip
          text="KRU FILM"
          enterFrame={6}
          variant="bracket"
          fontSize={26}
          tracking={5}
          color={DARK_THEME.text}
        />
      </div>

      <div style={{ position: "absolute", left: 100, top: 470 }}>
        <CollageCard
          src={CONFIG.assets.cards.train}
          enterFrame={8}
          width={620}
          aspect={16 / 9}
          frameBg={DARK_THEME.navy}
          framePad={18}
          rotate={-2}
          from="up"
          drift={2}
          caption={{ text: "berangkat ke Yogyakarta", color: "rgba(199, 215, 255, 0.85)" }}
        />
      </div>

      {/* route line JAKARTA -> YOGYAKARTA */}
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 1150,
          width: 830,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: FONT_PRIMARY,
            fontWeight: 800,
            fontSize: 38,
            letterSpacing: "0.06em",
            color: DARK_THEME.text,
            opacity: 0.92,
          }}
        >
          JKT
        </div>
        <svg width={360} height={26} viewBox="0 0 360 26">
          <line
            x1={6}
            y1={13}
            x2={354}
            y2={13}
            stroke={DARK_THEME.accent}
            strokeWidth={4}
            strokeDasharray="16 12"
            strokeLinecap="round"
          />
        </svg>
        <div
          style={{
            fontFamily: FONT_PRIMARY,
            fontWeight: 900,
            fontSize: 38,
            letterSpacing: "0.04em",
            color: DARK_THEME.accent,
          }}
        >
          YOGYA
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Scene3Sinopsis: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* beat 1 — journey (unmounts when beat 2 starts) */}
      <Sequence from={0} durationInFrames={B2} name="s3-beat1-journey">
        <Beat1Journey />
      </Sequence>

      {/* beat 2 — crew at work: full-bleed crew house */}
      <FilmClip
        src={CONFIG.assets.fullBleed.crewHouse}
        durationFrames={B3 - B2}
        enterFrame={B2}
        push
        pushScale={0.09}
        fadeInFrames={8}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1000,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StampChip
          text="KERJA + NGEREKAM"
          enterFrame={B2 + 16}
          variant="solid"
          accentBg={DARK_THEME.accent}
          color="#FFFFFF"
          fontSize={32}
          tracking={4}
        />
      </div>

      {/* beat 3 — anomalies begin: full-bleed anomaly + red splash */}
      <FilmClip
        src={CONFIG.assets.fullBleed.anomaly}
        durationFrames={F.scene3 - F.scene2 - B3}
        enterFrame={B3}
        push
        pushScale={0.1}
        fadeInFrames={8}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.35) 0%, rgba(10,18,40,0) 34%, rgba(10,18,40,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="ANEH."
          enterFrame={B3 + 38}
          size={140}
          accentColor={DARK_THEME.accent}
          redWord
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1030,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <StampChip
          text="TEREKAM KAMERA"
          enterFrame={B3 + 130}
          variant="box"
          color={DARK_THEME.text}
          fontSize={30}
          tracking={4}
        />
      </div>
    </AbsoluteFill>
  );
};
