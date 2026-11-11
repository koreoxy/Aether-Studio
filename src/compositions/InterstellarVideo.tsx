/**
 * InterstellarVideo — master composition for the production
 * "Interstellar: Film Luar Angkasa yang Terasa Nyata"
 *
 * Layer order:
 *   1. six scene Sequences (word-timed)
 *   2. SfxHits + narration + music bed
 *   3. word-by-word subtitle layer (karaoke)
 *   4. connected S2->S3 cream panel wipe
 *   5. optional preview-only safe-zone guides
 */
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { registerProductionFonts } from "../utils/loadFonts";
import { SubtitleLayer } from "../components/Subtitles/SubtitleLayer";
import { AudioLayers } from "../components/Audio/AudioLayers";
import { SafeZoneGuides } from "../components/SafeZone/SafeZone";
import { PanelWipe } from "../components/Transitions/PanelWipe";
import { interstellarConfig as CONFIG } from "../projects/interstellar/config";
import { F, PANEL_WIPE_FRAME } from "../projects/interstellar/scenes";
import { DARK_THEME } from "../projects/interstellar/theme";

import { Scene1Hook } from "./interstellar/Scene1Hook";
import { Scene2Pembuka } from "./interstellar/Scene2Pembuka";
import { Scene3Cerita } from "./interstellar/Scene3Cerita";
import { Scene4SisiNyata } from "./interstellar/Scene4SisiNyata";
import { Scene5Musik } from "./interstellar/Scene5Musik";
import { Scene6Cta } from "./interstellar/Scene6Cta";

/* fonts must be loaded before first render */
registerProductionFonts();

const SCENES = [
  { id: "scene-1-hook", Component: Scene1Hook, from: 0, dur: F.ceritaInti },
  {
    id: "scene-2-pembuka",
    Component: Scene2Pembuka,
    from: F.pembuka,
    dur: F.ceritaInti - F.pembuka,
  },
  {
    id: "scene-3-cerita",
    Component: Scene3Cerita,
    from: F.ceritaInti,
    dur: F.sisiNyata - F.ceritaInti,
  },
  {
    id: "scene-4-sisi-nyata",
    Component: Scene4SisiNyata,
    from: F.sisiNyata,
    dur: F.musik - F.sisiNyata,
  },
  { id: "scene-5-musik", Component: Scene5Musik, from: F.musik, dur: F.cta - F.musik },
  {
    id: "scene-6-cta",
    Component: Scene6Cta,
    from: F.cta,
    dur: CONFIG.durationInFrames - F.cta,
  },
];

export const InterstellarVideo: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame === 8) {
    console.log("INTERSTELLAR_RENDER_FRAME_8");
  }
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_THEME.background }}>
      {SCENES.map(({ id, Component, from, dur }) => (
        <Sequence key={id} from={from} durationInFrames={dur} name={id}>
          <Component />
        </Sequence>
      ))}

      {/* connected transition S2 -> S3: cream panel sweeps the cut */}
      <PanelWipe
        enterFrame={PANEL_WIPE_FRAME}
        exitFrame={F.ceritaInti}
        color={DARK_THEME.panelAlt}
        direction="up"
      />

      {/* full phrase karaoke captions (synchronized with voiceover) */}
      <SubtitleLayer
        narrationOffsetMs={CONFIG.assets.narrationOffsetMs}
        width={CONFIG.width}
        height={CONFIG.height}
        baselineY={1340}
        fontSize={48}
      />

      {/* audio: narration dominant / bed felt / SFX punctuating */}
      <AudioLayers config={CONFIG} />

      {/* preview-only guides — never enable for final render */}
      {CONFIG.safeZone.enabled && CONFIG.safeZone.showGuides ? (
        <SafeZoneGuides
          platform={CONFIG.platform}
          width={CONFIG.width}
          height={CONFIG.height}
        />
      ) : null}
    </AbsoluteFill>
  );
};
