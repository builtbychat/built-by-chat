const { createLoop, easeOutCubic, easeInOutCubic, lerp, seg } = window.TinyScaleMotion;

const member = document.querySelector('.member');
const g1 = document.querySelector('.g1');
const g2 = document.querySelector('.g2');
const body = document.querySelector('.body');
const ledge = document.querySelector('.ledge');
const phase = document.querySelector('[data-phase]');

function setPhase(text, state) {
  if (phase.textContent !== text) phase.textContent = text;
  if (phase.dataset.state !== state) phase.dataset.state = state;
}

createLoop({
  durationMs: 6200,
  reducedAt: 0.72,
  onFrame(u) {
    let mx = 0, my = 0, rot = -6, sc = 1, mop = 1;
    let g1op = 0, g2op = 0;
    let bodySc = 1, ledgeOp = 0;

    if (u < 0.1) {
      setPhase('WAITING', 'wait');
      mop = 0; g1op = 0.25; g2op = 0.15;
      bodySc = 1 + Math.sin(seg(u, 0, 0.1) * Math.PI) * 0.008;
      ledgeOp = 0.45;
    } else if (u < 0.4) {
      setPhase('JOINING', 'approach');
      const t = easeOutCubic(seg(u, 0.1, 0.4));
      mx = lerp(56, 0, t); my = lerp(-48, 0, t); rot = lerp(18, -6, t);
      sc = lerp(0.75, 1, t); mop = lerp(0, 1, Math.min(1, seg(u, 0.1, 0.4) * 1.4));
      g1op = 0.3; g2op = 0.18; ledgeOp = lerp(0.5, 0.1, t);
    } else if (u < 0.52) {
      setPhase('SEATED', 'seat');
      const t = easeOutCubic(seg(u, 0.4, 0.52));
      const squash = Math.sin(t * Math.PI);
      my = squash * 3; sc = 1 - squash * 0.08; mop = 1;
      // pill flattens slightly on land
      g1op = lerp(0.3, 0.55, t); g2op = lerp(0.18, 0.35, t);
      bodySc = 1 - squash * 0.02; ledgeOp = lerp(0.1, 0, t);
    } else if (u < 0.84) {
      setPhase('CLUB', 'held');
      const breath = Math.sin(seg(u, 0.52, 0.84) * Math.PI * 2);
      mop = 1; my = breath * 1; rot = -6 + breath * 0.8; sc = 1 + breath * 0.012;
      g1op = 0.55 + breath * 0.05; g2op = 0.35 + breath * 0.04;
      bodySc = 1 + breath * 0.005;
    } else {
      setPhase('RELEASE', 'approach');
      const t = easeInOutCubic(seg(u, 0.84, 1));
      mx = lerp(0, 18, t); my = lerp(0, -28, t); mop = lerp(1, 0, t);
      g1op = lerp(0.55, 0.2, t); g2op = lerp(0.35, 0.12, t);
      ledgeOp = t * 0.4;
    }

    member.setAttribute('transform', `translate(${mx} ${my}) translate(164 76) rotate(${rot}) scale(${sc}) translate(-164 -76)`);
    member.setAttribute('opacity', String(mop));
    g1.setAttribute('opacity', String(g1op));
    g2.setAttribute('opacity', String(g2op));
    body.setAttribute('transform', `translate(128 132) scale(${bodySc}) translate(-128 -132)`);
    ledge.setAttribute('opacity', String(ledgeOp));
  }
});
