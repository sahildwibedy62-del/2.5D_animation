/**
 * SCENE 06 — THE FIRST SUNRISE (Frames 1501–1800)
 *
 * Soft golden-rose and lavender sunrise floods the newly awakened metropolis.
 * Camera slowly approaches Nova as she looks carefully at an old sepia photograph
 * in her hands—where her mother's face has gently faded away into warm light.
 * A single sunlit tear rolls down her cheek, yet she smiles softly.
 * The camera then pulls back in a breathtaking final crane to reveal the enormous
 * city glowing in golden morning light, finally moving forward into tomorrow.
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, segmentProgress } from '../engine/animation.js';
import { clamp, lerp } from '../engine/math.js';
import {
  drawDepthHaze,
  drawPaintedClouds,
  drawSkyGradient,
} from '../effects/atmosphere.js';
import { drawSunriseBloom, drawVolumetricLightShafts } from '../effects/lighting.js';
import { drawCherryBlossoms, drawFlyingBirds, drawGlowingMotes } from '../effects/particles.js';
import {
  drawDistantSkyline,
  drawElevatedTrain,
  drawForegroundFrameSilhouettes,
  drawGiantClockTower,
  drawMidgroundArchitecture,
} from '../environments/city.js';
import { drawFadingPhotograph } from '../environments/memory_world.js';
import { createDefaultNovaPose, drawNova } from '../characters/nova.js';

export class Scene06FirstSunrise extends Scene {
  constructor() {
    super(SCENES[5]);
  }

  updateCamera(state) {
    // Gentle approach onto Nova & the fading photograph -> sweeping emotional pull-back over the golden city!
    this.camera.applyTrack([
      { t: 0.0, value: { x: -30, y: 40, zoom: 1.06, orbitX: -0.2, orbitY: 0.05, focusDepth: 1.0, shakeAmplitude: 0.7 } },
      { t: 0.44, value: { x: 12, y: 95, zoom: 1.24, orbitX: 0.1, orbitY: 0.08, focusDepth: 1.0, shakeAmplitude: 0.5 }, ease: EASING.easeInOutSine },
      { t: 0.66, value: { x: 8, y: 60, zoom: 1.16, orbitX: 0.16, orbitY: 0.02, focusDepth: 1.0, shakeAmplitude: 0.5 }, ease: EASING.easeInOutSine },
      { t: 1.0, value: { x: -18, y: -210, zoom: 0.86, orbitX: -0.26, orbitY: -0.22, focusDepth: 0.65, shakeAmplitude: 0.4 }, ease: EASING.easeInOutCubic },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    // Emotional acting beats in Scene 06 (localFrame 1..300)
    const tearRoll = segmentProgress(localFrame, 85, 165, EASING.easeOutCubic);
    const softSmile = segmentProgress(localFrame, 130, 175, EASING.easeInOutSine);
    const lookUpToSunrise = segmentProgress(localFrame, 195, 255, EASING.easeInOutCubic);
    const pullBackReveal = segmentProgress(localFrame, 185, 300, EASING.easeInOutCubic);

    return {
      // Layer 6: Radiant golden-rose & soft lavender sunrise sky with rising sun
      sky: {
        depth: 0.12,
        parallaxX: 0.12,
        parallaxY: 0.1,
        draw: (ctx) => {
          drawSkyGradient(ctx, width, height, 1.0, frame);
          drawPaintedClouds(ctx, {
            width,
            yBase: 295,
            spreadY: 310,
            count: 10,
            frame,
            speed: 0.85,
            dawn: 1.0,
            seed: 601,
          });

          // Blazing golden sunrise rising warmly beside the distant clock tower!
          drawSunriseBloom(ctx, 845, lerp(920, 790, pullBackReveal), 1.0, 150);
        },
      },

      // Layer 5: Vast golden-lit metropolis & clock tower reading 12:05 moving forward into tomorrow!
      distantSkyline: {
        depth: 0.4,
        parallaxX: 0.36,
        parallaxY: 0.3,
        draw: (ctx) => {
          drawDistantSkyline(ctx, {
            width,
            yBase: 1265,
            dawn: 1.0,
            windowWake: 0.72,
            seed: 6103,
          });

          // Clock tower now past midnight and smoothly ticking forward!
          drawGiantClockTower(ctx, {
            x: 705,
            yBase: 1365,
            scale: 0.68,
            dawn: 1.0,
            minuteProgress: 1.0 + localFrame * 0.0008,
            gearSpin: localFrame * 0.045,
            glowIntensity: 1.05,
            frame,
          });

          // Free morning birds gliding peacefully across the sunlit sky
          drawFlyingBirds(ctx, {
            birds: [
              { startX: 80, startY: 540, endX: 980, endY: 360, arcHeight: -70, scale: 0.78, loopFrames: 300, offset: 40 },
              { startX: 180, startY: 610, endX: 1050, endY: 420, arcHeight: -55, scale: 0.62, loopFrames: 300, offset: 85 },
              { startX: -40, startY: 490, endX: 890, endY: 310, arcHeight: -80, scale: 0.68, loopFrames: 300, offset: 15 },
              { startX: 320, startY: 660, endX: 1120, endY: 490, arcHeight: -45, scale: 0.54, loopFrames: 300, offset: 120 },
            ],
            frame,
            color: '#fff9eb',
            outline: '#6e4e5c',
            opacity: 0.9,
          });

          drawDepthHaze(ctx, width, height, '#f7bc8b', 0.36, 860, 1500);
        },
      },

      // Layer 4: Sunlit midground architecture, viaduct & smoothly gliding morning commuter train
      midground: {
        depth: 0.68,
        parallaxX: 0.65,
        parallaxY: 0.56,
        draw: (ctx) => {
          drawMidgroundArchitecture(ctx, {
            width,
            yBase: 1525,
            dawn: 1.0,
            windowWake: 0.65,
            includeViaduct: true,
            viaductY: 1245,
            seed: 6409,
          });

          // Morning train moving peacefully forward across the sunlit bridge
          drawElevatedTrain(ctx, {
            x: lerp(-120, 1280, localFrame / 300),
            y: 1245,
            cars: 5,
            scale: 0.78,
            dawn: 1.0,
            direction: 1,
          });

          drawDepthHaze(ctx, width, height, '#f5c798', 0.25, 1180, 1680);
        },
      },

      // Layer 3: Nova bathed in golden sunrise light holding her worn, faded photograph!
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.92,
        draw: (ctx) => {
          // Nova on sunlit overlook balcony / hillside terrace
          const novaScale = lerp(2.15, 1.38, pullBackReveal);
          const novaX = lerp(385, 340, pullBackReveal);
          const novaY = lerp(1355, 1585, pullBackReveal);

          drawNova(ctx, createDefaultNovaPose({
            frame: localFrame,
            view: pullBackReveal > 0.62 ? 'threeQuarter' : 'closeup',
            x: novaX,
            y: novaY,
            scale: novaScale,
            facing: 1,
            headTilt: lerp(0.18, -0.14, lookUpToSunrise),
            eyeOpen: lerp(0.82, 0.95, softSmile),
            pupilX: lerp(0.55, 0.72, lookUpToSunrise),
            pupilY: lerp(0.45, -0.22, lookUpToSunrise),
            eyebrowAngle: lerp(-0.22, 0.02, softSmile),
            eyebrowLift: lerp(0.05, 0.22, softSmile),
            mouthExpr: softSmile > 0.28 ? 'softSmile' : 'neutral',
            blush: 0.35,
            tearProgress: tearRoll,
            rightArmAngle: -0.58,
            rightForearmAngle: -0.45,
            leftArmAngle: 0.25,
            leftForearmAngle: -0.35,
            watchLightOnFace: 0.75, // warm sunrise bounce glow on her face
            rimColor: PALETTE.goldenSunrise,
            rimIntensity: 1.0,
            windStrength: 0.62,
            scarfPhase: localFrame * 0.12,
            hairPhase: localFrame * 0.1,
          }));

          // Hero worn sepia photograph held gently in Nova's hands (fades gracefully back during final pull-back)
          const photoOpacity = clamp(1 - segmentProgress(localFrame, 210, 265, EASING.easeInOutSine), 0, 1);
          if (photoOpacity > 0.02) {
            ctx.save();
            ctx.globalAlpha = photoOpacity;
            drawFadingPhotograph(ctx, {
              x: lerp(655, 610, pullBackReveal),
              y: lerp(1415, 1460, pullBackReveal),
              scale: lerp(1.12, 0.85, pullBackReveal),
              rotation: -0.11 + Math.sin(localFrame * 0.03) * 0.015,
              fadeAmount: 0.94, // Mother's face tenderly erased into warm sunlit glow
              withHands: true,
            });
            ctx.restore();
          }
        },
      },

      // Layer 1: Sunlit overhanging blossom branches & overlook balcony railing framing the final tableau
      foreground: {
        depth: 1.54,
        parallaxX: 1.72,
        parallaxY: 1.32,
        draw: (ctx) => {
          drawForegroundFrameSilhouettes(ctx, {
            width,
            height,
            dawn: 1.0,
            blossoms: true,
            railing: true,
            frame,
          });
        },
      },

      // Layer 7: Warm golden sunrise shafts, drifting cherry blossom petals & morning motes
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          drawVolumetricLightShafts(ctx, {
            originX: 860,
            originY: 620,
            count: 7,
            spread: 1100,
            length: 1850,
            angle: -0.52,
            color: PALETTE.goldenSunrise,
            opacity: 0.24,
            frame,
          });

          drawCherryBlossoms(ctx, {
            width,
            height,
            count: 34,
            frame,
            opacity: 0.88,
            seed: 6701,
          });

          drawGlowingMotes(ctx, {
            count: 64,
            frame,
            color: '#fff6d4',
            opacity: 0.82,
            speed: 0.65,
            seed: 6801,
          });
        },
      },
    };
  }
}
