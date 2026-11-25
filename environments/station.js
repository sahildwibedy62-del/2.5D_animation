/**
 * ABANDONED VICTORIAN TRAIN STATION — Scene 02 & Scene 03 Cameo Environment
 *
 * Layered 2.5D cathedral-scale glass-and-iron concourse:
 *  - Deep vaulted glass arch roof & towering mullioned moonlit windows
 *  - Distant platforms & ornamental iron clockwork trusses
 *  - Weathered vintage tram/locomotive parked on gleaming tracks
 *  - Wet tiled concourse floor with reflections & ornate waiting bench
 *  - Foreground riveted iron pillars & overhead steel beams for heavy 2.5D parallax
 */

import { PALETTE } from '../config.js';
import { rgba, TAU } from '../engine/math.js';
import { drawBrassGear } from '../effects/time_effects.js';
import { drawStreetlampGlow } from '../effects/lighting.js';

/**
 * Layer 5: Deep station vaulted glass-and-iron dome + glowing moonlit arched windows.
 */
export function drawStationVaultBackdrop(ctx, opts = {}) {
  const {
    width = 1080,
    height = 1920,
    gearAngle = 0,
    freezeTint = 0, // 0..1 icy temporal freeze sheen
  } = opts;

  ctx.save();

  // Deep cavernous interior atmosphere
  const bg = ctx.createLinearGradient(0, 0, 0, height);
  bg.addColorStop(0, '#091026');
  bg.addColorStop(0.45, '#132045');
  bg.addColorStop(0.75, '#1a2d57');
  bg.addColorStop(1, '#0c1328');
  ctx.fillStyle = bg;
  ctx.fillRect(-300, -300, width + 600, height + 600);

  // Three monumental glowing arched glass windows in the back wall
  const arches = [
    { cx: 190, w: 290, topY: 220, botY: 1120 },
    { cx: 560, w: 360, topY: 140, botY: 1120 },
    { cx: 930, w: 290, topY: 220, botY: 1120 },
  ];

  for (let i = 0; i < arches.length; i += 1) {
    const a = arches[i];
    const r = a.w * 0.5;
    const winGrad = ctx.createLinearGradient(a.cx, a.topY, a.cx, a.botY);
    winGrad.addColorStop(0, rgba('#8de0ff', 0.55 + freezeTint * 0.15));
    winGrad.addColorStop(0.5, rgba('#3e7cb0', 0.42));
    winGrad.addColorStop(1, rgba('#1b335c', 0.2));

    ctx.fillStyle = winGrad;
    ctx.beginPath();
    ctx.arc(a.cx, a.topY + r, r, Math.PI, 0);
    ctx.lineTo(a.cx + r, a.botY);
    ctx.lineTo(a.cx - r, a.botY);
    ctx.closePath();
    ctx.fill();

    // Mullion lattice grid
    ctx.strokeStyle = '#0c1228';
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.lineWidth = 4;
    for (let m = -2; m <= 2; m += 1) {
      const mx = a.cx + m * (r * 0.42);
      ctx.beginPath();
      ctx.moveTo(mx, a.topY + r * 0.25);
      ctx.lineTo(mx, a.botY);
      ctx.stroke();
    }
    for (let y = a.topY + r; y < a.botY; y += 110) {
      ctx.beginPath();
      ctx.moveTo(a.cx - r, y);
      ctx.lineTo(a.cx + r, y);
      ctx.stroke();
    }
  }

  // Sweeping iron roof ribs receding into vanishing point
  ctx.strokeStyle = '#0f162f';
  for (let rib = 0; rib < 4; rib += 1) {
    const rad = 420 + rib * 145;
    ctx.lineWidth = 18 - rib * 2;
    ctx.beginPath();
    ctx.arc(540, 620, rad, Math.PI * 1.05, Math.PI * 1.95);
    ctx.stroke();
  }

  // Ornamental weathered iron clockwork gear motif embedded in station upper arch
  ctx.save();
  ctx.globalAlpha = 0.48;
  drawBrassGear(ctx, 560, 420, 130, 14, gearAngle, '#2a3d66', '#5c8cb8');
  ctx.restore();

  ctx.restore();
}

/**
 * Layer 4: Parked vintage locomotive / tram resting silently on gleaming station tracks.
 */
export function drawStationTrain(ctx, opts = {}) {
  const {
    x = 845,
    y = 1295,
    scale = 1,
    headlightIntensity = 0.72,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Gleaming perspective steel rails receding right-to-center
  ctx.strokeStyle = rgba('#7ec4e8', 0.42);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-230, 120);
  ctx.lineTo(-10, -25);
  ctx.moveTo(-80, 165);
  ctx.lineTo(130, -20);
  ctx.stroke();

  // Vintage tram front carriage (angled 3/4 view matching Scene 02 reference art!)
  const bodyGrad = ctx.createLinearGradient(-150, -320, 160, 80);
  bodyGrad.addColorStop(0, '#374c75');
  bodyGrad.addColorStop(0.55, '#202d4d');
  bodyGrad.addColorStop(1, '#121a30');

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 4;

  // Main front face
  ctx.beginPath();
  ctx.roundRect(-145, -310, 235, 345, [34, 34, 8, 8]);
  ctx.fill();
  ctx.stroke();

  // Receding side carriage extending right
  ctx.fillStyle = '#16203b';
  ctx.beginPath();
  ctx.moveTo(90, -295);
  ctx.lineTo(295, -245);
  ctx.lineTo(295, 5);
  ctx.lineTo(90, 35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Warm cream & amber trim band
  ctx.fillStyle = '#c49752';
  ctx.fillRect(-142, -120, 229, 16);

  // Twin front cab windshields
  ctx.fillStyle = '#101a33';
  ctx.beginPath();
  ctx.roundRect(-118, -248, 82, 92, 10);
  ctx.roundRect(-18, -248, 82, 92, 10);
  ctx.fill();
  ctx.strokeStyle = '#6b9bc7';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Diagonal reflection gloss on cab glass
  ctx.fillStyle = rgba('#9ee4ff', 0.18);
  ctx.beginPath();
  ctx.moveTo(-110, -242);
  ctx.lineTo(-65, -242);
  ctx.lineTo(-98, -162);
  ctx.lineTo(-114, -162);
  ctx.closePath();
  ctx.fill();

  // Side illuminated passenger windows
  for (let w = 0; w < 3; w += 1) {
    const wx = 114 + w * 56;
    const wy = -215 + w * 11;
    ctx.fillStyle = rgba(PALETTE.warmAmber, 0.55);
    ctx.fillRect(wx, wy, 38, 62);
  }

  // Destination plaque at crown
  ctx.fillStyle = '#18223d';
  ctx.fillRect(-75, -292, 98, 26);
  ctx.fillStyle = rgba(PALETTE.brightGold, 0.65);
  ctx.fillRect(-62, -283, 72, 8);

  // Warm central cyclops headlight
  ctx.fillStyle = '#fff5cc';
  ctx.beginPath();
  ctx.arc(-28, -62, 19, 0, TAU);
  ctx.fill();
  drawStreetlampGlow(ctx, -28, -62, 155, PALETTE.warmAmber, headlightIntensity);

  ctx.restore();
}

/**
 * Layer 3: Wet station platform floor + antique wooden-and-wrought-iron waiting bench.
 */
export function drawStationPlatformAndBench(ctx, opts = {}) {
  const {
    width = 1080,
    yFloor = 1360,
    benchX = 585,
    benchY = 1485,
    watchGlow = 0.85,
    showBench = true,
  } = opts;

  ctx.save();

  // Wet marble/stone concourse platform
  const floorGrad = ctx.createLinearGradient(0, yFloor, 0, 2000);
  floorGrad.addColorStop(0, '#182547');
  floorGrad.addColorStop(0.4, '#111b36');
  floorGrad.addColorStop(1, '#080c1c');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(-350, yFloor, width + 700, 700);

  // Subtle moonlight pool reflected on wet concourse tiles
  const refl = ctx.createRadialGradient(540, yFloor + 160, 40, 540, yFloor + 160, 520);
  refl.addColorStop(0, rgba('#6bc4eb', 0.24));
  refl.addColorStop(0.55, rgba(PALETTE.warmAmber, 0.14 * watchGlow));
  refl.addColorStop(1, rgba('#0b1229', 0));
  ctx.fillStyle = refl;
  ctx.fillRect(-300, yFloor, width + 600, 620);

  // Perspective tile lines
  ctx.strokeStyle = rgba('#7cb8de', 0.16);
  ctx.lineWidth = 2;
  for (let i = -5; i <= 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(540 + i * 75, yFloor);
    ctx.lineTo(540 + i * 240, 2040);
    ctx.stroke();
  }
  for (let row = 0; row < 8; row += 1) {
    const ry = yFloor + Math.pow(row / 7, 1.5) * 580;
    ctx.beginPath();
    ctx.moveTo(-300, ry);
    ctx.lineTo(width + 300, ry);
    ctx.stroke();
  }

  // Ornate abandoned wooden waiting bench
  if (showBench) {
    ctx.save();
    ctx.translate(benchX, benchY);

    // Shadow underneath bench
    ctx.fillStyle = rgba('#040712', 0.55);
    ctx.beginPath();
    ctx.ellipse(0, 62, 165, 22, 0, 0, TAU);
    ctx.fill();

    // Wrought-iron scroll legs
    ctx.strokeStyle = '#0e1326';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(-125, -45);
    ctx.lineTo(-132, 60);
    ctx.moveTo(125, -45);
    ctx.lineTo(132, 60);
    ctx.stroke();

    // Slatted weathered mahogany backrest
    const woodGrad = ctx.createLinearGradient(-150, -90, 150, 20);
    woodGrad.addColorStop(0, '#4f352b');
    woodGrad.addColorStop(0.5, '#3b2621');
    woodGrad.addColorStop(1, '#261817');
    ctx.fillStyle = woodGrad;
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 3;

    for (let s = 0; s < 3; s += 1) {
      ctx.beginPath();
      ctx.roundRect(-148, -96 + s * 22, 296, 17, 4);
      ctx.fill();
      ctx.stroke();
    }

    // Bench seat plank
    ctx.beginPath();
    ctx.roundRect(-156, -24, 312, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Warm golden glow bounce on wood where the pocket watch rests
    if (watchGlow > 0.05) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const wBounce = ctx.createRadialGradient(18, -22, 4, 18, -22, 115);
      wBounce.addColorStop(0, rgba(PALETTE.brightGold, 0.72 * watchGlow));
      wBounce.addColorStop(1, rgba(PALETTE.warmAmber, 0));
      ctx.fillStyle = wBounce;
      ctx.beginPath();
      ctx.ellipse(18, -16, 115, 24, 0, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Layer 1 & 2: Monumental foreground riveted iron columns & overhead arched trusses.
 */
export function drawStationForegroundPillars(ctx, opts = {}) {
  const {
    width = 1080,
    height = 1920,
    positions = [-80, 1070],
    pillarWidth = 128,
    rimColor = '#5da9d6',
  } = opts;

  ctx.save();
  for (let i = 0; i < positions.length; i += 1) {
    const px = positions[i];
    const grad = ctx.createLinearGradient(px, 0, px + pillarWidth, 0);
    grad.addColorStop(0, '#070a18');
    grad.addColorStop(0.75, '#0f162c');
    grad.addColorStop(1, '#1b294d');

    ctx.fillStyle = grad;
    ctx.fillRect(px, -220, pillarWidth, height + 440);

    // Ornate riveted flange & capital
    ctx.fillStyle = '#0a0f22';
    ctx.fillRect(px - 18, 220, pillarWidth + 36, 48);
    ctx.fillRect(px - 20, height - 300, pillarWidth + 40, 320);

    // Subtle cool edge catchlight
    ctx.strokeStyle = rgba(rimColor, 0.32);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px + pillarWidth - 2, -200);
    ctx.lineTo(px + pillarWidth - 2, height + 200);
    ctx.stroke();
  }

  // Overhead silhouetted steel arch girder
  ctx.fillStyle = '#070a17';
  ctx.beginPath();
  ctx.moveTo(-260, -200);
  ctx.lineTo(width + 260, -200);
  ctx.lineTo(width + 260, 130);
  ctx.quadraticCurveTo(width * 0.5, -10, -260, 130);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
