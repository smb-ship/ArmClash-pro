import { clamp, lerp } from '../utils/helpers.js';
import {
  ARM_CENTER,
  ARM_LERP_SPEED,
  ARM_PLAYER_WIN_THRESHOLD,
  ARM_OPPONENT_WIN_THRESHOLD
} from '../utils/constants.js';

/**
 * Tracks the arm position between the two competitors.
 * 0   = fully player's win side
 * 50  = center
 * 100 = fully opponent's win side
 *
 * The visual position smoothly interpolates toward a "target" position
 * calculated from the power difference, so the arm never teleports.
 */
export class ArmWrestling {
  constructor() {
    this.position = ARM_CENTER;   // what's rendered on screen
    this.target = ARM_CENTER;     // where it's heading based on power
  }

  /**
   * Recalculate the target position and smoothly move toward it.
   * playerPower and opponentPower should each be 0-100.
   */
  update(playerPower, opponentPower) {
    const diff = playerPower - opponentPower; // positive = player winning
    // Map the power difference onto the 0-100 arm scale.
    // A diff of +/-100 would push the arm fully to one side.
    this.target = clamp(ARM_CENTER - diff * 0.9, 0, 100);
    this.position = lerp(this.position, this.target, ARM_LERP_SPEED);
  }

  /**
   * Returns 'PLAYER', 'OPPONENT', or null if no one has won yet.
   */
  checkWinner() {
    if (this.position <= ARM_PLAYER_WIN_THRESHOLD) return 'PLAYER';
    if (this.position >= ARM_OPPONENT_WIN_THRESHOLD) return 'OPPONENT';
    return null;
  }

  reset() {
    this.position = ARM_CENTER;
    this.target = ARM_CENTER;
  }
}