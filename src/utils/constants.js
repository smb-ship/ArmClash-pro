// ===== GAME STATES =====
export const GAME_STATES = {
  MENU: 'MENU',
  COUNTDOWN: 'COUNTDOWN',
  PLAYING: 'PLAYING',
  PLAYER_WON: 'PLAYER_WON',
  OPPONENT_WON: 'OPPONENT_WON',
  PAUSED: 'PAUSED'
};

// ===== ARM POSITION =====
// 0 = fully player's win side, 100 = fully opponent's win side, 50 = center
export const ARM_CENTER = 50;
export const ARM_PLAYER_WIN_THRESHOLD = 5;
export const ARM_OPPONENT_WIN_THRESHOLD = 95;

// How quickly the arm visually catches up to the calculated position (0-1, higher = snappier)
export const ARM_LERP_SPEED = 0.12;

// ===== PLAYER TAP SETTINGS =====
// TAP_POWER_GAIN is added instantly per tap.
// POWER_DECAY_RATE is subtracted every animation frame (~60/sec), so keep it small —
// a value of 1.0 here would mean losing ~60 power per second even while tapping.
export const TAP_POWER_GAIN = 3.2;
export const POWER_DECAY_RATE = 0.12;
export const MAX_POWER = 100;

// ===== DIFFICULTY SETTINGS =====
// baseStrength is applied every animation frame (~60/sec), so these are intentionally
// small — e.g. 0.2 base becomes roughly 12/sec, comparable to a human tapping ~4x/sec.
export const DIFFICULTIES = {
  EASY: {
    label: 'Easy',
    baseStrength: 0.12,
    burstChance: 0.01,
    burstStrength: 1.2,
    variation: 0.2
  },
  MEDIUM: {
    label: 'Medium',
    baseStrength: 0.2,
    burstChance: 0.018,
    burstStrength: 1.5,
    variation: 0.25
  },
  HARD: {
    label: 'Hard',
    baseStrength: 0.28,
    burstChance: 0.03,
    burstStrength: 1.9,
    variation: 0.3
  }
};

// ===== COUNTDOWN =====
export const COUNTDOWN_SECONDS = 3;

// ===== PROGRESSION =====
export const STORAGE_KEY = 'armclash_save';
export const COINS_PER_WIN = 10;
export const STRENGTH_UPGRADE_COST = 50;
export const STRENGTH_UPGRADE_AMOUNT = 0.1;

// ===== COLORS (kept in sync with CSS variables) =====
export const COLORS = {
  PLAYER: '#2fb2ff',
  OPPONENT: '#ff8c2f',
  BG: '#0a0e17'
};