/**
 * SCENE 02 — THE POCKET WATCH (Frames 301–600)
 *
 * Nova enters the abandoned Victorian glass-and-iron train station through heavy
 * foreground pillar parallax. She discovers the glowing amber pocket watch on a bench;
 * a close-up reveals animated brass clockwork patterns; when she touches it, the entire
 * station freezes while only Nova and the watch keep moving, and a giant shadow of the
 * clock tower stretches across the station wall.
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, segmentProgress } from '../engine/animation.js';
import { clamp, lerp } from '../engine/math.js';
import { drawDepthHaze } from '../effects/atmosphere.js';
import { drawClockTowerShadow, drawVolumetricLightShafts } from '../effects/lighting.js';
import { drawGlowingMotes, drawRain } from '../effects/particles.js';
import { drawPocketWatch, drawTimeFreezeRipple } from '../effects/time_effects.js';
import {
  drawStationForegroundPillars,
  drawStationPlatformAndBench,
  drawStationTrain,
  drawStationVaultBackdrop,
} from '../environments/station.js';
import { createDefaultNovaPose, createWalkPose, drawNova } from '../characters/nova.js';

export class Scene02PocketWatch extends Scene {
  constructor() {
    super(SCENES[1]);
  }

  updateCamera(state) {
    // Wide sweeping entrance -> dramatic push-in to close-up of watch -> subtle pull-back for tower shadow
    this.camera.applyTrack([
      { t: 0.0, value: { x: -165, y: 15, zoom: 0.96, orbitX: -0.45, orbitY: 0, focusDepth: 1.0, shakeAmplitude: 1.6 } },
      { t: 0.34, value: { x: 25, y: 55, zoom: 1.14, orbitX: -0.05, orbitY: 0.05, focusDepth: 1.0, shakeAmplitude: 1.2 }, ease: EASING.easeInOutCubic },
      { t: 0.64, value: { x: 55, y: 120, zoom: 1.38, orbitX: 0.22, orbitY: 0.08, focusDepth: 1.05, shakeAmplitude: 0.9 }, ease: EASING.easeInOutCubic },
      { t: 0.8, value: { x: 42, y: 80, zoom: 1.18, orbitX: 0.32, orbitY: -0.05, focusDepth: 0.95, shakeAmplitude: 3.4 }, ease: EASING.easeOutCubic },
      { t: 1.0, value: { x: 20, y: -35, zoom: 1.02, orbitX: 0.18, orbitY: -0.18, focusDepth: 0.82, shakeAmplitude: 1.0 }, ease: EASING.easeInOutSine },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    // Story beat timings inside Scene 02 (localFrame 1..300)
    const walkIn = segmentProgress(localFrame, 1, 105, EASING.easeOutCubic);
    const closeupMode = localFrame >= 115 && localFrame <= 220;
    const touchMoment = localFrame >= 198;
    const freezeRipple = segmentProgress(localFrame, 198, 265, EASING.easeOutCubic);
    const shadowReveal = segmentProgress(localFrame, 215, 285, EASING.easeOutCubic);
    const watchGlow = lerp(0.55, 1.0, segmentProgress(localFrame, 45, 205, EASING.easeInOutSine));
    const watchOpen = segmentProgress(localFrame, 118, 155, EASING.easeOutBack);

    // After touch (localFrame 198), station dust & exterior rain freeze solid
    const isStationFrozen = localFrame >= 204;

    return {
      // Layer 6: Deep vaulted cathedral glass station backdrop
      sky: {
        depth: 0.18,
        parallaxX: 0.2,
        parallaxY: 0.14,
        draw: (ctx) => {
          drawStationVaultBackdrop(ctx, {
            width,
            height,
            gearAngle: isStationFrozen ? 0.42 : localFrame * 0.004,
            freezeTint: freezeRipple,
          });
        },
      },

      // Layer 5: Giant clock tower shadow cast ominously across station wall after touch!
      distantSkyline: {
        depth: 0.44,
        parallaxX: 0.42,
        parallaxY: 0.34,
        draw: (ctx) => {
          if (shadowReveal > 0.01) {
            drawClockTowerShadow(ctx, {
              x: 560,
              y: 940,
              scale: lerp(0.85, 1.15, shadowReveal),
              opacity: shadowReveal * 0.72,
              skew: -0.18,
            });
          }

          drawDepthHaze(ctx, width, height, '#13254a', 0.4, 780, 1480);
        },
      },

      // Layer 4: Parked vintage steel-blue tram on station rails
      midground: {
        depth: 0.72,
        parallaxX: 0.7,
        parallaxY: 0.62,
        draw: (ctx) => {
          drawStationTrain(ctx, {
            x: 880,
            y: 1320,
            scale: 0.94,
            headlightIntensity: isStationFrozen ? 0.55 : 0.85,
          });
        },
      },

      // Layer 3: Wet station concourse, antique bench, Nova & glowing pocket watch
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.92,
        draw: (ctx) => {
          drawStationPlatformAndBench(ctx, {
            width,
            yFloor: 1355,
            benchX: 605,
            benchY: 1495,
            watchGlow: localFrame < 115 ? watchGlow : 0.35,
            showBench: !closeupMode,
          });

          if (!closeupMode) {
            // Wide / medium shot: Nova approaches bench (1..114) OR stands amazed as shadow looms (221..300)
            const novaX = localFrame < 115 ? lerp(110, 465, walkIn) : 455;
            const novaY = 1605;

            // Watch rests on bench before Nova picks it up
            if (localFrame < 115) {
              drawPocketWatch(ctx, {
                x: 622,
                y: 1466,
                radius: 20,
                openAmount: 0.25,
                glowIntensity: watchGlow,
                gearAngle: localFrame * 0.03,
                frame,
              });

              const walkPose = localFrame < 95
                ? createWalkPose(localFrame, {
                  x: novaX,
                  y: novaY,
                  scale: 1.08,
                  facing: 1,
                  pupilX: 0.6,
                  pupilY: 0.25,
                  mouthExpr: 'wonder',
                  rimColor: PALETTE.warmAmber,
                  rimIntensity: 0.45,
                })
                : createDefaultNovaPose({
                  frame: localFrame,
                  x: novaX,
                  y: novaY,
                  scale: 1.08,
                  facing: 1,
                  bodyLean: 0.14,
                  headTilt: 0.14,
                  pupilX: 0.72,
                  pupilY: 0.35,
                  mouthExpr: 'wonder',
                  rightArmAngle: -0.65,
                  rightForearmAngle: -0.4,
                  watchLightOnFace: 0.45,
                  rimColor: PALETTE.warmAmber,
                  rimIntensity: 0.65,
                });
              drawNova(ctx, walkPose);
            } else {
              // Post-freeze pull-back: Nova holds glowing watch, looking up in awe at the giant shadow
              const lookUp = segmentProgress(localFrame, 225, 265, EASING.easeOutCubic);
              drawNova(ctx, createDefaultNovaPose({
                frame: localFrame,
                x: novaX,
                y: novaY,
                scale: 1.12,
                facing: 1,
                headTilt: lerp(0.12, -0.26, lookUp),
                pupilX: 0.45,
                pupilY: lerp(0.3, -0.65, lookUp),
                eyebrowLift: 0.45,
                mouthExpr: 'wonder',
                rightArmAngle: -0.78,
                rightForearmAngle: -0.62,
                holdingWatch: true,
                watchGlow: 1.0,
                watchOpen: 1,
                watchGearAngle: localFrame * 0.08,
                watchLightOnFace: 0.85,
                rimColor: PALETTE.warmAmber,
                rimIntensity: 0.8,
                windStrength: 0.52,
                scarfPhase: localFrame * 0.14,
              }));
            }
          } else {
            // Dramatic Close-Up (localFrame 115..220): Nova gazing at the ornate open pocket watch!
            const reach = segmentProgress(localFrame, 175, 202, EASING.easeInOutCubic);

            // Nova upper-body close-up on the left, warmly lit by the watch
            drawNova(ctx, createDefaultNovaPose({
              frame: localFrame,
              view: 'closeup',
              x: 340,
              y: 1120,
              scale: 2.35,
              facing: 1,
              headTilt: 0.14,
              pupilX: 0.68,
              pupilY: 0.38,
              eyebrowLift: 0.38,
              mouthExpr: 'wonder',
              rightArmAngle: lerp(-0.45, -0.82, reach),
              rightForearmAngle: lerp(-0.65, -0.32, reach),
              leftArmAngle: 0.2,
              leftForearmAngle: -0.5,
              watchLightOnFace: 1.0,
              rimColor: PALETTE.brightGold,
              rimIntensity: 0.85,
              windStrength: 0.42,
              scarfPhase: localFrame * 0.11,
              hairPhase: localFrame * 0.09,
            }));

            // Hero Close-Up Ornate Pocket Watch revealing animated brass clockwork patterns!
            drawPocketWatch(ctx, {
              x: 695,
              y: 1205,
              radius: 132,
              openAmount: clamp(watchOpen, 0.25, 1),
              glowIntensity: touchMoment ? 1.15 : 0.92,
              gearAngle: localFrame * (touchMoment ? 0.1 : 0.045),
              minuteHandProgress: 0,
              rotation: -0.1,
              frame,
            });
          }
        },
      },

      // Layer 2 & 1: Heavy foreground riveted iron pillars sliding swiftly in 2.5D parallax
      foreground: {
        depth: 1.56,
        parallaxX: 1.85,
        parallaxY: 1.3,
        draw: (ctx) => {
          drawStationForegroundPillars(ctx, {
            width,
            height,
            positions: [-125, 1065],
            pillarWidth: 140,
            rimColor: isStationFrozen ? PALETTE.electricCyan : '#5da9d6',
          });
        },
      },

      // Layer 7: Moonlight beams, freezing dust motes, temporal freeze shockwave
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          drawVolumetricLightShafts(ctx, {
            originX: 540,
            originY: 80,
            count: 5,
            spread: 860,
            length: 1750,
            angle: 0.24,
            color: isStationFrozen ? '#94f0ff' : '#73c7f5',
            opacity: 0.17,
            frame: isStationFrozen ? 204 : frame,
          });

          // Exterior moonlit raindrops seen through glass vaults — freeze completely on touch!
          drawRain(ctx, {
            width,
            height: 1100,
            count: 55,
            frame: isStationFrozen ? 204 : frame,
            fallFactor: isStationFrozen ? 0 : 0.45,
            color: '#9ce6ff',
            opacity: 0.35,
            seed: 2201,
          });

          // Warm glowing golden dust motes rising off the pocket watch (always moving!)
          drawGlowingMotes(ctx, {
            xMin: 320,
            xMax: 840,
            yMin: 720,
            yMax: 1620,
            count: 42,
            frame,
            color: PALETTE.brightGold,
            opacity: 0.85,
            speed: 0.95,
            frozen: false,
            seed: 2301,
          });

          // Ambient blue station dust that freezes completely at frame 504!
          drawGlowingMotes(ctx, {
            xMin: 0,
            xMax: width,
            yMin: 200,
            yMax: 1700,
            count: 30,
            frame: isStationFrozen ? 204 : frame,
            color: PALETTE.iceCyan,
            opacity: 0.42,
            frozen: isStationFrozen,
            seed: 2309,
          });

          // Expanding time-freeze distortion shockwave when Nova touches the watch!
          if (touchMoment) {
            drawTimeFreezeRipple(ctx, 680, 1200, freezeRipple);
          }
        },
      },
    };
  }
}
