/**
 * MODULAR SFX TIMELINE & PROCEDURAL WEB AUDIO PREVIEW ENGINE
 *
 * Strictly SOUND EFFECTS ONLY:
 *  - No narration, no dialogue, no voice-over, no background music.
 *
 * Every cue carries exact 1-based frame positions (1..1800 @ 30 FPS) for external
 * DAW / FFmpeg audio-mix integration, plus optional opt-in procedural Web Audio
 * synthesis during interactive browser playback.
 */

import { FILM_CONFIG } from '../config.js';

export const SFX_TIMELINE = Object.freeze([
  // --- SCENE 01: THE ENDLESS NIGHT (Frames 1–300) ---
  {
    id: 'sfx_city_ambience_night',
    name: 'Distant City Ambience',
    scene: 'scene_01',
    category: 'ambience',
    startFrame: 1,
    endFrame: 300,
    gain: 0.32,
    pan: 0,
    synthType: 'windHum',
    description: 'Hollow midnight wind drifting across towering stone spires and rain-slick streets.',
  },
  {
    id: 'sfx_clock_tick_stalled_01',
    name: 'Clock Ticking (Stalled 11:59)',
    scene: 'scene_01',
    category: 'clockwork',
    startFrame: 18,
    endFrame: 295,
    repeatEveryFrames: 30,
    gain: 0.42,
    pan: 0.25,
    synthType: 'clockTick',
    description: 'Heavy metallic escapement tick that shudders without advancing past 11:59.',
  },
  {
    id: 'sfx_nova_footsteps_street',
    name: 'Footsteps (Wet Cobblestone)',
    scene: 'scene_01',
    category: 'foley',
    startFrame: 112,
    endFrame: 214,
    repeatEveryFrames: 18,
    gain: 0.36,
    pan: -0.2,
    synthType: 'footstep',
    description: 'Small boots stepping softly across shallow puddles on the quiet avenue.',
  },
  {
    id: 'sfx_newspaper_flutter_reset',
    name: 'Newspaper Flutter & Time Reset',
    scene: 'scene_01',
    category: 'foley',
    startFrame: 236,
    endFrame: 290,
    gain: 0.55,
    pan: 0.2,
    synthType: 'paperSnap',
    description: 'Crisp paper tumble followed by a reverse-zip temporal snap as the sheet resets upward.',
  },

  // --- SCENE 02: THE POCKET WATCH (Frames 301–600) ---
  {
    id: 'sfx_station_ambience',
    name: 'Train Station Ambience',
    scene: 'scene_02',
    category: 'ambience',
    startFrame: 301,
    endFrame: 500,
    gain: 0.34,
    pan: 0,
    synthType: 'cavernHum',
    description: 'Cavernous vaulted iron-and-glass reverberation and distant dripping eaves.',
  },
  {
    id: 'sfx_nova_footsteps_station',
    name: 'Footsteps (Station Tile Echo)',
    scene: 'scene_02',
    category: 'foley',
    startFrame: 312,
    endFrame: 400,
    repeatEveryFrames: 20,
    gain: 0.38,
    pan: -0.15,
    synthType: 'footstep',
    description: 'Echoing child footsteps approaching the weathered wooden bench.',
  },
  {
    id: 'sfx_watch_metallic_click',
    name: 'Pocket Watch Metallic Click',
    scene: 'scene_02',
    category: 'clockwork',
    startFrame: 418,
    endFrame: 432,
    gain: 0.68,
    pan: 0.15,
    synthType: 'metallicClick',
    description: 'Crisp antique brass clasp click as the filigree pocket watch lid springs open.',
  },
  {
    id: 'sfx_magical_activation',
    name: 'Magical Activation Chime',
    scene: 'scene_02',
    category: 'chronos',
    startFrame: 428,
    endFrame: 492,
    gain: 0.54,
    pan: 0.15,
    synthType: 'amberResonance',
    description: 'Warm crystalline brass harmonic bloom as the watch begins glowing amber.',
  },
  {
    id: 'sfx_time_freeze_effect',
    name: 'Time-Freeze Vacuum Drop',
    scene: 'scene_02',
    category: 'chronos',
    startFrame: 498,
    endFrame: 590,
    gain: 0.8,
    pan: 0,
    synthType: 'timeFreeze',
    description: 'Sudden sub-bass pressure drop and icy glass shimmer as the station freezes silent.',
  },

  // --- SCENE 03: THE CITY REPEATS (Frames 601–900) ---
  {
    id: 'sfx_repeating_city_loop',
    name: 'Repeating City Sound Loop',
    scene: 'scene_03',
    category: 'ambience',
    startFrame: 601,
    endFrame: 762,
    repeatEveryFrames: 54,
    gain: 0.48,
    pan: 0,
    synthType: 'loopReset',
    description: 'Rhythmic 54-frame repeating audio cycle of car tires, distant rail clatter, and dove wings resetting.',
  },
  {
    id: 'sfx_nova_running_steps',
    name: 'Footsteps (Running)',
    scene: 'scene_03',
    category: 'foley',
    startFrame: 604,
    endFrame: 754,
    repeatEveryFrames: 10,
    gain: 0.44,
    pan: -0.1,
    synthType: 'footstep',
    description: 'Urgent rapid footsteps splashing through the midnight intersection.',
  },
  {
    id: 'sfx_birds_loop_wings',
    name: 'Birds (Repeating Wing Flaps)',
    scene: 'scene_03',
    category: 'nature',
    startFrame: 618,
    endFrame: 750,
    repeatEveryFrames: 54,
    gain: 0.35,
    pan: -0.35,
    synthType: 'wingFlutter',
    description: 'Sharp white dove wing beats repeating identically past the Gothic spire.',
  },
  {
    id: 'sfx_sky_timeline_unfold',
    name: 'Timeline Projection Resonance',
    scene: 'scene_03',
    category: 'chronos',
    startFrame: 778,
    endFrame: 890,
    gain: 0.62,
    pan: 0,
    synthType: 'amberResonance',
    description: 'Vast metallic harmonic hum as the glowing looping timeline illuminates the sky.',
  },

  // --- SCENE 04: THE PRICE OF TOMORROW (Frames 901–1200) ---
  {
    id: 'sfx_memory_transition',
    name: 'Memory Projection Transition',
    scene: 'scene_04',
    category: 'chronos',
    startFrame: 912,
    endFrame: 995,
    gain: 0.56,
    pan: -0.15,
    synthType: 'memorySwell',
    description: 'Soft warm airy shimmer as the sunset memory of Nova and her mother opens.',
  },
  {
    id: 'sfx_heartbeat_low_impact',
    name: 'Heartbeat-Like Low Impact',
    scene: 'scene_04',
    category: 'impact',
    startFrame: 1052,
    endFrame: 1196,
    repeatEveryFrames: 36,
    gain: 0.72,
    pan: 0,
    synthType: 'heartbeat',
    description: 'Deep muted low-frequency double pulse as Nova realizes the memory sacrifice required.',
  },

  // --- SCENE 05: THE FINAL TURN (Frames 1201–1500) ---
  {
    id: 'sfx_clockwork_mechanism',
    name: 'Clockwork Mechanism Winding',
    scene: 'scene_05',
    category: 'clockwork',
    startFrame: 1236,
    endFrame: 1284,
    repeatEveryFrames: 8,
    gain: 0.65,
    pan: 0.1,
    synthType: 'metallicClick',
    description: 'Decisive ratchet clicks as Nova closes her eyes and turns the brass crown.',
  },
  {
    id: 'sfx_time_acceleration',
    name: 'Time Acceleration Chronos Wave',
    scene: 'scene_05',
    category: 'chronos',
    startFrame: 1272,
    endFrame: 1435,
    gain: 0.85,
    pan: 0,
    synthType: 'chronosSweep',
    description: 'Sweeping golden energy surge and accelerating tower clockwork gears waking the city.',
  },
  {
    id: 'sfx_rain_falling_release',
    name: 'Rain Falling (Release Splash)',
    scene: 'scene_05',
    category: 'nature',
    startFrame: 1295,
    endFrame: 1448,
    gain: 0.45,
    pan: 0,
    synthType: 'rainRush',
    description: 'Hundreds of suspended droplets suddenly plummeting and pattering across wet rooftops.',
  },
  {
    id: 'sfx_birds_dawn_flock',
    name: 'Birds (Awakening Flock)',
    scene: 'scene_05',
    category: 'nature',
    startFrame: 1315,
    endFrame: 1485,
    gain: 0.44,
    pan: 0.25,
    synthType: 'wingFlutter',
    description: 'Flock of doves bursting upward into the turning dawn sky.',
  },
  {
    id: 'sfx_clock_strikes_midnight',
    name: 'Clock Striking Midnight (12:00)',
    scene: 'scene_05',
    category: 'clockwork',
    startFrame: 1432,
    endFrame: 1500,
    gain: 0.92,
    pan: 0.12,
    synthType: 'midnightBell',
    description: 'Monumental resonant bronze cathedral bell toll as the giant tower reaches 12:00.',
  },

  // --- SCENE 06: THE FIRST SUNRISE (Frames 1501–1800) ---
  {
    id: 'sfx_sunrise_ambience',
    name: 'Sunrise Ambience',
    scene: 'scene_06',
    category: 'ambience',
    startFrame: 1501,
    endFrame: 1800,
    gain: 0.4,
    pan: 0,
    synthType: 'sunriseBreeze',
    description: 'Warm morning breeze rustling blossom branches over a gently awakening city.',
  },
  {
    id: 'sfx_morning_birds_chirp',
    name: 'Morning Birds (Distant Sunrise)',
    scene: 'scene_06',
    category: 'nature',
    startFrame: 1545,
    endFrame: 1765,
    repeatEveryFrames: 72,
    gain: 0.34,
    pan: 0.22,
    synthType: 'birdChirp',
    description: 'Delicate distant morning birds greeting the first tomorrow in years.',
  },
]);

/**
 * Return all SFX cues active on a given 1-based frame.
 */
export function getActiveSfxForFrame(frame) {
  return SFX_TIMELINE.filter((cue) => frame >= cue.startFrame && frame <= cue.endFrame);
}

/**
 * Return cues whose exact trigger impulse fires on this specific 1-based frame.
 */
export function getTriggeredSfxAtFrame(frame) {
  const triggered = [];
  for (let i = 0; i < SFX_TIMELINE.length; i += 1) {
    const cue = SFX_TIMELINE[i];
    if (frame < cue.startFrame || frame > cue.endFrame) continue;
    if (frame === cue.startFrame) {
      triggered.push(cue);
    } else if (cue.repeatEveryFrames && (frame - cue.startFrame) % cue.repeatEveryFrames === 0) {
      triggered.push(cue);
    }
  }
  return triggered;
}

/**
 * Export structured frame + timestamp cue sheet for downstream DAW / FFmpeg mixing.
 */
export function exportSfxCueSheet() {
  return SFX_TIMELINE.map((cue) => ({
    ...cue,
    startSeconds: Number(((cue.startFrame - 1) / FILM_CONFIG.fps).toFixed(3)),
    endSeconds: Number(((cue.endFrame - 1) / FILM_CONFIG.fps).toFixed(3)),
  }));
}

/**
 * Lightweight optional Web Audio API procedural SFX synthesizer for live interactive preview.
 * Strictly triggered by user playback interaction; never affects deterministic rendering.
 */
export class SfxPreviewEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (this.enabled && !this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.enabled && this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  triggerForFrame(frame) {
    if (!this.enabled || !this.ctx) return;
    const cues = getTriggeredSfxAtFrame(frame);
    for (let i = 0; i < cues.length; i += 1) {
      this.playCue(cues[i]);
    }
  }

  playCue(cue) {
    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;
    const vol = Math.min(0.4, (cue.gain ?? 0.4) * 0.42);
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    switch (cue.synthType) {
      case 'clockTick':
      case 'metallicClick': {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(cue.synthType === 'metallicClick' ? 2450 : 1280, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);
        gainNode.gain.setValueAtTime(vol, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }
      case 'footstep': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(165, now);
        osc.frequency.exponentialRampToValueAtTime(58, now + 0.07);
        gainNode.gain.setValueAtTime(vol * 0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }
      case 'heartbeat': {
        [0, 0.24].forEach((offset, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 72 : 58, now + offset);
          osc.frequency.exponentialRampToValueAtTime(32, now + offset + 0.22);
          g.gain.setValueAtTime(vol * (idx === 0 ? 1 : 0.7), now + offset);
          g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.25);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.26);
        });
        break;
      }
      case 'timeFreeze': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.9);
        gainNode.gain.setValueAtTime(vol, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.05);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 1.1);
        break;
      }
      case 'amberResonance':
      case 'memorySwell': {
        [440, 659.25, 880].forEach((freq) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(vol * 0.28, now + 0.28);
          g.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.55);
        });
        break;
      }
      case 'midnightBell': {
        [146.83, 293.66, 440, 587.33].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, now);
          g.gain.setValueAtTime(vol * (0.45 / (idx + 1)), now);
          g.gain.exponentialRampToValueAtTime(0.0008, now + 2.6);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 2.7);
        });
        break;
      }
      case 'birdChirp': {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2100, now);
        osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.16);
        gainNode.gain.setValueAtTime(vol * 0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      default: {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.45);
        gainNode.gain.setValueAtTime(vol * 0.35, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gainNode);
        osc.start(now);
        osc.stop(now + 0.52);
      }
    }
  }
}
