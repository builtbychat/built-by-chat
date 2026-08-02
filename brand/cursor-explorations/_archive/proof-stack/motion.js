const params = new URLSearchParams(location.search);
function setPaused(paused) { document.body.classList.toggle('paused', paused); }
function replay() {
  const board = document.querySelector('[data-motion-root]');
  if (!board) return;
  const clone = board.cloneNode(true);
  board.replaceWith(clone);
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
if (params.get('motion') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.body.classList.add('reduced');
  setPaused(true);
}
window.cursorBrandReady = true;
