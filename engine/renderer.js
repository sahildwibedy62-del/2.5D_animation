/**
 * Master Deterministic Renderer for THE CITY THAT FORGOT TOMORROW.
 *
 * Guarantees:
 *  - Fixed 1080 × 1920 vertical 9:16 internal resolution
 *  - Accepts 1-based integer frames from 1 to 1800 in any order
 *  - Zero cross-frame state accumulation, zero Math.random(), zero wall-clock dependency
 *  - Supports automated headless frame capture & PNG/WebP export for MP4 assembly
 */

import { FILM_CONFIG, clampFrame } from '../config.js';
import { Timeline } from './timeline.js';
import { SceneManager } from './scene.js';
import { createDeterministicGrainTile, drawFilmGrainAndVignette } from '../effects/atmosphere.js';
import { renderSceneTransition } from '../effects/transitions.js';
import { getActiveSfxForFrame } from '../audio/sfx_timeline.js';

import { Scene01EndlessNight } from '../scenes/scene_01.js';
import { Scene02PocketWatch } from '../scenes/scene_02.js';
import { Scene03CityRepeats } from '../scenes/scene_03.js';
import { Scene04PriceOfTomorrow } from '../scenes/scene_04.js';
import { Scene05FinalTurn } from '../scenes/scene_05.js';
import { Scene06FirstSunrise } from '../scenes/scene_06.js';

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if (!canvas) {
      throw new Error('Renderer requires a valid HTMLCanvasElement.');
    }
    this.canvas = canvas;
    this.canvas.width = FILM_CONFIG.width;
    this.canvas.height = FILM_CONFIG.height;
    this.ctx = canvas.getContext('2d', { alpha: false });

    this.timeline = new Timeline();
    this.sceneManager = new SceneManager([
      new Scene01EndlessNight(),
      new Scene02PocketWatch(),
      new Scene03CityRepeats(),
      new Scene04PriceOfTomorrow(),
      new Scene05FinalTurn(),
      new Scene06FirstSunrise(),
    ]);

    // Pre-generate immutable deterministic film-grain tile once
    this.grainTile = createDeterministicGrainTile(192, 2025);
    this.lastRenderedFrame = null;
  }

  /**
   * Deterministically render an exact frame in [1, 1800].
   * Always yields identical output for the same frame number regardless of seek order.
   *
   * @param {number} frameInput - 1-based frame number (1..1800)
   * @returns {object} Evaluated frame metadata
   */
  renderFrame(frameInput) {
    const frame = clampFrame(frameInput);
    const tlState = this.timeline.evaluate(frame);
    const scene = this.sceneManager.getForTimelineState(tlState);
    const ctx = this.ctx;
    const { width, height } = FILM_CONFIG;

    // Reset full canvas state cleanly before every frame
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    if ('filter' in ctx) ctx.filter = 'none';
    ctx.fillStyle = '#070914';
    ctx.fillRect(0, 0, width, height);

    // Render active 2.5D scene layers
    scene.render(ctx, tlState);

    // Render deterministic scene boundary transitions
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    renderSceneTransition(
      ctx,
      width,
      height,
      tlState.sceneIndex,
      tlState.localFrame,
      tlState.localDuration,
    );

    // Apply subtle deterministic film grain & cinematic vignette
    const vignetteStrength = tlState.sceneIndex === 5 ? 0.36 : 0.52;
    drawFilmGrainAndVignette(ctx, width, height, frame, this.grainTile, vignetteStrength);

    this.lastRenderedFrame = frame;

    return {
      frame,
      seconds: tlState.seconds,
      timecode: tlState.timecode,
      sceneIndex: tlState.sceneIndex,
      sceneId: tlState.sceneId,
      sceneNumber: tlState.sceneConfig.number,
      sceneTitle: tlState.sceneConfig.title,
      localFrame: tlState.localFrame,
      localDuration: tlState.localDuration,
      globalProgress: tlState.globalProgress,
      sfxCues: getActiveSfxForFrame(frame),
    };
  }

  /**
   * Render a specific frame and export it as a Data URL (for headless MP4 frame capture).
   */
  exportFrameDataURL(frame, mimeType = 'image/png', quality = 0.96) {
    this.renderFrame(frame);
    return this.canvas.toDataURL(mimeType, quality);
  }

  /**
   * Render a specific frame and export it as a Blob (for automated capture pipelines).
   */
  exportFrameBlob(frame, mimeType = 'image/png', quality = 0.96) {
    this.renderFrame(frame);
    return new Promise((resolve, reject) => {
      this.canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error(`Failed to encode frame ${frame}`));
      }, mimeType, quality);
    });
  }
}
