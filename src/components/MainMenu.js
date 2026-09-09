import { playSound } from '../utils/audio.js';

/**
 * The main menu screen for local 2-player mode.
 */
export function createMainMenu({ onPlay }) {
  const el = document.createElement('div');
  el.className = 'main-menu';

  el.innerHTML = `
    <div class="main-menu__eyebrow"><span></span> LOCAL ARCADE DUEL <span></span></div>
    <h1 class="main-menu__title"><span>ARM</span><b>CLASH</b></h1>
    <p class="main-menu__tagline">TWO PLAYERS. ONE TABLE. NO MERCY.</p>
    <div class="main-menu__versus-card">
      <div><strong>01</strong><span>PLAYER 1</span><small>SPACE / TAP</small></div>
      <em>VS</em>
      <div><strong>02</strong><span>PLAYER 2</span><small>ENTER / TAP</small></div>
    </div>
    <p class="main-menu__instructions">Lock eyes. Tap fast. Own the table.</p>
    <button type="button" class="main-menu__play-btn"><span>START MATCH</span><i>→</i></button>
  `;

  const playBtn = el.querySelector('.main-menu__play-btn');

  playBtn.addEventListener('click', () => {
    playSound('click');
    onPlay();
  });

  return { element: el };
}