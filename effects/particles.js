/**
 * Deterministic procedural particles & illustrated micro-elements:
 * - Suspended / resetting / falling raindrops
 * - Floating glowing dust motes & memory sparkles
 * - Painted cherry blossoms (Scene 04 & Scene 06)
 * - Illustrated tumbling/resetting newspaper (Scene 01 & Scene 03)
 * - Animated illustrated birds / doves (Scene 03, 05, 06)
 */

import { PALETTE } from '../config.js';
import { clamp, hash1D, lerp, rgba, TAU } from '../engine/math.js';
import { loopPhase } from '../engine/animation.js';

/**
 * Draw deterministic rain supporting frozen suspension (motion = 0) and falling motion (motion > 0).
 */
export function drawRain(ctx, opts = {}) {
  const {
    width = 1080,
    height = 1920,
    count = 130,
    frame = 1,
    fallFactor = 0, // 0 = frozen suspended droplets, 1 = full falling rain streaks
    color = '#a6e4ff',
    opacity = 0.72,
    seed = 701,
    windAngle = -0.16,
  } = opts;

  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= opacity;

  for (let i = 0; i < count; i += 1) {
    const depth = 0.4 + hash1D(i, seed + 1) * 0.9;
    const baseX = hash1D(i, seed + 2) * (width + 320) - 160;
    const baseY = hash1D(i, seed + 3) * (height + 240) - 120;
    const speed = (28 + hash1D(i, seed + 4) * 24) * depth;

    // When frozen, droplets hover delicately in mid-air; when falling, they streak downward
    const travel = (frame - 1) * speed * fallFactor;
    const hover = (1 - fallFactor) * Math.sin(frame * 0.05 + i) * 2.2;
    const x = ((baseX + travel * windAngle) % (width + 320) + (width + 320)) % (width + 320) - 160;
    const y = ((baseY + travel + hover) % (height + 240) + (height + 240)) % (height + 240) - 120;

    if (fallFactor < 0.25) {
      // Suspended crystalline tear-shaped raindrop with bright catchlight
      const r = (2.1 + hash1D(i, seed + 5) * 2.6) * depth;
      ctx.fillStyle = rgba(color, 0.55 * depth);
      ctx.beginPath();
      ctx.moveTo(x, y - r * 2.2);
      ctx.quadraticCurveTo(x + r * 1.15, y, x, y + r * 1.2);
      ctx.quadraticCurveTo(x - r * 1.15, y, x, y - r * 2.2);
      ctx.fill();

      ctx.fillStyle = rgba('#ffffff', 0.78 * depth);
      ctx.beginPath();
      ctx.arc(x - r * 0.28, y + r * 0.15, r * 0.34, 0, TAU);
      ctx.fill();
    } else {
      // Diagonal cinematic rain streak
      const streakLen = lerp(10, 48, fallFactor) * depth;
      ctx.strokeStyle = rgba(color, 0.45 * depth);
      ctx.lineWidth = 1.2 * depth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + windAngle * streakLen, y + streakLen);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draw glowing floating dust motes / chronos embers with bokeh halos.
 */
export function drawGlowingMotes(ctx, opts = {}) {
  const {
    xMin = -100,
    xMax = 1180,
    yMin = 0,
    yMax = 1920,
    count = 55,
    frame = 1,
    color = PALETTE.brightGold,
    opacity = 0.85,
    speed = 1,
    frozen = false,
    seed = 809,
    minRadius = 2.2,
    maxRadius = 7.5,
  } = opts;

  if (opacity <= 0.01) return;
  const spanX = xMax - xMin;
  const spanY = yMax - yMin;
  const t = frozen ? 12 : frame;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < count; i += 1) {
    const phase = hash1D(i, seed + 1) * TAU;
    const bx = xMin + hash1D(i, seed + 2) * spanX;
    const by = yMin + hash1D(i, seed + 3) * spanY;
    const driftY = (t * (0.45 + hash1D(i, seed + 4) * 0.9) * speed);
    const y = yMax - (((yMax - by + driftY) % spanY + spanY) % spanY);
    const x = bx + Math.sin(t * 0.025 * speed + phase) * (16 + hash1D(i, seed + 5) * 28);
    const r = lerp(minRadius, maxRadius, hash1D(i, seed + 6));
    const flicker = 0.55 + 0.45 * Math.sin(frame * 0.08 + phase * 2);

    const g = ctx.createRadialGradient(x, y, 0.5, x, y, r * 2.8);
    g.addColorStop(0, rgba('#fffdf2', 0.92 * opacity * flicker));
    g.addColorStop(0.35, rgba(color, 0.55 * opacity * flicker));
    g.addColorStop(1, rgba(color, 0));

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.8, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Painted 2.5D drifting cherry-blossom petals (Scenes 04 and 06).
 */
export function drawCherryBlossoms(ctx, opts = {}) {
  const {
    width = 1080,
    height = 1920,
    count = 36,
    frame = 1,
    opacity = 0.9,
    seed = 919,
    centerX = null,
    centerY = null,
    spreadRadius = null,
  } = opts;

  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= opacity;

  for (let i = 0; i < count; i += 1) {
    const s = 0.65 + hash1D(i, seed + 1) * 1.15;
    let x;
    let y;

    if (centerX !== null && centerY !== null && spreadRadius !== null) {
      const ang = hash1D(i, seed + 2) * TAU + frame * (0.008 + hash1D(i, seed + 3) * 0.01);
      const rad = spreadRadius * (0.68 + hash1D(i, seed + 4) * 0.52);
      x = centerX + Math.cos(ang) * rad;
      y = centerY + Math.sin(ang) * rad * 0.86;
    } else {
      const driftX = (frame - 1) * (1.2 + hash1D(i, seed + 2) * 1.6);
      const driftY = (frame - 1) * (0.9 + hash1D(i, seed + 3) * 1.3);
      x = ((hash1D(i, seed + 4) * (width + 260) - driftX) % (width + 260) + (width + 260)) % (width + 260) - 130;
      y = ((hash1D(i, seed + 5) * (height + 260) + driftY) % (height + 260) + (height + 260)) % (height + 260) - 130;
    }

    const rot = hash1D(i, seed + 6) * TAU + frame * (0.035 + hash1D(i, seed + 7) * 0.03);
    const tilt = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.045 + i));

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s * tilt);

    const pGrad = ctx.createLinearGradient(-10, -6, 12, 6);
    pGrad.addColorStop(0, '#fff4f7');
    pGrad.addColorStop(0.55, PALETTE.blossomPink);
    pGrad.addColorStop(1, '#e58eb1');
    ctx.fillStyle = pGrad;

    ctx.beginPath();
    ctx.moveTo(-11, 0);
    ctx.bezierCurveTo(-6, -9, 7, -8, 12, -1);
    ctx.lineTo(8, 0);
    ctx.lineTo(12, 2);
    ctx.bezierCurveTo(6, 9, -6, 8, -11, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Illustrated falling & resetting newspaper with folded crease, headline ink lines,
 * wet-ground shadow, and temporal reset ring ripple.
 */
export function drawFallingNewspaper(ctx, opts = {}) {
  const {
    startX = 760,
    startY = 820,
    endX = 635,
    endY = 1525,
    frame = 1,
    loopFrames = 90,
    phaseOffset = 0,
    scale = 1,
    frozenAt = null, // optional fixed phase [0..1]
  } = opts;

  const p = frozenAt !== null ? frozenAt : loopPhase(frame, loopFrames, phaseOffset);

  // Smooth tumbling descent arc
  const easeFall = Math.pow(p, 1.15);
  const x = lerp(startX, endX, easeFall) + Math.sin(p * TAU * 1.5) * 44 * (1 - p * 0.6);
  const y = lerp(startY, endY, easeFall);
  const rot = Math.sin(p * TAU * 1.5) * 0.34 - 0.18 + p * 0.25;
  const flutter = 0.72 + 0.28 * Math.cos(p * TAU * 3);

  ctx.save();

  // Temporal reset ripple right as the newspaper snaps back to the start
  if (p < 0.16 && frozenAt === null) {
    const rp = p / 0.16;
    const rippleR = lerp(18, 155, rp) * scale;
    ctx.strokeStyle = rgba(PALETTE.electricCyan, (1 - rp) * 0.75);
    ctx.lineWidth = 3 * (1 - rp) + 1;
    ctx.beginPath();
    ctx.ellipse(endX, endY + 14, rippleR, rippleR * 0.28, 0, 0, TAU);
    ctx.stroke();

    // Ghost echo near the rooftop start point
    ctx.strokeStyle = rgba(PALETTE.warmAmber, (1 - rp) * 0.65);
    ctx.beginPath();
    ctx.arc(startX, startY, lerp(10, 72, rp), 0, TAU);
    ctx.stroke();
  }

  // Ground reflection / shadow beneath the newspaper
  const heightRatio = clamp((y - startY) / Math.max(1, endY - startY), 0, 1);
  ctx.fillStyle = rgba('#040814', 0.38 * heightRatio);
  ctx.beginPath();
  ctx.ellipse(x, endY + 18, 46 * scale * (0.4 + 0.6 * heightRatio), 11 * scale, 0, 0, TAU);
  ctx.fill();

  // Illustrated open newspaper sheet
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.scale(scale, scale * flutter);

  const w = 96;
  const h = 68;

  // Left page
  ctx.fillStyle = '#e7e2d3';
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.45);
  ctx.quadraticCurveTo(-w * 0.52, -h * 0.56, -w, -h * 0.32);
  ctx.lineTo(-w * 0.9, h * 0.52);
  ctx.quadraticCurveTo(-w * 0.44, h * 0.36, 0, h * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right page (slightly warmer highlight)
  ctx.fillStyle = '#f2eee2';
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.45);
  ctx.quadraticCurveTo(w * 0.5, -h * 0.6, w, -h * 0.36);
  ctx.lineTo(w * 0.92, h * 0.48);
  ctx.quadraticCurveTo(w * 0.46, h * 0.34, 0, h * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Printed masthead & column lines
  ctx.fillStyle = '#333b56';
  ctx.fillRect(-w * 0.78, -h * 0.25, w * 0.62, 7);
  ctx.fillRect(w * 0.14, -h * 0.26, w * 0.64, 7);
  ctx.fillStyle = '#5c6684';
  for (let row = 0; row < 4; row += 1) {
    const ly = -h * 0.05 + row * 10;
    ctx.fillRect(-w * 0.76, ly, w * 0.56, 3.2);
    ctx.fillRect(w * 0.16, ly, w * 0.58, 3.2);
  }

  ctx.restore();
}

/**
 * Illustrated animated flying birds (doves & silhouette swallows) along sweeping arcs.
 */
export function drawFlyingBirds(ctx, opts = {}) {
  const {
    birds = [],
    frame = 1,
    frozen = false,
    color = '#eef5ff',
    outline = PALETTE.inkOutline,
    opacity = 1,
  } = opts;

  if (opacity <= 0.01 || birds.length === 0) return;
  ctx.save();
  ctx.globalAlpha *= opacity;

  for (let i = 0; i < birds.length; i += 1) {
    const b = birds[i];
    const p = b.phase !== undefined ? b.phase : loopPhase(frame, b.loopFrames || 120, b.offset || 0);
    const x = lerp(b.startX, b.endX, p);
    const arcY = Math.sin(p * Math.PI) * (b.arcHeight || -90);
    const y = lerp(b.startY, b.endY, p) + arcY;
    const flapTime = frozen ? (b.frozenFlap ?? 0.35) : (frame * (b.flapSpeed || 0.28) + i * 1.7);
    const wingY = Math.sin(flapTime) * 18;
    const scale = b.scale || 1;
    const dir = b.endX >= b.startX ? 1 : -1;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale * dir, scale);

    // Back wing
    ctx.fillStyle = color;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, -2);
    ctx.quadraticCurveTo(-18, -22 - wingY * 0.7, -34, -14 - wingY);
    ctx.quadraticCurveTo(-16, 2, -2, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bird body & tail
    ctx.beginPath();
    ctx.ellipse(2, 2, 16, 7.5, -0.1, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Tail feathers
    ctx.beginPath();
    ctx.moveTo(-12, 3);
    ctx.lineTo(-27, 9);
    ctx.lineTo(-24, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Head & beak
    ctx.beginPath();
    ctx.arc(17, -2, 6, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Front wing
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.quadraticCurveTo(-8, -26 + wingY * 0.9, -28, -22 + wingY * 1.15);
    ctx.quadraticCurveTo(-8, 6, 6, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}
