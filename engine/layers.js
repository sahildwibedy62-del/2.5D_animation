/**
 * Depth-separated 2.5D Layer primitives and LayerStack compositor.
 */

import { clamp } from './math.js';

export class DepthLayer {
  /**
   * @param {object} options
   * @param {string} options.id
   * @param {number} [options.depth=1]
   * @param {number} [options.parallaxX]
   * @param {number} [options.parallaxY]
   * @param {number} [options.scaleFactor=1]
   * @param {number} [options.offsetX=0]
   * @param {number} [options.offsetY=0]
   * @param {number} [options.opacity=1]
   * @param {number} [options.blur=0]
   * @param {string} [options.blendMode='source-over']
   * @param {boolean} [options.screenSpace=false]
   * @param {boolean} [options.visible=true]
   * @param {number} [options.order]
   * @param {Function} options.draw
   */
  constructor(options) {
    this.id = options.id || 'layer';
    this.depth = options.depth ?? 1.0;
    this.parallaxX = options.parallaxX ?? this.depth;
    this.parallaxY = options.parallaxY ?? this.depth * 0.85;
    this.scaleFactor = options.scaleFactor ?? 1.0;
    this.offsetX = options.offsetX ?? 0;
    this.offsetY = options.offsetY ?? 0;
    this.opacity = options.opacity ?? 1.0;
    this.blur = options.blur ?? 0;
    this.blendMode = options.blendMode ?? 'source-over';
    this.screenSpace = Boolean(options.screenSpace);
    this.visible = options.visible !== false;
    this.order = options.order ?? (this.screenSpace ? 100 : this.depth);
    this.draw = options.draw || (() => {});
  }
}

export class LayerStack {
  constructor(layers = []) {
    this.layers = [];
    for (let i = 0; i < layers.length; i += 1) {
      this.add(layers[i]);
    }
  }

  add(layerOrConfig) {
    const layer = layerOrConfig instanceof DepthLayer
      ? layerOrConfig
      : new DepthLayer(layerOrConfig);
    this.layers.push(layer);
    return layer;
  }

  getSortedLayers() {
    return [...this.layers].sort((a, b) => a.order - b.order);
  }

  /**
   * Composite all visible layers back-to-front using camera projection.
   */
  render(ctx, camera, state) {
    const sorted = this.getSortedLayers();
    for (let i = 0; i < sorted.length; i += 1) {
      const layer = sorted[i];
      if (!layer.visible || layer.opacity <= 0.001) continue;

      const proj = camera.projectLayer(layer);
      ctx.save();
      ctx.globalAlpha = clamp(layer.opacity, 0, 1);
      ctx.globalCompositeOperation = layer.blendMode;

      if (layer.blur > 0.05 && 'filter' in ctx) {
        ctx.filter = `blur(${layer.blur.toFixed(1)}px)`;
      }

      if (!layer.screenSpace) {
        ctx.translate(proj.pivotX + proj.tx, proj.pivotY + proj.ty);
        if (proj.rotation !== 0) {
          ctx.rotate(proj.rotation);
        }
        ctx.scale(proj.scale, proj.scale);
        ctx.translate(-proj.pivotX, -proj.pivotY);
      } else if (proj.tx !== 0 || proj.ty !== 0) {
        ctx.translate(proj.tx, proj.ty);
      }

      layer.draw(ctx, state, proj);
      ctx.restore();
    }
  }
}
