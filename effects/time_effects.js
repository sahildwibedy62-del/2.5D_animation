/**
 * Chronos visual effects:
 * - Hero illustrated antique brass pocket watch (small & extreme close-up)
 * - Enormous sky-spanning repeating loop timeline (Scene 03)
 * - Sweeping golden chronos energy wave & helical ribbons (Scene 05)
 * - Time-freeze cyan/amber distortion shockwave (Scene 02)
 * - Luminous memory vignette portal (Scene 04)
 */

import { PALETTE } from '../config.js';
import { clamp, lerp, rgba, TAU } from '../engine/math.js';
import { drawWatchGlow } from './lighting.js';

/**
 * Draw an intricately illustrated gear wheel with teeth, spokes, and bevel rim.
 */
export function drawBrassGear(ctx, x, y, outerR, teeth = 12, angle = 0, color = PALETTE.antiqueBrass, highlight = PALETTE.brightGold) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const innerR = outerR * 0.78;
  const step = TAU / teeth;

  ctx.beginPath();
  for (let i = 0; i < teeth; i += 1) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.5;
    const a3 = a0 + step * 0.72;
    if (i === 0) ctx.moveTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    else ctx.lineTo(Math.cos(a0) * innerR, Math.sin(a0) * innerR);
    ctx.lineTo(Math.cos(a1) * outerR, Math.sin(a1) * outerR);
    ctx.lineTo(Math.cos(a2) * outerR, Math.sin(a2) * outerR);
    ctx.lineTo(Math.cos(a3) * innerR, Math.sin(a3) * innerR);
  }
  ctx.closePath();

  const grad = ctx.createLinearGradient(-outerR, -outerR, outerR, outerR);
  grad.addColorStop(0, highlight);
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, '#6b4316');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = Math.max(1.2, outerR * 0.04);
  ctx.stroke();

  // Inner cutout & spokes
  ctx.fillStyle = '#181427';
  ctx.beginPath();
  ctx.arc(0, 0, outerR * 0.56, 0, TAU);
  ctx.fill();

  ctx.strokeStyle = highlight;
  ctx.lineWidth = Math.max(2, outerR * 0.09);
  for (let s = 0; s < 5; s += 1) {
    const sa = (s / 5) * TAU;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(sa) * outerR * 0.58, Math.sin(sa) * outerR * 0.58);
    ctx.stroke();
  }

  ctx.fillStyle = highlight;
  ctx.beginPath();
  ctx.arc(0, 0, outerR * 0.16, 0, TAU);
  ctx.fill();

  ctx.restore();
}

/**
 * Hero antique brass pocket watch with hinged lid, Roman numerals, exposed moving gears,
 * turning crown, and warm amber luminescence.
 */
export function drawPocketWatch(ctx, opts = {}) {
  const {
    x = 540,
    y = 960,
    radius = 120,
    openAmount = 1, // 0 = closed, 1 = fully opened lid
    glowIntensity = 0.85,
    gearAngle = 0,
    minuteHandProgress = 0, // 0 = 11:59, 1 = 12:00
    crownTurn = 0,
    rotation = 0,
    frame = 1,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  // Back ambient amber aura
  if (glowIntensity > 0.02) {
    drawWatchGlow(ctx, 0, 0, radius * 2.4, glowIntensity, frame);
  }

  // Crown stem and winding bow at top
  ctx.save();
  ctx.translate(0, -radius * 1.08);
  const bowGrad = ctx.createLinearGradient(-radius * 0.25, -radius * 0.3, radius * 0.25, radius * 0.2);
  bowGrad.addColorStop(0, PALETTE.brightGold);
  bowGrad.addColorStop(0.55, PALETTE.antiqueBrass);
  bowGrad.addColorStop(1, '#6b4214');

  // Winding ring bow
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = radius * 0.13;
  ctx.beginPath();
  ctx.arc(0, -radius * 0.14, radius * 0.22, 0, TAU);
  ctx.stroke();
  ctx.strokeStyle = bowGrad;
  ctx.lineWidth = radius * 0.08;
  ctx.stroke();

  // Ridged crown knob (animates ridges when Nova turns the watch)
  ctx.fillStyle = bowGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = Math.max(2, radius * 0.03);
  ctx.beginPath();
  ctx.roundRect(-radius * 0.16, -radius * 0.09, radius * 0.32, radius * 0.19, radius * 0.05);
  ctx.fill();
  ctx.stroke();

  // Animated knurl lines on crown
  ctx.strokeStyle = '#5c3610';
  ctx.lineWidth = Math.max(1.2, radius * 0.018);
  for (let k = -2; k <= 2; k += 1) {
    const kx = ((k * 0.055 + crownTurn * 0.08) % 0.28) * radius;
    if (Math.abs(kx) < radius * 0.13) {
      ctx.beginPath();
      ctx.moveTo(kx, -radius * 0.08);
      ctx.lineTo(kx, radius * 0.09);
      ctx.stroke();
    }
  }
  ctx.restore();

  // Opened hinged filigree lid (pivoting off right-top hinge)
  if (openAmount > 0.05) {
    ctx.save();
    ctx.translate(radius * 0.88, -radius * 0.28);
    ctx.rotate(lerp(-0.15, -0.78, openAmount));
    const lidScaleX = lerp(0.95, 0.42, openAmount);
    ctx.scale(lidScaleX, 0.94);

    const lidGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
    lidGrad.addColorStop(0, PALETTE.brightGold);
    lidGrad.addColorStop(0.5, PALETTE.antiqueBrass);
    lidGrad.addColorStop(1, '#5d3712');
    ctx.fillStyle = lidGrad;
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = Math.max(2.5, radius * 0.035);
    ctx.beginPath();
    ctx.arc(radius * 0.55, 0, radius * 0.95, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Inner engraved crescent & starburst inside lid
    ctx.strokeStyle = rgba(PALETTE.sunriseCore, 0.65);
    ctx.lineWidth = Math.max(1.4, radius * 0.02);
    ctx.beginPath();
    ctx.arc(radius * 0.55, 0, radius * 0.72, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  // Outer brass bezel casing
  const bezelGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
  bezelGrad.addColorStop(0, '#ffe8a3');
  bezelGrad.addColorStop(0.35, PALETTE.warmAmber);
  bezelGrad.addColorStop(0.75, PALETTE.antiqueBrass);
  bezelGrad.addColorStop(1, '#583310');

  ctx.fillStyle = bezelGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = Math.max(2.6, radius * 0.038);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Inner luminous recessed clockface
  const faceR = radius * 0.84;
  const faceGrad = ctx.createRadialGradient(0, 0, faceR * 0.08, 0, 0, faceR);
  faceGrad.addColorStop(0, '#fff9df');
  faceGrad.addColorStop(0.55, lerp(0, 1, glowIntensity) > 0.3 ? '#f7dfa4' : PALETTE.ivoryClock);
  faceGrad.addColorStop(1, '#b8853f');
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.arc(0, 0, faceR, 0, TAU);
  ctx.fill();

  // Exposed skeleton clockwork cavity in center
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, faceR * 0.62, 0, TAU);
  ctx.clip();

  ctx.fillStyle = '#1f162c';
  ctx.fillRect(-faceR, -faceR, faceR * 2, faceR * 2);

  drawBrassGear(ctx, -faceR * 0.22, faceR * 0.12, faceR * 0.34, 12, gearAngle, PALETTE.antiqueBrass, PALETTE.brightGold);
  drawBrassGear(ctx, faceR * 0.24, -faceR * 0.14, faceR * 0.26, 10, -gearAngle * 1.2 + 0.3, '#d99838', '#ffe8a3');
  drawBrassGear(ctx, faceR * 0.16, faceR * 0.28, faceR * 0.19, 8, gearAngle * 1.6, '#b87624', PALETTE.warmAmber);
  ctx.restore();

  // Inner brass ring separating skeleton gears from numerals
  ctx.strokeStyle = PALETTE.antiqueBrass;
  ctx.lineWidth = Math.max(1.5, radius * 0.024);
  ctx.beginPath();
  ctx.arc(0, 0, faceR * 0.62, 0, TAU);
  ctx.stroke();

  // Glowing Roman numerals / hour ticks
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.fillStyle = '#2a1c12';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `700 ${Math.max(8, Math.round(radius * 0.125))}px Georgia, serif`;
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * TAU - Math.PI * 0.5;
    const nr = faceR * 0.8;
    ctx.fillText(numerals[i], Math.cos(a) * nr, Math.sin(a) * nr);
  }

  // Chronos hands: moves from 11:59 to 12:00 as minuteHandProgress goes 0 -> 1
  const minAngle = lerp(-Math.PI * 0.5 - (TAU / 60), -Math.PI * 0.5, clamp(minuteHandProgress, 0, 1));
  const hrAngle = lerp(-Math.PI * 0.5 - (TAU / 720), -Math.PI * 0.5, clamp(minuteHandProgress, 0, 1));

  // Hour hand
  ctx.save();
  ctx.rotate(hrAngle);
  ctx.fillStyle = PALETTE.inkOutline;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.08, -radius * 0.032);
  ctx.lineTo(faceR * 0.56, 0);
  ctx.lineTo(-radius * 0.08, radius * 0.032);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Minute hand
  ctx.save();
  ctx.rotate(minAngle);
  ctx.fillStyle = PALETTE.inkOutline;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.1, -radius * 0.022);
  ctx.lineTo(faceR * 0.8, 0);
  ctx.lineTo(-radius * 0.1, radius * 0.022);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Glowing sapphire-amber center jewel pin
  const pin = ctx.createRadialGradient(-2, -2, 1, 0, 0, radius * 0.1);
  pin.addColorStop(0, '#fffce6');
  pin.addColorStop(0.55, PALETTE.warmAmber);
  pin.addColorStop(1, '#7a4212');
  ctx.fillStyle = pin;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.09, 0, TAU);
  ctx.fill();

  // Glass crystal specular reflection
  ctx.fillStyle = rgba('#ffffff', 0.22);
  ctx.beginPath();
  ctx.ellipse(-faceR * 0.28, -faceR * 0.34, faceR * 0.42, faceR * 0.18, -0.55, 0, TAU);
  ctx.fill();

  ctx.restore();
}

/**
 * Scene 03 Hero Effect: Enormous glowing golden-amber repeating loop timeline across the sky.
 * Shows interlocking luminous circular day-rings with miniature city silhouettes and curved cycle arrows.
 */
export function drawSkyTimeline(ctx, opts = {}) {
  const {
    cx = 540,
    cy = 560,
    width = 960,
    reveal = 1,
    frame = 1,
    opacity = 1,
  } = opts;

  if (reveal <= 0.01 || opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= opacity * reveal;

  const ringCount = 5;
  const ringR = 112;
  const spacing = width / (ringCount + 0.4);
  const startX = cx - spacing * ((ringCount - 1) * 0.5);

  // Luminous golden aura ribbon behind the timeline
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const aura = ctx.createRadialGradient(cx, cy, 40, cx, cy, width * 0.62);
  aura.addColorStop(0, rgba(PALETTE.warmAmber, 0.34));
  aura.addColorStop(0.55, rgba(PALETTE.electricCyan, 0.14));
  aura.addColorStop(1, rgba(PALETTE.midnightIndigo, 0));
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(cx, cy, width * 0.62, ringR * 2.2, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  // Interlocking repeating day circles with miniature repeating city skyline inside
  for (let i = 0; i < ringCount; i += 1) {
    const rx = startX + i * spacing;
    const localReveal = clamp(reveal * ringCount - i * 0.65, 0, 1);
    if (localReveal <= 0.01) continue;

    ctx.save();
    ctx.translate(rx, cy);
    ctx.scale(localReveal, localReveal);

    // Subtle dark-blue glowing interior disc
    ctx.fillStyle = rgba('#0f1a3c', 0.55);
    ctx.beginPath();
    ctx.arc(0, 0, ringR, 0, TAU);
    ctx.fill();

    // Miniature repeating city silhouette inside each ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, ringR * 0.92, 0, TAU);
    ctx.clip();
    ctx.fillStyle = rgba('#182a54', 0.92);
    ctx.beginPath();
    ctx.moveTo(-ringR, ringR);
    ctx.lineTo(-ringR, 18);
    ctx.lineTo(-62, 18);
    ctx.lineTo(-62, -16);
    ctx.lineTo(-38, -16);
    ctx.lineTo(-38, 12);
    // Miniature clock tower in center of every repeating ring!
    ctx.lineTo(-16, 12);
    ctx.lineTo(-14, -42);
    ctx.lineTo(0, -68);
    ctx.lineTo(14, -42);
    ctx.lineTo(16, 12);
    ctx.lineTo(44, 12);
    ctx.lineTo(44, -22);
    ctx.lineTo(68, -22);
    ctx.lineTo(68, 18);
    ctx.lineTo(ringR, 18);
    ctx.lineTo(ringR, ringR);
    ctx.closePath();
    ctx.fill();

    // Glowing tiny clock dot at 11:59 inside every ring
    ctx.fillStyle = PALETTE.brightGold;
    ctx.beginPath();
    ctx.arc(0, -32, 6, 0, TAU);
    ctx.fill();
    ctx.restore();

    // Outer luminous golden ring border
    ctx.strokeStyle = rgba(PALETTE.brightGold, 0.9);
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, 0, ringR, 0, TAU);
    ctx.stroke();

    // Animated rotating chronos arc dash around ring
    const spin = frame * 0.045 + i * 0.9;
    ctx.strokeStyle = rgba('#fff6d1', 0.95);
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(0, 0, ringR + 8, spin, spin + 1.15);
    ctx.stroke();

    // 11:59 subtle dial ticks at top of ring
    ctx.strokeStyle = rgba(PALETTE.electricCyan, 0.72);
    ctx.lineWidth = 2;
    for (let t = 0; t < 12; t += 1) {
      const a = (t / 12) * TAU;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (ringR - 8), Math.sin(a) * (ringR - 8));
      ctx.lineTo(Math.cos(a) * ringR, Math.sin(a) * ringR);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Sweeping upper & lower golden loop-return arrows showing the endless reset cycle
  const arrowAlpha = clamp((reveal - 0.35) / 0.65, 0, 1);
  if (arrowAlpha > 0.01) {
    ctx.save();
    ctx.globalAlpha *= arrowAlpha;
    ctx.strokeStyle = PALETTE.brightGold;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    // Top forward arc
    ctx.beginPath();
    ctx.moveTo(cx - 210, cy - ringR - 22);
    ctx.quadraticCurveTo(cx, cy - ringR - 135, cx + 210, cy - ringR - 26);
    ctx.stroke();

    // Arrowhead right-top
    ctx.fillStyle = PALETTE.brightGold;
    ctx.beginPath();
    ctx.moveTo(cx + 224, cy - ringR - 18);
    ctx.lineTo(cx + 190, cy - ringR - 46);
    ctx.lineTo(cx + 184, cy - ringR - 14);
    ctx.closePath();
    ctx.fill();

    // Bottom backward reset arc
    ctx.beginPath();
    ctx.moveTo(cx + 210, cy + ringR + 22);
    ctx.quadraticCurveTo(cx, cy + ringR + 135, cx - 210, cy + ringR + 26);
    ctx.stroke();

    // Arrowhead left-bottom
    ctx.beginPath();
    ctx.moveTo(cx - 224, cy + ringR + 18);
    ctx.lineTo(cx - 190, cy + ringR + 46);
    ctx.lineTo(cx - 184, cy + ringR + 14);
    ctx.closePath();
    ctx.fill();

    // Orbiting luminous time bead racing along the loop
    const beadT = ((frame - 1) % 60) / 60;
    const bx = lerp(cx - 210, cx + 210, beadT);
    const by = cy - ringR - 22 - Math.sin(beadT * Math.PI) * 72;
    drawWatchGlow(ctx, bx, by, 42, 0.9, frame);

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Scene 05 Hero Effect: Sweeping golden chronos shockwave & luminous helical ribbons
 * radiating across the awakening metropolis and wrapping the clock tower.
 */
export function drawChronosWave(ctx, opts = {}) {
  const {
    originX = 480,
    originY = 1280,
    targetX = 640,
    targetY = 620,
    progress = 0.5, // 0..1 wave expansion
    frame = 1,
  } = opts;

  const p = clamp(progress, 0, 1);
  if (p <= 0.005) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Expanding concentric golden shockwave rings
  for (let rIdx = 0; rIdx < 3; rIdx += 1) {
    const localP = clamp(p * 1.25 - rIdx * 0.14, 0, 1);
    if (localP <= 0.01) continue;
    const radius = lerp(24, 1780, Math.pow(localP, 0.85));
    const fade = (1 - localP) * 0.85;

    ctx.strokeStyle = rgba(rIdx === 0 ? '#fff9d6' : PALETTE.warmAmber, fade);
    ctx.lineWidth = lerp(24, 3, localP);
    ctx.beginPath();
    ctx.arc(originX, originY, radius, 0, TAU);
    ctx.stroke();
  }

  // Sweeping helical ribbons spiraling from Nova's watch up around the giant clock tower
  const ribbonCount = 4;
  for (let r = 0; r < ribbonCount; r += 1) {
    const ribbonPhase = r * 1.57 + frame * 0.055;
    const ribbonOpacity = Math.sin(clamp(p, 0, 1) * Math.PI) * 0.88;
    if (ribbonOpacity <= 0.01) continue;

    ctx.strokeStyle = rgba(r % 2 === 0 ? PALETTE.brightGold : PALETTE.burntOrange, ribbonOpacity);
    ctx.lineWidth = r % 2 === 0 ? 11 : 6.5;
    ctx.lineCap = 'round';
    ctx.beginPath();

    const steps = 48;
    const maxStep = Math.floor(steps * clamp(p * 1.35, 0, 1));
    for (let s = 0; s <= maxStep; s += 1) {
      const t = s / steps;
      const baseX = lerp(originX, targetX, t);
      const baseY = lerp(originY, targetY, t);
      const swirlRadius = lerp(25, 310, Math.sin(t * Math.PI)) * (0.7 + r * 0.14);
      const angle = t * TAU * 2.1 + ribbonPhase;
      const px = baseX + Math.cos(angle) * swirlRadius;
      const py = baseY + Math.sin(angle) * swirlRadius * 0.42;
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Scene 02 Time-Freeze expanding distortion ring.
 */
export function drawTimeFreezeRipple(ctx, x, y, progress = 0.5) {
  const p = clamp(progress, 0, 1);
  if (p <= 0.01 || p >= 0.99) return;
  const r = lerp(20, 1450, Math.pow(p, 0.72));
  const alpha = (1 - p) * 0.82;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const grad = ctx.createRadialGradient(x, y, Math.max(1, r - 60), x, y, r + 20);
  grad.addColorStop(0, rgba(PALETTE.electricCyan, 0));
  grad.addColorStop(0.6, rgba(PALETTE.iceCyan, alpha * 0.55));
  grad.addColorStop(0.85, rgba(PALETTE.brightGold, alpha * 0.8));
  grad.addColorStop(1, rgba(PALETTE.electricCyan, 0));

  ctx.strokeStyle = grad;
  ctx.lineWidth = 48 * (1 - p * 0.5);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.stroke();

  ctx.restore();
}

/**
 * Scene 04 Glowing golden-peach ethereal frame for the memory projection.
 */
export function drawMemoryPortalFrame(ctx, x, y, rx, ry, progress = 1, dissolve = 0, frame = 1) {
  const p = clamp(progress, 0, 1);
  if (p <= 0.01) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const pulse = 1 + 0.025 * Math.sin(frame * 0.09);
  const aura = ctx.createRadialGradient(x, y, rx * 0.55, x, y, rx * 1.48 * pulse);
  aura.addColorStop(0, rgba(PALETTE.goldenSunrise, 0.08 * p));
  aura.addColorStop(0.64, rgba(PALETTE.warmAmber, 0.52 * p * (1 - dissolve * 0.4)));
  aura.addColorStop(0.82, rgba(PALETTE.dawnRose, 0.25 * p));
  aura.addColorStop(1, rgba(PALETTE.deepViolet, 0));

  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 1.48 * pulse, ry * 1.48 * pulse, 0, 0, TAU);
  ctx.fill();

  // Delicate luminous double rim around the memory portal
  ctx.strokeStyle = rgba('#fff4cf', 0.82 * p * (1 - dissolve * 0.35));
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * pulse, ry * pulse, 0, 0, TAU);
  ctx.stroke();

  ctx.strokeStyle = rgba(PALETTE.blossomPink, 0.52 * p);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 1.06 * pulse, ry * 1.06 * pulse, 0.08, 0, TAU);
  ctx.stroke();

  ctx.restore();
}
