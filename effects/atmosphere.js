/**
 * Atmospheric sky gradients, textured moon, painted drifting cloud banks,
 * aerial depth haze, wet cobblestone reflections, and deterministic film grain.
 */

import { PALETTE } from '../config.js';
import { clamp, hash1D, lerp, lerpColor, rgba, seededRandom, TAU } from '../engine/math.js';

/**
 * Draw multi-stop hand-painted sky that transitions cleanly from cold midnight indigo
 * through twilight violet-rose into golden sunrise.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @param {number} dawn - 0 = deep midnight, 0.5 = violet/orange awakening, 1 = golden sunrise
 * @param {number} [frame=1]
 */
export function drawSkyGradient(ctx, width, height, dawn = 0, frame = 1) {
  const d = clamp(dawn, 0, 1);

  let topColor;
  let upperMid;
  let lowerMid;
  let horizonColor;

  if (d < 0.5) {
    const t = d * 2;
    topColor = lerpColor('#070b1e', '#1e1948', t);
    upperMid = lerpColor('#10193d', '#492b6b', t);
    lowerMid = lerpColor('#1b2a58', '#a84b68', t);
    horizonColor = lerpColor('#24476b', '#eb834c', t);
  } else {
    const t = (d - 0.5) * 2;
    topColor = lerpColor('#1e1948', '#4e5d9e', t);
    upperMid = lerpColor('#492b6b', '#b888cc', t);
    lowerMid = lerpColor('#a84b68', '#f5a982', t);
    horizonColor = lerpColor('#eb834c', '#ffe9a8', t);
  }

  const grad = ctx.createLinearGradient(0, -120, 0, height * 0.88);
  grad.addColorStop(0, topColor);
  grad.addColorStop(0.32, upperMid);
  grad.addColorStop(0.68, lowerMid);
  grad.addColorStop(1, horizonColor);

  ctx.fillStyle = grad;
  ctx.fillRect(-300, -300, width + 600, height + 600);

  // Subtle starfield fading out as dawn rises
  const starOpacity = clamp(1 - d * 1.85, 0, 1);
  if (starOpacity > 0.02) {
    ctx.save();
    for (let i = 0; i < 85; i += 1) {
      const sx = hash1D(i, 401) * (width + 240) - 120;
      const sy = hash1D(i, 409) * (height * 0.52);
      const r = 0.8 + hash1D(i, 419) * 1.9;
      const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.06 + hash1D(i, 421) * TAU);
      ctx.fillStyle = rgba(i % 4 === 0 ? PALETTE.iceCyan : '#eef4ff', starOpacity * twinkle * 0.78);
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
}

/**
 * Painted luminous full moon with soft cyan-silver craters and atmospheric halo.
 */
export function drawMoon(ctx, x, y, radius = 92, opacity = 1) {
  if (opacity <= 0.01) return;
  ctx.save();
  ctx.globalAlpha *= opacity;

  // Outer moonlight atmospheric halo
  const halo = ctx.createRadialGradient(x, y, radius * 0.7, x, y, radius * 4.4);
  halo.addColorStop(0, rgba('#bceeff', 0.42));
  halo.addColorStop(0.35, rgba('#5aa7d6', 0.16));
  halo.addColorStop(1, rgba('#1b2e5e', 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, radius * 4.4, 0, TAU);
  ctx.fill();

  // Moon disc
  const disc = ctx.createRadialGradient(
    x - radius * 0.25,
    y - radius * 0.25,
    radius * 0.1,
    x,
    y,
    radius,
  );
  disc.addColorStop(0, '#f4fbff');
  disc.addColorStop(0.65, '#d5ecfa');
  disc.addColorStop(1, '#8fb8db');

  ctx.fillStyle = disc;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.fill();

  // Painted mare/crater washes clipped to disc
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, TAU);
  ctx.clip();

  const craters = [
    { dx: -0.28, dy: -0.18, rx: 0.34, ry: 0.24, a: 0.18 },
    { dx: 0.22, dy: -0.26, rx: 0.28, ry: 0.22, a: 0.14 },
    { dx: 0.14, dy: 0.22, rx: 0.38, ry: 0.26, a: 0.16 },
    { dx: -0.34, dy: 0.3, rx: 0.22, ry: 0.18, a: 0.12 },
  ];
  for (let i = 0; i < craters.length; i += 1) {
    const c = craters[i];
    ctx.fillStyle = rgba('#54739c', c.a);
    ctx.beginPath();
    ctx.ellipse(x + c.dx * radius, y + c.dy * radius, c.rx * radius, c.ry * radius, 0.3, 0, TAU);
    ctx.fill();
  }
  ctx.restore();

  ctx.restore();
}

/**
 * Multi-layered hand-painted clouds with lit undersides and soft painterly puffs.
 */
export function drawPaintedClouds(ctx, opts = {}) {
  const {
    width = 1080,
    yBase = 360,
    spreadY = 340,
    count = 9,
    frame = 1,
    speed = 0.55,
    dawn = 0,
    seed = 501,
    opacity = 0.85,
  } = opts;

  const bodyColor = dawn < 0.5
    ? lerpColor('#141c3d', '#3a275c', dawn * 2)
    : lerpColor('#3a275c', '#d490a6', (dawn - 0.5) * 2);

  const rimColor = dawn < 0.5
    ? lerpColor('#5e9ec7', '#f09467', dawn * 2)
    : lerpColor('#f09467', '#fff0b8', (dawn - 0.5) * 2);

  ctx.save();
  ctx.globalAlpha *= opacity;

  for (let i = 0; i < count; i += 1) {
    const baseW = 240 + hash1D(i, seed + 1) * 320;
    const baseH = 52 + hash1D(i, seed + 2) * 58;
    const wrapW = width + baseW * 2.2;
    const startX = hash1D(i, seed + 3) * wrapW;
    const drift = (frame - 1) * speed * (0.45 + hash1D(i, seed + 4) * 0.85);
    const cx = ((startX + drift) % wrapW) - baseW * 1.1;
    const cy = yBase + (hash1D(i, seed + 5) - 0.5) * spreadY;

    // Cloud puffs
    const puffCount = 5;
    for (let p = 0; p < puffCount; p += 1) {
      const ratio = (p / (puffCount - 1)) - 0.5;
      const px = cx + ratio * baseW * 0.85;
      const py = cy + Math.abs(ratio) * baseH * 0.35 - (1 - Math.abs(ratio) * 1.6) * baseH * 0.25;
      const prx = baseW * (0.26 + (1 - Math.abs(ratio)) * 0.16);
      const pry = baseH * (0.52 + (1 - Math.abs(ratio)) * 0.42);

      // Lit rim edge
      const grad = ctx.createLinearGradient(px, py - pry, px, py + pry);
      grad.addColorStop(0, rgba(rimColor, 0.52));
      grad.addColorStop(0.35, rgba(bodyColor, 0.72));
      grad.addColorStop(1, rgba(bodyColor, 0.08));

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(px, py, prx, pry, 0, 0, TAU);
      ctx.fill();
    }
  }

  ctx.restore();
}

/**
 * Horizontal depth-separation atmospheric haze mist.
 */
export function drawDepthHaze(ctx, width, height, color = '#1e355d', opacity = 0.45, yStart = 900, yEnd = 1800) {
  if (opacity <= 0.005) return;
  ctx.save();
  const grad = ctx.createLinearGradient(0, yStart, 0, yEnd);
  grad.addColorStop(0, rgba(color, 0));
  grad.addColorStop(0.45, rgba(color, opacity));
  grad.addColorStop(1, rgba(color, opacity * 0.18));
  ctx.fillStyle = grad;
  ctx.fillRect(-350, yStart, width + 700, yEnd - yStart + 300);
  ctx.restore();
}

/**
 * Rain-slick cobblestone street reflection surface with shimmering lamp pools & puddle streaks.
 */
export function drawWetStreetReflections(ctx, opts = {}) {
  const {
    width = 1080,
    yTop = 1420,
    height = 600,
    dawn = 0,
    frame = 1,
    lampPositions = [180, 560, 910],
    freeze = false,
  } = opts;

  ctx.save();
  const baseTop = lerpColor('#0e162e', '#4f3b59', dawn);
  const baseBot = lerpColor('#070b1a', '#261e34', dawn);

  const ground = ctx.createLinearGradient(0, yTop, 0, yTop + height);
  ground.addColorStop(0, baseTop);
  ground.addColorStop(1, baseBot);
  ctx.fillStyle = ground;
  ctx.fillRect(-320, yTop, width + 640, height + 120);

  // Subtle reflected sky sheen across the wet stones
  const skyReflect = ctx.createLinearGradient(0, yTop, 0, yTop + height * 0.85);
  const sheenColor = lerpColor('#3c7da6', '#f7b974', dawn);
  skyReflect.addColorStop(0, rgba(sheenColor, 0.24));
  skyReflect.addColorStop(0.55, rgba(sheenColor, 0.08));
  skyReflect.addColorStop(1, rgba(sheenColor, 0));
  ctx.fillStyle = skyReflect;
  ctx.fillRect(-320, yTop, width + 640, height);

  // Vertical reflected light columns from streetlamps
  const shimmerTime = freeze ? 0 : frame * 0.11;
  for (let i = 0; i < lampPositions.length; i += 1) {
    const lx = lampPositions[i];
    const colGrad = ctx.createLinearGradient(lx, yTop, lx, yTop + height * 0.9);
    const warmCol = lerpColor(PALETTE.warmAmber, PALETTE.goldenSunrise, dawn);
    colGrad.addColorStop(0, rgba(warmCol, 0.34));
    colGrad.addColorStop(0.5, rgba(warmCol, 0.14));
    colGrad.addColorStop(1, rgba(warmCol, 0));
    ctx.fillStyle = colGrad;

    for (let s = 0; s < 14; s += 1) {
      const sy = yTop + 14 + s * 30;
      const w = 34 + s * 6 + Math.sin(shimmerTime + s * 1.4 + i) * 7;
      ctx.fillRect(lx - w * 0.5, sy, w, 8);
    }
  }

  // Painted perspective cobblestone lines
  ctx.strokeStyle = rgba('#7aa9d4', lerp(0.11, 0.18, dawn));
  ctx.lineWidth = 1.5;
  for (let row = 0; row < 12; row += 1) {
    const ry = yTop + Math.pow(row / 11, 1.45) * height;
    ctx.beginPath();
    ctx.moveTo(-260, ry);
    ctx.lineTo(width + 260, ry);
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Build a deterministic tileable film-grain offscreen canvas once during Renderer init.
 */
export function createDeterministicGrainTile(size = 192, seed = 2025) {
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const gctx = canvas.getContext('2d');
  const img = gctx.createImageData(size, size);
  const rand = seededRandom(seed);

  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.floor(rand() * 255);
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = Math.min(255, v + 8);
    img.data[i + 3] = 28;
  }
  gctx.putImageData(img, 0, 0);
  return canvas;
}

/**
 * Apply deterministic film grain and cinematic vignette over the finished frame.
 */
export function drawFilmGrainAndVignette(ctx, width, height, frame, grainTile, vignetteStrength = 0.52) {
  ctx.save();

  // Subtle shifting deterministic film grain
  if (grainTile) {
    const ox = Math.floor(hash1D(frame, 881) * grainTile.width);
    const oy = Math.floor(hash1D(frame, 887) * grainTile.height);
    ctx.globalAlpha = 0.14;
    ctx.globalCompositeOperation = 'overlay';
    for (let x = -ox; x < width; x += grainTile.width) {
      for (let y = -oy; y < height; y += grainTile.height) {
        ctx.drawImage(grainTile, x, y);
      }
    }
  }

  // Cinematic soft lens vignette
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  const cx = width * 0.5;
  const cy = height * 0.5;
  const vig = ctx.createRadialGradient(cx, cy, width * 0.34, cx, cy, height * 0.66);
  vig.addColorStop(0, 'rgba(6, 8, 20, 0)');
  vig.addColorStop(0.72, `rgba(7, 9, 22, ${(vignetteStrength * 0.24).toFixed(3)})`);
  vig.addColorStop(1, `rgba(5, 7, 16, ${vignetteStrength.toFixed(3)})`);
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, width, height);

  ctx.restore();
}
