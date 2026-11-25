/**
 * THE CITY THAT FORGOT TOMORROW — Entry Point, Deterministic Capture Bridge & Cinema Player
 *
 * Exposes `window.__CITY_ANIMATION__` for automated headless frame capture (1..1800)
 * and drives the interactive 9:16 screening room player UI.
 */

import { FILM_CONFIG, SCENES, clampFrame, getSceneConfigForFrame } from './config.js';
import { Renderer } from './engine/renderer.js';
import { SFX_TIMELINE, SfxPreviewEngine, exportSfxCueSheet, getActiveSfxForFrame } from './audio/sfx_timeline.js';

const canvas = document.getElementById('stage-canvas');
const renderer = new Renderer(canvas);
const sfxEngine = new SfxPreviewEngine();

let currentFrame = FILM_CONFIG.firstFrame;
let isPlaying = false;
let rafId = null;
let lastTickMs = 0;
let accumulatorMs = 0;
const FRAME_INTERVAL_MS = 1000 / FILM_CONFIG.fps;

const ui = {
  playBtn: document.getElementById('btn-play'),
  prevBtn: document.getElementById('btn-prev'),
  nextBtn: document.getElementById('btn-next'),
  audioBtn: document.getElementById('btn-audio'),
  cinemaBtn: document.getElementById('btn-cinema'),
  captureBtn: document.getElementById('btn-capture'),
  scrubber: document.getElementById('timeline-scrubber'),
  frameDisplay: document.getElementById('frame-display'),
  timecodeDisplay: document.getElementById('timecode-display'),
  sceneNumber: document.getElementById('scene-number'),
  sceneTitle: document.getElementById('scene-title'),
  sceneSummary: document.getElementById('scene-summary'),
  sfxTicker: document.getElementById('sfx-ticker'),
  sceneRail: document.getElementById('scene-rail'),
  shell: document.getElementById('cinema-shell'),
};

function renderAndSyncUI(frameInput, triggerAudio = false) {
  const frame = clampFrame(frameInput);
  currentFrame = frame;
  const info = renderer.renderFrame(frame);

  if (triggerAudio) {
    sfxEngine.triggerForFrame(frame);
  }

  if (ui.scrubber) ui.scrubber.value = String(frame);
  if (ui.frameDisplay) {
    ui.frameDisplay.textContent = `${String(frame).padStart(4, '0')} / ${FILM_CONFIG.totalFrames}`;
  }
  if (ui.timecodeDisplay) {
    ui.timecodeDisplay.textContent = `${info.timecode} · 30 FPS`;
  }
  if (ui.sceneNumber) {
    ui.sceneNumber.textContent = `SCENE ${info.sceneNumber}`;
  }
  if (ui.sceneTitle) {
    ui.sceneTitle.textContent = info.sceneTitle;
  }
  if (ui.sceneSummary) {
    const cfg = getSceneConfigForFrame(frame);
    ui.sceneSummary.textContent = cfg.summary;
  }
  if (ui.sfxTicker) {
    const activeNames = info.sfxCues.map((c) => c.name);
    ui.sfxTicker.textContent = activeNames.length > 0
      ? activeNames.slice(0, 2).join(' · ')
      : 'Ambient Silence';
  }

  if (ui.sceneRail) {
    const buttons = ui.sceneRail.querySelectorAll('.scene-pill');
    buttons.forEach((btn, idx) => {
      btn.classList.toggle('is-active', idx === info.sceneIndex);
      btn.setAttribute('aria-current', idx === info.sceneIndex ? 'true' : 'false');
    });
  }

  return info;
}

function updatePlayButton() {
  if (!ui.playBtn) return;
  ui.playBtn.dataset.playing = String(isPlaying);
  ui.playBtn.setAttribute('aria-label', isPlaying ? 'Pause film' : 'Play film');
  ui.playBtn.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg><span>Pause</span>'
    : '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6.5 4.2a1 1 0 0 1 1.52-.85l11.4 7.8a1 1 0 0 1 0 1.65l-11.4 7.8A1 1 0 0 1 6.5 19.8V4.2z"/></svg><span>Play</span>';
}

function playbackLoop(nowMs) {
  if (!isPlaying) return;
  if (!lastTickMs) lastTickMs = nowMs;
  const dt = Math.min(100, nowMs - lastTickMs);
  lastTickMs = nowMs;
  accumulatorMs += dt;

  while (accumulatorMs >= FRAME_INTERVAL_MS) {
    accumulatorMs -= FRAME_INTERVAL_MS;
    if (currentFrame >= FILM_CONFIG.lastFrame) {
      pause();
      return;
    }
    renderAndSyncUI(currentFrame + 1, true);
  }

  rafId = window.requestAnimationFrame(playbackLoop);
}

function play() {
  if (isPlaying) return;
  if (currentFrame >= FILM_CONFIG.lastFrame) {
    currentFrame = FILM_CONFIG.firstFrame;
  }
  isPlaying = true;
  lastTickMs = 0;
  accumulatorMs = 0;
  updatePlayButton();
  rafId = window.requestAnimationFrame(playbackLoop);
}

function pause() {
  isPlaying = false;
  if (rafId !== null) {
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }
  updatePlayButton();
}

function togglePlay() {
  if (isPlaying) pause();
  else play();
}

function seek(frame) {
  pause();
  return renderAndSyncUI(frame, false);
}

function step(delta) {
  pause();
  return renderAndSyncUI(currentFrame + delta, false);
}

function buildSceneRail() {
  if (!ui.sceneRail) return;
  ui.sceneRail.innerHTML = '';
  for (let i = 0; i < SCENES.length; i += 1) {
    const sc = SCENES[i];
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scene-pill';
    btn.style.setProperty('--scene-accent', sc.accent);
    btn.innerHTML = `<span class="pill-num">${sc.number}</span><span class="pill-label">${sc.title}</span><span class="pill-frames">${sc.startFrame}–${sc.endFrame}</span>`;
    btn.addEventListener('click', () => seek(sc.startFrame));
    ui.sceneRail.appendChild(btn);
  }
}

if (ui.playBtn) ui.playBtn.addEventListener('click', togglePlay);
if (ui.prevBtn) ui.prevBtn.addEventListener('click', () => step(-1));
if (ui.nextBtn) ui.nextBtn.addEventListener('click', () => step(1));

if (ui.scrubber) {
  ui.scrubber.min = String(FILM_CONFIG.firstFrame);
  ui.scrubber.max = String(FILM_CONFIG.lastFrame);
  ui.scrubber.value = String(FILM_CONFIG.firstFrame);
  ui.scrubber.addEventListener('input', (e) => {
    seek(Number(e.target.value));
  });
}

if (ui.audioBtn) {
  ui.audioBtn.addEventListener('click', () => {
    const next = !sfxEngine.enabled;
    sfxEngine.setEnabled(next);
    ui.audioBtn.classList.toggle('is-active', next);
    ui.audioBtn.setAttribute('aria-pressed', String(next));
    ui.audioBtn.querySelector('span').textContent = next ? 'SFX On' : 'SFX Preview';
  });
}

if (ui.cinemaBtn && ui.shell) {
  ui.cinemaBtn.addEventListener('click', () => {
    const active = ui.shell.classList.toggle('cinema-mode');
    ui.cinemaBtn.classList.toggle('is-active', active);
    ui.cinemaBtn.setAttribute('aria-pressed', String(active));
  });
}

if (ui.captureBtn) {
  ui.captureBtn.addEventListener('click', () => {
    const dataUrl = renderer.exportFrameDataURL(currentFrame, 'image/png', 1);
    const link = document.createElement('a');
    link.download = `city_that_forgot_tomorrow_f${String(currentFrame).padStart(4, '0')}.png`;
    link.href = dataUrl;
    link.click();
  });
}

window.addEventListener('keydown', (e) => {
  if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
  if (e.code === 'Space') {
    e.preventDefault();
    togglePlay();
  } else if (e.code === 'ArrowLeft') {
    e.preventDefault();
    step(e.shiftKey ? -10 : -1);
  } else if (e.code === 'ArrowRight') {
    e.preventDefault();
    step(e.shiftKey ? 10 : 1);
  } else if (e.key >= '1' && e.key <= '6') {
    const idx = Number(e.key) - 1;
    if (SCENES[idx]) seek(SCENES[idx].startFrame);
  } else if (e.key === 'h' || e.key === 'H') {
    if (ui.shell) ui.shell.classList.toggle('cinema-mode');
  }
});

/**
 * Deterministic Capture Interface for Headless Automation & MP4 Export Pipelines.
 */
window.__CITY_ANIMATION__ = Object.freeze({
  renderFrame(frame) {
    pause();
    return renderAndSyncUI(frame, false);
  },
  getMetadata() {
    return {
      ...FILM_CONFIG,
      scenes: SCENES,
      sfxCueCount: SFX_TIMELINE.length,
      sfxCueSheet: exportSfxCueSheet(),
    };
  },
  getSceneForFrame(frame) {
    return getSceneConfigForFrame(frame);
  },
  getSfxEventsForFrame(frame) {
    return getActiveSfxForFrame(clampFrame(frame));
  },
  exportFrameDataURL(frame, mimeType = 'image/png', quality = 0.96) {
    pause();
    return renderer.exportFrameDataURL(frame, mimeType, quality);
  },
  exportFrameBlob(frame, mimeType = 'image/png', quality = 0.96) {
    pause();
    return renderer.exportFrameBlob(frame, mimeType, quality);
  },
  getCanvas() {
    return canvas;
  },
  seek,
  play,
  pause,
  step,
});

buildSceneRail();
updatePlayButton();
renderAndSyncUI(FILM_CONFIG.firstFrame, false);
