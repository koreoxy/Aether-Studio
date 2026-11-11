/**
 * AudioLayers — narration (dominant) + organ bed (felt, not heard) + SFX hits.
 * SFX fires at the scene choreography frames via Sequences; volumes are
 * per-file tuned from measured peaks (see scripts/prepare-audio.sh output).
 */
import React from "react";
import { Audio, interpolate, Sequence, staticFile } from "remotion";
import type { InterstellarConfig } from "../../projects/interstellar/config";
import { SFX_CUES } from "../../projects/interstellar/scenes";

export const AudioLayers: React.FC<{ config: InterstellarConfig }> = ({
  config,
}) => {
  const compDur = config.durationInFrames;
  return (
    <>
      {/* narration — dominant, starts with the composition */}
      <Audio src={staticFile(config.assets.narration)} volume={1} />

      {/* organ drone bed — overall fade in/out handled here, bed level 0.15-0.18 */}
      <Audio
        src={staticFile(config.assets.music)}
        volume={(f) =>
          interpolate(f, [0, 24, compDur - 132, compDur], [0, 1, 1, 0.35], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) * config.assets.musicVolume
        }
      />

      {/* synchronized SFX hits */}
      {SFX_CUES.map((cue, idx) => {
        const file = config.assets.sfx[cue.key];
        return (
          <Sequence
            key={idx}
            from={cue.frame}
            /* no durationInFrames: let the hit ring out to comp end */
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
