/**
 * Scene 5 — MUSIK & SINEMATOGRAFI (frames 0–178 relative; abs 1442–1620)
 * "ditambah musik Hans Zimmer yang megah dan gambar yang indah,
 *  semua terasa nyata dan emosional."
 *
 * Royal papercut organ rises; giant HANS ZIMMER block headline;
 * 3-cut cinematic montage band; "EMOSIONAL." burst.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { KineticHeadline } from "../../components/KineticTypography/KineticHeadline";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { FilmClip } from "../../components/Broll/FilmClip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { DARK_THEME } from "../../projects/interstellar/theme";

const cards = CONFIG.assets.cards;
const imgs = CONFIG.assets.images;
const fb = CONFIG.assets.fullBleed;

const R = {
  organ: 0, // rises at "ditambah"
  zimmer: 25, // 48.91s "Hans"
  mont1: 68, // 50.33s "gambar"
  mont2: 88, // 51.02s
  mont3: 117, // 51.99s
  emosional: 145, // 52.92s
  end: 179,
} as const;

const clampN = (v: number) => Math.max(0, Math.min(1, v));

export const Scene5Musik: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* single landscape b-roll box in center */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 640,
          width: 1080,
          height: 607,
          overflow: "hidden",
          borderTop: `1px solid ${DARK_THEME.accent}44`,
          borderBottom: `1px solid ${DARK_THEME.accent}44`,
          backgroundColor: "#000",
        }}
      >
        <FilmClip
          src={fb.gargantua}
          durationFrames={R.end}
          enterFrame={0}
          fadeInFrames={8}
          fadeOutFrames={8}
          push
          pushScale={0.12}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* HANS ZIMMER headline */}
      <div style={{ position: "absolute", left: 70, top: 330, width: 830 }}>
        <KineticHeadline
          kicker="DITAMBAH MUSIK"
          lines={["HANS", "ZIMMER."]}
          enterFrame={R.zimmer}
          size={128}
          redRule
        />
      </div>

      {/* EMOSIONAL burst on the final statement */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 810,
          width: 1080,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <WordSplash
          word="EMOSIONAL."
          enterFrame={R.emosional}
          size={132}
          accentColor={DARK_THEME.accent}
          burst
        />
      </div>
    </AbsoluteFill>
  );
};
