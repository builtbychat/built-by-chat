/** Continuous identity-lab motion: rAF loop, Play/Pause/Replay via postMessage. */
(function () {
  const params = new URLSearchParams(location.search);
  const reduced =
    params.get('motion') === 'reduced' ||
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  /** Map global u [0,1) through a segment [start,end] → local 0..1 */
  function seg(u, start, end) {
    if (u <= start) return 0;
    if (u >= end) return 1;
    return (u - start) / (end - start);
  }

  function createLoop(options) {
    const duration = options.durationMs || 5200;
    const onFrame = options.onFrame;
    let t0 = performance.now();
    let paused = document.body.classList.contains('paused') || reduced;
    let raf = 0;

    function setPaused(next) {
      paused = next;
      document.body.classList.toggle('paused', paused);
      if (!paused) t0 = performance.now() - ((performance.now() - t0) % duration);
    }

    function replay() {
      t0 = performance.now();
      setPaused(false);
      onFrame(0, { replay: true });
    }

    function tick(now) {
      if (!paused && !reduced) {
        const u = ((now - t0) % duration) / duration;
        onFrame(u, { now, duration });
      } else if (reduced) {
        onFrame(options.reducedAt ?? 0.72, { reduced: true });
      }
      raf = requestAnimationFrame(tick);
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
        setPaused(!paused);
      }
      if (event.key.toLowerCase() === 'r') replay();
    });

    if (reduced) {
      document.body.classList.add('reduced');
      setPaused(true);
    }

    raf = requestAnimationFrame(tick);
    window.cursorBrandReady = true;

    return { setPaused, replay, stop: () => cancelAnimationFrame(raf) };
  }

  window.TinyScaleMotion = {
    createLoop,
    easeOutCubic,
    easeInOutCubic,
    clamp01,
    lerp,
    seg,
    reduced
  };
})();
