const motion = new URLSearchParams(location.search).get('motion');
if (motion === 'reduced') document.body.classList.add('reduced');
if (motion === 'full') document.body.classList.add('force-motion');

function replay() {
  document.body.classList.remove('paused');
  for (const element of document.querySelectorAll('[data-animated], [data-animated] *')) {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  }
}

addEventListener('message', (event) => {
  if (event.origin !== location.origin || event.data?.channel !== 'tiny-signal-ident') return;
  if (event.data.action === 'pause') document.body.classList.add('paused');
  if (event.data.action === 'play') document.body.classList.remove('paused');
  if (event.data.action === 'replay') replay();
});
