import { GameState } from './GameState.js';
import { Player } from './Player.js';
import { ArmWrestling } from './ArmWrestling.js';
import { playSound } from '../utils/audio.js';
import { loadSave, writeSave } from '../utils/helpers.js';
import { GAME_STATES, COUNTDOWN_SECONDS, STORAGE_KEY } from '../utils/constants.js';

const SAVE_DEFAULTS = {
  playerOneWins: 0,
  playerTwoWins: 0
};

/**
 * Central orchestrator for local 2-player mode. Owns both players,
 * the arm position, and the main game loop. UI should only ever
 * talk to the game through this class.
 */
export class GameManager {
  constructor() {
    this.state = new GameState();
    this.playerOne = new Player('Player 1');
    this.playerTwo = new Player('Player 2');
    this.arm = new ArmWrestling();

    this.save = loadSave(STORAGE_KEY, SAVE_DEFAULTS);

    this.countdownValue = COUNTDOWN_SECONDS;
    this._countdownTimer = null;
    this._rafId = null;
    this._lastTime = 0;

    this._listeners = {};
  }

  on(eventName, callback) {
    if (!this._listeners[eventName]) this._listeners[eventName] = [];
    this._listeners[eventName].push(callback);
  }

  _emit(eventName, payload) {
    (this._listeners[eventName] || []).forEach((fn) => fn(payload));
  }

  startRound() {
    clearInterval(this._countdownTimer);
    cancelAnimationFrame(this._rafId);
    this.playerOne.reset();
    this.playerTwo.reset();
    this.arm.reset();
    this.countdownValue = COUNTDOWN_SECONDS;
    this.state.set(GAME_STATES.COUNTDOWN);
    this._emit('countdownTick', this.countdownValue);

    this._countdownTimer = setInterval(() => {
      this.countdownValue -= 1;
      playSound('countdown');
      if (this.countdownValue <= 0) {
        clearInterval(this._countdownTimer);
        this._emit('countdownTick', 'GO!');
        this.state.set(GAME_STATES.PLAYING);
        this._lastTime = performance.now();
        this._loop(this._lastTime);
        setTimeout(() => this._emit('countdownTick', ''), 500);
      } else {
        this._emit('countdownTick', this.countdownValue);
      }
    }, 1000);
  }

  /**
   * side is 'one' or 'two'.
   */
  handleTap(side) {
    if (!this.state.is(GAME_STATES.PLAYING)) return;
    if (side === 'one') this.playerOne.registerTap();
    else this.playerTwo.registerTap();
    playSound('tap');
  }

  _loop(time) {
    if (!this.state.is(GAME_STATES.PLAYING)) return;

    const delta = (time - this._lastTime) / 16.67;
    this._lastTime = time;

    this.playerOne.update(delta);
    this.playerTwo.update(delta);
    this.arm.update(this.playerOne.power, this.playerTwo.power);

    this._emit('tick', {
      playerOnePower: this.playerOne.power,
      playerTwoPower: this.playerTwo.power,
      armPosition: this.arm.position,
      armTarget: this.arm.target,
      leader: this.playerOne.power - this.playerTwo.power
    });

    const winner = this.arm.checkWinner();
    if (winner) {
      this._endRound(winner);
      return;
    }

    this._rafId = requestAnimationFrame((t) => this._loop(t));
  }

  _endRound(winner) {
    cancelAnimationFrame(this._rafId);

    if (winner === 'PLAYER') {
      this.playerOne.recordWin();
      this.playerTwo.recordLoss();
      this.save.playerOneWins += 1;
      playSound('victory');
      this.state.set(GAME_STATES.PLAYER_WON);
    } else {
      this.playerTwo.recordWin();
      this.playerOne.recordLoss();
      this.save.playerTwoWins += 1;
      playSound('victory');
      this.state.set(GAME_STATES.OPPONENT_WON);
    }

    writeSave(STORAGE_KEY, this.save);
    this._emit('roundEnded', winner);
  }

  pause() {
    if (this.state.is(GAME_STATES.PLAYING)) {
      cancelAnimationFrame(this._rafId);
      this.state.set(GAME_STATES.PAUSED);
    }
  }

  resume() {
    if (this.state.is(GAME_STATES.PAUSED)) {
      this.state.set(GAME_STATES.PLAYING);
      this._lastTime = performance.now();
      this._loop(this._lastTime);
    }
  }

  goToMenu() {
    clearInterval(this._countdownTimer);
    cancelAnimationFrame(this._rafId);
    this.state.set(GAME_STATES.MENU);
  }
}