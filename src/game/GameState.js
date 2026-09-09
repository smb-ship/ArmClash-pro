import { GAME_STATES } from '../utils/constants.js';

/**
 * Simple state manager with pub/sub so UI components can react
 * to state changes without being tightly coupled to game logic.
 */
export class GameState {
  constructor() {
    this.current = GAME_STATES.MENU;
    this.listeners = [];
  }

  set(newState) {
    if (this.current === newState) return;
    const previous = this.current;
    this.current = newState;
    this.listeners.forEach((fn) => fn(newState, previous));
  }

  get() {
    return this.current;
  }

  is(state) {
    return this.current === state;
  }

  /**
   * Register a callback that runs whenever the state changes.
   * Returns an unsubscribe function.
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== callback);
    };
  }
}