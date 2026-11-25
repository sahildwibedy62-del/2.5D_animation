/**
 * Deterministic cinematic scene transitions evaluated at scene boundaries.
 */

import { PALETTE } from '../config.js';
import { clamp, rgba } from '../engine/math.js';
import { EASING } from '../engine/animation.js';

/**
 * Render smooth deterministic entry/exit transitions for each of the 6 scenes.
 */
export function renderSceneTransition(ctx, width, height, sceneIndex, localFrame, durationFrames) {
  const fadeFrames = 20;

  // Scene entry transition
  if (localFrame <= fadeFrames) {
    const t = 1 - EASING.easeOutCubic(clamp((localFrame - 1) / fadeFrames, 0, 1));
    if (sceneIndex === 0) {
      // Film opens gently from deep midnight obsidian
      ctx.fillStyle = rgba(PALETTE.obsidian, t);
      ctx.fillRect(0, 0, width, height);
    } else if (sceneIndex === 4 || sceneIndex === 5) {
      // Warm golden-amber light wash entering Scene 05 / Scene 06
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = rgba(PALETTE.goldenSunrise, t * 0.72);
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else {
      // Soft dark indigo cinema dissolve
      ctx.fillStyle = rgba('#090d1f', t * 0.92);
      ctx.fillRect(0, 0, width, height);
    }
  }

  // Scene exit transition
  const remaining = durationFrames - localFrame;
  if (remaining < fadeFrames) {
    const t = EASING.easeInCubic(clamp((fadeFrames - remaining) / fadeFrames, 0, 1));
    if (sceneIndex === 4) {
      // Scene 05 -> Scene 06 blooms into warm sunrise white-gold
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = rgba('#fff3cc', t * 0.85);
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    } else if (sceneIndex === 5) {
      // Final poetic fade-out on frame 1775..1800
      const endFade = EASING.easeInOutSine(clamp((localFrame - (durationFrames - 30)) / 30, 0, 1));
      ctx.fillStyle = rgba('#090a14', endFade);
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = rgba('#080c1c', t * 0.92);
      ctx.fillRect(0, 0, width, height);
    }
  }
}
