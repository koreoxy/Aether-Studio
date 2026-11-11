/**
 * Scene 3 — CERITA INTI (frames 0–504 relative; scene starts at abs 445)
 * "Di balik petualangan antargalaksinya, ini sebenarnya kisah ayah dan
 *  anak. Cooper harus pergi... Demi menyelamatkan umat manusia.
 *  Di planet tertentu, satu jam bisa berarti tahun-tahun di Bumi.
 *  Bayangkan menunggu ayahmu pulang selama itu."
 *
 * Cream editorial panel: farewell scene cards + handwritten notes,
 * name stamps, then the TIME sequence: papercut clock art with
 * bracket-stat "1 JAM = TAHUN" and the watch handover card as the
 * object that carries into the next scene register.
 */
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  useCurrentFrame,
  interpolate,
  spring,
  staticFile,
  useVideoConfig,
} from "remotion";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { DARK_THEME } from "../../projects/interstellar/theme";

const cards = CONFIG.assets.cards;
const imgs = CONFIG.assets.images;

const R = {
  title: 0,
  talkCard: 0, // 14.84s (immediately when scene 3 opens)
  kisahNote: 96, // 18.03s word "kisah"
  cooper: 137, // 19.4s
  murph: 227, // 22.4s
  hugCard: 213, // 21.95s
  timeArt: 311, // 25.2s
  satuJam: 353, // 26.6s
  berarti: 371,
  tahun: 386, // 27.72s
  bayangkan: 434, // 29.33s
  watchCard: 442, // 29.56s
  end: 505,
} as const;

const clampN = (v: number) => Math.max(0, Math.min(1, v));

/** flicking year counter for the "TAHUN" bracket: cycles 1..9 then TAHUN */
const YearCounter: React.FC<{ enterFrame: number; lockMs?: number }> = ({
  enterFrame,
  lockMs = 220,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - enterFrame;
  if (t < 0) return null;
  const flick = t < lockMs / (1000 / fps);
  const digits = [1, 3, 5, 7, 9];
  const active = digits[Math.floor(t / 4) % digits.length];
  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {flick ? active : "TAHUN"}
    </span>
  );
};

export const Scene3Cerita: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // card phase opacities
  const talkOpacity =
    clampN((frame - R.talkCard) / 6) * (1 - clampN((frame - R.hugCard) / 5));
  const hugOpacity =
    clampN((frame - R.hugCard) / 6) * (1 - clampN((frame - R.timeArt) / 6));
  const timeOpacity =
    clampN((frame - R.timeArt) / 8) * (1 - clampN((frame - R.bayangkan) / 8));
  const watchOpacity = clampN((frame - R.watchCard) / 7);

  const popIn = (enter: number) =>
    spring({
      frame: frame - enter,
      fps,
      config: { damping: 13, stiffness: 150, mass: 0.55 },
    });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.panelAlt }}>
      {/* scene title stamp */}
      <div style={{ position: "absolute", left: 70, top: 288 }}>
        <StampChip
          text="CERITA INTI"
          enterFrame={R.title}
          variant="bracket"
          fontSize={30}
          tracking={7}
          color={DARK_THEME.navy}
        />
      </div>

      {/* handwritten thematic note */}
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 382,
          transform: "rotate(-2.2deg)",
          fontFamily: "Architects Daughter",
          fontSize: 44,
          fontWeight: 400,
          color: DARK_THEME.accent,
          opacity: interpolate(frame, [R.kisahNote, R.kisahNote + 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        kisah ayah & anak
      </div>

      {/* ---------- footage phase: talk -> hug continuity ---------- */}
      {/* talk card */}
      <div
        style={{
          position: "absolute",
          left: 125,
          top: 786,
          width: 830,
          opacity: talkOpacity,
        }}
      >
        <div
          style={{
            border: `2px solid ${DARK_THEME.navy}`,
            padding: 0,
            boxShadow: "0 16px 34px rgba(10,18,40,0.28)",
          }}
        >
          <FilmInline src={cards.farewellTalk} w={830} />
        </div>
        <div style={{ position: "absolute", left: 18, top: 20 }}>
          <StampChip
            text="COOPER"
            enterFrame={R.cooper}
            variant="solid"
            bg={DARK_THEME.navy}
            color={DARK_THEME.text}
            fontSize={26}
            tracking={6}
          />
        </div>
        <div style={{ position: "absolute", right: 18, top: 20 }}>
          <StampChip
            text="MURPH"
            enterFrame={R.murph}
            variant="solid"
            bg={DARK_THEME.accent}
            color="#FFFFFF"
            fontSize={26}
            tracking={6}
          />
        </div>
      </div>

      {/* hug card (keeps emotional subject onscreen — connected) */}
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 776,
          width: 880,
          opacity: hugOpacity,
        }}
      >
        <FilmInline src={cards.farewellHug} w={880} />
      </div>

      {/* ---------- time phase: papercut clock + bracket stats ---------- */}
      <div
        style={{
          position: "absolute",
          left: 320,
          top: 500,
          width: 440,
          opacity: timeOpacity,
          transform: `translateY(${(1 - popIn(R.timeArt)) * 60}px)`,
        }}
      >
        <CollageCard
          src={imgs.papercutClock}
          enterFrame={R.timeArt}
          width={440}
          aspect={0.667}
          frameBg={DARK_THEME.navy}
          framePad={0}
          from="up"
          drift={3}
        />
      </div>

      {/* bracket stat row: [ 1 JAM ] = [ TAHUN ] */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 1220,
          width: 1080,
          display: "flex",
          justifyContent: "center",
          gap: 26,
          opacity: clampN((frame - R.satuJam) / 6),
        }}
      >
        <StampChip
          text="1 JAM"
          enterFrame={R.satuJam}
          variant="solid"
          bg={DARK_THEME.navy}
          color={DARK_THEME.text}
          fontSize={44}
          rotate={-1.2}
          tracking={5}
        />
        <div
          style={{
            fontFamily: "Montserrat",
            fontWeight: 800,
            fontSize: 54,
            color: DARK_THEME.navy,
            opacity: clampN((frame - R.berarti) / 4),
          }}
        >
          =
        </div>
        <StampChip
          enterFrame={R.tahun}
          variant="solid"
          bg={DARK_THEME.accent}
          color="#FFFFFF"
          fontSize={44}
          rotate={1.2}
          tracking={5}
          text=<YearCounter enterFrame={R.tahun} />
        />
      </div>

      {/* ---------- watch handover carries into next register ---------- */}
      <div
        style={{
          position: "absolute",
          left: 270,
          top: 560,
          width: 540,
          opacity: watchOpacity,
          transform: `translateY(${(1 - popIn(R.watchCard)) * 80}px)`,
        }}
      >
        <CollageCard
          src={cards.watchHandover}
          enterFrame={R.watchCard}
          width={540}
          aspect={1.0}
          frameBg={DARK_THEME.navy}
          framePad={10}
          from="pop"
          rotate={2}
        />
        <div
          style={{
            position: "absolute",
            left: 24,
            bottom: 24,
            fontFamily: "Architects Daughter",
            fontSize: 30,
            color: DARK_THEME.text,
            opacity: clampN((frame - R.watchCard - 16) / 8),
          }}
        >
          satu jam →
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* film strip inside Scene3 (letterboxed source, thin frame, cream panel look) */
const FilmInline: React.FC<{ src: string; w: number }> = ({ src, w }) => {
  return (
    <OffthreadVideo
      muted
      src={staticFile(src)}
      style={{
        width: w,
        height: Math.round(w / 2.39),
        objectFit: "cover",
        display: "block",
      }}
    />
  );
};
