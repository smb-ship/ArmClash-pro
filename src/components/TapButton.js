/**
 * A tappable button that fires onTap on click or touch.
 * side is 'player' or 'opponent' for styling hooks (mainly used
 * for the player's own tap control, but reusable if needed).
 */
export function createTapButton({ side, onTap }) {
  const el = document.createElement('button');
  el.className = `tap-button tap-button--${side}`;
  el.type = 'button';
  el.setAttribute('aria-label', `${side === 'player' ? 'Player 1' : 'Player 2'} tap`);
  el.innerHTML = `
    <span class="tap-button__icon">☝</span>
    <span class="tap-button__label">TAP</span>
    <span class="tap-button__hint">${side === 'player' ? 'SPACE' : 'ENTER'}</span>
  `;

  function trigger(e) {
    e.preventDefault();
    onTap();
    el.classList.add('tap-button--active');
    setTimeout(() => el.classList.remove('tap-button--active'), 80);
  }

  let lastPointer = 0;
  function handlePointerDown(e) {
    lastPointer = performance.now();
    trigger(e);
  }
  function handleClick(e) {
    if (performance.now() - lastPointer > 450) trigger(e);
  }

  el.addEventListener('pointerdown', handlePointerDown);
  el.addEventListener('click', handleClick);

  function destroy() {
    el.removeEventListener('pointerdown', handlePointerDown);
    el.removeEventListener('click', handleClick);
  }

  return { element: el, destroy };
}