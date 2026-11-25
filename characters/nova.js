/**
 * NOVA — Layered, Pivot-Rigged 2D Illustrated Protagonist
 *
 * Appearance:
 *  - Small child proportions with oversized expressive head
 *  - Short dark-blue flared coat with collar & brass buttons
 *  - Flowing warm amber-ochre scarf with animated wind waves & fringe
 *  - Small laced brown boots & dark leggings
 *  - Messy dark-indigo windswept hair (back layer, crown, bangs, loose flyaways)
 *  - Large expressive eyes with dual specular catchlights, animated blink & eyebrows
 *  - Optional glowing antique pocket watch or worn sepia photograph
 *
 * Independently articulated joints & channels:
 *  head, eyes, eyebrows, mouth, arms, hands, body, legs, scarf, hair.
 */

import { PALETTE } from '../config.js';
import { clamp, lerp, rgba, TAU } from '../engine/math.js';
import { drawPocketWatch } from '../effects/time_effects.js';

/**
 * Default neutral pose for Nova.
 */
export function createDefaultNovaPose(overrides = {}) {
  return {
    x: 540,
    y: 1520,
    scale: 1,
    facing: 1, // 1 = right, -1 = left
    view: 'threeQuarter', // 'threeQuarter' | 'backThreeQuarter' | 'crouch' | 'closeup'
    frame: 1,

    // Body & head kinematics
    bobY: 0,
    bodyLean: 0,
    headTilt: 0,
    headNod: 0,

    // Facial acting
    eyeOpen: 1, // 0 = closed, 1 = wide open
    pupilX: 0, // -1..1
    pupilY: 0, // -1..1
    eyebrowAngle: 0, // negative = worried/sad, positive = suspicious/determined
    eyebrowLift: 0, // -1..1
    mouthExpr: 'neutral', // 'neutral' | 'wonder' | 'suspicious' | 'sad' | 'determined' | 'softSmile'
    blush: 0.25,
    tearProgress: 0, // 0..1 glistening tear streak (Scene 06)

    // Arms & hands (radians)
    leftArmAngle: 0.25,
    leftForearmAngle: -0.25,
    rightArmAngle: -0.22,
    rightForearmAngle: -0.35,
    handTremble: 0,

    // Legs (radians)
    leftLegAngle: 0.08,
    leftKneeAngle: 0.06,
    rightLegAngle: -0.08,
    rightKneeAngle: 0.08,

    // Secondary motion (hair & amber scarf)
    windStrength: 0.45,
    scarfPhase: 0,
    hairPhase: 0,

    // Lighting & props
    rimColor: PALETTE.electricCyan,
    rimIntensity: 0.45,
    watchLightOnFace: 0,
    holdingWatch: false,
    watchGlow: 0.85,
    watchOpen: 1,
    watchGearAngle: 0,
    watchMinuteProgress: 0,
    holdingPhoto: false,
    photoFade: 0.85,
    ...overrides,
  };
}

/**
 * Generate a natural deterministic walk cycle pose.
 */
export function createWalkPose(frame, base = {}) {
  const phase = (frame * 0.17) % TAU;
  const stride = Math.sin(phase);
  const lift = Math.abs(Math.cos(phase));
  const blink = (frame % 115) > 110 ? 0.08 : 1;

  return createDefaultNovaPose({
    frame,
    bobY: -lift * 7,
    bodyLean: 0.06,
    headTilt: Math.sin(phase * 0.5) * 0.03,
    eyeOpen: blink,
    leftLegAngle: stride * 0.48,
    leftKneeAngle: Math.max(0, -stride) * 0.45 + 0.06,
    rightLegAngle: -stride * 0.48,
    rightKneeAngle: Math.max(0, stride) * 0.45 + 0.06,
    leftArmAngle: -stride * 0.38 + 0.12,
    leftForearmAngle: -0.28,
    rightArmAngle: stride * 0.36 + 0.08,
    rightForearmAngle: -0.32,
    scarfPhase: frame * 0.14,
    hairPhase: frame * 0.12,
    windStrength: 0.6,
    ...base,
  });
}

/**
 * Generate an energetic deterministic run cycle pose (Scene 03).
 */
export function createRunPose(frame, base = {}) {
  const phase = (frame * 0.32) % TAU;
  const stride = Math.sin(phase);
  const lift = Math.abs(Math.cos(phase));

  return createDefaultNovaPose({
    frame,
    bobY: -lift * 16 - 4,
    bodyLean: 0.24,
    headTilt: -0.06 + Math.sin(phase) * 0.04,
    eyebrowAngle: 0.22,
    mouthExpr: 'determined',
    leftLegAngle: stride * 0.88,
    leftKneeAngle: Math.max(0, -stride) * 0.82 + 0.18,
    rightLegAngle: -stride * 0.88,
    rightKneeAngle: Math.max(0, stride) * 0.82 + 0.18,
    leftArmAngle: -stride * 0.72 + 0.15,
    leftForearmAngle: -0.85,
    rightArmAngle: stride * 0.65 - 0.1,
    rightForearmAngle: -0.92,
    scarfPhase: frame * 0.28,
    hairPhase: frame * 0.24,
    windStrength: 1.25,
    ...base,
  });
}

/**
 * Draw Nova's billowing warm amber-ochre scarf trailing behind her neck.
 */
function drawFlowingScarf(ctx, pose, tailOriginX, tailOriginY, tailLen = 195) {
  const wind = pose.windStrength;
  const ph = pose.scarfPhase || pose.frame * 0.12;
  const w1 = Math.sin(ph) * (14 + wind * 16);
  const w2 = Math.cos(ph * 1.15 - 1.1) * (18 + wind * 20);

  ctx.save();
  ctx.translate(tailOriginX, tailOriginY);

  // Back tail ribbon (darker amber)
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.bezierCurveTo(
    -tailLen * 0.35, -16 + w1 * 0.7,
    -tailLen * 0.72, 16 + w2 * 0.85,
    -tailLen * 0.92, 2 + w2,
  );
  ctx.lineTo(-tailLen * 0.88, 28 + w2);
  ctx.bezierCurveTo(
    -tailLen * 0.65, 42 + w2 * 0.75,
    -tailLen * 0.32, 10 + w1 * 0.65,
    0, 18,
  );
  ctx.closePath();
  ctx.fillStyle = PALETTE.scarfShadow;
  ctx.fill();
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Main upper flowing scarf ribbon
  const sGrad = ctx.createLinearGradient(0, -10, -tailLen, 20);
  sGrad.addColorStop(0, PALETTE.scarfLight);
  sGrad.addColorStop(0.55, PALETTE.scarfBase);
  sGrad.addColorStop(1, '#c9761c');

  ctx.beginPath();
  ctx.moveTo(2, -10);
  ctx.bezierCurveTo(
    -tailLen * 0.32, -28 + w1,
    -tailLen * 0.7, -8 - w2 * 0.7,
    -tailLen, -14 + w1 * 0.85,
  );
  ctx.lineTo(-tailLen * 0.95, 16 + w1 * 0.85);
  ctx.bezierCurveTo(
    -tailLen * 0.64, 24 - w2 * 0.6,
    -tailLen * 0.3, 4 + w1 * 0.9,
    4, 15,
  );
  ctx.closePath();
  ctx.fillStyle = sGrad;
  ctx.fill();
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3.2;
  ctx.stroke();

  // Painted woven fold highlight along scarf
  ctx.strokeStyle = rgba('#ffe49e', 0.45);
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-8, -2);
  ctx.bezierCurveTo(-tailLen * 0.32, -14 + w1, -tailLen * 0.65, 4 - w2 * 0.65, -tailLen * 0.92, 0 + w1 * 0.8);
  ctx.stroke();

  // Tassel fringes at tail tip
  ctx.strokeStyle = PALETTE.scarfLight;
  ctx.lineWidth = 2.5;
  for (let f = 0; f < 4; f += 1) {
    const fy = -10 + f * 8 + w1 * 0.85;
    ctx.beginPath();
    ctx.moveTo(-tailLen * 0.96, fy);
    ctx.lineTo(-tailLen * 1.07, fy + 4 + Math.sin(ph + f) * 3);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw Nova's layered messy dark-indigo hair (back locks + front sculpted bangs + stray wisps).
 */
function drawBackHair(ctx, pose, headR) {
  const ph = pose.hairPhase || pose.frame * 0.1;
  const wind = pose.windStrength;
  const sway = Math.sin(ph) * (6 + wind * 9);

  ctx.save();
  const hGrad = ctx.createLinearGradient(-headR, -headR, headR, headR);
  hGrad.addColorStop(0, '#23284b');
  hGrad.addColorStop(0.55, PALETTE.hairDark);
  hGrad.addColorStop(1, '#0c0d1c');

  ctx.fillStyle = hGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3.2;

  ctx.beginPath();
  ctx.moveTo(headR * 0.55, -headR * 0.92);
  // Crown arch
  ctx.bezierCurveTo(headR * 0.05, -headR * 1.24, -headR * 0.95, -headR * 1.08, -headR * 1.15, -headR * 0.28);
  // Swept messy back locks fluttering in wind
  ctx.bezierCurveTo(-headR * 1.55 - sway * 0.6, -headR * 0.05, -headR * 1.5 - sway, headR * 0.52, -headR * 1.08 - sway * 0.8, headR * 0.86);
  ctx.quadraticCurveTo(-headR * 0.82 - sway * 0.4, headR * 0.64, -headR * 0.68 - sway * 0.3, headR * 1.02);
  ctx.quadraticCurveTo(-headR * 0.25, headR * 0.95, headR * 0.18, headR * 0.84);
  ctx.quadraticCurveTo(headR * 0.82, headR * 0.55, headR * 0.85, -headR * 0.25);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Rim-light stroke on windswept hair silhouette
  if (pose.rimIntensity > 0.05) {
    ctx.strokeStyle = rgba(pose.rimColor, pose.rimIntensity * 0.85);
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-headR * 0.92, -headR * 0.72);
    ctx.bezierCurveTo(-headR * 1.38 - sway * 0.5, -headR * 0.15, -headR * 1.38 - sway * 0.9, headR * 0.42, -headR * 1.04 - sway * 0.7, headR * 0.78);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFrontBangs(ctx, pose, headR) {
  const ph = pose.hairPhase || pose.frame * 0.1;
  const sway = Math.sin(ph + 0.8) * (3 + pose.windStrength * 5);

  ctx.save();
  const bGrad = ctx.createLinearGradient(-headR * 0.6, -headR * 1.1, headR * 0.7, headR * 0.4);
  bGrad.addColorStop(0, PALETTE.hairHighlight);
  bGrad.addColorStop(0.45, PALETTE.hairDark);
  bGrad.addColorStop(1, '#0e1022');
  ctx.fillStyle = bGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3;

  // Sculpted anime/storybook bangs framing forehead & side cheek
  ctx.beginPath();
  ctx.moveTo(-headR * 0.88, -headR * 0.52);
  ctx.bezierCurveTo(-headR * 0.48, -headR * 1.2, headR * 0.52, -headR * 1.15, headR * 0.95, -headR * 0.42);
  // Right sweeping brow lock
  ctx.quadraticCurveTo(headR * 1.05 + sway * 0.2, -headR * 0.02, headR * 0.76 + sway * 0.2, headR * 0.14);
  ctx.quadraticCurveTo(headR * 0.72, -headR * 0.22, headR * 0.46, -headR * 0.34);
  // Center bangs lock
  ctx.quadraticCurveTo(headR * 0.34 + sway * 0.25, headR * 0.04, headR * 0.12 + sway * 0.2, -headR * 0.26);
  // Left eyebrow lock
  ctx.quadraticCurveTo(-headR * 0.04 + sway * 0.2, headR * 0.06, -headR * 0.26, -headR * 0.24);
  // Side ear-covering messy curl
  ctx.quadraticCurveTo(-headR * 0.42 - sway * 0.35, headR * 0.48, -headR * 0.72 - sway * 0.4, headR * 0.76);
  ctx.quadraticCurveTo(-headR * 0.95 - sway * 0.2, headR * 0.35, -headR * 0.88, -headR * 0.52);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Painterly blue-indigo sheen arc across crown
  ctx.strokeStyle = rgba('#5b68a8', 0.42);
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(-headR * 0.05, -headR * 0.3, headR * 0.62, -2.35, -0.95);
  ctx.stroke();

  // Loose ahoge / stray wind strands
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(-headR * 0.12, -headR * 1.05);
  ctx.quadraticCurveTo(-headR * 0.45 - sway * 0.4, -headR * 1.32, -headR * 0.68 - sway * 0.6, -headR * 1.12);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw Nova's oversized expressive face with independently animated eyes,
 * eyebrows, blush, mouth expression, warm watch under-glow, and optional tear.
 */
function drawNovaFace(ctx, pose, headR) {
  ctx.save();

  // Skin gradient with optional warm amber watch bounce-light from below
  const skinGrad = ctx.createRadialGradient(
    headR * 0.32, headR * 0.28, headR * 0.12,
    0, 0, headR * 1.05,
  );
  if (pose.watchLightOnFace > 0.05) {
    skinGrad.addColorStop(0, '#ffe8c4');
    skinGrad.addColorStop(0.55, PALETTE.skinLight);
    skinGrad.addColorStop(1, '#ba8070');
  } else {
    skinGrad.addColorStop(0, '#fce0ce');
    skinGrad.addColorStop(0.65, PALETTE.skinLight);
    skinGrad.addColorStop(1, PALETTE.skinShadow);
  }

  // Soft expressive child jawline (3/4 view facing right in local coords)
  ctx.fillStyle = skinGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(-headR * 0.64, -headR * 0.48);
  ctx.bezierCurveTo(-headR * 0.72, headR * 0.35, -headR * 0.25, headR * 0.92, headR * 0.28, headR * 0.88);
  ctx.bezierCurveTo(headR * 0.74, headR * 0.84, headR * 0.92, headR * 0.35, headR * 0.88, -headR * 0.14);
  ctx.bezierCurveTo(headR * 0.86, -headR * 0.68, headR * 0.32, -headR * 0.95, -headR * 0.64, -headR * 0.48);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Delicate blush on cheeks
  if (pose.blush > 0.02) {
    ctx.fillStyle = rgba('#f0828c', pose.blush * 0.38);
    ctx.beginPath();
    ctx.ellipse(headR * 0.16, headR * 0.38, headR * 0.18, headR * 0.09, 0, 0, TAU);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(headR * 0.74, headR * 0.36, headR * 0.12, headR * 0.08, 0, 0, TAU);
    ctx.fill();
  }

  // Expressive Eyes (left eye larger in 3/4 view, right eye slightly foreshortened)
  const eyes = [
    { ex: headR * 0.18, ey: headR * 0.12, rx: headR * 0.21, ry: headR * 0.25 },
    { ex: headR * 0.68, ey: headR * 0.11, rx: headR * 0.14, ry: headR * 0.23 },
  ];

  const open = clamp(pose.eyeOpen, 0, 1);
  for (let i = 0; i < eyes.length; i += 1) {
    const e = eyes[i];
    if (open < 0.15) {
      // Closed peaceful / determined eyelids
      ctx.strokeStyle = PALETTE.inkOutline;
      ctx.lineWidth = 3.6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(e.ex - e.rx * 0.85, e.ey + e.ry * 0.1);
      ctx.quadraticCurveTo(e.ex, e.ey + e.ry * 0.48, e.ex + e.rx * 0.85, e.ey + e.ry * 0.05);
      ctx.stroke();
    } else {
      const curRy = e.ry * open;
      // Sclera
      ctx.fillStyle = '#fffdf8';
      ctx.beginPath();
      ctx.ellipse(e.ex, e.ey, e.rx, curRy, 0, 0, TAU);
      ctx.fill();

      // Clip iris inside eye opening
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(e.ex, e.ey, e.rx * 0.96, curRy * 0.96, 0, 0, TAU);
      ctx.clip();

      const px = e.ex + pose.pupilX * e.rx * 0.32;
      const py = e.ey + pose.pupilY * curRy * 0.25;
      const irisGrad = ctx.createLinearGradient(px, py - curRy, px, py + curRy);
      irisGrad.addColorStop(0, '#171936');
      irisGrad.addColorStop(0.55, '#3b2e5e');
      irisGrad.addColorStop(1, pose.watchLightOnFace > 0.2 ? PALETTE.warmAmber : '#7c5d87');
      ctx.fillStyle = irisGrad;
      ctx.beginPath();
      ctx.ellipse(px, py, e.rx * 0.72, e.ry * 0.82, 0, 0, TAU);
      ctx.fill();

      // Deep pupil
      ctx.fillStyle = '#0c0d1c';
      ctx.beginPath();
      ctx.ellipse(px, py, e.rx * 0.38, e.ry * 0.44, 0, 0, TAU);
      ctx.fill();

      // Primary & secondary luminous catchlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px - e.rx * 0.22, py - e.ry * 0.28, e.rx * 0.24, 0, TAU);
      ctx.fill();
      ctx.fillStyle = rgba(PALETTE.goldenSunrise, 0.9);
      ctx.beginPath();
      ctx.arc(px + e.rx * 0.24, py + e.ry * 0.24, e.rx * 0.13, 0, TAU);
      ctx.fill();

      ctx.restore();

      // Bold upper eyelash arch
      ctx.strokeStyle = PALETTE.inkOutline;
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(e.ex, e.ey + curRy * 0.08, e.rx * 1.05, Math.PI * 1.12, Math.PI * 1.9);
      ctx.stroke();
    }

    // Expressive animated eyebrows
    const browY = e.ey - e.ry * 1.32 - pose.eyebrowLift * 8;
    const tilt = pose.eyebrowAngle * (i === 0 ? 1 : -0.7);
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.ex - e.rx * 0.72, browY - tilt * 10);
    ctx.quadraticCurveTo(e.ex, browY - 4, e.ex + e.rx * 0.75, browY + tilt * 10);
    ctx.stroke();
  }

  // Tiny sculpted button nose
  ctx.strokeStyle = '#9e6b5b';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(headR * 0.56, headR * 0.28);
  ctx.lineTo(headR * 0.62, headR * 0.35);
  ctx.lineTo(headR * 0.54, headR * 0.38);
  ctx.stroke();

  // Glistening tear streak (Scene 06 emotional reveal)
  if (pose.tearProgress > 0.02) {
    const tp = clamp(pose.tearProgress, 0, 1);
    ctx.save();
    ctx.strokeStyle = rgba('#e8f6ff', 0.85);
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(headR * 0.16, headR * 0.34);
    ctx.quadraticCurveTo(headR * 0.12, headR * (0.38 + tp * 0.24), headR * 0.18, headR * (0.36 + tp * 0.38));
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(headR * 0.18, headR * (0.36 + tp * 0.38), 3.4, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // Expressive animated mouth
  const mx = headR * 0.46;
  const my = headR * 0.58;
  ctx.strokeStyle = '#6d3b3a';
  ctx.lineWidth = 2.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  if (pose.mouthExpr === 'wonder') {
    ctx.fillStyle = '#803d45';
    ctx.ellipse(mx, my + 2, headR * 0.09, headR * 0.11, 0, 0, TAU);
    ctx.fill();
    ctx.stroke();
  } else if (pose.mouthExpr === 'softSmile') {
    ctx.moveTo(mx - headR * 0.16, my - 1);
    ctx.quadraticCurveTo(mx, my + headR * 0.12, mx + headR * 0.16, my - 4);
    ctx.stroke();
  } else if (pose.mouthExpr === 'sad') {
    ctx.moveTo(mx - headR * 0.12, my + 5);
    ctx.quadraticCurveTo(mx, my - 3, mx + headR * 0.12, my + 5);
    ctx.stroke();
  } else if (pose.mouthExpr === 'suspicious' || pose.mouthExpr === 'determined') {
    ctx.moveTo(mx - headR * 0.12, my + 1);
    ctx.lineTo(mx + headR * 0.13, my - 2);
    ctx.stroke();
  } else {
    ctx.moveTo(mx - headR * 0.1, my);
    ctx.quadraticCurveTo(mx, my + 3, mx + headR * 0.1, my - 1);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draw articulated leg + small dark-brown laced boot.
 */
function drawLeg(ctx, hipX, hipY, upperAngle, kneeAngle, scale = 1, isBack = false) {
  const thighLen = 58 * scale;
  const shinLen = 56 * scale;

  ctx.save();
  ctx.translate(hipX, hipY);
  ctx.rotate(upperAngle);

  // Legging
  ctx.strokeStyle = isBack ? '#0e1326' : '#18203c';
  ctx.lineWidth = 17 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, thighLen);
  ctx.stroke();

  // Knee pivot
  ctx.translate(0, thighLen);
  ctx.rotate(kneeAngle);

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, shinLen);
  ctx.stroke();

  // Boot
  ctx.translate(0, shinLen - 8 * scale);
  ctx.fillStyle = isBack ? '#3b2419' : '#573524';
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(-10 * scale, -14 * scale);
  ctx.lineTo(10 * scale, -14 * scale);
  ctx.lineTo(14 * scale, 8 * scale);
  ctx.quadraticCurveTo(32 * scale, 10 * scale, 30 * scale, 22 * scale);
  ctx.lineTo(-12 * scale, 22 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw articulated coat sleeve + child hand, optionally holding pocket watch or photograph.
 */
function drawArm(ctx, shX, shY, armAngle, forearmAngle, pose, isFront = true) {
  const upperLen = 50;
  const lowerLen = 46;
  const trembleX = pose.handTremble ? Math.sin(pose.frame * 1.9) * pose.handTremble * 3.5 : 0;
  const trembleY = pose.handTremble ? Math.cos(pose.frame * 2.3) * pose.handTremble * 2.5 : 0;

  ctx.save();
  ctx.translate(shX, shY);
  ctx.rotate(armAngle);

  // Upper coat sleeve
  ctx.fillStyle = isFront ? PALETTE.coatBlue : PALETTE.coatShadow;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-12, -6, 24, upperLen + 10, 10);
  ctx.fill();
  ctx.stroke();

  // Elbow pivot
  ctx.translate(0, upperLen);
  ctx.rotate(forearmAngle);

  ctx.beginPath();
  ctx.roundRect(-10.5, -4, 21, lowerLen + 8, 9);
  ctx.fill();
  ctx.stroke();

  // Cuff trim
  ctx.fillStyle = '#334878';
  ctx.fillRect(-11, lowerLen - 6, 22, 8);

  // Hand
  ctx.translate(trembleX, lowerLen + 6 + trembleY);
  ctx.fillStyle = PALETTE.skinLight;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.arc(2, 5, 11, 0, TAU);
  ctx.fill();
  ctx.stroke();

  // Prop in front hand: glowing pocket watch
  if (isFront && pose.holdingWatch) {
    drawPocketWatch(ctx, {
      x: 16,
      y: -8,
      radius: 22,
      openAmount: pose.watchOpen,
      glowIntensity: pose.watchGlow,
      gearAngle: pose.watchGearAngle,
      minuteHandProgress: pose.watchMinuteProgress,
      frame: pose.frame,
    });
  }

  ctx.restore();
}

/**
 * Draw Nova's flared dark-blue coat with brass buttons and warm amber scarf wrap around collar.
 */
function drawCoatAndCollar(ctx, pose) {
  const cGrad = ctx.createLinearGradient(-46, -10, 48, 130);
  cGrad.addColorStop(0, '#2c3f6e');
  cGrad.addColorStop(0.55, PALETTE.coatBlue);
  cGrad.addColorStop(1, PALETTE.coatShadow);

  ctx.fillStyle = cGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3.2;

  // Flared child overcoat silhouette
  ctx.beginPath();
  ctx.moveTo(-26, -6);
  ctx.lineTo(26, -6);
  ctx.bezierCurveTo(38, 42, 56, 98, 62, 138);
  ctx.quadraticCurveTo(0, 152, -64, 136);
  ctx.bezierCurveTo(-54, 92, -38, 42, -26, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Subtle coat lapel & brass buttons (for front/3/4 view)
  if (pose.view !== 'backThreeQuarter') {
    ctx.strokeStyle = rgba('#0d1326', 0.65);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(8, 12);
    ctx.lineTo(14, 136);
    ctx.stroke();

    ctx.fillStyle = PALETTE.antiqueBrass;
    for (let b = 0; b < 3; b += 1) {
      ctx.beginPath();
      ctx.arc(20, 38 + b * 28, 4.2, 0, TAU);
      ctx.fill();
    }
  }

  // Rim highlight along coat front edge
  if (pose.rimIntensity > 0.05) {
    ctx.strokeStyle = rgba(pose.rimColor, pose.rimIntensity * 0.72);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(26, 2);
    ctx.bezierCurveTo(38, 44, 54, 96, 59, 134);
    ctx.stroke();
  }

  // Warm amber scarf wrapped snugly around neck
  const neckGrad = ctx.createLinearGradient(-34, -18, 36, 18);
  neckGrad.addColorStop(0, PALETTE.scarfLight);
  neckGrad.addColorStop(0.55, PALETTE.scarfBase);
  neckGrad.addColorStop(1, PALETTE.scarfShadow);

  ctx.fillStyle = neckGrad;
  ctx.strokeStyle = PALETTE.inkOutline;
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.roundRect(-36, -18, 72, 30, 15);
  ctx.fill();
  ctx.stroke();

  // Scarf fold crease
  ctx.strokeStyle = rgba('#783f0f', 0.55);
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-26, -2);
  ctx.quadraticCurveTo(0, 6, 28, -4);
  ctx.stroke();
}

/**
 * Render Nova at her anchor point (x, y = foot/ground contact point for full body,
 * or torso center for close-up portrait mode).
 */
export function drawNova(ctx, rawPose = {}) {
  const pose = createDefaultNovaPose(rawPose);

  ctx.save();
  ctx.translate(pose.x, pose.y + pose.bobY);
  ctx.scale(pose.scale * pose.facing, pose.scale);

  // Subtle ground shadow for full-body views
  if (pose.view !== 'closeup') {
    ctx.fillStyle = rgba('#040712', 0.42);
    ctx.beginPath();
    ctx.ellipse(0, 4, 56, 13, 0, 0, TAU);
    ctx.fill();
  }

  // Anchor offset: place torso pivot above ground (feet around y=0)
  const isCrouch = pose.view === 'crouch';
  const torsoBaseY = pose.view === 'closeup' ? 0 : isCrouch ? -168 : -236;

  // Back flowing scarf behind body
  drawFlowingScarf(ctx, pose, -18, torsoBaseY + 6, pose.view === 'closeup' ? 235 : 195);

  // Legs (omitted in closeup portrait)
  if (pose.view !== 'closeup') {
    if (isCrouch) {
      drawLeg(ctx, -16, torsoBaseY + 110, -1.05, 1.85, 0.92, true);
      drawLeg(ctx, 14, torsoBaseY + 110, -0.78, 1.55, 0.96, false);
    } else {
      drawLeg(ctx, -14, torsoBaseY + 124, pose.leftLegAngle, pose.leftKneeAngle, 0.95, true);
      drawLeg(ctx, 14, torsoBaseY + 124, pose.rightLegAngle, pose.rightKneeAngle, 0.95, false);
    }
  }

  // Torso pivot
  ctx.save();
  ctx.translate(0, torsoBaseY);
  ctx.rotate(pose.bodyLean + (isCrouch ? 0.22 : 0));

  // Back arm
  drawArm(ctx, -20, 12, pose.leftArmAngle, pose.leftForearmAngle, pose, false);

  // Flared dark-blue coat & amber scarf collar
  drawCoatAndCollar(ctx, pose);

  // Oversized expressive head pivot
  const headR = 54;
  ctx.save();
  ctx.translate(4, -56);
  ctx.rotate(pose.headTilt);

  if (pose.view === 'backThreeQuarter') {
    // Hero back-3/4 view looking up at the giant clock tower or sky timeline
    // Soft cheek profile peeking out
    ctx.fillStyle = PALETTE.skinLight;
    ctx.strokeStyle = PALETTE.inkOutline;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(headR * 0.34, headR * 0.08, headR * 0.62, -0.7, 1.45);
    ctx.fill();
    ctx.stroke();

    // Small upturned eye glimpse on side profile
    ctx.fillStyle = PALETTE.inkOutline;
    ctx.beginPath();
    ctx.ellipse(headR * 0.68, -headR * 0.02, 5, 8, -0.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(headR * 0.7, -headR * 0.06, 2.2, 0, TAU);
    ctx.fill();

    // Lush back dark hair enveloping crown
    drawBackHair(ctx, pose, headR * 1.06);
  } else {
    drawBackHair(ctx, pose, headR);
    drawNovaFace(ctx, pose, headR);
    drawFrontBangs(ctx, pose, headR);
  }

  ctx.restore(); // end head

  // Front arm (with optional glowing pocket watch)
  drawArm(ctx, 18, 12, pose.rightArmAngle, pose.rightForearmAngle, pose, true);

  ctx.restore(); // end torso
  ctx.restore();
}
