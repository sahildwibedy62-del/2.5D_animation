/**
 * Multi-plane 2.5D Parallax System.
 * Organizes the canonical 7-layer cinematic depth architecture:
 *   Layer 6: Clouds & sky
 *   Layer 5: Distant skyline
 *   Layer 4: Midground buildings
 *   Layer 3: Main characters & action
 *   Layer 2: Near architectural objects
 *   Layer 1: Foreground silhouettes
 *   Layer 7: Atmospheric overlays & particles
 */

import { DEPTH_PRESETS } from '../config.js';
import { clamp } from './math.js';
import { DepthLayer, LayerStack } from './layers.js';

export class ParallaxSystem {
  constructor() {
    this.stack = new LayerStack();
  }

  clear() {
    this.stack = new LayerStack();
    return this;
  }

  addLayer(config) {
    return this.stack.add(config);
  }

  /**
   * Build the canonical 7-plane depth stack from a scene's layer descriptors.
   * Each key accepts either a draw function `(ctx, state, proj) => void` or a full config object.
   */
  composeStandardPlanes(planes = {}) {
    this.clear();

    const mapping = [
      { key: 'sky', preset: DEPTH_PRESETS.SKY, order: 10 },
      { key: 'distantSkyline', preset: DEPTH_PRESETS.DISTANT_SKYLINE, order: 20 },
      { key: 'midground', preset: DEPTH_PRESETS.MIDGROUND, order: 30 },
      { key: 'action', preset: DEPTH_PRESETS.ACTION, order: 40 },
      { key: 'nearArchitecture', preset: DEPTH_PRESETS.NEAR_ARCH, order: 50 },
      { key: 'foreground', preset: DEPTH_PRESETS.FOREGROUND, order: 60 },
      { key: 'atmosphere', preset: DEPTH_PRESETS.ATMOSPHERE, order: 70 },
    ];

    for (let i = 0; i < mapping.length; i += 1) {
      const { key, preset, order } = mapping[i];
      const spec = planes[key];
      if (!spec) continue;

      if (typeof spec === 'function') {
        this.stack.add(new DepthLayer({
          id: preset.name,
          depth: preset.depth,
          parallaxX: preset.parallaxX,
          parallaxY: preset.parallaxY,
          screenSpace: Boolean(preset.screenSpace),
          order,
          draw: spec,
        }));
      } else {
        this.stack.add(new DepthLayer({
          id: spec.id || preset.name,
          depth: spec.depth ?? preset.depth,
          parallaxX: spec.parallaxX ?? preset.parallaxX,
          parallaxY: spec.parallaxY ?? preset.parallaxY,
          scaleFactor: spec.scaleFactor ?? 1,
          offsetX: spec.offsetX ?? 0,
          offsetY: spec.offsetY ?? 0,
          opacity: spec.opacity ?? 1,
          blur: spec.blur ?? 0,
          blendMode: spec.blendMode ?? 'source-over',
          screenSpace: spec.screenSpace ?? Boolean(preset.screenSpace),
          visible: spec.visible ?? true,
          order: spec.order ?? order,
          draw: spec.draw,
        }));
      }
    }

    if (Array.isArray(planes.extra)) {
      for (let i = 0; i < planes.extra.length; i += 1) {
        this.stack.add(planes.extra[i]);
      }
    }

    return this;
  }

  /**
   * Compute depth-based aerial perspective haze factor [0, 1].
   */
  static computeAerialPerspective(depth, density = 0.55) {
    const distance = clamp(1 - depth, 0, 1);
    return clamp(distance * density, 0, 0.85);
  }

  /**
   * Compute subtle depth-of-field blur radius from camera focal depth.
   */
  static computeDepthBlur(layerDepth, focusDepth, strength = 2.4) {
    const delta = Math.abs(layerDepth - focusDepth);
    return delta < 0.22 ? 0 : clamp((delta - 0.22) * strength, 0, 6);
  }

  render(ctx, camera, state) {
    this.stack.render(ctx, camera, state);
  }
}
