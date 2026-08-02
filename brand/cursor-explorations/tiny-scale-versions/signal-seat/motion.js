const { createLoop, easeOutCubic, easeInOutCubic, lerp, seg } = window.TinyScaleMotion;

const bead = document.querySelector('.bead');
const body = document.querySelector('.body');
const ledge = document.querySelector('.ledge');
const phase = document.querySelector('[data-phase]');

function setPhase(text, state) {
  if (phase.textContent !== text) phase.textContent = text;
  if (phase.dataset.state !== state) phase.dataset.state = state;
}

createLoop({
  durationMs: 5800,
  reducedAt: 0.7,
  onFrame(u) {
    let x = 0, y = 0, sc = 1, op = 1, rot = 0;
    let bodySc = 1, ledgeOp = 0;

    if (u < 0.12) {
      setPhase('WAITING', 'wait');
      op = 0;
      bodySc = 1 + Math.sin(seg(u, 0, 0.12) * Math.PI) * 0.01;
      ledgeOp = 0.45;
    } else if (u < 0.42) {
      setPhase('ROLLING', 'approach');
      const t = easeOutCubic(seg(u, 0.12, 0.42));
      // arc roll into the bowl
      x = lerp(70, 0, t);
      y = lerp(-55, 0, t) + Math.sin(t * Math.PI) * -12;
      rot = lerp(-120, 0, t);
      sc = lerp(0.7, 1, t);
      op = lerp(0, 1, Math.min(1, seg(u, 0.12, 0.42) * 1.5));
      ledgeOp = lerp(0.55, 0.1, t);
    } else if (u < 0.52) {
      setPhase('SEATED', 'seat');
      const t = easeOutCubic(seg(u, 0.42, 0.52));
      const bounce = Math.sin(t * Math.PI);
      y = bounce * 4;
      sc = 1 - bounce * 0.08;
      op = 1;
      bodySc = 1 - bounce * 0.025;
      ledgeOp = lerp(0.1, 0, t);
    } else if (u < 0.84) {
      setPhase('SIGNAL', 'held');
      const breath = Math.sin(seg(u, 0.52, 0.84) * Math.PI * 2);
      op = 1;
      y = breath * 1.4;
      sc = 1 + breath * 0.02;
      bodySc = 1 + breath * 0.006;
    } else {
      setPhase('RELEASE', 'approach');
      const t = easeInOutCubic(seg(u, 0.84, 1));
      x = lerp(0, 24, t);
      y = lerp(0, -34, t);
      rot = lerp(0, 80, t);
      op = lerp(1, 0, t);
      ledgeOp = t * 0.4;
    }

    bead.setAttribute('transform', `translate(${x} ${y}) translate(168 78) rotate(${rot}) scale(${sc}) translate(-168 -78)`);
    bead.setAttribute('opacity', String(op));
    body.setAttribute('transform', `translate(128 128) scale(${bodySc}) translate(-128 -128)`);
    ledge.setAttribute('opacity', String(ledgeOp));
  }
});
