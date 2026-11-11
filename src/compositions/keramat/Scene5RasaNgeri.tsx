/**
 * Scene 5 — RASA NGERI (Keramat)
 * "Makanya film ini salah satu film Indonesia, yang ngerinya kerasa banget.
 *  Karena kamu cuma bisa lihat apa yang dilihat kamera. Sempit, terbatas,
 *  dan kamu nggak pernah tahu ada apa di luar frame."
 * Three beats: ghost reveal + NGERI splash -> camcorder viewfinder UI ->
 * inset-frame metaphor ("di luar frame").
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FilmClip } from "../../components/Broll/FilmClip";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { DARK_THEME, FONT_SECONDARY, FONT_PRIMARY } from "../../projects/keramat/theme";
import { F } from "../../projects/keramat/scenes";

const B2 = F.s5b - F.scene4; // "Karena kamu cuma bisa lihat..."
const B3 = F.s5c - F.scene4; // "Sempit, terbatas..."

/** camcorder viewfinder chrome: REC dot + battery + corner brackets */
const ViewfinderUI: React.FC<{ enterFrame: number }> = ({ enterFrame }) => {
  const frame = useCurrentFrame();
  const t = frame - enterFrame;
  if (t < 0) return null;
  const opacity = interpolate(t, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blink = Math.floor(frame / 15) % 2 === 0;
  const uiFont: React.CSSProperties = {
    fontFamily: FONT_PRIMARY,
    fontWeight: 800,
    fontSize: 30,
    letterSpacing: "0.08em",
    color: "#FFFFFF",
  };
  const corner: React.CSSProperties = {
    position: "absolute",
    width: 54,
    height: 54,
    border: `4px solid rgba(255,255,255,0.85)`,
    opacity,
  };
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* corners of the safe-zone content area */}
      <div style={{ ...corner, left: 96, top: 276, borderRight: "none", borderBottom: "none" }} />
      <div style={{ ...corner, right: 206, top: 276, borderLeft: "none", borderBottom: "none" }} />
      <div style={{ ...corner, left: 96, bottom: 446, borderRight: "none", borderTop: "none" }} />
      <div style={{ ...corner, right: 206, bottom: 446, borderLeft: "none", borderTop: "none" }} />
      {/* REC */}
      <div style={{ position: "absolute", left: 110, top: 352, display: "flex", alignItems: "center", gap: 12, opacity }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: DARK_THEME.accent,
            opacity: blink ? 1 : 0.25,
          }}
        />
        <div style={uiFont}>REC</div>
      </div>
      {/* battery */}
      <div style={{ position: "absolute", right: 222, top: 352, display: "flex", alignItems: "center", gap: 10, opacity }}>
        <div
          style={{
            width: 52,
            height: 26,
            border: "3px solid rgba(255,255,255,0.9)",
            borderRadius: 4,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 3,
              width: "38%",
              backgroundColor: DARK_THEME.accent,
            }}
          />
        </div>
        <div style={uiFont}>13%</div>
      </div>
    </div>
  );
};

export const Scene5RasaNgeri: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* beat 1 — ghost reveal */}
      <FilmClip
        src={CONFIG.assets.fullBleed.ghost}
        durationFrames={B2}
        enterFrame={0}
        push
        pushScale={0.1}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(10,18,40,0.5) 0%, rgba(10,18,40,0) 30%, rgba(10,18,40,0.55) 100%)",
        }}
      />
      <div style={{ position: "absolute", left: 70, top: 270 }}>
        <StampChip
          text="SALAH SATU FILM INDONESIA"
          enterFrame={6}
          variant="bracket"
          fontSize={26}
          tracking={4}
          color={DARK_THEME.text}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 700,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="NGERI."
          enterFrame={100}
          size={165}
          accentColor={DARK_THEME.accent}
          redWord
          burst
        />
      </div>

      {/* beat 2 — camera POV: red doorway + viewfinder chrome */}
      <FilmClip
        src={CONFIG.assets.fullBleed.doorwayLate}
        durationFrames={F.scene5 - F.scene4 - B2}
        enterFrame={B2}
        push
        pushScale={0.08}
        fadeInFrames={8}
      />
      {/* signal-loss payoff at "...di luar frame" — sits UNDER the UI layers */}
      <FilmClip
        src={CONFIG.assets.fullBleed.doorwayGlitch}
        durationFrames={F.scene5 - F.scene4 - (B3 + 105)}
        enterFrame={B3 + 105}
        push={false}
        fadeInFrames={4}
      />
      <ViewfinderUI enterFrame={B2 + 10} />

      {/* beat 3 — the frame metaphor: darken outside an inset frame */}
      <FrameMetaphor enterFrame={B3} />

      {/* handwritten kicker in beat 3 — centered INSIDE the frame */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 800,
          width: 1080,
          textAlign: "center",
          fontFamily: FONT_SECONDARY,
          fontSize: 46,
          color: "rgba(199, 215, 255, 0.95)",
          transform: "rotate(-2deg)",
          opacity: interpolate(useCurrentFrame() - B3 - 96, [0, 8], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        ada apa di luar frame?
      </div>
    </AbsoluteFill>
  );
};

/** inset viewfinder frame: outside goes near-black, label "DI LUAR FRAME" */
const FrameMetaphor: React.FC<{ enterFrame: number }> = ({ enterFrame }) => {
  const frame = useCurrentFrame();
  const t = frame - enterFrame;
  if (t < 0) return null;
  const grow = interpolate(t, [0, 16], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (e) => 1 - Math.pow(1 - e, 3),
  });
  const opacity = interpolate(t, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // frame box inside the safe zone — horizontally centered on the canvas
  const box = { left: 210, top: 330, width: 660, height: 1000 };
  return (
    <div style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {/* the frame window — spread shadow darkens ONLY the outside */}
      <div
        style={{
          position: "absolute",
          ...box,
          transform: `scale(${grow})`,
          transformOrigin: "center",
          border: "4px solid rgba(199, 215, 255, 0.95)",
          boxShadow:
            "0 0 0 2000px rgba(5, 9, 20, 0.82), 0 0 60px rgba(0,0,0,0.5) inset",
        }}
      />
      {/* label */}
      <div
        style={{
          position: "absolute",
          left: box.left,
          top: box.top - 78,
          fontFamily: FONT_PRIMARY,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.12em",
          color: DARK_THEME.text,
        }}
      >
        FRAME
      </div>
      <div
        style={{
          position: "absolute",
          right: 210,
          top: box.top - 78,
          fontFamily: FONT_PRIMARY,
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: "0.12em",
          color: DARK_THEME.accent,
        }}
      >
        ???
      </div>
    </div>
  );
};
