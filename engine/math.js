/**
 * Deterministic mathematics, seeded PRNG, noise, geometry, and colour interpolation utilities.
 * Zero Math.random() usage — every function is 100% pure and deterministic.
 */

export const TAU = Math.PI * 2;
export const HALF_PI = Math.PI * 0.5;

export function clamp(value, min = 0, max = 1) {
  return value < min ? min : value > max ? max : value;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function invLerp(a, b, value) {
  if (a === b) return 0;
  return clamp((value - a) / (b - a), 0, 1);
}

export function remap(value, inMin, inMax, outMin, outMax) {
  return lerp(outMin, outMax, invLerp(inMin, inMax, value));
}

export function smoothstep(edge0, edge1, x) {
  const t = invLerp(edge0, edge1, x);
  return t * t * (3 - 2 * t);
}

export function smootherstep(edge0, edge1, x) {
  const t = invLerp(edge0, edge1, x);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function degToRad(deg) {
  return (deg * Math.PI) / 180;
}

export function radToDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function fract(x) {
  return x - Math.floor(x);
}

export function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Deterministic 1D hash returning a float in [0, 1).
 */
export function hash1D(n, seed = 1337) {
  let x = Math.imul(Math.floor(n) ^ Math.floor(seed), 0x27d4eb2d);
  x = Math.imul(x ^ (x >>> 15), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

/**
 * Deterministic 2D hash returning a float in [0, 1).
 */
export function hash2D(x, y, seed = 1337) {
  const h = Math.imul(Math.floor(x), 374761393) + Math.imul(Math.floor(y), 668265263) + Math.imul(Math.floor(seed), 1442695041);
  let z = (h ^ (h >>> 13)) * 1274126177;
  z = z ^ (z >>> 16);
  return (z >>> 0) / 4294967296;
}

/**
 * Mulberry32 seeded PRNG returning a deterministic generator function () => [0, 1).
 */
export function seededRandom(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Smooth deterministic 1D value noise in [0, 1].
 */
export function valueNoise1D(x, seed = 101) {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash1D(i, seed), hash1D(i + 1, seed), u);
}

/**
 * Smooth deterministic 2D value noise in [0, 1].
 */
export function valueNoise2D(x, y, seed = 202) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2D(ix, iy, seed);
  const b = hash2D(ix + 1, iy, seed);
  const c = hash2D(ix, iy + 1, seed);
  const d = hash2D(ix + 1, iy + 1, seed);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
}

/**
 * Deterministic 1D fractal Brownian motion in [-1, 1].
 */
export function fbm1D(x, octaves = 3, seed = 303) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i += 1) {
    value += (valueNoise1D(x * frequency, seed + i * 71) * 2 - 1) * amplitude;
    norm += amplitude;
    amplitude *= 0.5;
    frequency *= 2.03;
  }
  return norm > 0 ? value / norm : 0;
}

export function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r, g, b) {
  const toHex = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgba(hex, alpha = 1) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(4)})`;
}

export function lerpColor(hexA, hexB, t) {
  const f = clamp(t, 0, 1);
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex(
    lerp(a.r, b.r, f),
    lerp(a.g, b.g, f),
    lerp(a.b, b.b, f),
  );
}

export function quadraticBezier(p0, p1, p2, t) {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
}

export function cubicBezier(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

export function dist(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}
