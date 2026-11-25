/**
 * SCENE 05 — THE FINAL TURN (Frames 1201–1500)
 *
 * Nova closes her eyes and turns the pocket watch crown. An explosive glowing amber
 * chronos wave sweeps across the entire city: the giant clock tower gears whirl alive,
 * suspended raindrops plummet, doves soar, cars and elevated trains roll forward, dark
 * windows ignite, the midnight sky transforms into burnt orange and golden dawn, and
 * the clock finally reaches 12:00—tomorrow arrives!
 */

import { FILM_CONFIG, PALETTE, SCENES } from '../config.js';
import { Scene } from '../engine/scene.js';
import { EASING, segmentProgress } from '../engine/animation.js';
import { clamp, lerp, rgba } from '../engine/math.js';
import {
  drawDepthHaze,
  drawMoon,
  drawPaintedClouds,
  drawSkyGradient,
  drawWetStreetReflections,
} from '../effects/atmosphere.js';
import { drawSunriseBloom, drawVolumetricLightShafts } from '../effects/lighting.js';
import { drawFlyingBirds, drawGlowingMotes, drawRain } from '../effects/particles.js';
import { drawChronosWave, drawPocketWatch } from '../effects/time_effects.js';
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
import { createDefaultNovaPose, drawNova } from '../characters/nova.js';

export class Scene05FinalTurn extends Scene {
  constructor() {
    super(SCENES[4]);
  }

  updateCamera(state) {
    // Tight dramatic close-up on the watch turn -> colossal soaring multi-plane crane across the awakening city!
    this.camera.applyTrack([
      { t: 0.0, value: { x: 25, y: 120, zoom: 1.32, orbitX: 0.25, orbitY: 0.1, focusDepth: 1.0, shakeAmplitude: 1.2 } },
      { t: 0.26, value: { x: 0, y: 80, zoom: 1.38, orbitX: 0.15, orbitY: 0.05, focusDepth: 1.0, shakeAmplitude: 4.5 }, ease: EASING.easeInOutCubic },
      { t: 0.58, value: { x: -65, y: -150, zoom: 1.02, orbitX: -0.35, orbitY: -0.18, focusDepth: 0.72, shakeAmplitude: 2.8 }, ease: EASING.easeOutCubic },
      { t: 1.0, value: { x: 40, y: -330, zoom: 0.92, orbitX: 0.22, orbitY: -0.32, focusDepth: 0.55, shakeAmplitude: 1.2 }, ease: EASING.easeInOutCubic },
    ], state.u, state.frame);
  }

  buildPlanes(state) {
    const { frame, localFrame } = state;
    const { width, height } = FILM_CONFIG;

    // Beat 1: Nova closes eyes & turns the watch crown (localFrame 1..85)
    const closeEyes = segmentProgress(localFrame, 8, 42, EASING.easeInOutCubic);
    const crownTurn = segmentProgress(localFrame, 36, 82, EASING.easeInOutQuad);
    const isCloseupTurn = localFrame <= 88;

    // Beat 2: Golden chronos wave explodes across the city (localFrame 72..265)
    const waveProgress = segmentProgress(localFrame, 72, 265, EASING.easeOutCubic);

    // Beat 3: City awakens — sky shifts from midnight -> burnt orange -> golden dawn!
    const dawnProgress = segmentProgress(localFrame, 90, 295, EASING.easeInOutCubic);
    const rainFall = segmentProgress(localFrame, 95, 165, EASING.easeInCubic);
    const trafficMove = segmentProgress(localFrame, 115, 295, EASING.easeInOutQuad);
    const windowWake = lerp(0.22, 0.96, segmentProgress(localFrame, 105, 250, EASING.easeOutCubic));

    // Beat 4: Giant clock hands sweep dramatically from 11:59 onto 12:00!
    const clockStrike = segmentProgress(localFrame, 185, 245, EASING.easeOutBack);
    const midnightFlash = Math.sin(segmentProgress(localFrame, 232, 285, EASING.linear) * Math.PI);

    return {
      // Layer 6: Dramatic sky transformation from cold midnight indigo to blazing golden dawn!
      sky: {
        depth: 0.14,
        parallaxX: 0.14,
        parallaxY: 0.12,
        draw: (ctx) => {
          drawSkyGradient(ctx, width, height, dawnProgress * 0.92, frame);
          drawMoon(ctx, 210, 215, 86, clamp(1 - dawnProgress * 1.4, 0, 1));
          drawPaintedClouds(ctx, {
            width,
            yBase: 310,
            spreadY: 320,
            count: 10,
            frame,
            speed: lerp(0.1, 1.35, dawnProgress),
            dawn: dawnProgress * 0.92,
            seed: 501,
          });

          // First golden sunrise glow emerging behind the clock tower horizon
          drawSunriseBloom(ctx, 740, 1040, segmentProgress(localFrame, 165, 300, EASING.easeOutCubic), 155);
        },
      },

      // Layer 5: Distant awakening skyline & giant clock tower striking 12:00!
      distantSkyline: {
        depth: 0.44,
        parallaxX: 0.4,
        parallaxY: 0.34,
        draw: (ctx) => {
          drawDistantSkyline(ctx, {
            width,
            yBase: 1255,
            dawn: dawnProgress * 0.9,
            windowWake,
            seed: 5103,
          });

          // Giant Clock Tower awakening! Gears accelerate and hands reach 12:00!
          const gearSpin = 0.12 + segmentProgress(localFrame, 85, 300, EASING.easeInQuad) * 14.5;
          drawGiantClockTower(ctx, {
            x: 695,
            yBase: 1410,
            scale: 0.96,
            dawn: dawnProgress * 0.9,
            minuteProgress: clamp(clockStrike, 0, 1),
            gearSpin,
            glowIntensity: 0.95 + midnightFlash * 0.8,
            frame,
          });

          // Liberated flock of white doves soaring upward across the dawn sky!
          if (localFrame > 110) {
            const flockP = segmentProgress(localFrame, 110, 300, EASING.easeOutQuad);
            drawFlyingBirds(ctx, {
              birds: [
                { startX: 280, startY: 1080, endX: 920, endY: 510, arcHeight: -120, scale: 1.15, phase: flockP },
                { startX: 160, startY: 1140, endX: 830, endY: 590, arcHeight: -95, scale: 0.95, phase: clamp(flockP * 1.12, 0, 1) },
                { startX: 390, startY: 1190, endX: 1020, endY: 640, arcHeight: -140, scale: 0.85, phase: clamp(flockP * 0.94, 0, 1) },
                { startX: 210, startY: 1010, endX: 880, endY: 430, arcHeight: -105, scale: 0.78, phase: clamp(flockP * 1.06, 0, 1) },
              ],
              frame,
              color: '#fff8e8',
              opacity: 0.95,
            });
          }

          drawDepthHaze(ctx, width, height, dawnProgress > 0.45 ? '#e08b63' : '#1b2e5e', 0.34, 880, 1520);
        },
      },

      // Layer 4: Awakening midground architecture & moving viaduct train
      midground: {
        depth: 0.72,
        parallaxX: 0.7,
        parallaxY: 0.62,
        draw: (ctx) => {
          drawMidgroundArchitecture(ctx, {
            width,
            yBase: 1510,
            dawn: dawnProgress * 0.9,
            windowWake,
            includeViaduct: true,
            viaductY: 1215,
            seed: 5409,
          });

          // Elevated illuminated train finally surging forward across the full bridge!
          drawElevatedTrain(ctx, {
            x: lerp(260, 1340, trafficMove),
            y: 1215,
            cars: 5,
            scale: 0.86,
            dawn: dawnProgress * 0.9,
            direction: 1,
          });
        },
      },

      // Layer 3: Street awakening + Nova's decisive turn of the watch!
      action: {
        depth: 1.0,
        parallaxX: 1.0,
        parallaxY: 0.92,
        draw: (ctx) => {
          if (isCloseupTurn) {
            // Intimate dramatic close-up: Nova closes her eyes & turns the watch crown!
            drawNova(ctx, createDefaultNovaPose({
              frame: localFrame,
              view: 'closeup',
              x: 425,
              y: 1220,
              scale: 2.35,
              facing: 1,
              headTilt: 0.1,
              eyeOpen: 1 - closeEyes,
              eyebrowAngle: 0.25,
              mouthExpr: 'determined',
              rightArmAngle: -0.78,
              rightForearmAngle: -0.45,
              watchLightOnFace: 1.0,
              rimColor: PALETTE.brightGold,
              rimIntensity: 0.95,
              windStrength: 0.55 + crownTurn * 0.85,
              scarfPhase: localFrame * 0.16,
              hairPhase: localFrame * 0.14,
            }));

            drawPocketWatch(ctx, {
              x: 680,
              y: 1240,
              radius: 128,
              openAmount: 1,
              glowIntensity: 1.0 + crownTurn * 0.65,
              gearAngle: localFrame * 0.06 + crownTurn * 5.2,
              minuteHandProgress: crownTurn,
              crownTurn: crownTurn * 6,
              rotation: -0.06,
              frame,
            });
          } else {
            // Wide awakening city shot: traffic signal turns GREEN, cars & pedestrians move forward!
            drawWetStreetReflections(ctx, {
              width,
              yTop: 1430,
              height: 620,
              dawn: dawnProgress * 0.92,
              frame,
              lampPositions: [160, 560, 940],
              freeze: false,
            });

            drawVintageStreetlamp(ctx, 160, 1550, 0.88, 1 - dawnProgress * 0.45);
            drawTrafficSignal(ctx, 790, 1515, localFrame > 110, 0.85);

            // Vintage cars finally accelerating past the green light!
            drawVintageCar(ctx, {
              x: lerp(650, 1280, trafficMove),
              y: 1535,
              scale: 0.88,
              direction: 1,
              color: '#344975',
              headlights: true,
            });
            drawVintageCar(ctx, {
              x: lerp(210, 740, trafficMove),
              y: 1545,
              scale: 0.84,
              direction: 1,
              color: '#4e3554',
              headlights: true,
            });

            // Pedestrians walking freely onward (not looping!)
            drawUmbrellaPedestrian(ctx, {
              x: lerp(420, 760, trafficMove),
              y: 1555,
              scale: 0.8,
              direction: 1,
              walkPhase: localFrame * 0.24,
              dawn: dawnProgress,
            });

            // Hero back-3/4 silhouette of Nova gazing up in triumph as the golden wave awakens the clock tower!
            drawNova(ctx, createDefaultNovaPose({
              frame: localFrame,
              view: 'backThreeQuarter',
              x: 265,
              y: 1690,
              scale: 1.38,
              facing: 1,
              headTilt: -0.24,
              rightArmAngle: -1.15,
              rightForearmAngle: -0.35,
              holdingWatch: true,
              watchGlow: lerp(1.4, 0.45, dawnProgress),
              watchOpen: 1,
              watchGearAngle: localFrame * 0.16,
              watchMinuteProgress: 1,
              windStrength: 1.35,
              scarfPhase: localFrame * 0.24,
              hairPhase: localFrame * 0.2,
              rimColor: PALETTE.goldenSunrise,
              rimIntensity: 0.98,
            }));
          }
        },
      },

      // Layer 1: Foreground silhouette branches catching warm dawn blossoms
      foreground: {
        depth: 1.56,
        parallaxX: 1.75,
        parallaxY: 1.35,
        draw: (ctx) => {
          drawForegroundFrameSilhouettes(ctx, {
            width,
            height,
            dawn: dawnProgress * 0.85,
            blossoms: dawnProgress > 0.55,
            frame,
          });
        },
      },

      // Layer 7: Sweeping golden chronos ribbons, falling raindrops, midnight strike bloom!
      atmosphere: {
        screenSpace: true,
        draw: (ctx) => {
          // Explosive golden chronos wave & spiraling ribbons wrapping the clock tower!
          drawChronosWave(ctx, {
            originX: isCloseupTurn ? 680 : 340,
            originY: isCloseupTurn ? 1240 : 1420,
            targetX: 695,
            targetY: 590,
            progress: waveProgress,
            frame,
          });

          // Frozen raindrops finally break free and fall diagonally through the golden air!
          drawRain(ctx, {
            width,
            height,
            count: 120,
            frame,
            fallFactor: rainFall,
            color: dawnProgress > 0.5 ? '#ffe7b3' : '#b2ecff',
            opacity: lerp(0.75, 0.22, dawnProgress),
            seed: 5701,
          });

          // Golden dawn light shafts pouring across the city
          drawVolumetricLightShafts(ctx, {
            originX: 740,
            originY: 420,
            count: 7,
            spread: 1050,
            length: 1750,
            angle: -0.35,
            color: PALETTE.goldenSunrise,
            opacity: 0.22 * dawnProgress,
            frame,
          });

          drawGlowingMotes(ctx, {
            count: 70,
            frame,
            color: PALETTE.brightGold,
            opacity: 0.9,
            speed: 1.55,
            seed: 5801,
          });

          // Triumphant golden burst when the giant clock strikes 12:00!
          if (midnightFlash > 0.02) {
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            ctx.fillStyle = rgba('#fff4cc', midnightFlash * 0.42);
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
          }
        },
      },
    };
  }
}
