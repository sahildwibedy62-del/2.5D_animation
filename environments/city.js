/**
 * CHRONOPOLIS — Enormous 2.5D Illustrated Gothic/Clockpunk City Environment
 *
 * Modular depth-separated architectural painters:
 *  - Giant Clock Tower (11:59 -> 12:00 animated dial + exposed interlocking brass gears)
 *  - Distant atmospheric spire skyline (Layer 5)
 *  - Midground detailed tenements, viaduct bridge, and illuminating windows (Layer 4)
 *  - Elevated vintage illuminated commuter train
 *  - Street-level cobblestone avenue, vintage lamps, traffic signal, looping sedans, umbrella pedestrians
 *  - Foreground silhouetted branches, blossoms, roof eaves, and wrought-iron railings (Layer 1)
 */

import { PALETTE } from '../config.js';
import { clamp, hash1D, lerp, lerpColor, rgba, TAU } from '../engine/math.js';
import { drawBrassGear } from '../effects/time_effects.js';
import { drawStreetlampGlow } from '../effects/lighting.js';

/**
 * Draw the colossal ornate Gothic Clock Tower dominating the city skyline.
 */
export function drawGiantClockTower(ctx, opts = {}) {
  const {
    x = 710,
    yBase = 1520,
    scale = 1,
    dawn = 0, // 0 = midnight indigo, 1 = golden sunrise
    minuteProgress = 0, // 0 = 11:59 PM, 1 = 12:00 Midnight!
    gearSpin = 0,
    glowIntensity = 0.85,
    frame = 1,
  } = opts;

  ctx.save();
  ctx.translate(x, yBase);
  ctx.scale(scale, scale);

  const stoneMain = lerpColor('#1b2447', '#4a3d66', dawn);
  const stoneLight = lerpColor('#2d3e6e', '#996c7d', dawn);
  const stoneDark = lerpColor('#0f142b', '#27203d', dawn);
  const trimGold = lerpColor('#b5843c', '#ffd984', 0.3 + dawn * 0.7);
  const rimEdge = lerpColor('#63b4e0', '#ffe3a3', dawn);

  // Radiant golden-ivory halo behind the clock face
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const dialAura = ctx.createRadialGradient(0, -820, 40, 0, -820, 390);
  dialAura.addColorStop(0, rgba('#fff4cc', 0.55 * glowIntensity));
  dialAura.addColorStop(0.42, rgba(PALETTE.warmAmber, 0.28 * glowIntensity));
  dialAura.addColorStop(1, rgba(PALETTE.burntOrange, 0));
  ctx.fillStyle = dialAura;
  ctx.beginPath();
  ctx.arc(0, -820, 390, 0, TAU);
  ctx.fill();
  ctx.restore();

  // Main tower shaft with painted light-to-shadow gradient
  const shaftGrad = ctx.createLinearGradient(-195, -960, 195, 0);
  shaftGrad.addColorStop(0, stoneDark);
  shaftGrad.addColorStop(0.55, stoneMain);
  shaftGrad.addColorStop(1, stoneLight);

  ctx.fillStyle = shaftGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(-185, 0);
  ctx.lineTo(-175, -1040);
  ctx.lineTo(175, -1040);
  ctx.lineTo(185, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Side Gothic corner buttresses & pinnacles
  const buttresses = [-190, 146];
  for (let i = 0; i < buttresses.length; i += 1) {
    const bx = buttresses[i];
    ctx.fillStyle = i === 0 ? stoneDark : stoneLight;
    ctx.fillRect(bx, -1060, 44, 1060);
    ctx.strokeRect(bx, -1060, 44, 1060);

    // Pointed side pinnacle turret
    ctx.beginPath();
    ctx.moveTo(bx - 4, -1060);
    ctx.lineTo(bx + 22, -1210);
    ctx.lineTo(bx + 48, -1060);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Stepped central cathedral spire crowning the tower
  ctx.fillStyle = stoneMain;
  ctx.beginPath();
  ctx.moveTo(-155, -1040);
  ctx.lineTo(-96, -1220);
  ctx.lineTo(96, -1220);
  ctx.lineTo(155, -1040);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Upper spire needle
  ctx.fillStyle = stoneDark;
  ctx.beginPath();
  ctx.moveTo(-72, -1220);
  ctx.lineTo(0, -1480);
  ctx.lineTo(72, -1220);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Illuminated Gothic lancet windows in upper belfry
  for (let w = -1; w <= 1; w += 1) {
    const wx = w * 46;
    ctx.fillStyle = rgba(PALETTE.brightGold, 0.72 + 0.2 * dawn);
    ctx.beginPath();
    ctx.moveTo(wx - 12, -1075);
    ctx.lineTo(wx - 12, -1145);
    ctx.quadraticCurveTo(wx, -1172, wx + 12, -1145);
    ctx.lineTo(wx + 12, -1075);
    ctx.closePath();
    ctx.fill();
  }

  // Exposed monumental interlocking brass clockwork gallery below the dial
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, -450, 128, Math.PI, 0);
  ctx.lineTo(128, -280);
  ctx.lineTo(-128, -280);
  ctx.closePath();
  ctx.fillStyle = '#0c1024';
  ctx.fill();
  ctx.clip();

  drawBrassGear(ctx, 0, -430, 108, 16, gearSpin, PALETTE.antiqueBrass, PALETTE.brightGold);
  drawBrassGear(ctx, -84, -330, 56, 12, -gearSpin * 1.4, '#b87624', PALETTE.warmAmber);
  drawBrassGear(ctx, 88, -342, 62, 12, -gearSpin * 1.3 + 0.5, '#d19234', '#ffe29c');
  ctx.restore();

  // Golden gothic arch framing the exposed clockwork
  ctx.strokeStyle = trimGold;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(0, -450, 128, Math.PI, 0);
  ctx.lineTo(128, -280);
  ctx.moveTo(-128, -450);
  ctx.lineTo(-128, -280);
  ctx.stroke();

  // Ornamental cornice moldings
  ctx.fillStyle = trimGold;
  ctx.fillRect(-196, -1046, 392, 14);
  ctx.fillRect(-194, -638, 388, 12);

  // Giant Illuminated Clock Face (centered at y = -820)
  const dialR = 148;
  ctx.save();
  ctx.translate(0, -820);

  // Outer carved brass ring
  ctx.fillStyle = trimGold;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, dialR + 16, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Luminous glowing ivory clock dial
  const faceGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, dialR);
  faceGrad.addColorStop(0, '#fffdf2');
  faceGrad.addColorStop(0.68, PALETTE.ivoryClock);
  faceGrad.addColorStop(1, '#d6b67c');
  ctx.fillStyle = faceGrad;
  ctx.beginPath();
  ctx.arc(0, 0, dialR, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Delicate inner decorative rings & spoke lines
  ctx.strokeStyle = rgba('#78582c', 0.45);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, dialR * 0.72, 0, TAU);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, dialR * 0.44, 0, TAU);
  ctx.stroke();

  // Roman numerals
  const numerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  ctx.fillStyle = '#1b1629';
  ctx.font = '700 24px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let n = 0; n < 12; n += 1) {
    const a = (n / 12) * TAU - Math.PI * 0.5;
    ctx.fillText(numerals[n], Math.cos(a) * (dialR * 0.84), Math.sin(a) * (dialR * 0.84));
  }

  // Clock hands: frozen at 11:59 (minuteProgress = 0) -> strikes 12:00 (minuteProgress = 1)
  const mp = clamp(minuteProgress, 0, 1);
  // Subtle micro-shudder at 11:59 if frozen, then crisp sweep to 12:00
  const shudder = mp === 0 ? Math.sin(frame * 0.25) * 0.004 : 0;
  const minAng = lerp(-Math.PI * 0.5 - (TAU / 52), -Math.PI * 0.5, mp) + shudder;
  const hrAng = lerp(-Math.PI * 0.5 - (TAU / 320), -Math.PI * 0.5, mp);

  // Hour hand
  ctx.save();
  ctx.rotate(hrAng);
  ctx.fillStyle = '#141528';
  ctx.beginPath();
  ctx.moveTo(-18, -7);
  ctx.lineTo(dialR * 0.54, 0);
  ctx.lineTo(-18, 7);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Minute hand
  ctx.save();
  ctx.rotate(minAng);
  ctx.fillStyle = '#141528';
  ctx.beginPath();
  ctx.moveTo(-22, -5);
  ctx.lineTo(dialR * 0.78, 0);
  ctx.lineTo(-22, 5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Center brass boss
  ctx.fillStyle = PALETTE.warmAmber;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, TAU);
  ctx.fill();
  ctx.stroke();

  ctx.restore(); // end dial

  // Rim highlight on right edge of tower catching moon/sunrise
  ctx.strokeStyle = rgba(rimEdge, 0.52);
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(188, -1060);
  ctx.lineTo(188, -40);
  ctx.stroke();

  ctx.restore();
}

/**
 * Layer 5: Distant atmospheric gothic skyline silhouettes with twinkling miniature windows.
 */
export function drawDistantSkyline(ctx, opts = {}) {
  const {
    width = 1080,
    yBase = 1360,
    dawn = 0,
    windowWake = 0.25, // 0..1 fraction of windows illuminated
    seed = 1103,
  } = opts;

  const fillCol = lerpColor('#131c3d', '#6d567c', dawn);
  const rimCol = lerpColor('#3c6896', '#f7be8b', dawn);
  const winCol = lerpColor('#d8c78a', '#fff0b0', dawn);

  ctx.save();
  const count = 18;
  const startX = -260;
  const span = width + 520;
  const step = span / count;

  for (let i = 0; i < count; i += 1) {
    const bx = startX + i * step;
    const bw = step * (0.78 + hash1D(i, seed + 1) * 0.42);
    const bh = 180 + hash1D(i, seed + 2) * 320;
    const roofType = Math.floor(hash1D(i, seed + 3) * 3);

    ctx.fillStyle = fillCol;
    ctx.beginPath();
    ctx.rect(bx, yBase - bh, bw, bh + 300);
    ctx.fill();

    // Gothic spire, mansard dome, or gabled roof
    ctx.beginPath();
    if (roofType === 0) {
      ctx.moveTo(bx + bw * 0.15, yBase - bh);
      ctx.lineTo(bx + bw * 0.5, yBase - bh - 95 - hash1D(i, seed + 4) * 75);
      ctx.lineTo(bx + bw * 0.85, yBase - bh);
    } else if (roofType === 1) {
      ctx.moveTo(bx, yBase - bh);
      ctx.lineTo(bx + bw * 0.16, yBase - bh - 44);
      ctx.lineTo(bx + bw * 0.84, yBase - bh - 44);
      ctx.lineTo(bx + bw, yBase - bh);
    } else {
      ctx.moveTo(bx + bw * 0.1, yBase - bh);
      ctx.quadraticCurveTo(bx + bw * 0.5, yBase - bh - 75, bx + bw * 0.9, yBase - bh);
    }
    ctx.closePath();
    ctx.fill();

    // Atmospheric rim edge
    ctx.strokeStyle = rgba(rimCol, 0.3);
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bx, yBase - bh, bw, bh);

    // Tiny illuminated windows
    const cols = Math.max(2, Math.floor(bw / 20));
    const rows = Math.max(3, Math.floor(bh / 26));
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const h = hash1D(i * 100 + r * 13 + c, seed + 7);
        if (h < windowWake) {
          ctx.fillStyle = rgba(winCol, 0.35 + h * 0.5);
          ctx.fillRect(bx + 8 + c * 17, yBase - bh + 16 + r * 22, 6, 10);
        }
      }
    }
  }

  ctx.restore();
}

/**
 * Layer 4: Detailed midground European/Gothic architecture + masonry viaduct bridge.
 */
export function drawMidgroundArchitecture(ctx, opts = {}) {
  const {
    width = 1080,
    yBase = 1480,
    dawn = 0,
    windowWake = 0.35,
    includeViaduct = true,
    viaductY = 1235,
    seed = 1409,
  } = opts;

  const wallDark = lerpColor('#141b36', '#463759', dawn);
  const wallMid = lerpColor('#1e2a4f', '#6b4f6e', dawn);
  const roofCol = lerpColor('#0e142b', '#2f2440', dawn);
  const warmWin = lerpColor('#f2bd61', '#fff0b3', dawn);
  const coolWin = lerpColor('#539ec4', '#ffd89e', dawn);

  ctx.save();

  // Midground buildings flanking left & right leaving dramatic canyon for skyline/clock tower
  const blocks = [
    { x: -240, w: 220, h: 610, style: 'gable' },
    { x: -40, w: 195, h: 490, style: 'mansard' },
    { x: 135, w: 175, h: 380, style: 'spire' },
    { x: 790, w: 185, h: 440, style: 'mansard' },
    { x: 955, w: 235, h: 620, style: 'gable' },
    { x: 1165, w: 220, h: 520, style: 'spire' },
  ];

  for (let i = 0; i < blocks.length; i += 1) {
    const b = blocks[i];
    const grad = ctx.createLinearGradient(b.x, yBase - b.h, b.x + b.w, yBase);
    grad.addColorStop(0, wallMid);
    grad.addColorStop(1, wallDark);

    ctx.fillStyle = grad;
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 3;
    ctx.fillRect(b.x, yBase - b.h, b.w, b.h + 200);
    ctx.strokeRect(b.x, yBase - b.h, b.w, b.h + 200);

    // Ornate roof
    ctx.fillStyle = roofCol;
    ctx.beginPath();
    if (b.style === 'gable') {
      ctx.moveTo(b.x - 10, yBase - b.h);
      ctx.lineTo(b.x + b.w * 0.5, yBase - b.h - 110);
      ctx.lineTo(b.x + b.w + 10, yBase - b.h);
    } else if (b.style === 'mansard') {
      ctx.moveTo(b.x - 8, yBase - b.h);
      ctx.lineTo(b.x + 22, yBase - b.h - 70);
      ctx.lineTo(b.x + b.w - 22, yBase - b.h - 70);
      ctx.lineTo(b.x + b.w + 8, yBase - b.h);
    } else {
      ctx.moveTo(b.x + 12, yBase - b.h);
      ctx.lineTo(b.x + b.w * 0.5, yBase - b.h - 155);
      ctx.lineTo(b.x + b.w - 12, yBase - b.h);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chimneys & rooftop dormers
    ctx.fillRect(b.x + b.w * 0.22, yBase - b.h - 88, 20, 50);

    // Multi-story arched windows with glowing interiors & iron sill bars
    const cols = Math.max(2, Math.floor((b.w - 36) / 42));
    const rows = Math.max(4, Math.floor((b.h - 70) / 56));
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const wx = b.x + 22 + c * ((b.w - 44) / cols);
        const wy = yBase - b.h + 36 + r * 54;
        const h = hash1D(i * 211 + r * 17 + c * 5, seed);
        const isLit = h < windowWake;

        ctx.fillStyle = isLit
          ? (h < windowWake * 0.72 ? warmWin : coolWin)
          : rgba('#0b1024', 0.85);
        ctx.beginPath();
        ctx.roundRect(wx, wy, 22, 34, [10, 10, 2, 2]);
        ctx.fill();

        // Mullion cross
        ctx.strokeStyle = PALETTE.inkOutline;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(wx + 11, wy);
        ctx.lineTo(wx + 11, wy + 34);
        ctx.moveTo(wx, wy + 18);
        ctx.lineTo(wx + 22, wy + 18);
        ctx.stroke();

        // Warm soft glow halo when illuminated
        if (isLit) {
          ctx.fillStyle = rgba(warmWin, 0.16);
          ctx.beginPath();
          ctx.arc(wx + 11, wy + 17, 24, 0, TAU);
          ctx.fill();
        }
      }
    }
  }

  // Elevated masonry stone viaduct arches stretching across the cityscape
  if (includeViaduct) {
    const deckH = 38;
    const archSpan = 165;
    const archCount = 10;
    const startX = -260;

    ctx.fillStyle = lerpColor('#17203f', '#4e3c5e', dawn);
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 3;
    ctx.fillRect(startX, viaductY, width + 520, deckH);
    ctx.strokeRect(startX, viaductY, width + 520, deckH);

    // Repeating stone arches underneath bridge deck
    for (let a = 0; a < archCount; a += 1) {
      const ax = startX + a * archSpan;
      ctx.beginPath();
      ctx.moveTo(ax, viaductY + deckH);
      ctx.lineTo(ax + archSpan, viaductY + deckH);
      ctx.lineTo(ax + archSpan, viaductY + 260);
      ctx.lineTo(ax + archSpan - 26, viaductY + 260);
      ctx.lineTo(ax + archSpan - 26, viaductY + 112);
      ctx.arc(ax + archSpan * 0.5, viaductY + 112, archSpan * 0.5 - 26, 0, Math.PI, true);
      ctx.lineTo(ax + 26, viaductY + 260);
      ctx.lineTo(ax, viaductY + 260);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Vintage illuminated blue-and-crimson elevated commuter train gliding along the viaduct.
 */
export function drawElevatedTrain(ctx, opts = {}) {
  const {
    x = 300,
    y = 1235,
    cars = 4,
    scale = 1,
    dawn = 0,
    direction = 1,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * direction, scale);

  const carW = 148;
  const carH = 48;
  const gap = 8;

  for (let i = 0; i < cars; i += 1) {
    const cx = -i * (carW + gap);

    // Car body (navy steel blue + crimson lower stripe like reference artwork)
    ctx.fillStyle = lerpColor('#1b2e57', '#354570', dawn);
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(cx - carW, -carH, carW, carH, [10, 10, 3, 3]);
    ctx.fill();
    ctx.stroke();

    // Crimson lower livery band
    ctx.fillStyle = '#992b37';
    ctx.fillRect(cx - carW + 3, -17, carW - 6, 12);

    // Warm glowing passenger windows
    for (let w = 0; w < 5; w += 1) {
      const wx = cx - carW + 14 + w * 25;
      ctx.fillStyle = '#ffe599';
      ctx.fillRect(wx, -carH + 10, 17, 15);
    }

    // Headlight beam on front car
    if (i === 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const beam = ctx.createLinearGradient(0, -24, 155, -16);
      beam.addColorStop(0, rgba('#fff8d6', 0.78));
      beam.addColorStop(1, rgba(PALETTE.warmAmber, 0));
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(155, -52);
      ctx.lineTo(155, 8);
      ctx.lineTo(0, -18);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  ctx.restore();
}

/**
 * Vintage streamlined 1940s sedan (frozen at red light or moving forward at dawn).
 */
export function drawVintageCar(ctx, opts = {}) {
  const {
    x = 260,
    y = 1470,
    scale = 1,
    direction = 1,
    color = '#243459',
    headlights = true,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * direction, scale);

  // Ground shadow
  ctx.fillStyle = rgba('#040712', 0.55);
  ctx.beginPath();
  ctx.ellipse(0, 8, 106, 16, 0, 0, TAU);
  ctx.fill();

  // Headlight cone
  if (headlights) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const cone = ctx.createLinearGradient(92, -32, 320, -10);
    cone.addColorStop(0, rgba('#fff4c2', 0.65));
    cone.addColorStop(1, rgba(PALETTE.warmAmber, 0));
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(96, -38);
    ctx.lineTo(310, -78);
    ctx.lineTo(310, 16);
    ctx.lineTo(96, -24);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Chassis
  ctx.fillStyle = color;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-102, -16);
  ctx.quadraticCurveTo(-98, -46, -68, -50);
  ctx.lineTo(-42, -82);
  ctx.quadraticCurveTo(0, -90, 40, -80);
  ctx.lineTo(66, -48);
  ctx.quadraticCurveTo(100, -45, 104, -16);
  ctx.lineTo(104, -2);
  ctx.lineTo(-102, -2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Windows
  ctx.fillStyle = rgba('#82c8e8', 0.42);
  ctx.beginPath();
  ctx.moveTo(-36, -74);
  ctx.lineTo(32, -74);
  ctx.lineTo(54, -48);
  ctx.lineTo(-56, -48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wheels
  const wheels = [-60, 62];
  for (let i = 0; i < wheels.length; i += 1) {
    ctx.fillStyle = '#0d101e';
    ctx.beginPath();
    ctx.arc(wheels[i], -2, 22, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#9aa9c9';
    ctx.beginPath();
    ctx.arc(wheels[i], -2, 10, 0, TAU);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Illustrated silhouette pedestrian with overcoat & umbrella (walks in repeating loop or moves on).
 */
export function drawUmbrellaPedestrian(ctx, opts = {}) {
  const {
    x = 400,
    y = 1480,
    scale = 1,
    direction = 1,
    walkPhase = 0,
    opacity = 0.88,
    dawn = 0,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale * direction, scale);
  ctx.globalAlpha *= opacity;

  const col = lerpColor('#111833', '#2e2542', dawn);
  const rim = lerpColor('#6dc8eb', '#ffd599', dawn);
  const stride = Math.sin(walkPhase) * 16;

  // Legs
  ctx.strokeStyle = col;
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-4, -52);
  ctx.lineTo(-4 - stride, 0);
  ctx.moveTo(4, -52);
  ctx.lineTo(4 + stride, 0);
  ctx.stroke();

  // Long tailored coat silhouette
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-14, -142);
  ctx.lineTo(14, -142);
  ctx.lineTo(24, -44);
  ctx.lineTo(-24, -44);
  ctx.closePath();
  ctx.fill();

  // Head & hat
  ctx.beginPath();
  ctx.arc(0, -158, 13, 0, TAU);
  ctx.fill();

  // Umbrella stem
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(14, -110);
  ctx.lineTo(14, -206);
  ctx.stroke();

  // Umbrella canopy
  ctx.fillStyle = lerpColor('#162244', '#3d2f54', dawn);
  ctx.strokeStyle = rgba(rim, 0.55);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(14, -172, 48, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Cast-iron vintage streetlamp + optional traffic signal.
 */
export function drawVintageStreetlamp(ctx, x, yBase, scale = 1, glowIntensity = 0.85) {
  ctx.save();
  ctx.translate(x, yBase);
  ctx.scale(scale, scale);

  // Iron pole
  ctx.fillStyle = '#0e1326';
  ctx.fillRect(-7, -360, 14, 360);
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(-10, -45);
  ctx.lineTo(10, -45);
  ctx.lineTo(18, 0);
  ctx.closePath();
  ctx.fill();

  // Lantern head
  ctx.fillStyle = '#fff5cf';
  ctx.strokeStyle = '#0e1326';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-14, -360);
  ctx.lineTo(-22, -408);
  ctx.lineTo(22, -408);
  ctx.lineTo(14, -360);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Cap
  ctx.fillStyle = '#0e1326';
  ctx.beginPath();
  ctx.moveTo(-28, -408);
  ctx.lineTo(0, -432);
  ctx.lineTo(28, -408);
  ctx.closePath();
  ctx.fill();

  drawStreetlampGlow(ctx, 0, -384, 175, PALETTE.warmAmber, glowIntensity);
  ctx.restore();
}

/**
 * Vintage street traffic signal showing frozen RED or awakening GREEN.
 */
export function drawTrafficSignal(ctx, x, yBase, isGreen = false, scale = 1) {
  ctx.save();
  ctx.translate(x, yBase);
  ctx.scale(scale, scale);

  ctx.fillStyle = '#11162b';
  ctx.fillRect(-6, -300, 12, 300);
  ctx.beginPath();
  ctx.roundRect(-22, -395, 44, 108, 8);
  ctx.fill();

  // Red, Amber, Green lenses
  const lenses = [
    { dy: -372, col: '#ff4a4a', on: !isGreen },
    { dy: -341, col: '#ffb84d', on: false },
    { dy: -310, col: '#4ef29c', on: isGreen },
  ];
  for (let i = 0; i < lenses.length; i += 1) {
    const l = lenses[i];
    ctx.fillStyle = l.on ? l.col : '#1d2238';
    ctx.beginPath();
    ctx.arc(0, l.dy, 11, 0, TAU);
    ctx.fill();

    if (l.on) {
      drawStreetlampGlow(ctx, 0, l.dy, 76, l.col, 0.72);
    }
  }

  ctx.restore();
}

/**
 * Layer 1: Foreground framing silhouettes (overhanging branches, blossoms, lamp silhouettes, railings).
 */
export function drawForegroundFrameSilhouettes(ctx, opts = {}) {
  const {
    width = 1080,
    height = 1920,
    dawn = 0,
    blossoms = false,
    frame = 1,
    railing = false,
  } = opts;

  const silColor = lerpColor('#070a17', '#261a30', dawn);
  const sway = Math.sin(frame * 0.04) * 7;

  ctx.save();

  // Upper-left overhanging gnarled branch silhouette
  ctx.fillStyle = silColor;
  ctx.beginPath();
  ctx.moveTo(-120, -40);
  ctx.quadraticCurveTo(110, 90 + sway * 0.3, 310 + sway, 185 + sway * 0.4);
  ctx.quadraticCurveTo(180, 140, 80, 210 + sway * 0.5);
  ctx.quadraticCurveTo(20, 130, -120, 170);
  ctx.closePath();
  ctx.fill();

  // Upper-right roof eave / foliage corner
  ctx.beginPath();
  ctx.moveTo(width + 120, -40);
  ctx.quadraticCurveTo(width - 130, 85 - sway * 0.3, width - 280 - sway * 0.6, 155);
  ctx.lineTo(width + 120, 145);
  ctx.closePath();
  ctx.fill();

  // Painted sunlit pink blossoms on foreground branch (Scenes 05 & 06!)
  if (blossoms) {
    const clusters = [
      { x: 95, y: 120, r: 26 },
      { x: 170, y: 155, r: 30 },
      { x: 255, y: 180, r: 22 },
      { x: 55, y: 195, r: 24 },
      { x: 110, y: 1710, r: 34 },
      { x: 215, y: 1775, r: 28 },
      { x: 65, y: 1810, r: 38 },
      { x: width - 115, y: 110, r: 26 },
      { x: width - 205, y: 145, r: 20 },
    ];
    for (let i = 0; i < clusters.length; i += 1) {
      const c = clusters[i];
      for (let p = 0; p < 5; p += 1) {
        const a = (p / 5) * TAU + i * 0.4;
        const px = c.x + Math.cos(a) * c.r * 0.55 + sway * 0.4;
        const py = c.y + Math.sin(a) * c.r * 0.55;
        ctx.fillStyle = p % 2 === 0 ? PALETTE.blossomPink : '#fff0f5';
        ctx.beginPath();
        ctx.arc(px, py, c.r * 0.42, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = PALETTE.warmAmber;
      ctx.beginPath();
      ctx.arc(c.x + sway * 0.4, c.y, c.r * 0.16, 0, TAU);
      ctx.fill();
    }
  }

  // Optional bottom wrought-iron balcony railing silhouette
  if (railing) {
    ctx.fillStyle = silColor;
    ctx.fillRect(-160, height - 135, width + 320, 18);
    ctx.fillRect(-160, height - 30, width + 320, 80);
    for (let rx = -120; rx < width + 180; rx += 54) {
      ctx.fillRect(rx, height - 135, 10, 120);
    }
  }

  ctx.restore();
}
