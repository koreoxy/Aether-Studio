/**
 * FightClubVideo — master composition for the Fight Club production
 */
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { registerProductionFonts } from "../../utils/loadFonts";
import { AudioLayersFightClub } from "../../components/Audio/AudioLayersFightClub";
import { SubtitleLayerFightClub } from "../../components/Subtitles/SubtitleLayerFightClub";
import { SafeZoneGuides } from "../../components/SafeZone/SafeZone";
import { FlashTransition } from "../../components/Transitions/FlashTransition";
import { fightClubConfig as CONFIG } from "../../projects/fight-club/config";
import { F } from "../../projects/fight-club/scenes";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2PriaKlub } from "./Scene2PriaKlub";
import { Scene3Gerakan } from "./Scene3Gerakan";
import { Scene4Identitas } from "./Scene4Identitas";
import { Scene5Cta } from "./Scene5Cta";

/* fonts must be loaded before first render */
registerProductionFonts();

const SCENES = [
  { id: "scene-1-hook", Component: Scene1Hook, from: 0, dur: F.scene1 },
  { id: "scene-2-pria-klub", Component: Scene2PriaKlub, from: F.scene1, dur: F.scene2 - F.scene1 },
  { id: "scene-3-gerakan", Component: Scene3Gerakan, from: F.scene2, dur: F.scene3 - F.scene2 },
  { id: "scene-4-identitas", Component: Scene4Identitas, from: F.scene3, dur: F.scene4 - F.scene3 },
  { id: "scene-5-cta", Component: Scene5Cta, from: F.scene4, dur: CONFIG.durationInFrames - F.scene4 },
];

export const FightClubVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: CONFIG.theme.background }}>
      {SCENES.map(({ id, Component, from, dur }) => (
        <Sequence key={id} from={from} durationInFrames={dur} name={id}>
          <Component />
        </Sequence>
      ))}

      <FlashTransition flashFrame={F.scene1 - 2} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene2 - 2} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene3 - 2} durationFrames={6} color="#FFFFFF" />
      <FlashTransition flashFrame={F.scene4 - 2} durationFrames={6} color="#FFFFFF" />

      <SubtitleLayerFightClub
        narrationOffsetMs={CONFIG.assets.narrationOffsetMs}
        width={CONFIG.width}
        height={CONFIG.height}
        baselineY={1340}
        fontSize={48}
      />

      <AudioLayersFightClub config={CONFIG} />

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
