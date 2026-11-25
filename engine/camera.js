/**
 * Cinematic 2.5D Camera controller.
 * Supports dolly-in/out, horizontal/vertical tracking, orbital 2.5D shift,
 * push-ins, close-ups, deterministic handheld breath/shake, and depth projection.
 */

import { FILM_CONFIG } from '../config.js';
import { clamp, fbm1D, lerp } from './math.js';
import { evaluateKeyframes } from './animation.js';

export class Camera {
  constructor(initial = {}) {
    this.x = initial.x ?? 0;
    this.y = initial.y ?? 0;
    this.zoom = initial.zoom ?? 1;
    this.rotation = initial.rotation ?? 0;
    this.orbitX = initial.orbitX ?? 0;
    this.orbitY = initial.orbitY ?? 0;
    this.focusDepth = initial.focusDepth ?? 1.0;
    this.shakeAmplitude = initial.shakeAmplitude ?? 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.pivotX = initial.pivotX ?? FILM_CONFIG.width * 0.5;
    this.pivotY = initial.pivotY ?? FILM_CONFIG.height * 0.5;
  }

  /**
   * Apply a deterministic state object to the camera.
   */
  setState(state = {}, frame = 1) {
    this.x = state.x ?? 0;
    this.y = state.y ?? 0;
    this.zoom = Math.max(0.25, state.zoom ?? 1);
    this.rotation = state.rotation ?? 0;
    this.orbitX = state.orbitX ?? 0;
    this.orbitY = state.orbitY ?? 0;
    this.focusDepth = state.focusDepth ?? 1.0;
    this.shakeAmplitude = state.shakeAmplitude ?? 0;
    this.pivotX = state.pivotX ?? FILM_CONFIG.width * 0.5;
    this.pivotY = state.pivotY ?? FILM_CONFIG.height * 0.5;

    // Deterministic procedural micro-shake / breath (zero randomness)
    if (this.shakeAmplitude > 0) {
      const freq = state.shakeFreq ?? 0.22;
      this.shakeX = fbm1D(frame * freq, 3, 911) * this.shakeAmplitude;
      this.shakeY = fbm1D(frame * freq + 47.3, 3, 977) * this.shakeAmplitude;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
    }
    return this;
  }

  /**
   * Evaluate a keyframed camera track at normalized scene progress `u`.
   */
  applyTrack(keyframes, u, frame = 1, extra = {}) {
    const evaluated = evaluateKeyframes(keyframes, u, {
      x: 0,
      y: 0,
      zoom: 1,
      rotation: 0,
      orbitX: 0,
      orbitY: 0,
      focusDepth: 1.0,
      shakeAmplitude: 0,
    });
    return this.setState({ ...evaluated, ...extra }, frame);
  }

  /**
   * Project a 2.5D depth layer into screen-space transform coordinates.
   * Layers with depth < 1 recede and move slower; depth > 1 sit in front and move faster.
   */
  projectLayer(layer) {
    if (layer.screenSpace) {
      return {
        tx: layer.offsetX || 0,
        ty: layer.offsetY || 0,
        scale: layer.scaleFactor || 1,
        rotation: 0,
        pivotX: this.pivotX,
        pivotY: this.pivotY,
      };
    }

    const depth = layer.depth ?? 1;
    const px = layer.parallaxX ?? depth;
    const py = layer.parallaxY ?? depth * 0.85;
    const baseScale = layer.scaleFactor ?? 1;

    // Perspective zoom response: closer planes scale faster than distant sky planes
    const depthZoomInfluence = lerp(0.18, 1.35, clamp(depth / 1.55, 0, 1.25));
    const effectiveZoom = Math.max(0.2, 1 + (this.zoom - 1) * depthZoomInfluence);

    // Orbital shift creates genuine 2.5D separation around the focal plane
    const relativeDepth = depth - this.focusDepth;
    const orbitalDx = this.orbitX * relativeDepth * 140;
    const orbitalDy = this.orbitY * relativeDepth * 90;

    const tx = -(this.x + this.shakeX) * px + orbitalDx + (layer.offsetX || 0);
    const ty = -(this.y + this.shakeY) * py + orbitalDy + (layer.offsetY || 0);
    const rotation = this.rotation * lerp(0.35, 1.15, clamp(depth, 0, 1.4));

    return {
      tx,
      ty,
      scale: effectiveZoom * baseScale,
      rotation,
      pivotX: this.pivotX,
      pivotY: this.pivotY,
    };
  }
}
