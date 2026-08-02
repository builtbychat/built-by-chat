(() => {
  const params = new URLSearchParams(location.search);
  const inputText = (params.get('input') || 'ADD A NIGHT MARKET').slice(0, 48);
  const resultText = (params.get('result') || 'NIGHT MARKET').slice(0, 36);
  const root = document.querySelector('[data-motion-root]');
  const input = document.querySelector('[data-input-card]');
  const result = document.querySelector('[data-result-card]');
  const progress = document.querySelector('[data-progress]');
  const phase = document.querySelector('[data-phase]');
  document.querySelector('[data-input]').textContent = inputText;
  document.querySelector('[data-result]').textContent = resultText;

  function frame(u) {
    const { seg, easeOutCubic, easeInOutCubic } = window.TinyScaleMotion;
    const inputIn = easeOutCubic(seg(u, .02, .16));
    const build = easeInOutCubic(seg(u, .22, .48));
    const resultIn = easeOutCubic(seg(u, .48, .68));
    const reset = 1 - easeInOutCubic(seg(u, .9, .99));
    input.style.opacity = String(inputIn * reset);
    input.style.transform = `translate3d(${(1 - inputIn) * -26}px,0,0)`;
    progress.style.transform = `scaleX(${build})`;
    result.style.opacity = String(resultIn * reset);
    result.style.transform = `translate3d(0,${(1 - resultIn) * 24}px,0) scale(${.82 + resultIn * .18})`;
    const state = u < .18 ? 'input' : u < .5 ? 'build' : 'result';
    phase.dataset.state = state;
    phase.textContent = state === 'input' ? 'INPUT' : state === 'build' ? 'BUILD + TEST' : 'MADE REAL';
  }

  if (window.TinyScaleMotion.reduced) root.classList.add('reduced');
  window.TinyScaleMotion.createLoop({ durationMs: 6200, reducedAt: .76, onFrame: frame });
})();
