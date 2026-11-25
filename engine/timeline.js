/**
 * Deterministic 1800-frame timeline mapper (30 FPS, 60.0 seconds, frames 1..1800).
 */

import { FILM_CONFIG, SCENES, clampFrame, getSceneConfigForFrame } from '../config.js';

export class Timeline {
  constructor() {
    this.fps = FILM_CONFIG.fps;
    this.totalFrames = FILM_CONFIG.totalFrames;
    this.scenes = SCENES;
  }

  /**
   * Pure evaluation of timing metadata for any integer frame in [1, 1800].
   */
  evaluate(frame) {
    const f = clampFrame(frame);
    const sceneConfig = getSceneConfigForFrame(f);
    const localFrame = f - sceneConfig.startFrame + 1;
    const localProgress = (localFrame - 1) / Math.max(1, sceneConfig.durationFrames - 1);
    const globalProgress = (f - 1) / Math.max(1, this.totalFrames - 1);
    const seconds = (f - 1) / this.fps;

    return {
      frame: f,
      seconds,
      fps: this.fps,
      totalFrames: this.totalFrames,
      globalProgress,
      sceneConfig,
      sceneIndex: sceneConfig.index,
      sceneId: sceneConfig.id,
      localFrame,
      localDuration: sceneConfig.durationFrames,
      u: localProgress,
      timecode: formatTimecode(f, this.fps),
    };
  }
}

/**
 * Format 1-based frame number as MM:SS:FF.
 */
export function formatTimecode(frame, fps = FILM_CONFIG.fps) {
  const zeroBased = Math.max(0, clampFrame(frame) - 1);
  const totalSeconds = Math.floor(zeroBased / fps);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const subFrame = zeroBased % fps;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(subFrame).padStart(2, '0')}`;
}
