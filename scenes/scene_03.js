/**
 * SCENE 03 — THE CITY REPEATS (Frames 601–900)
 *
 * Nova sprints through the midnight city as visual loops repeat around her in rhythmic
 * synchronization: the same vintage car crossing the red-light intersection, the same
 * white dove flying past the spire, the same pedestrian dropping the same newspaper,
 * and the same train entering the viaduct. Nova halts and raises the glowing pocket watch—
 * revealing an enormous illustrated repeating timeline across the midnight sky.
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, loopPhase, segmentProgress } from '../engine/animation.js';
import { lerp, rgba } from '../engine/math.js';
import {
  drawDepthHaze,
  drawMoon,
  drawPaintedClouds,
  drawSkyGradient,
  drawWetStreetReflections,
} from '../effects/atmosphere.js';
import { drawVolumetricLightShafts } from '../effects/lighting.js';
import {
  drawFallingNewspaper,
  drawFlyingBirds,
  drawGlowingMotes,
  drawRain,
} from '../effects/particles.js';
import { drawSkyTimeline } from '../effects/time_effects.js';
import {
  drawDistantSkyline,
  drawElevatedTrain,
  drawForegroundFrameSilhouettes,
  drawGiantClockTower,
  drawMidgroundArchitecture,
  drawTrafficSignal,
  drawUmbrellaPedestrian,
  drawVintageCar,
  drawVintageStreetlamp,
} from '../environments/city.js';
import { createDefaultNovaPose, createRunPose, drawNova } from '../characters/nova.js';

export class Scene03CityRepeats extends Scene {
  constructor() {
    super(SCENES[2]);
  }

  updateCamera(state) {
    // Dynamic horizontal tracking while Nova runs -> dramatic crane tilt UP for the sky timeline!
    this.camera.applyTrack([
      { t: 0.0, value: { x: -180, y: 170, zoom: 1.08, orbitX: -0.32, orbitY: 0.05, focusDepth: 1.0, shakeAmplitude: 3.2 } },
      { t: 0.48, value: { x: 145, y: 160, zoom: 1.12, orbitX: 0.3, orbitY: 0.02, focusDepth: 1.0, shakeAmplitude: 3.8 }, ease: EASING.easeInOutSine },
      { t: 0.62, value: { x: 20, y: 40, zoom: 1.02, orbitX: 0.08, orbitY: -0.1, focusDepth: 0.85, shakeAmplitude: 1.8 }, ease: EASING.easeInOutCubic },
      { t: 1.0, value: { x: 0, y: -230, zoom: 0.94, orbitX: -0.18, orbitY: -0.3, focusDepth: 0.65, shakeAmplitude: 1.1 }, ease: EASING.easeInOutCubic },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    // Synchronized 54-frame city reset loop so every repeating element visibly snaps back!
    const cityLoopLen = 54;
    const loopP = loopPhase(localFrame, cityLoopLen, 0);
    const resetFlash = loopP < 0.14 ? (1 - loopP / 0.14) : 0;

    // Nova runs across frames 1..155, then halts and raises the watch (156..300)
    const isRunning = localFrame <= 155;
    const runProgress = segmentProgress(localFrame, 1, 155, EASING.easeInOutSine);
    const raiseWatch = segmentProgress(localFrame, 160, 195, EASING.easeOutBack);
    const timelineReveal = segmentProgress(localFrame, 178, 252, EASING.easeOutCubic);

    return {
      // Layer 6: Midnight sky, moon, clouds, and the enormous glowing repeating timeline!
      sky: {
        depth: 0.16,
        parallaxX: 0.16,
        parallaxY: 0.14,
        draw: (ctx) => {
          drawSkyGradient(ctx, width, height, 0, frame);
          drawMoon(ctx, 210, 190, 82, 0.92);
          drawPaintedClouds(ctx, {
            width,
            yBase: 270,
            spreadY: 260,
            count: 8,
            frame,
            speed: 0.5,
            dawn: 0,
            seed: 301,
          });

          // Enormous illustrated repeating timeline arcing across the night sky!
          drawSkyTimeline(ctx, {
            cx: 540,
            cy: 560,
            width: 980,
            reveal: timelineReveal,
            frame,
            opacity: 0.98,
          });
        },
      },

      // Layer 5: Distant skyline & 11:59 clock tower
      distantSkyline: {
        depth: 0.42,
        parallaxX: 0.4,
        parallaxY: 0.34,
        draw: (ctx) => {
          drawDistantSkyline(ctx, {
            width,
            yBase: 1210,
            dawn: 0,
            windowWake: 0.3,
            seed: 3103,
          });

          drawGiantClockTower(ctx, {
            x: 845,
            yBase: 1350,
            scale: 0.72,
            dawn: 0,
            minuteProgress: 0,
            gearSpin: 0.12,
            glowIntensity: 0.85,
            frame,
          });

          // Repeating white dove flying past the spire on exact 54-frame loop!
          drawFlyingBirds(ctx, {
            birds: [
              {
                startX: 110,
                startY: 940,
                endX: 780,
                endY: 820,
                arcHeight: -105,
                scale: 1.28,
                phase: loopP,
                flapSpeed: 0.36,
              },
            ],
            frame,
            color: '#f2f8ff',
            opacity: 0.94,
          });

          drawDepthHaze(ctx, width, height, '#172c58', 0.46, 860, 1460);
        },
      },

      // Layer 4: Midground buildings & repeating illuminated viaduct train
      midground: {
        depth: 0.72,
        parallaxX: 0.7,
        parallaxY: 0.62,
        draw: (ctx) => {
          drawMidgroundArchitecture(ctx, {
            width,
            yBase: 1470,
            dawn: 0,
            windowWake: 0.32,
            includeViaduct: true,
            viaductY: 1180,
            seed: 3409,
          });

          // Same illuminated train repeatedly entering the viaduct arch every 54 frames
          drawElevatedTrain(ctx, {
            x: lerp(210, 880, loopP),
            y: 1180,
            cars: 4,
            scale: 0.84,
            dawn: 0,
            direction: 1,
          });

          // Ghost echo silhouette of train right on loop reset
          if (resetFlash > 0.05) {
            ctx.save();
            ctx.globalAlpha = resetFlash * 0.35;
            drawElevatedTrain(ctx, {
              x: 860,
              y: 1180,
              cars: 4,
              scale: 0.84,
              dawn: 0,
              direction: 1,
            });
            ctx.restore();
          }
        },
      },

      // Layer 3: Wet street with repeating car, repeating newspaper pedestrian, and Nova running / raising watch
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.92,
        draw: (ctx) => {
          drawWetStreetReflections(ctx, {
            width,
            yTop: 1400,
            height: 620,
            dawn: 0,
            frame,
            lampPositions: [165, 595, 945],
          });

          drawVintageStreetlamp(ctx, 165, 1525, 0.88, 0.85);
          drawTrafficSignal(ctx, 470, 1495, false, 0.88);
          drawVintageStreetlamp(ctx, 945, 1530, 0.9, 0.85);

          // Same vintage car repeatedly crossing and snapping back at the red-light intersection!
          drawVintageCar(ctx, {
            x: lerp(140, 445, loopP),
            y: 1515,
            scale: 0.88,
            direction: 1,
            color: '#263a63',
            headlights: true,
          });

          // Same umbrella pedestrian dropping the same newspaper repeatedly
          drawUmbrellaPedestrian(ctx, {
            x: lerp(790, 915, loopP),
            y: 1540,
            scale: 0.84,
            direction: 1,
            walkPhase: loopP * Math.PI * 6,
            opacity: 0.88,
          });
          drawFallingNewspaper(ctx, {
            startX: 830,
            startY: 1380,
            endX: 780,
            endY: 1625,
            frame: localFrame,
            loopFrames: cityLoopLen,
            phaseOffset: 0,
            scale: 0.78,
          });

          // Nova running briskly across avenue -> stops & turns back-3/4 raising the glowing pocket watch!
          if (isRunning) {
            drawNova(ctx, createRunPose(localFrame, {
              x: lerp(140, 560, runProgress),
              y: 1685,
              scale: 1.12,
              facing: 1,
              holdingWatch: true,
              watchGlow: 0.95,
              watchOpen: 1,
              watchGearAngle: localFrame * 0.1,
              rimColor: PALETTE.electricCyan,
              rimIntensity: 0.65,
            }));
          } else {
            // Hero back-3/4 pose raising the glowing pocket watch toward the repeating sky timeline
            drawNova(ctx, createDefaultNovaPose({
              frame: localFrame,
              view: 'backThreeQuarter',
              x: 525,
              y: 1680,
              scale: 1.24,
              facing: 1,
              headTilt: -0.22,
              rightArmAngle: lerp(-0.4, -2.18, raiseWatch),
              rightForearmAngle: lerp(-0.5, -0.25, raiseWatch),
              leftArmAngle: 0.25,
              leftForearmAngle: -0.3,
              holdingWatch: true,
              watchGlow: 1.25,
              watchOpen: 1,
              watchGearAngle: localFrame * 0.12,
              windStrength: 0.95,
              scarfPhase: localFrame * 0.18,
              hairPhase: localFrame * 0.15,
              rimColor: PALETTE.brightGold,
              rimIntensity: 0.85,
            }));
          }
        },
      },

      // Layer 2: Near silhouettes & match-cut temporal echo vignette strips on reset beat
      nearArchitecture: {
        depth: 1.28,
        parallaxX: 1.38,
        parallaxY: 1.15,
        draw: (ctx) => {
          drawVintageStreetlamp(ctx, -35, 1810, 1.35, 0.78);
          drawVintageStreetlamp(ctx, 1115, 1820, 1.35, 0.78);
        },
      },

      // Layer 1: Foreground framing silhouettes
      foreground: {
        depth: 1.56,
        parallaxX: 1.75,
        parallaxY: 1.35,
        draw: (ctx) => {
          drawForegroundFrameSilhouettes(ctx, {
            width,
            height,
            dawn: 0,
            blossoms: false,
            frame,
          });
        },
      },

      // Layer 7: Atmospheric beam from watch to timeline, temporal glitch pulse & suspended rain
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          // Subtle cyan temporal pulse right as the city resets on beat
          if (resetFlash > 0.04 && isRunning) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = rgba(PALETTE.electricCyan, resetFlash * 0.12);
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          }

          // Golden light beam projecting upward from Nova's raised watch to the sky timeline
          if (timelineReveal > 0.02) {
            drawVolumetricLightShafts(ctx, {
              originX: 590,
              originY: 1320,
              count: 4,
              spread: 260,
              length: 980,
              angle: Math.PI, // straight upward beam
              color: PALETTE.brightGold,
              opacity: 0.16 * timelineReveal,
              frame,
            });
          }

          drawRain(ctx, {
            width,
            height,
            count: 95,
            frame,
            fallFactor: 0.18,
            color: '#9ce6ff',
            opacity: 0.52,
            seed: 3701,
          });

          drawGlowingMotes(ctx, {
            count: 44,
            frame,
            color: PALETTE.brightGold,
            opacity: 0.72 * Math.max(0.35, timelineReveal),
            seed: 3801,
          });
        },
      },
    };
  }
}
