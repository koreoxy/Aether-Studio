import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { InterstellarVideo } from "./compositions/InterstellarVideo";
import { FightClubVideo } from "./compositions/fight-club/FightClubVideo";
import { KeramatVideo } from "./compositions/keramat/KeramatVideo";
import { interstellarConfig } from "./projects/interstellar/config";
import { fightClubConfig } from "./projects/fight-club/config";
import { keramatConfig } from "./projects/keramat/config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* original template composition — preserved, untouched */}
      <MyComposition />

      {/* production: Interstellar film-review short */}
      <Composition
        id="interstellar"
        component={InterstellarVideo}
        durationInFrames={interstellarConfig.durationInFrames}
        fps={interstellarConfig.fps}
        width={interstellarConfig.width}
        height={interstellarConfig.height}
      />

      {/* production: Fight Club (1999) documentary short */}
      <Composition
        id="fight-club"
        component={FightClubVideo}
        durationInFrames={fightClubConfig.durationInFrames}
        fps={fightClubConfig.fps}
        width={fightClubConfig.width}
        height={fightClubConfig.height}
      />

      {/* production: Keramat (2009) film-review short */}
      <Composition
        id="keramat"
        component={KeramatVideo}
        durationInFrames={keramatConfig.durationInFrames}
        fps={keramatConfig.fps}
        width={keramatConfig.width}
        height={keramatConfig.height}
      />
    </>
  );
};