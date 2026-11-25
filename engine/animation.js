/**
 * Deterministic easing curves, keyframe interpolation, envelopes, and cyclic motion helpers.
 */

import { clamp, lerp, invLerp, lerpColor, mod, TAU } from './math.js';

export const EASING = Object.freeze({
  linear: (t) => t,
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => 1 - (1 - t) * (1 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),

  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),

  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),

  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  easeInExpo: (t) => (t <= 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    return t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
});

/**
 * Evaluate normalized progress [0, 1] across a frame range with optional easing.
 */
export function segmentProgress(frame, startFrame, endFrame, ease = EASING.linear) {
  const raw = invLerp(startFrame, endFrame, frame);
  return ease(clamp(raw, 0, 1));
}

/**
 * Smooth fade-in and fade-out opacity envelope for normalized progress u in [0, 1].
 */
export function envelope(u, fadeIn = 0.12, fadeOut = 0.12) {
  const t = clamp(u, 0, 1);
  const inVal = fadeIn > 0 ? clamp(t / fadeIn, 0, 1) : 1;
  const outVal = fadeOut > 0 ? clamp((1 - t) / fadeOut, 0, 1) : 1;
  return EASING.easeInOutSine(Math.min(inVal, outVal));
}

/**
 * Deterministic sinusoidal oscillation between min and max.
 */
export function oscillate(timeValue, min, max, period = 60, phase = 0) {
  const s = 0.5 + 0.5 * Math.sin(((timeValue / period) + phase) * TAU);
  return lerp(min, max, s);
}

/**
 * Deterministic repeating loop phase in [0, 1).
 */
export function loopPhase(frame, loopLength, offset = 0) {
  return mod(frame - 1 + offset, loopLength) / loopLength;
}

function interpolateValue(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') {
    return lerp(a, b, t);
  }
  if (typeof a === 'string' && typeof b === 'string' && a.startsWith('#') && b.startsWith('#')) {
    return lerpColor(a, b, t);
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((item, idx) => interpolateValue(item, b[idx], t));
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const out = {};
    const keys = Object.keys(a);
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      out[k] = k in b ? interpolateValue(a[k], b[k], t) : a[k];
    }
    return out;
  }
  return t < 0.5 ? a : b;
}

/**
 * Evaluate sorted keyframes `[{ t, value, ease? }]` at normalized time `t`.
 * Supports numbers, hex colors, arrays, and plain objects.
 */
export function evaluateKeyframes(keyframes, t, fallback = 0) {
  if (!keyframes || keyframes.length === 0) return fallback;
  if (keyframes.length === 1 || t <= keyframes[0].t) return keyframes[0].value;
  const last = keyframes[keyframes.length - 1];
  if (t >= last.t) return last.value;

  for (let i = 0; i < keyframes.length - 1; i += 1) {
    const k0 = keyframes[i];
    const k1 = keyframes[i + 1];
    if (t >= k0.t && t <= k1.t) {
      const localT = invLerp(k0.t, k1.t, t);
      const easeFn = typeof k1.ease === 'function'
        ? k1.ease
        : typeof k1.ease === 'string' && EASING[k1.ease]
          ? EASING[k1.ease]
          : EASING.easeInOutCubic;
      return interpolateValue(k0.value, k1.value, easeFn(localT));
    }
  }

  return last.value;
}
