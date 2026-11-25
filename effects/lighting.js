/**
 * Volumetric light shafts, streetlamp halos, pocket watch glow,
 * sunrise horizon bloom, and monumental clock-tower wall shadows.
 */

import { PALETTE } from '../config.js';
import { clamp, lerp, rgba, TAU } from '../engine/math.js';

/**
 * Diagonal volumetric god-rays (moonlight through clouds/arches or golden sunrise beams).
 */
export function drawVolumetricLightShafts(ctx, opts = {}) {
  const {
    originX = 820,
    originY = 120,
    count = 6,
    spread = 980,
    length = 1750,
    angle = 0.42,
    color = '#86dcff',
    opacity = 0.16,
    frame = 1,
    sway = 0.02,
  } = opts;

  if (opacity <= 0.004) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  for (let i = 0; i < count; i += 1) {
    const ratio = count > 1 ? i / (count - 1) : 0.5;
    const x0 = originX + (ratio - 0.5) * spread * 0.55;
    const y0 = originY;
    const rayAngle = angle + (ratio - 0.5) * 0.22 + Math.sin(frame * 0.025 + i * 1.3) * sway;
    const topW = 36 + (i % 3) * 28;
    const botW = topW * 4.4;
    const dx = Math.cos(rayAngle + Math.PI * 0.5) * length;
    const dy = Math.sin(rayAngle + Math.PI * 0.5) * length;
    const x1 = x0 + dx;
    const y1 = y0 + dy;

    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, rgba(color, opacity * (0.7 + 0.3 * Math.sin(i * 2.1))));
    grad.addColorStop(0.55, rgba(color, opacity * 0.38));
    grad.addColorStop(1, rgba(color, 0));

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x0 - topW * 0.5, y0);
    ctx.lineTo(x0 + topW * 0.5, y0);
    ctx.lineTo(x1 + botW * 0.5, y1);
    ctx.lineTo(x1 - botW * 0.5, y1);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Multi-layered warm streetlamp lantern glow.
 */
export function drawStreetlampGlow(ctx, x, y, radius = 150, color = PALETTE.warmAmber, intensity = 0.85) {
  if (intensity <= 0.01) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const outer = ctx.createRadialGradient(x, y, 4, x, y, radius);
  outer.addColorStop(0, rgba('#fff7dc', 0.85 * intensity));
  outer.addColorStop(0.24, rgba(color, 0.48 * intensity));
  outer.addColorStop(0.62, rgba(PALETTE.burntOrange, 0.14 * intensity));
  outer.addColorStop(1, rgba(color, 0));

  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();
  ctx.restore();
}

/**
 * Luminous pocket watch amber radial aura with delicate star-flare rays.
 */
export function drawWatchGlow(ctx, x, y, radius = 210, intensity = 1, frame = 1) {
  if (intensity <= 0.01) return;
  const pulse = 0.92 + 0.08 * Math.sin(frame * 0.14);
  const r = radius * pulse;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const grad = ctx.createRadialGradient(x, y, 2, x, y, r);
  grad.addColorStop(0, rgba('#fffbe6', 0.95 * intensity));
  grad.addColorStop(0.2, rgba(PALETTE.brightGold, 0.65 * intensity));
  grad.addColorStop(0.55, rgba(PALETTE.warmAmber, 0.25 * intensity));
  grad.addColorStop(1, rgba(PALETTE.burntOrange, 0));

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();

  // Crisp 4-point cross star flare
  ctx.translate(x, y);
  ctx.rotate(Math.sin(frame * 0.03) * 0.12);
  for (let i = 0; i < 4; i += 1) {
    ctx.rotate(Math.PI * 0.5);
    const len = r * (i % 2 === 0 ? 0.72 : 0.48);
    const rayGrad = ctx.createLinearGradient(0, 0, len, 0);
    rayGrad.addColorStop(0, rgba('#fff8d6', 0.72 * intensity));
    rayGrad.addColorStop(1, rgba(PALETTE.warmAmber, 0));
    ctx.fillStyle = rayGrad;
    ctx.beginPath();
    ctx.moveTo(0, -3.5);
    ctx.lineTo(len, 0);
    ctx.lineTo(0, 3.5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Golden sunrise solar disc + warm atmospheric horizon bloom.
 */
export function drawSunriseBloom(ctx, x, y, progress = 1, radius = 140) {
  const p = clamp(progress, 0, 1);
  if (p <= 0.01) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Broad atmospheric sunrise wash
  const washR = radius * lerp(2.6, 6.2, p);
  const wash = ctx.createRadialGradient(x, y, radius * 0.18, x, y, washR);
  wash.addColorStop(0, rgba('#fffdf0', 0.95 * p));
  wash.addColorStop(0.18, rgba(PALETTE.goldenSunrise, 0.72 * p));
  wash.addColorStop(0.45, rgba(PALETTE.coralDawn, 0.34 * p));
  wash.addColorStop(0.75, rgba(PALETTE.softLavender, 0.12 * p));
  wash.addColorStop(1, rgba(PALETTE.burntOrange, 0));

  ctx.fillStyle = wash;
  ctx.beginPath();
  ctx.arc(x, y, washR, 0, TAU);
  ctx.fill();

  // Crisp luminous sun orb
  const sunDisc = ctx.createRadialGradient(x, y, 2, x, y, radius * lerp(0.55, 1.0, p));
  sunDisc.addColorStop(0, rgba('#ffffff', 0.98 * p));
  sunDisc.addColorStop(0.55, rgba('#fff4c4', 0.9 * p));
  sunDisc.addColorStop(1, rgba(PALETTE.warmAmber, 0));

  ctx.fillStyle = sunDisc;
  ctx.beginPath();
  ctx.arc(x, y, radius * lerp(0.55, 1.0, p), 0, TAU);
  ctx.fill();

  ctx.restore();
}

/**
 * Colossal ominous Gothic clock-tower silhouette shadow projected across the station wall (Scene 02).
 */
export function drawClockTowerShadow(ctx, opts = {}) {
  const {
    x = 580,
    y = 920,
    scale = 1,
    opacity = 0.55,
    skew = -0.22,
  } = opts;

  if (opacity <= 0.01) return;
  ctx.save();
  ctx.translate(x, y);
  ctx.transform(1, 0, skew, 1, 0, 0);
  ctx.scale(scale, scale);
  ctx.globalAlpha *= opacity;

  // Tower shaft & spire shadow
  const grad = ctx.createLinearGradient(0, -640, 0, 460);
  grad.addColorStop(0, 'rgba(6, 9, 24, 0.78)');
  grad.addColorStop(0.7, 'rgba(9, 13, 32, 0.52)');
  grad.addColorStop(1, 'rgba(9, 13, 32, 0)');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.moveTo(0, -620);
  ctx.lineTo(68, -430);
  ctx.lineTo(135, -430);
  ctx.lineTo(155, -340);
  ctx.lineTo(165, 460);
  ctx.lineTo(-165, 460);
  ctx.lineTo(-155, -340);
  ctx.lineTo(-135, -430);
  ctx.lineTo(-68, -430);
  ctx.closePath();
  ctx.fill();

  // Luminous negative-space clock dial cutout inside the shadow showing 11:59
  ctx.fillStyle = rgba(PALETTE.iceCyan, 0.16);
  ctx.beginPath();
  ctx.arc(0, -180, 96, 0, TAU);
  ctx.fill();

  // Shadow clock hands frozen at 11:59
  ctx.strokeStyle = 'rgba(7, 10, 26, 0.85)';
  ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(-16, -238); // hour hand just shy of 12
  ctx.stroke();

  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(0, -180);
  ctx.lineTo(-8, -264); // minute hand at 59
  ctx.stroke();

  ctx.restore();
}
