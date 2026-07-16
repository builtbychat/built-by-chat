const params = new URLSearchParams(location.search);

for (const element of document.querySelectorAll('[data-param]')) {
  const value = params.get(element.dataset.param);
  if (value) element.textContent = value.slice(0, 120);
}

if (params.get('motion') === 'reduced') document.body.classList.add('reduced');

const music = document.querySelector('#music');
const chime = document.querySelector('#chime');
const notice = document.querySelector('.audio-notice');
const audioEnabled = params.get('audio') === '1';
const targetVolume = Math.min(.5, Math.max(0, Number(params.get('volume') || .22)));
const duration = Math.min(120, Math.max(6, Number(params.get('duration') || 18)));
const chimeAt = Math.min(duration - 1, Math.max(.5, Number(params.get('chimeAt') || 2.25)));

async function startAudio() {
  if (!audioEnabled || !music) return;
  music.volume = 0;
  try {
    await music.play();
    document.body.dataset.audio = 'playing';
    const started = performance.now();
    const fadeIn = () => {
      const progress = Math.min(1, (performance.now() - started) / 1200);
      music.volume = targetVolume * progress;
      if (progress < 1) requestAnimationFrame(fadeIn);
    };
    requestAnimationFrame(fadeIn);
  } catch {
    document.body.dataset.audio = 'blocked';
  }
}

function playChime() {
  if (!audioEnabled || !chime) return;
  chime.volume = Math.min(.9, targetVolume + .55);
  chime.play().catch(() => { document.body.dataset.audio = 'blocked'; });
}

async function unlockAudio() {
  await startAudio();
  playChime();
}

notice?.addEventListener('click', unlockAudio);
document.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'm') unlockAudio();
});

if (audioEnabled) {
  startAudio();
  window.setTimeout(playChime, chimeAt * 1000);
  if (document.body.classList.contains('outro')) {
    window.setTimeout(() => {
      if (!music || music.paused) return;
      const initial = music.volume;
      const started = performance.now();
      const fadeOut = () => {
        const progress = Math.min(1, (performance.now() - started) / 1800);
        music.volume = initial * (1 - progress);
        if (progress < 1) requestAnimationFrame(fadeOut);
        else music.pause();
      };
      requestAnimationFrame(fadeOut);
    }, Math.max(2000, (duration - 1.8) * 1000));
  }
}

document.body.dataset.ready = 'true';
window.overlayReady = true;
