/**
 * SCENE 04 — THE PRICE OF TOMORROW (Frames 901–1200)
 *
 * The pocket watch projects Nova's most precious memory: a warm golden-sunset portrait
 * of young Nova laughing in her mother's loving embrace, framed by drifting blossoms.
 * As golden filaments pull from the memory into the watch's gears, the mother's image
 * shimmers and begins to dissolve—revealing the heartbreaking price. Nova's hand trembles
 * while the city behind her remains cold and frozen at midnight.
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, segmentProgress } from '../engine/animation.js';
import { lerp, rgba, TAU } from '../engine/math.js';
import {
  drawDepthHaze,
  drawMoon,
  drawPaintedClouds,
  drawSkyGradient,
} from '../effects/atmosphere.js';
import { drawCherryBlossoms, drawGlowingMotes, drawRain } from '../effects/particles.js';
import { drawMemoryPortalFrame, drawPocketWatch } from '../effects/time_effects.js';
import {
  drawDistantSkyline,
  drawForegroundFrameSilhouettes,
  drawGiantClockTower,
} from '../environments/city.js';
import { drawMotherAndNovaMemory } from '../environments/memory_world.js';
import { createDefaultNovaPose, drawNova } from '../characters/nova.js';

export class Scene04PriceOfTomorrow extends Scene {
  constructor() {
    super(SCENES[3]);
  }

  updateCamera(state) {
    // Gentle emotional orbital drift + slow intimate push-in as Nova realizes the price
    this.camera.applyTrack([
      { t: 0.0, value: { x: -24, y: -35, zoom: 0.98, orbitX: -0.28, orbitY: -0.06, focusDepth: 1.0, shakeAmplitude: 0.8 } },
      { t: 0.45, value: { x: 10, y: 12, zoom: 1.06, orbitX: 0.14, orbitY: 0.04, focusDepth: 1.0, shakeAmplitude: 0.7 }, ease: EASING.easeInOutSine },
      { t: 0.78, value: { x: 26, y: 38, zoom: 1.15, orbitX: 0.34, orbitY: 0.08, focusDepth: 1.02, shakeAmplitude: 1.4 }, ease: EASING.easeInOutCubic },
      { t: 1.0, value: { x: 34, y: 48, zoom: 1.2, orbitX: 0.4, orbitY: 0.1, focusDepth: 1.02, shakeAmplitude: 1.8 }, ease: EASING.easeInOutSine },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    const portalReveal = segmentProgress(localFrame, 12, 76, EASING.easeOutCubic);
    const realizePrice = segmentProgress(localFrame, 150, 235, EASING.easeInOutCubic);
    const memoryDissolve = segmentProgress(localFrame, 168, 290, EASING.easeInOutSine);
    const tremble = segmentProgress(localFrame, 185, 255, EASING.easeOutQuad);

    return {
      // Layer 6: Cold midnight sky behind the warm memory projection
      sky: {
        depth: 0.12,
        draw: (ctx) => {
          drawSkyGradient(ctx, width, height, 0, frame);
          drawMoon(ctx, 180, 210, 76, 0.82);
          drawPaintedClouds(ctx, {
            width,
            yBase: 260,
            spreadY: 220,
            count: 7,
            frame: 901, // frozen midnight sky
            speed: 0,
            dawn: 0,
            seed: 401,
          });
        },
      },

      // Layer 5: Frozen distant city & 11:59 clock tower reminding us midnight hasn't moved
      distantSkyline: {
        depth: 0.38,
        parallaxX: 0.35,
        parallaxY: 0.28,
        blur: 1.4,
        draw: (ctx) => {
          drawDistantSkyline(ctx, {
            width,
            yBase: 1460,
            dawn: 0,
            windowWake: 0.2,
            seed: 4103,
          });
          drawGiantClockTower(ctx, {
            x: 245,
            yBase: 1580,
            scale: 0.74,
            dawn: 0,
            minuteProgress: 0,
            gearSpin: 0.12,
            glowIntensity: 0.55,
            frame: 901,
          });
          drawDepthHaze(ctx, width, height, '#0c132d', 0.68, 520, 1750);
        },
      },

      // Layer 4: Luminous golden projection beam rising from watch into the floating memory orb
      midground: {
        depth: 0.78,
        parallaxX: 0.75,
        parallaxY: 0.68,
        draw: (ctx) => {
          if (portalReveal > 0.02) {
            // Warm beam connecting watch (x=540, y=1320) to memory portal (x=420, y=735)
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            const beam = ctx.createLinearGradient(540, 1340, 420, 680);
            beam.addColorStop(0, rgba(PALETTE.brightGold, 0.52 * portalReveal));
            beam.addColorStop(0.55, rgba(PALETTE.warmAmber, 0.22 * portalReveal));
            beam.addColorStop(1, rgba(PALETTE.dawnRose, 0));
            ctx.fillStyle = beam;
            ctx.beginPath();
            ctx.moveTo(510, 1340);
            ctx.lineTo(585, 1340);
            ctx.lineTo(750, 740);
            ctx.lineTo(95, 740);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Hand-painted sunset memory of Mother & young Nova!
            drawMotherAndNovaMemory(ctx, {
              cx: 415,
              cy: 735,
              rx: 325,
              ry: 260,
              reveal: portalReveal,
              dissolve: memoryDissolve * 0.78,
              frame,
            });

            // Glowing ethereal blossom-tinted frame
            drawMemoryPortalFrame(ctx, 415, 735, 325, 260, portalReveal, memoryDissolve, frame);

            // Golden memory threads being drawn down into the pocket watch to signify the sacrifice!
            if (realizePrice > 0.05) {
              ctx.save();
              ctx.globalCompositeOperation = 'screen';
              for (let s = 0; s < 5; s += 1) {
                const startX = 240 + s * 92;
                const startY = 895 + Math.sin(s * 1.4) * 40;
                const ctrlX = lerp(startX, 540, 0.5) + Math.sin(frame * 0.08 + s) * 45;
                const ctrlY = 1120;
                ctx.strokeStyle = rgba(PALETTE.goldenSunrise, realizePrice * 0.55);
                ctx.lineWidth = 2.6;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.quadraticCurveTo(ctrlX, ctrlY, 540, 1315);
                ctx.stroke();

                // Traveling golden bead flowing into watch
                const bt = ((localFrame * 0.025 + s * 0.21) % 1);
                const bx = (1 - bt) * (1 - bt) * startX + 2 * (1 - bt) * bt * ctrlX + bt * bt * 540;
                const by = (1 - bt) * (1 - bt) * startY + 2 * (1 - bt) * bt * ctrlY + bt * bt * 1315;
                ctx.fillStyle = '#fff9de';
                ctx.beginPath();
                ctx.arc(bx, by, 5, 0, TAU);
                ctx.fill();
              }
              ctx.restore();
            }
          }
        },
      },

      // Layer 3: Intimate close-up of Nova gazing sorrowfully at the memory, hand trembling on watch
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.92,
        draw: (ctx) => {
          // Nova positioned on right looking left toward the memory & watch
          drawNova(ctx, createDefaultNovaPose({
            frame: localFrame,
            view: 'closeup',
            x: 825,
            y: 1380,
            scale: 2.38,
            facing: -1,
            headTilt: lerp(0.06, 0.18, realizePrice),
            eyeOpen: lerp(1.0, 0.86, realizePrice),
            pupilX: 0.55,
            pupilY: lerp(-0.18, 0.3, realizePrice),
            eyebrowAngle: lerp(-0.15, -0.52, realizePrice),
            eyebrowLift: lerp(0.15, 0.35, realizePrice),
            mouthExpr: realizePrice > 0.3 ? 'sad' : 'neutral',
            blush: 0.32,
            tearProgress: realizePrice * 0.45,
            rightArmAngle: -0.68,
            rightForearmAngle: -0.45,
            handTremble: tremble,
            watchLightOnFace: 0.95,
            rimColor: PALETTE.goldenSunrise,
            rimIntensity: 0.9,
            windStrength: 0.28,
            scarfPhase: localFrame * 0.07,
            hairPhase: localFrame * 0.06,
          }));

          // Hero glowing pocket watch trembling subtly in Nova's hands
          const tx = Math.sin(frame * 1.9) * tremble * 4.5;
          const ty = Math.cos(frame * 2.3) * tremble * 3.0;
          drawPocketWatch(ctx, {
            x: 540 + tx,
            y: 1345 + ty,
            radius: 96,
            openAmount: 1,
            glowIntensity: 1.12,
            gearAngle: localFrame * 0.055,
            minuteHandProgress: 0,
            rotation: 0.08,
            frame,
          });
        },
      },

      // Layer 1: Soft dark foreground edge framing
      foreground: {
        depth: 1.5,
        parallaxX: 1.65,
        parallaxY: 1.3,
        draw: (ctx) => {
          drawForegroundFrameSilhouettes(ctx, {
            width,
            height,
            dawn: 0,
            blossoms: false,
            frame: 901,
          });
        },
      },

      // Layer 7: Drifting warm cherry blossoms, golden embers, and frozen midnight raindrops
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          drawRain(ctx, {
            width,
            height,
            count: 55,
            frame: 901, // frozen midnight rain in background
            fallFactor: 0,
            color: '#9ce6ff',
            opacity: 0.35,
            seed: 4701,
          });

          drawCherryBlossoms(ctx, {
            centerX: 425,
            centerY: 745,
            spreadRadius: 430,
            count: 26,
            frame,
            opacity: portalReveal * 0.85,
            seed: 4801,
          });

          drawGlowingMotes(ctx, {
            xMin: 120,
            xMax: 920,
            yMin: 400,
            yMax: 1680,
            count: 52,
            frame,
            color: PALETTE.goldenSunrise,
            opacity: 0.85 * portalReveal,
            speed: 0.72,
            seed: 4901,
          });
        },
      },
    };
  }
}
