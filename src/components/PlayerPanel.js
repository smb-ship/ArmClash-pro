/**
 * Displays a competitor's name, avatar placeholder, and power bar.
 * side should be 'player' or 'opponent' for styling hooks.
 */
export function createPlayerPanel({ name, side, keyHint }) {
  const el = document.createElement('div');
  el.className = `player-panel player-panel--${side}`;
  el.innerHTML = `
    <div class="player-panel__avatar"><span>${side === 'player' ? '01' : '02'}</span></div>
    <div class="player-panel__info">
      <div class="player-panel__name">${name}<span class="player-panel__key">${keyHint}</span></div>
      <div class="player-panel__bar-track">
        <div class="player-panel__bar-fill"></div>
      </div>
      <div class="player-panel__readout"><span class="player-panel__power-value">0</span><span class="player-panel__unit">POWER</span></div>
    </div>
  `;

  const fill = el.querySelector('.player-panel__bar-fill');
  const valueEl = el.querySelector('.player-panel__power-value');

  /**
   * Update the displayed power (0-100).
   */
  function update(power, advantage = 0) {
    const pct = Math.min(100, Math.max(0, power));
    fill.style.width = `${pct}%`;
    valueEl.textContent = Math.round(power);
    el.style.setProperty('--panel-power', `${pct}%`);
    el.dataset.status = advantage > 8 ? 'leading' : advantage < -8 ? 'struggling' : 'ready';
  }

  return { element: el, update };
}