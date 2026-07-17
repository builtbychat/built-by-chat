const params = new URLSearchParams(location.search);
const allowedModes = new Set(['mark', 'lockup', 'system']);
let board = document.querySelector('.board');
board.dataset.mode = allowedModes.has(params.get('mode')) ? params.get('mode') : 'mark';

function setPaused(paused) { document.body.classList.toggle('paused', paused); }
function replay() {
  const replacement = board.cloneNode(true);
  board.replaceWith(replacement);
  board = replacement;
  document.body.classList.remove('paused');
}

window.addEventListener('message', (event) => {
  if (event.origin !== location.origin || !event.data || event.data.channel !== 'identity-lab') return;
  if (event.data.action === 'play') setPaused(false);
  if (event.data.action === 'pause') setPaused(true);
  if (event.data.action === 'replay') replay();
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') { event.preventDefault(); setPaused(!document.body.classList.contains('paused')); }
  if (event.key.toLowerCase() === 'r') replay();
});

if (params.get('motion') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches) setPaused(true);
window.wildcardLabReady = true;
