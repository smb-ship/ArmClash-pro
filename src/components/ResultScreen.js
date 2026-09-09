import { GAME_STATES } from '../utils/constants.js';
import { playSound } from '../utils/audio.js';

/**
 * Shown after a round ends. Displays win/lose and basic stats,
 * with buttons to play again or return to the menu.
 */
export function createResultScreen({ manager, onPlayAgain, onMainMenu }) {
  const el = document.createElement('div');
  el.className = 'result-screen';

  el.innerHTML = `
    <div class="result-screen__eyebrow">MATCH COMPLETE</div>
    <div class="result-screen__burst">✦</div>
    <h2 class="result-screen__title"></h2>
    <p class="result-screen__subtitle">THE TABLE HAS A NEW CHAMPION</p>
    <p class="result-screen__stats"></p>
    <div class="result-screen__buttons">
      <button type="button" class="result-screen__play-again">REMATCH <span>↗</span></button>
      <button type="button" class="result-screen__menu">MAIN MENU</button>
    </div>
  `;

  const titleEl = el.querySelector('.result-screen__title');
  const statsEl = el.querySelector('.result-screen__stats');
  const playAgainBtn = el.querySelector('.result-screen__play-again');
  const menuBtn = el.querySelector('.result-screen__menu');

  playAgainBtn.addEventListener('click', () => {
    playSound('click');
    onPlayAgain();
  });

  menuBtn.addEventListener('click', () => {
    playSound('click');
    onMainMenu();
  });

  /**
   * Call this right before showing the screen to refresh the result text.
   */
  function update(state) {
    const won = state === GAME_STATES.PLAYER_WON;
    titleEl.textContent = won ? 'PLAYER 1 WINS!' : 'PLAYER 2 WINS!';
    titleEl.classList.toggle('result-screen__title--win', won);
    titleEl.classList.toggle('result-screen__title--lose', !won);
    el.dataset.winner = won ? 'one' : 'two';
    statsEl.innerHTML = `<span>PLAYER 1 <b>${manager.save.playerOneWins}</b></span><i>—</i><span>PLAYER 2 <b>${manager.save.playerTwoWins}</b></span>`;
  }

  return { element: el, update };
}