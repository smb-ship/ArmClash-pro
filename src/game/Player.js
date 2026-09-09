import { clamp } from '../utils/helpers.js';
import { MAX_POWER, POWER_DECAY_RATE, TAP_POWER_GAIN } from '../utils/constants.js';

/**
 * Represents a competitor in the arm-wrestling match (used for the
 * human player; OpponentAI extends similar ideas separately).
 */
export class Player {
  constructor(name = 'Player') {
    this.name = name;
    this.power = 0;          // current power output (0-100), decays over time
    this.strength = 1;       // multiplier, increased via progression upgrades
    this.wins = 0;
    this.losses = 0;
  }

  /**
   * Call this every time the player taps/clicks/presses space.
   */
  registerTap() {
    this.power = clamp(this.power + TAP_POWER_GAIN * this.strength, 0, MAX_POWER);
  }

  /**
   * Call this every animation frame to naturally decay power
   * when the player isn't actively tapping.
   */
  update(deltaMultiplier = 1) {
    this.power = clamp(this.power - POWER_DECAY_RATE * deltaMultiplier, 0, MAX_POWER);
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