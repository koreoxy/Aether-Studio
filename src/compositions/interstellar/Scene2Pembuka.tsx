/**
 * Scene 2 — PEMBUKA (frames 0–301 relative; scene starts at abs 143)
 * "Interstellar, karya Christopher Nolan. Salah satu film luar angkasa
 *  favoritku. Musiknya indah, sinematografinya memukau, dan ceritanya
 *  menyentuh."
 *
 * Ref-3 editorial panel rhythm: cream mounted-poster card + stacked
 * Nolan headline; hard panel switch to navy for the MUSIK/INDAH/MEMUKAU
 * type beats; handwritten red note for the personal line.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { interpolate, useVideoConfig } from "remotion";
import { KineticHeadline } from "../../components/KineticTypography/KineticHeadline";
import { StampChip } from "../../components/KineticTypography/StampChip";
import { WordSplash } from "../../components/KineticTypography/WordSplash";
import { CollageCard } from "../../components/DigitalCollage/CollageCard";
import { interstellarConfig as CONFIG } from "../../projects/interstellar/config";
import { DARK_THEME } from "../../projects/interstellar/theme";

const imgs = CONFIG.assets.images;

/* beat starts relative to scene start (scene = 143..444 abs) */
const REL = {
  poster: 4, // 4.76s+  — poster slams on "Interstellar,"
  cooperName: 45, // 6.34s — "Christopher"
  favoritku: 110, // 8.44s — handwritten note
  panelSwitch: 158, // 10.04s — MUSIK beat, cream -> navy
  musik: 158,
  memukau: 197, // 11.08s
  menyentuh: 231, // 12.81s
  end: 302,
} as const;

export const Scene2Pembuka: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;
  const onCream = frame < REL.panelSwitch;

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {/* navy -> cream background switch (hard type-cut) */}
      <AbsoluteFill
        style={{
          backgroundColor: DARK_THEME.panelAlt,
          opacity: onCream ? 1 : 0,
        }}
      />

      {onCream ? (
        /* ---------- cream phase: poster card + Nolan headline ---------- */
        <>
          <div
            style={{
              position: "absolute",
              left: 90,
              top: 300,
              width: 900,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CollageCard
              src={imgs.posterFilm}
              enterFrame={REL.poster}
              width={560}
              aspect={0.676}
              frameBg="#FFFFFF"
              framePad={14}
              rotate={-1.4}
              from="pop"
              drift={2.2}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 1120,
              width: 830,
            }}
          >
            <KineticHeadline
              kicker="KARYA"
              lines={["CHRISTOPHER", "NOLAN,"]}
              enterFrame={REL.cooperName}
              size={96}
            />
          </div>
          {/* handwritten personal note: centered over poster */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 760,
              width: "100%",
              textAlign: "center",
              transform: "rotate(-1deg)",
              fontFamily: "Architects Daughter",
              fontSize: 68,
              color: DARK_THEME.accent,
              opacity: interpolate(frame, [REL.favoritku, REL.favoritku + 8], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            salah satu film favoritku!
          </div>
        </>
      ) : (
        /* ---------- navy phase: MUSIK / INDAH / MEMUKAU type beats ---------- */
        <>
          <div
            style={{
              position: "absolute",
              left: 70,
              top: 560,
              width: 830,
              display: "flex",
              flexDirection: "column",
              gap: 26,
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: 28 }}>
              <WordSplash
                word="MUSIK"
                enterFrame={REL.musik}
                size={150}
                accentColor={DARK_THEME.accent}
                align="left"
              />
              <WordSplash
                word="INDAH"
                enterFrame={REL.musik + 22}
                size={110}
                accentColor={DARK_THEME.accent}
                align="left"
                color="rgba(199,215,255,0.72)"
              />
            </div>
            <WordSplash
              word="MEMUKAU."
              enterFrame={REL.memukau}
              size={172}
              accentColor={DARK_THEME.accent}
              align="left"
            />
          </div>
          {/* editorial stamp for the film section */}
          <div style={{ position: "absolute", left: 70, top: 340 }}>
            <StampChip
              text="INTERSTELLAR"
              enterFrame={REL.panelSwitch}
              variant="bracket"
              fontSize={34}
              tracking={8}
            />
          </div>
          {/* handwritten accent for 'ceritanya menyentuh.' — centered */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 1120,
              width: "100%",
              textAlign: "center",
              transform: "rotate(-1.5deg)",
              fontFamily: "Architects Daughter",
              fontSize: 84,
              color: DARK_THEME.accent,
              opacity: interpolate(frame, [REL.menyentuh, REL.menyentuh + 9], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            menyentuh.
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
