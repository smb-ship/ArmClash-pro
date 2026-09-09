import { createPlayerPanel } from './PlayerPanel.js';
import { createTapButton } from './TapButton.js';

/**
 * The main gameplay screen for two local players, each with their
 * own tap button and keyboard key (Space / Enter).
 */
export function createGameScreen(manager) {
  const el = document.createElement('div');
  el.className = 'game-screen';

  const playerOnePanel = createPlayerPanel({ name: 'Player 1', side: 'player', keyHint: 'SPACE' });
  const playerTwoPanel = createPlayerPanel({ name: 'Player 2', side: 'opponent', keyHint: 'ENTER' });

  const vs = document.createElement('div');
  vs.className = 'game-screen__vs';
  vs.textContent = 'VS';

  const header = document.createElement('div');
  header.className = 'game-screen__header';
  header.appendChild(playerOnePanel.element);
  header.appendChild(vs);
  header.appendChild(playerTwoPanel.element);

  const arena = document.createElement('div');
  arena.className = 'game-screen__arena';
  arena.innerHTML = `
    <div class="arena__backdrop"></div>
    <div class="arena__lights"></div>
    <div class="arena__crowd" aria-hidden="true">
      ${Array.from({ length: 18 }, (_, index) => `
        <span class="crowd-person crowd-person--${index % 2 ? 'blue' : 'orange'}" style="--crowd-delay:${(index % 6) * 0.18}s"></span>
      `).join('')}
    </div>
    <div class="arena__sign">TAP <b>FASTER</b></div>
    <div class="arena__battlefield">
      <div class="fighter-fx fighter-fx--one"><span class="fighter-fx__muscle"></span><i class="fighter-fx__sweat fighter-fx__sweat--one"></i><i class="fighter-fx__sweat fighter-fx__sweat--two"></i></div>
      <div class="fighter-fx fighter-fx--two"><span class="fighter-fx__muscle"></span><i class="fighter-fx__sweat fighter-fx__sweat--one"></i><i class="fighter-fx__sweat fighter-fx__sweat--two"></i></div>
      <div class="arm-wrestle">
        <div class="arm-wrestle__grip"><span></span></div>
      </div>
      <div class="arena__table"><span class="table-pad"></span></div>
    </div>
  `;
  const armWrestle = arena.querySelector('.arm-wrestle');
  const grip = arena.querySelector('.arm-wrestle__grip');
  const fighterFx = {
    one: arena.querySelector('.fighter-fx--one'),
    two: arena.querySelector('.fighter-fx--two')
  };

  const countdownEl = document.createElement('div');
  countdownEl.className = 'game-screen__countdown';

  const tapOne = createTapButton({ side: 'player', onTap: () => manager.handleTap('one') });
  const tapTwo = createTapButton({ side: 'opponent', onTap: () => manager.handleTap('two') });

  const controls = document.createElement('div');
  controls.className = 'game-screen__controls';
  const instruction = document.createElement('div');
  instruction.className = 'game-screen__instruction';
  instruction.innerHTML = '<span>ϟ</span><b>TAP FASTER<br><small>GET STRONGER</small></b>';
  controls.appendChild(tapOne.element);
  controls.appendChild(instruction);
  controls.appendChild(tapTwo.element);

  el.appendChild(header);
  el.appendChild(arena);
  el.appendChild(countdownEl);
  el.appendChild(controls);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      manager.handleTap('one');
    } else if (e.code === 'Enter') {
      e.preventDefault();
      manager.handleTap('two');
    }
  });

  function updateArena(data) {
    const position = data.armPosition ?? 50;
    const lead = data.playerOnePower - data.playerTwoPower;
    const tension = Math.min(1, Math.abs(lead) / 42);
    arena.style.setProperty('--arm-position', position);
    arena.style.setProperty('--tension', tension.toFixed(2));
    arena.style.setProperty('--p1-power', (data.playerOnePower / 100).toFixed(2));
    arena.style.setProperty('--p2-power', (data.playerTwoPower / 100).toFixed(2));
    armWrestle.classList.toggle('arm-wrestle--shaking', tension > 0.35);
    armWrestle.classList.toggle('arm-wrestle--critical', tension > 0.78);
    grip.classList.toggle('arm-wrestle__grip--p1', lead > 10);
    grip.classList.toggle('arm-wrestle__grip--p2', lead < -10);

    const leader = lead > 7 ? 'one' : lead < -7 ? 'two' : 'even';
    fighterFx.one.dataset.mood = data.playerOnePower < data.playerTwoPower - 8 ? 'struggling' : leader === 'one' ? 'confident' : 'focused';
    fighterFx.two.dataset.mood = data.playerTwoPower < data.playerOnePower - 8 ? 'struggling' : leader === 'two' ? 'confident' : 'focused';
    arena.dataset.leader = leader;
    arena.classList.toggle('arena--live', data.playerOnePower > 0 || data.playerTwoPower > 0);
  }

  manager.on('tick', (data) => {
    playerOnePanel.update(data.playerOnePower, data.playerOnePower - data.playerTwoPower);
    playerTwoPanel.update(data.playerTwoPower, data.playerTwoPower - data.playerOnePower);
    updateArena(data);
  });

  manager.on('countdownTick', (value) => {
    countdownEl.textContent = value;
    countdownEl.classList.remove('countdown--pulse');
    void countdownEl.offsetWidth;
    countdownEl.classList.add('countdown--pulse');
    el.dataset.phase = value === 'GO!' ? 'fight' : 'countdown';
  });

  return { element: el };
}