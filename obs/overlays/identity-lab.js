const params = new URLSearchParams(location.search);
const allowed = new Set(['receiver', 'pulse', 'patch', 'clubmark']);
const concept = allowed.has(params.get('concept')) ? params.get('concept') : 'receiver';
let stage = document.querySelector('.stage');

stage.dataset.concept = concept;
const reducedMotion = params.get('motion') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches;

function replay() {
  const replacement = stage.cloneNode(true);
  stage.replaceWith(replacement);
  stage = replacement;
  document.body.classList.remove('paused');
  document.body.classList.add('replay');
  window.setTimeout(() => document.body.classList.remove('replay'), 220);
}

function setPaused(paused) {
  document.body.classList.toggle('paused', paused);
  for (const svg of document.querySelectorAll('svg')) {
    if (paused) svg.pauseAnimations?.();
    else svg.unpauseAnimations?.();
  }
}

window.addEventListener('message', (event) => {
  if (event.origin !== location.origin || !event.data || event.data.channel !== 'identity-lab') return;
  if (event.data.action === 'play') setPaused(false);
  if (event.data.action === 'pause') setPaused(true);
  if (event.data.action === 'replay') replay();
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    setPaused(!document.body.classList.contains('paused'));
  }
  if (event.key.toLowerCase() === 'r') replay();
});

window.identityLabReady = true;
if (reducedMotion) setPaused(true);
