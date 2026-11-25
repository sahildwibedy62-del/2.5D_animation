/**
 * Base Scene abstraction and SceneManager registry.
 */

import { Camera } from './camera.js';
import { ParallaxSystem } from './parallax.js';

export class Scene {
  constructor(config) {
    this.id = config.id;
    this.index = config.index;
    this.title = config.title;
    this.startFrame = config.startFrame;
    this.endFrame = config.endFrame;
    this.durationFrames = config.durationFrames;
    this.camera = new Camera();
    this.parallax = new ParallaxSystem();
  }

  /**
   * Override in concrete scenes to configure the camera for the current frame.
   * @param {object} state - Evaluated timeline + canvas state
   */
  updateCamera(_state) {
    this.camera.setState({ x: 0, y: 0, zoom: 1 }, _state.frame);
  }

  /**
   * Override in concrete scenes to return a 7-plane layer descriptor object
   * passed to `ParallaxSystem.composeStandardPlanes`.
   */
  buildPlanes(_state) {
    return {};
  }

  /**
   * Optional post-layer scene overlay drawn in screen space.
   */
  drawOverlay(_ctx, _state) {}

  /**
   * Deterministically render the scene for a given timeline state.
   */
  render(ctx, state) {
    this.updateCamera(state);
    const planes = this.buildPlanes(state);
    this.parallax.composeStandardPlanes(planes);
    this.parallax.render(ctx, this.camera, state);
    this.drawOverlay(ctx, state);
  }
}

export class SceneManager {
  constructor(scenes = []) {
    this.scenes = scenes;
    this.byId = new Map();
    for (let i = 0; i < scenes.length; i += 1) {
      this.byId.set(scenes[i].id, scenes[i]);
    }
  }

  getById(id) {
    return this.byId.get(id) || this.scenes[0];
  }

  getForTimelineState(tlState) {
    return this.getById(tlState.sceneId);
  }
}
