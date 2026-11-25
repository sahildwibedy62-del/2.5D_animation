/**
 * SCENE 01 — THE ENDLESS NIGHT (Frames 1–300)
 *
 * Opens high above the colossal midnight metropolis & glowing 11:59 PM clock tower,
 * descends through multi-plane depth layers to a rain-slick cobblestone street where
 * traffic is frozen, umbrella pedestrians repeat, raindrops hang suspended in air,
 * and Nova spots a falling newspaper suddenly reset back upward.
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, evaluateKeyframes, loopPhase, segmentProgress } from '../engine/animation.js';
import { clamp, lerp, rgba } from '../engine/math.js';
import {
  drawDepthHaze,
  drawMoon,
  drawPaintedClouds,
  drawSkyGradient,
  drawWetStreetReflections,
} from '../effects/atmosphere.js';
import { drawVolumetricLightShafts } from '../effects/lighting.js';
import { drawFallingNewspaper, drawGlowingMotes, drawRain } from '../effects/particles.js';
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
import { createDefaultNovaPose, createWalkPose, drawNova } from '../characters/nova.js';

export class Scene01EndlessNight extends Scene {
  constructor() {
    super(SCENES[0]);
  }

  updateCamera(state) {
    // Sweeping crane descent from the towering 11:59 clock skyline down to Nova on the street
    this.camera.applyTrack([
      { t: 0.0, value: { x: 45, y: -510, zoom: 0.92, orbitX: -0.35, orbitY: -0.2, focusDepth: 0.65, shakeAmplitude: 1.5 } },
      { t: 0.34, value: { x: 20, y: -320, zoom: 1.02, orbitX: -0.1, orbitY: -0.05, focusDepth: 0.8, shakeAmplitude: 1.8 }, ease: EASING.easeInOutSine },
      { t: 0.68, value: { x: -35, y: 120, zoom: 1.08, orbitX: 0.25, orbitY: 0.1, focusDepth: 1.0, shakeAmplitude: 2.0 }, ease: EASING.easeInOutCubic },
      { t: 1.0, value: { x: 22, y: 205, zoom: 1.24, orbitX: 0.42, orbitY: 0.14, focusDepth: 1.0, shakeAmplitude: 1.2 }, ease: EASING.easeInOutCubic },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    // Repeating 84-frame loop for pedestrians and newspaper reset
    const pedPhase = loopPhase(localFrame, 84, 0);
    const newsLoop = 84;

    // Nova walks in from left (frames 105..215), then crouches and reaches toward the resetting newspaper (215..300)
    const walkProgress = segmentProgress(localFrame, 105, 215, EASING.easeOutCubic);
    const crouchBlend = segmentProgress(localFrame, 215, 240, EASING.easeInOutCubic);
    const novaX = lerp(110, 415, walkProgress);
    const novaY = 1690;

    // Suspicion intensifies right after the newspaper snaps back around localFrame 252
    const suspicious = segmentProgress(localFrame, 248, 268, EASING.easeOutQuad);

    return {
      // Layer 6: Midnight sky, moon, drifting painted clouds
      sky: {
        depth: 0.12,
        draw: (ctx) => {
          drawSkyGradient(ctx, width, height, 0, frame);
          drawMoon(ctx, 410, 175, 96, 0.96);
          drawPaintedClouds(ctx, {
            width,
            yBase: 310,
            spreadY: 280,
            count: 9,
            frame,
            speed: 0.42,
            dawn: 0,
            seed: 101,
          });
        },
      },

      // Layer 5: Distant gothic spire skyline & monumental 11:59 clock tower
      distantSkyline: {
        depth: 0.42,
        parallaxX: 0.38,
        parallaxY: 0.34,
        draw: (ctx) => {
          drawDistantSkyline(ctx, {
            width,
            yBase: 1180,
            dawn: 0,
            windowWake: 0.32,
            seed: 1103,
          });

          // Giant Clock Tower dominating the upper-right midnight skyline, frozen at 11:59 PM
          drawGiantClockTower(ctx, {
            x: 785,
            yBase: 1320,
            scale: 0.88,
            dawn: 0,
            minuteProgress: 0,
            gearSpin: 0.12, // gears frozen
            glowIntensity: 0.92,
            frame,
          });

          drawDepthHaze(ctx, width, height, '#182c57', 0.48, 720, 1480);
        },
      },

      // Layer 4: Midground Gothic architecture, elevated viaduct, frozen vintage train
      midground: {
        depth: 0.72,
        parallaxX: 0.68,
        parallaxY: 0.62,
        draw: (ctx) => {
          drawMidgroundArchitecture(ctx, {
            width,
            yBase: 1480,
            dawn: 0,
            windowWake: 0.34,
            includeViaduct: true,
            viaductY: 1155,
            seed: 1409,
          });

          // Elevated train stuck in tiny repeating glide along viaduct
          const trainX = lerp(320, 620, loopPhase(localFrame, 150, 20));
          drawElevatedTrain(ctx, {
            x: trainX,
            y: 1155,
            cars: 4,
            scale: 0.82,
            dawn: 0,
            direction: 1,
          });

          drawDepthHaze(ctx, width, height, '#102042', 0.44, 1180, 1680);
        },
      },

      // Layer 3: Wet cobblestone avenue, frozen cars, repeating pedestrians, Nova & resetting newspaper
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.94,
        draw: (ctx) => {
          drawWetStreetReflections(ctx, {
            width,
            yTop: 1410,
            height: 620,
            dawn: 0,
            frame,
            lampPositions: [145, 585, 955],
            freeze: true,
          });

          // Streetlamps & glowing red traffic light
          drawVintageStreetlamp(ctx, 145, 1530, 0.88, 0.9);
          drawVintageStreetlamp(ctx, 955, 1535, 0.92, 0.88);
          drawTrafficSignal(ctx, 840, 1505, false, 0.82);

          // Frozen vintage sedan stopped at the red light
          drawVintageCar(ctx, {
            x: 720,
            y: 1515,
            scale: 0.86,
            direction: -1,
            color: '#203052',
            headlights: true,
          });

          // Repeating umbrella pedestrians walking identical short loops
          const peds = [
            { x0: 210, x1: 355, y: 1520, s: 0.78, dir: 1, off: 0 },
            { x0: 540, x1: 685, y: 1510, s: 0.74, dir: 1, off: 28 },
            { x0: 880, x1: 745, y: 1525, s: 0.8, dir: -1, off: 52 },
          ];
          for (let i = 0; i < peds.length; i += 1) {
            const p = peds[i];
            const lp = loopPhase(localFrame, 84, p.off);
            drawUmbrellaPedestrian(ctx, {
              x: lerp(p.x0, p.x1, lp),
              y: p.y,
              scale: p.s,
              direction: p.dir,
              walkPhase: lp * Math.PI * 6,
              opacity: 0.84,
              dawn: 0,
            });
          }

          // Falling newspaper that resets sharply back to rooftop air every 84 frames
          drawFallingNewspaper(ctx, {
            startX: 725,
            startY: 1120,
            endX: 645,
            endY: 1685,
            frame: localFrame,
            loopFrames: newsLoop,
            phaseOffset: 16,
            scale: 0.95,
          });

          // Nova walking alone, then crouching & reaching curiously toward the resetting newspaper
          let novaPose;
          if (crouchBlend < 0.5) {
            novaPose = createWalkPose(localFrame, {
              x: novaX,
              y: novaY,
              scale: 1.08,
              facing: 1,
              pupilX: 0.5,
              pupilY: 0.15,
              mouthExpr: 'neutral',
              rimColor: PALETTE.electricCyan,
              rimIntensity: 0.55,
            });
          } else {
            novaPose = createDefaultNovaPose({
              frame: localFrame,
              view: 'crouch',
              x: novaX,
              y: novaY + 12,
              scale: 1.12,
              facing: 1,
              headTilt: lerp(0.18, -0.06, suspicious),
              pupilX: 0.65,
              pupilY: lerp(0.45, -0.35, suspicious),
              eyebrowAngle: lerp(0.05, 0.42, suspicious),
              eyebrowLift: lerp(0.1, -0.2, suspicious),
              mouthExpr: suspicious > 0.45 ? 'suspicious' : 'wonder',
              rightArmAngle: -0.95,
              rightForearmAngle: -0.35,
              leftArmAngle: 0.35,
              leftForearmAngle: -0.45,
              windStrength: 0.68,
              scarfPhase: localFrame * 0.12,
              hairPhase: localFrame * 0.1,
              rimColor: PALETTE.electricCyan,
              rimIntensity: 0.62,
            });
          }
          drawNova(ctx, novaPose);
        },
      },

      // Layer 2: Near wrought-iron streetlamp column sliding past in foreground parallax
      nearArchitecture: {
        depth: 1.28,
        parallaxX: 1.35,
        parallaxY: 1.15,
        draw: (ctx) => {
          drawVintageStreetlamp(ctx, -18, 1790, 1.38, 0.95);
          drawVintageStreetlamp(ctx, 1110, 1815, 1.32, 0.72);
        },
      },

      // Layer 1: Foreground framing foliage & dark eave silhouettes
      foreground: {
        depth: 1.58,
        parallaxX: 1.78,
        parallaxY: 1.4,
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

      // Layer 7: Volumetric moonlight shafts, suspended crystalline raindrops & subtle glowing dust
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          drawVolumetricLightShafts(ctx, {
            originX: 430,
            originY: 60,
            count: 6,
            spread: 900,
            length: 1850,
            angle: 0.28,
            color: '#7cd9ff',
            opacity: 0.14,
            frame,
          });

          // Frozen suspended raindrops floating in mid-air (fallFactor = 0!)
          drawRain(ctx, {
            width,
            height,
            count: 135,
            frame,
            fallFactor: 0,
            color: '#b0ecff',
            opacity: 0.72,
            seed: 1701,
          });

          drawGlowingMotes(ctx, {
            count: 28,
            frame,
            color: PALETTE.electricCyan,
            opacity: 0.45,
            frozen: true,
            seed: 1801,
          });

          // Poetic gold serif opening film title embedded in the upper midnight sky (frames 8..105)
          const titleAlpha = evaluateKeyframes([
            { t: 0, value: 0 },
            { t: 10, value: 0 },
            { t: 32, value: 1, ease: EASING.easeOutCubic },
            { t: 78, value: 1 },
            { t: 106, value: 0, ease: EASING.easeInCubic },
          ], localFrame, 0);

          if (titleAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = clamp(titleAlpha, 0, 1);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(7, 10, 26, 0.85)';
            ctx.shadowBlur = 24;

            ctx.fillStyle = '#f5dea4';
            ctx.font = '600 32px Georgia, "Times New Roman", serif';
            ctx.fillText('THE', 420, 228);

            ctx.font = '700 66px Georgia, "Times New Roman", serif';
            ctx.fillText('CITY THAT', 420, 294);
            ctx.fillText('FORGOT', 420, 368);
            ctx.fillText('TOMORROW', 420, 442);

            // Delicate brass dial arc underline
            ctx.strokeStyle = rgba(PALETTE.warmAmber, 0.72);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(420, 565, 115, Math.PI * 1.25, Math.PI * 1.75);
            ctx.stroke();

            ctx.restore();
          }
        },
      },
    };
  }
}
