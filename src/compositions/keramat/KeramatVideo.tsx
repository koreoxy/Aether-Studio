/**
 * KeramatVideo — master composition for the Keramat production.
 * Six scenes + shutter flash transitions at every boundary +
 * word-by-word subtitle layer + audio stack.
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { registerProductionFonts } from "../../utils/loadFonts";
import { AudioLayersKeramat } from "../../components/Audio/AudioLayersKeramat";
import { SubtitleLayerKeramat } from "../../components/Subtitles/SubtitleLayerKeramat";
import { SafeZoneGuides } from "../../components/SafeZone/SafeZone";
import { FlashTransition } from "../../components/Transitions/FlashTransition";
import { keramatConfig as CONFIG } from "../../projects/keramat/config";
import { F, DURATION_IN_FRAMES } from "../../projects/keramat/scenes";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Pengenalan } from "./Scene2Pengenalan";
import { Scene3Sinopsis } from "./Scene3Sinopsis";
import { Scene4KenapaBagus } from "./Scene4KenapaBagus";
import { Scene5RasaNgeri } from "./Scene5RasaNgeri";
import { Scene6Penutup } from "./Scene6Penutup";

/* fonts must be loaded before first render */
registerProductionFonts();

const SCENES = [
  { id: "scene-1-hook", Component: Scene1Hook, from: 0, dur: F.scene1 },
  {
    id: "scene-2-pengenalan",
    Component: Scene2Pengenalan,
    from: F.scene1,
    dur: F.scene2 - F.scene1,
  },
  {
    id: "scene-3-sinopsis",
    Component: Scene3Sinopsis,
    from: F.scene2,
    dur: F.scene3 - F.scene2,
  },
  {
    id: "scene-4-kenapa-bagus",
    Component: Scene4KenapaBagus,
    from: F.scene3,
    dur: F.scene4 - F.scene3,
  },
  {
    id: "scene-5-rasa-ngeri",
    Component: Scene5RasaNgeri,
    from: F.scene4,
    dur: F.scene5 - F.scene4,
  },
  {
    id: "scene-6-penutup",
    Component: Scene6Penutup,
    from: F.scene5,
    dur: DURATION_IN_FRAMES - F.scene5,
  },
];

export const KeramatVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: CONFIG.theme.background }}>
      {SCENES.map(({ id, Component, from, dur }) => (
        <Sequence key={id} from={from} durationInFrames={dur} name={id}>
          <Component />
        </Sequence>
      ))}

      {/* flash + shutter at every scene boundary — flash peaks ON the cut */}
      <FlashTransition flashFrame={F.scene1} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene2} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene3} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene4} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene5} durationFrames={6} color="#FFFFFF" />

      {/* word-by-word karaoke captions */}
      <SubtitleLayerKeramat
        narrationOffsetMs={CONFIG.assets.narrationOffsetMs}
        width={CONFIG.width}
        height={CONFIG.height}
        baselineY={1395}
        fontSize={52}
      />

      <AudioLayersKeramat config={CONFIG} />

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
