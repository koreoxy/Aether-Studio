/**
 * Scene 4 — SISI NYATA (frames 0–491 relative; scene starts at abs 950)
 * "Nolan sangat minim memakai CGI. Ladang jagungnya betul-betul ditanam.
 *  Pesawatnya memakai miniatur besar. Dan layar-layar raksasa dipakai
 *  untuk memproyeksikan pemandangan luar angkasa langsung ke jendela
 *  kokpit, jadi para aktor bereaksi pada hal yang benar-benar mereka
 *  lihat."
 *
 * Navy panel: CGI strike-through, corn + BTS photo cards with stamps,
 * then the projection-window moment escalating to full-bleed cockpit.
 */
import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { interpolate } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { ProjectionWindow } from "../../components/Broll/ProjectionWindow";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { DARK_THEME } from "../../projects/interstellar/theme";

const imgs = CONFIG.assets.images;
const cards = CONFIG.assets.cards;
const fb = CONFIG.assets.fullBleed;

const R = {
  chipTop: 13, // 32.1s "sangat"
  cgi: 57, // 33.59s "CGI,"
  cornCard: 76, // 34.22s
  asliStamp: 97, // 34.94s "ditanam,"
  cornOut: 133,
  miniCard: 141, // 36.39s "pesawatnya"
  miniStamp: 177, // 37.61s "miniatur besar."
  miniOut: 213,
  layar: 219, // 38.98s "Dan layar-layar..." FB bg + window
  windowLabel: 300,
  kokpitSwap: 338, // 42.94s window content -> helmet
  helmetBg: 330, // FB bg cross to helmets
  windowOut: 404, // 45.14s "para aktor" -> window collapse
  end: 492,
} as const;

const clampN = (v: number) => Math.max(0, Math.min(1, v));

export const Scene4SisiNyata: React.FC = () => {
  const frame = useCurrentFrame();

  const cornOpacity =
    clampN((frame - R.cornCard) / 6) * (1 - clampN((frame - R.cornOut) / 6));
  const miniOpacity =
    clampN((frame - R.miniCard) / 6) * (1 - clampN((frame - R.miniOut) / 6));

  const bgInstruments = clampN((frame - R.layar) / 12);
  const bgHelmets = clampN((frame - R.helmetBg) / 14);

  const windowWipe = clampN((frame - R.windowOut) / 22); // 0..1 collapse progress
  const windowAlive = frame >= R.layar;

  // CGI red strike draws across at the spoken word
  const strike = interpolate(frame, [R.cgi + 4, R.cgi + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* full-bleed backdrops behind cards */}
      {/* instrument panels (dark cockpit) */}
      <FilmClip
        src={fb.instrumentPanels}
        durationFrames={R.end - R.layar}
        enterFrame={R.layar}
        fadeInFrames={10}
        fadeOutFrames={10}
        push
        pushScale={0.05}
        style={{ opacity: bgInstruments * (1 - bgHelmets) }}
      />
      {/* helmet close-up, escalates to full-bleed while the window collapses */}
      <FilmClip
        src={fb.helmetCooper}
        durationFrames={R.end - R.helmetBg}
        enterFrame={R.helmetBg}
        fadeInFrames={12}
        push
        pushScale={0.09}
        style={{ opacity: bgHelmets }}
      />

      {/* ---------- phase 1: cards on navy ---------- */}
      <div style={{ position: "absolute", left: 70, top: 290 }}>
        <StampChip
          text="SANGAT MINIM"
          enterFrame={R.chipTop}
          variant="bracket"
          fontSize={32}
          tracking={7}
        />
      </div>

      {/* CGI splash with drawn strike */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 420,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="CGI"
          enterFrame={R.cgi}
          size={200}
          accentColor={DARK_THEME.accent}
          align="center"
        />
        <div
          style={{
            position: "absolute",
            left: 300,
            top: 96,
            width: 480,
            height: 0,
            transform: `scaleX(${strike})`,
            transformOrigin: "left center",
            borderTop: `12px solid ${DARK_THEME.accent}`,
          }}
        />
      </div>

      {/* corn photo card */}
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 720,
          width: 800,
          opacity: cornOpacity,
        }}
      >
        <CollageCard
          src={imgs.houseCorn}
          enterFrame={R.cornCard}
          width={800}
          aspect={1.83}
          frameBg="#C7D7FF"
          framePad={12}
          from="right"
          rotate={1.2}
        />
        <div style={{ position: "absolute", right: 26, top: 26 }}>
          <StampChip
            text="ASLI."
            enterFrame={R.asliStamp}
            variant="solid"
            bg={DARK_THEME.accent}
            color="#FFFFFF"
            fontSize={40}
            rotate={-2}
            tracking={6}
          />
        </div>
      </div>

      {/* BTS mini-lander photo card */}
      <div
        style={{
          position: "absolute",
          left: 105,
          top: 640,
          width: 870,
          opacity: miniOpacity,
        }}
      >
        <CollageCard
          src={imgs.miniLanderBts}
          enterFrame={R.miniCard}
          width={870}
          aspect={1.5}
          frameBg="#FFFFFF"
          framePad={12}
          from="up"
          rotate={-1}
        />
        <div style={{ position: "absolute", left: 28, bottom: 30 }}>
          <StampChip
            text="MINIATUR BESAR"
            enterFrame={R.miniStamp}
            variant="solid"
            bg={DARK_THEME.navy}
            color={DARK_THEME.text}
            fontSize={34}
            tracking={5}
          />
        </div>
      </div>

      {/* ---------- phase 2: the projection window ---------- */}
      {windowAlive ? (
        <>
          {/* primary window: blueprint schematic screen.
              Wrapper carries ONLY opacity + collapse-scale; ProjectionWindow
              owns its own x/y positioning (do not offset here again). */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity:
                (1 - bgHelmets) *
                clampN((frame - R.layar) / 8) *
                (frame < R.kokpitSwap ? 1 : 1 - clampN((frame - R.kokpitSwap) / 10)),
              transform: `scale(${1 + windowWipe * 0.1})`,
              // origin = centre of the 860×483 window at (110, 720)
              transformOrigin: "540px 962px",
            }}
          >
            <ProjectionWindow
              src={cards.blueprintScreen}
              enterFrame={R.layar}
              x={110}
              y={720}
              width={860}
              aspect={1.78}
              label="LAYAR RAKSASA — PROYEKSI"
            />
          </div>
          {/* swapped content: kokpit image inside the window, stays visible with no ease-out */}
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 720,
              width: 860,
              opacity: clampN((frame - R.kokpitSwap) / 10),
            }}
          >
            <div
              style={{
                width: 860,
                height: 860 / 1.78,
                overflow: "hidden",
                borderRadius: 14,
                border: "2px solid rgba(199,215,255,0.35)",
                boxShadow: "0 24px 60px rgba(5,10,24,0.6)",
                backgroundColor: "rgba(12,20,44,0.92)",
              }}
            >
              <img
                src={staticFile(imgs.cockpitPhoto)}
                alt="Kokpit"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
