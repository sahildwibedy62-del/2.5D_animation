/**
 * THE CITY THAT FORGOT TOMORROW
 * Global film configuration, scene definitions, colour palette, and depth layers.
 * Single source of truth shared across engine, environments, characters, effects, and scenes.
 */

export const FILM_CONFIG = Object.freeze({
  title: 'THE CITY THAT FORGOT TOMORROW',
  subtitle: 'A 60-Second 2.5D Animated Short',
  width: 1080,
  height: 1920,
  aspectRatio: 9 / 16,
  fps: 30,
  durationSeconds: 60,
  totalFrames: 1800,
  firstFrame: 1,
  lastFrame: 1800,
});

export const PALETTE = Object.freeze({
  // Cold / Midnight Act I & II tones
  obsidian: '#070914',
  midnightIndigo: '#0d1430',
  deepIndigo: '#16204a',
  deepViolet: '#231b47',
  royalViolet: '#352666',
  electricCyan: '#4be3f5',
  iceCyan: '#8ff2ff',
  mutedTeal: '#245d6e',
  slateBlue: '#2c3d63',
  coatBlue: '#1f2d4f',
  coatShadow: '#121a31',
  inkOutline: '#101326',

  // Warm / Chronos / Dawn Act III tones
  warmAmber: '#f5b041',
  brightGold: '#ffd97d',
  antiqueBrass: '#c68d3a',
  burntOrange: '#e06b36',
  coralDawn: '#f28b66',
  goldenSunrise: '#ffe29c',
  sunriseCore: '#fff6d6',
  softLavender: '#c49ce8',
  dawnRose: '#e89bb8',
  blossomPink: '#f7c5d8',

  // Architectural & character materials
  ivoryClock: '#f7efd8',
  stoneDark: '#171d33',
  stoneMid: '#242d4c',
  stoneLight: '#38456e',
  skinLight: '#f6d2bd',
  skinShadow: '#d9a48d',
  hairDark: '#16172c',
  hairHighlight: '#363b69',
  scarfBase: '#e3942d',
  scarfLight: '#f7c059',
  scarfShadow: '#9e5819',
  paperIvory: '#ebe5d5',
  sepiaLight: '#f0dec2',
  sepiaDark: '#7a5c42',
});

export const DEPTH_PRESETS = Object.freeze({
  SKY: { name: 'sky', depth: 0.12, parallaxX: 0.12, parallaxY: 0.08 },
  DISTANT_SKYLINE: { name: 'distant_skyline', depth: 0.38, parallaxX: 0.35, parallaxY: 0.25 },
  MIDGROUND: { name: 'midground', depth: 0.68, parallaxX: 0.65, parallaxY: 0.5 },
  ACTION: { name: 'action', depth: 1.0, parallaxX: 1.0, parallaxY: 0.85 },
  NEAR_ARCH: { name: 'near_architecture', depth: 1.25, parallaxX: 1.32, parallaxY: 1.05 },
  FOREGROUND: { name: 'foreground_silhouettes', depth: 1.55, parallaxX: 1.75, parallaxY: 1.35 },
  ATMOSPHERE: { name: 'atmosphere_overlay', depth: 1.08, parallaxX: 0.5, parallaxY: 0.4, screenSpace: true },
});

export const SCENES = Object.freeze([
  Object.freeze({
    id: 'scene_01',
    index: 0,
    number: '01',
    title: 'THE ENDLESS NIGHT',
    summary: 'Midnight grips the colossal city at 11:59 PM. Nova spots a falling newspaper reset in mid-air.',
    startFrame: 1,
    endFrame: 300,
    durationFrames: 300,
    accent: '#4be3f5',
  }),
  Object.freeze({
    id: 'scene_02',
    index: 1,
    number: '02',
    title: 'THE POCKET WATCH',
    summary: 'Inside the abandoned vaulted station, Nova touches a glowing pocket watch and time freezes around her.',
    startFrame: 301,
    endFrame: 600,
    durationFrames: 300,
    accent: '#f5b041',
  }),
  Object.freeze({
    id: 'scene_03',
    index: 2,
    number: '03',
    title: 'THE CITY REPEATS',
    summary: 'Nova runs past repeating cars, doves, pedestrians, and trains before revealing the infinite sky-timeline.',
    startFrame: 601,
    endFrame: 900,
    durationFrames: 300,
    accent: '#78b8f5',
  }),
  Object.freeze({
    id: 'scene_04',
    index: 3,
    number: '04',
    title: 'THE PRICE OF TOMORROW',
    summary: 'The watch projects Nova’s cherished sunset memory with her mother—and reveals the sacrifice required.',
    startFrame: 901,
    endFrame: 1200,
    durationFrames: 300,
    accent: '#e89bb8',
  }),
  Object.freeze({
    id: 'scene_05',
    index: 4,
    number: '05',
    title: 'THE FINAL TURN',
    summary: 'Nova closes her eyes and turns the watch. A golden wave sweeps the city as the clock strikes 12:00.',
    startFrame: 1201,
    endFrame: 1500,
    durationFrames: 300,
    accent: '#e06b36',
  }),
  Object.freeze({
    id: 'scene_06',
    index: 5,
    number: '06',
    title: 'THE FIRST SUNRISE',
    summary: 'The face in her old photograph fades from memory, yet Nova smiles as the first golden sunrise breaks.',
    startFrame: 1501,
    endFrame: 1800,
    durationFrames: 300,
    accent: '#ffe29c',
  }),
]);

/**
 * Clamp any frame input to valid 1-based integer range [1, 1800].
 * @param {number} frame
 * @returns {number}
 */
export function clampFrame(frame) {
  const n = Math.round(Number(frame));
  if (!Number.isFinite(n)) return FILM_CONFIG.firstFrame;
  return Math.max(FILM_CONFIG.firstFrame, Math.min(FILM_CONFIG.lastFrame, n));
}

/**
 * Retrieve scene metadata for a given 1-based frame number.
 * @param {number} frame
 */
export function getSceneConfigForFrame(frame) {
  const f = clampFrame(frame);
  for (let i = 0; i < SCENES.length; i += 1) {
    const s = SCENES[i];
    if (f >= s.startFrame && f <= s.endFrame) {
      return s;
    }
  }
  return SCENES[SCENES.length - 1];
}
