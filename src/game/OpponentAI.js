import { clamp, chance, randomRange } from '../utils/helpers.js';
import { DIFFICULTIES, MAX_POWER } from '../utils/constants.js';

/**
 * AI-controlled opponent. Continuously generates power based on
 * difficulty settings, with occasional bursts and slight randomness
 * so it feels alive rather than a flat ramp.
 */
export class OpponentAI {
  constructor(difficulty = 'MEDIUM') {
    this.setDifficulty(difficulty);
    this.power = 0;
    this.wins = 0;
    this.losses = 0;
  }

  setDifficulty(difficulty) {
    this.difficultyKey = difficulty;
    this.settings = DIFFICULTIES[difficulty] || DIFFICULTIES.MEDIUM;
  }

  /**
   * Call every animation frame. deltaMultiplier scales with frame time
   * so behavior stays consistent across different frame rates.
   */
  update(deltaMultiplier = 1) {
    const { baseStrength, burstChance, burstStrength, variation } = this.settings;

    // Base steady output, with slight random variation each frame
    let gain = baseStrength * randomRange(1 - variation, 1 + variation);

    // Occasional burst of extra strength to feel competitive, not robotic
    if (chance(burstChance)) {
      gain += burstStrength;
    }

    this.power = clamp(this.power + gain * deltaMultiplier, 0, MAX_POWER);

    // Natural slight decay so the AI doesn't just climb forever if player is idle
    this.power = clamp(this.power - baseStrength * 0.3 * deltaMultiplier, 0, MAX_POWER);
  }

  recordWin() {
    this.wins += 1;
  }

  recordLoss() {
    this.losses += 1;
  }

  reset() {
    this.power = 0;
  }
}