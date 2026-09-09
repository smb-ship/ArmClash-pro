/**
 * Lightweight audio manager.
 * Safe to call even if sound files don't exist yet — failures are caught
 * silently so the game never breaks due to missing audio assets.
 *
 * To add real sounds later, drop files into public/assets/sounds/ using
 * the filenames listed below, and they'll work automatically.
 */

const SOUND_FILES = {
  click: '/assets/sounds/click.mp3',
  countdown: '/assets/sounds/countdown.mp3',
  tap: '/assets/sounds/tap.mp3',
  impact: '/assets/sounds/impact.mp3',
  victory: '/assets/sounds/victory.mp3',
  defeat: '/assets/sounds/defeat.mp3'
};

const cache = {};
let muted = false;

function getAudio(name) {
  if (!cache[name]) {
    const audio = new Audio(SOUND_FILES[name]);
    audio.volume = name === 'tap' ? 0.25 : 0.6;
    cache[name] = audio;
  }
  return cache[name];
}

/**
 * Play a sound by name. Never throws — missing files just fail silently.
 */
export function playSound(name) {
  if (muted || !SOUND_FILES[name]) return;
  try {
    const audio = getAudio(name);
    // Clone for rapid-fire sounds like "tap" so overlapping plays don't cut off
    const instance = name === 'tap' ? audio.cloneNode() : audio;
    instance.currentTime = 0;
    instance.play().catch(() => {
      // Autoplay restrictions or missing file — ignore quietly
    });
  } catch (err) {
    // Missing asset or unsupported format — ignore quietly
  }
}

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}