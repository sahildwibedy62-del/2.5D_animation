/**
 * MEMORY WORLD & FADED PHOTOGRAPH — Emotional Core Illustrations (Scene 04 & Scene 06)
 *
 *  - drawMotherAndNovaMemory: Warm sunset-lit hand-painted illustration of Nova's mother
 *    embracing laughing younger Nova, bordered by golden spring blossoms, with gradual
 *    ethereal dissolve as the pocket watch claims the memory.
 *  - drawFadingPhotograph: Worn cream-bordered sepia photograph held in Nova's hands in
 *    Scene 06 where the mother's face has tenderly faded into warm luminous light.
 */

import { PALETTE } from '../config.js';
import { clamp, hash1D, lerp, rgba, TAU } from '../engine/math.js';
import { drawCherryBlossoms } from '../effects/particles.js';

/**
 * Draw the painted sunset memory inside an elliptical golden portal (Scene 04).
 */
export function drawMotherAndNovaMemory(ctx, opts = {}) {
  const {
    cx = 430,
    cy = 770,
    rx = 315,
    ry = 255,
    reveal = 1, // 0..1 portal open
    dissolve = 0, // 0..1 memory starting to unravel into golden dust
    frame = 1,
  } = opts;

  const r = clamp(reveal, 0, 1);
  if (r <= 0.01) return;

  const breath = Math.sin(frame * 0.05) * 4;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(r, r);

  // Clip painted memory world inside the luminous vignette ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, TAU);
  ctx.clip();

  // Warm golden-peach sunset memory sky backdrop
  const sky = ctx.createRadialGradient(0, -40, 20, 0, 0, rx * 1.15);
  sky.addColorStop(0, '#fff7d9');
  sky.addColorStop(0.42, '#ffd49b');
  sky.addColorStop(0.75, '#f29a85');
  sky.addColorStop(1, '#94536f');
  ctx.fillStyle = sky;
  ctx.fillRect(-rx, -ry, rx * 2, ry * 2);

  // Soft sunlit meadow & distant blurred hills
  ctx.fillStyle = rgba('#d47f72', 0.42);
  ctx.beginPath();
  ctx.ellipse(0, ry * 0.85, rx * 1.1, ry * 0.45, 0, 0, TAU);
  ctx.fill();

  // Floating blossom petals behind mother & child
  drawCherryBlossoms(ctx, {
    centerX: 0,
    centerY: 0,
    spreadRadius: rx * 0.72,
    count: 20,
    frame,
    opacity: 0.75 * (1 - dissolve * 0.4),
    seed: 4401,
  });

  // --- MOTHER FIGURE (right-center, embracing Nova tenderly) ---
  ctx.save();
  ctx.translate(46, 36 + breath * 0.6);

  // Warm cream/rose shawl & shoulders
  const shawlGrad = ctx.createLinearGradient(-85, 25, 110, 210);
  shawlGrad.addColorStop(0, '#fce6cf');
  shawlGrad.addColorStop(0.55, '#e8b59e');
  shawlGrad.addColorStop(1, '#ba7c76');
  ctx.fillStyle = shawlGrad;
  ctx.strokeStyle = '#5c3436';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-88, 220);
  ctx.quadraticCurveTo(-74, 48, -16, 20);
  ctx.lineTo(66, 20);
  ctx.quadraticCurveTo(138, 65, 152, 220);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Mother's low bun back hair
  ctx.fillStyle = '#3b2633';
  ctx.beginPath();
  ctx.arc(82, -52, 34, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Mother's neck
  ctx.fillStyle = '#f2c7b1';
  ctx.fillRect(-6, -12, 34, 42);

  // Mother's gentle tilted head
  ctx.save();
  ctx.translate(6, -64);
  ctx.rotate(-0.18);

  // Hair crown
  ctx.fillStyle = '#3b2633';
  ctx.beginPath();
  ctx.arc(10, -10, 64, 0, TAU);
  ctx.fill();

  // Warm face profile tilted toward Nova
  const mSkin = ctx.createRadialGradient(-16, -6, 6, 0, 0, 62);
  mSkin.addColorStop(0, '#ffe6d4');
  mSkin.addColorStop(0.75, '#f2c7b1');
  mSkin.addColorStop(1, '#d69c88');
  ctx.fillStyle = mSkin;
  ctx.strokeStyle = '#5c3436';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(-42, -32);
  ctx.bezierCurveTo(-52, 18, -32, 58, 6, 60);
  ctx.bezierCurveTo(38, 58, 52, 24, 48, -22);
  ctx.bezierCurveTo(36, -56, -24, -56, -42, -32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sweeping soft bangs framing mother's forehead
  ctx.fillStyle = '#3b2633';
  ctx.beginPath();
  ctx.moveTo(-46, -24);
  ctx.bezierCurveTo(-22, -74, 42, -70, 58, -18);
  ctx.quadraticCurveTo(46, 28, 34, 48);
  ctx.quadraticCurveTo(34, -8, 16, -24);
  ctx.quadraticCurveTo(-8, -34, -36, -12);
  ctx.closePath();
  ctx.fill();

  // Mother's peaceful closed-eye smile (warmth & tenderness)
  ctx.strokeStyle = '#47252b';
  ctx.lineWidth = 3.2;
  ctx.lineCap = 'round';
  // Left closed eye arc
  ctx.beginPath();
  ctx.arc(-22, 4, 12, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  // Right closed eye arc
  ctx.beginPath();
  ctx.arc(10, 6, 11, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();

  // Soft blush & serene smile
  ctx.fillStyle = rgba('#f0868b', 0.35);
  ctx.beginPath();
  ctx.ellipse(-26, 20, 11, 6, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-14, 32);
  ctx.quadraticCurveTo(-2, 42, 12, 31);
  ctx.stroke();

  ctx.restore(); // end mother head
  ctx.restore(); // end mother figure

  // --- YOUNG NOVA (left-center, laughing warmly in mother's embrace) ---
  ctx.save();
  ctx.translate(-74, 96 - breath * 0.4);

  // Coat & amber scarf
  ctx.fillStyle = '#293a66';
  ctx.strokeStyle = '#402633';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.roundRect(-52, 22, 108, 120, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = PALETTE.scarfLight;
  ctx.beginPath();
  ctx.roundRect(-48, 8, 96, 26, 12);
  ctx.fill();
  ctx.stroke();

  // Young Nova's head tilted joyfully upward toward her mother
  ctx.save();
  ctx.translate(2, -32);
  ctx.rotate(0.16);

  // Messy dark hair
  ctx.fillStyle = '#232440';
  ctx.beginPath();
  ctx.arc(-6, -4, 54, 0, TAU);
  ctx.fill();

  // Face
  ctx.fillStyle = '#fce0ce';
  ctx.beginPath();
  ctx.arc(4, 2, 42, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Front bangs
  ctx.fillStyle = '#232440';
  ctx.beginPath();
  ctx.arc(0, -14, 46, Math.PI * 1.05, Math.PI * 1.98);
  ctx.lineTo(28, -16);
  ctx.lineTo(12, -26);
  ctx.lineTo(-4, -14);
  ctx.lineTo(-22, -24);
  ctx.closePath();
  ctx.fill();

  // Happy squinting crescent eyes & wide joyful smile!
  ctx.strokeStyle = '#3d2228';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-6, 4, 9, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(24, 3, 8, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();

  ctx.fillStyle = '#d96c72';
  ctx.beginPath();
  ctx.arc(10, 22, 11, 0, Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore(); // end young Nova head

  // Mother's gentle embracing arm wrapping around Nova's shoulder
  ctx.fillStyle = '#fce6cf';
  ctx.strokeStyle = '#5c3436';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(118, 28);
  ctx.quadraticCurveTo(54, 72, -10, 56);
  ctx.quadraticCurveTo(-24, 42, -4, 30);
  ctx.quadraticCurveTo(52, 42, 112, 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore(); // end young Nova

  // Dissolving golden memory glow when the watch reveals the sacrifice price!
  if (dissolve > 0.01) {
    const d = clamp(dissolve, 0, 1);
    const wash = ctx.createRadialGradient(46, -24, 10, 46, -24, rx * 0.95);
    wash.addColorStop(0, rgba('#fff8db', d * 0.88));
    wash.addColorStop(0.55, rgba(PALETTE.warmAmber, d * 0.45));
    wash.addColorStop(1, rgba(PALETTE.warmAmber, 0));
    ctx.fillStyle = wash;
    ctx.fillRect(-rx, -ry, rx * 2, ry * 2);

    // Swirling golden filaments pulling memory particles outward toward the pocket watch
    for (let i = 0; i < 28; i += 1) {
      const px = lerp(-120 + hash1D(i, 4501) * 280, rx * 0.9, d * (0.4 + hash1D(i, 4502) * 0.6));
      const py = lerp(-120 + hash1D(i, 4503) * 240, ry * 0.85, d * 0.75) + Math.sin(frame * 0.1 + i) * 14;
      ctx.fillStyle = rgba('#fff4c4', d * 0.9);
      ctx.beginPath();
      ctx.arc(px, py, 2.5 + hash1D(i, 4504) * 4.5, 0, TAU);
      ctx.fill();
    }
  }

  // Soft warm inner vignette border
  const innerVig = ctx.createRadialGradient(0, 0, rx * 0.62, 0, 0, rx * 1.02);
  innerVig.addColorStop(0, 'rgba(255, 240, 200, 0)');
  innerVig.addColorStop(1, rgba(PALETTE.goldenSunrise, 0.45));
  ctx.fillStyle = innerVig;
  ctx.fillRect(-rx, -ry, rx * 2, ry * 2);

  ctx.restore(); // end ellipse clip
  ctx.restore();
}

/**
 * Scene 06 Emotional Payoff: Worn sepia photograph held in Nova's hands.
 * The mother's face has gently faded into luminous golden blankness — she can no longer remember it.
 */
export function drawFadingPhotograph(ctx, opts = {}) {
  const {
    x = 540,
    y = 1220,
    scale = 1,
    rotation = -0.08,
    fadeAmount = 0.92, // 0 = visible face, 1 = completely faded into soft warm light
    withHands = true,
  } = opts;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.scale(scale, scale);

  const pw = 230;
  const ph = 275;

  // Drop shadow
  ctx.fillStyle = rgba('#211324', 0.34);
  ctx.beginPath();
  ctx.roundRect(-pw * 0.5 + 8, -ph * 0.5 + 12, pw, ph, 6);
  ctx.fill();

  // Vintage cream photographic paper border
  const paperGrad = ctx.createLinearGradient(-pw * 0.5, -ph * 0.5, pw * 0.5, ph * 0.5);
  paperGrad.addColorStop(0, '#fcf3e1');
  paperGrad.addColorStop(1, '#e0c9a4');
  ctx.fillStyle = paperGrad;
  ctx.strokeStyle = '#5e4332';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-pw * 0.5, -ph * 0.5, pw, ph, 4);
  ctx.fill();
  ctx.stroke();

  // Inner sepia image frame
  const ix = -pw * 0.5 + 18;
  const iy = -ph * 0.5 + 18;
  const iw = pw - 36;
  const ih = ph - 64;

  const imgGrad = ctx.createLinearGradient(ix, iy, ix, iy + ih);
  imgGrad.addColorStop(0, '#f3dec0');
  imgGrad.addColorStop(0.55, '#d6b389');
  imgGrad.addColorStop(1, '#a6805b');
  ctx.fillStyle = imgGrad;
  ctx.fillRect(ix, iy, iw, ih);

  // Subtle folded crease lines across the old photo
  ctx.strokeStyle = rgba('#fff6e6', 0.42);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ix, iy + ih * 0.62);
  ctx.lineTo(ix + iw, iy + ih * 0.46);
  ctx.stroke();

  // Silhouette of Mother & young Nova in sepia
  ctx.save();
  ctx.beginPath();
  ctx.rect(ix, iy, iw, ih);
  ctx.clip();

  // Mother's silhouette torso & low hair bun
  ctx.fillStyle = '#73533b';
  ctx.beginPath();
  ctx.ellipse(24, 52, 54, 68, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(20, -26, 34, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(54, -22, 16, 0, TAU);
  ctx.fill();

  // Young Nova beside her
  ctx.fillStyle = '#634632';
  ctx.beginPath();
  ctx.ellipse(-38, 66, 36, 48, 0, 0, TAU);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-36, 10, 24, 0, TAU);
  ctx.fill();

  // Luminous golden erasure haze softly dissolving the mother's face!
  const f = clamp(fadeAmount, 0, 1);
  const fadeHalo = ctx.createRadialGradient(18, -26, 4, 18, -26, 52);
  fadeHalo.addColorStop(0, rgba('#fff9eb', 0.98 * f));
  fadeHalo.addColorStop(0.55, rgba('#f5dfc0', 0.88 * f));
  fadeHalo.addColorStop(1, rgba('#f5dfc0', 0));
  ctx.fillStyle = fadeHalo;
  ctx.beginPath();
  ctx.arc(18, -26, 54, 0, TAU);
  ctx.fill();

  ctx.restore(); // end inner photo clip

  // Subtle border line around photo inset
  ctx.strokeStyle = rgba('#785940', 0.5);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(ix, iy, iw, ih);

  // Nova's small hands gently holding left & right edges of the photograph
  if (withHands) {
    ctx.fillStyle = PALETTE.skinLight;
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 2.6;

    // Left thumb & fingers
    ctx.beginPath();
    ctx.ellipse(-pw * 0.46, 32, 22, 15, 0.25, 0, TAU);
    ctx.fill();
    ctx.stroke();

    // Right thumb & fingers
    ctx.beginPath();
    ctx.ellipse(pw * 0.46, 26, 22, 15, -0.25, 0, TAU);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}
