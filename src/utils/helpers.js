/**
 * Clamp a number between a min and max value.
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values.
 * t should be between 0 and 1.
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Return a random float between min and max.
 */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Return true with the given probability (0-1).
 */
export function chance(probability) {
  return Math.random() < probability;
}

/**
 * Format a number for display (rounds to nearest integer).
 */
export function formatNumber(value) {
  return Math.round(value).toString();
}

/**
 * Load saved progression data from localStorage.
 * Returns a default object if nothing is saved or data is corrupted.
 */
export function loadSave(storageKey, defaults) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (err) {
    console.warn('ArmClash: failed to load save, using defaults.', err);
    return { ...defaults };
  }
}

/**
 * Save progression data to localStorage.
 */
export function writeSave(storageKey, data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (err) {
    console.warn('ArmClash: failed to write save.', err);
  }
}