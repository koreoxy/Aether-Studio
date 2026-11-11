/**
 * AudioLayers — Fight Club production
 * narration (dominant) + organ bed (felt, not heard) + SFX hits.
 */
import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import type { FightClubConfig } from "../../projects/fight-club/config";
import { SFX_CUES } from "../../projects/fight-club/scenes";

export const AudioLayersFightClub: React.FC<{ config: FightClubConfig }> = ({
  config,
}) => {
  const compDur = config.durationInFrames;
  return (
    <>
      <Audio src={staticFile(config.assets.narration)} volume={1} />
      <Audio
        src={staticFile(config.assets.music)}
        volume={(f) =>
          interpolate(f, [0, 24, compDur - 132, compDur], [0, 1, 1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * config.assets.musicVolume
        }
      />
      {SFX_CUES.map((cue, idx) => {
        const file = config.assets.sfx[cue.key];
        return (
          <Sequence
            key={idx}
            from={cue.frame}
            name={`sfx-${cue.key}-${cue.frame}`}
          >
            <Audio
              src={staticFile(file.src)}
              volume={(file.volume ?? 1) * (cue.volumeMultiplier ?? 1)}
            />
          </Sequence>
        );
      })}
    </>
  );
};