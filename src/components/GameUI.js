import { GameManager } from '../game/GameManager.js';
import { createMainMenu } from './MainMenu.js';
import { createGameScreen } from './GameScreen.js';
import { createResultScreen } from './ResultScreen.js';
import { GAME_STATES } from '../utils/constants.js';

export function createGameUI(rootEl) {
  const manager = new GameManager();

  const menu = createMainMenu({
    onPlay: () => manager.startRound()
  });

  const gameScreen = createGameScreen(manager);

  const resultScreen = createResultScreen({
    manager,
    onPlayAgain: () => manager.startRound(),
    onMainMenu: () => manager.goToMenu()
  });

  const allScreens = [menu.element, gameScreen.element, resultScreen.element];

  function showOnly(activeEl) {
    allScreens.forEach((screenEl) => {
      screenEl.style.display = screenEl === activeEl ? '' : 'none';
    });
  }

  rootEl.appendChild(menu.element);
  rootEl.appendChild(gameScreen.element);
  rootEl.appendChild(resultScreen.element);

  showOnly(menu.element);

  manager.state.onChange((newState) => {
    if (newState === GAME_STATES.MENU) {
      showOnly(menu.element);
    } else if (newState === GAME_STATES.COUNTDOWN || newState === GAME_STATES.PLAYING) {
      showOnly(gameScreen.element);
    } else if (newState === GAME_STATES.PLAYER_WON || newState === GAME_STATES.OPPONENT_WON) {
      resultScreen.update(newState);
      showOnly(resultScreen.element);
    }
  });

  return { manager };
}