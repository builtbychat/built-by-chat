const { createLoop, easeOutCubic, easeInOutCubic, lerp, seg } = window.TinyScaleMotion;

const signal = document.querySelector('.signal');
const body = document.querySelector('.body');
const ledge = document.querySelector('.ledge');
const phase = document.querySelector('[data-phase]');

function setPhase(text, state) {
  if (phase.textContent !== text) phase.textContent = text;
  if (phase.dataset.state !== state) phase.dataset.state = state;
}

createLoop({
  durationMs: 5600,
  reducedAt: 0.68,
  onFrame(u) {
    // Timeline (continuous, no freeze):
    // 0.00–0.12 empty breathe
    // 0.12–0.42 approach
    // 0.42–0.52 seat / squash
    // 0.52–0.82 held breath
    // 0.82–1.00 lift & reset into next approach
    const empty = seg(u, 0, 0.12);
    const approach = seg(u, 0.12, 0.42);
    const seat = seg(u, 0.42, 0.52);
    const held = seg(u, 0.52, 0.82);
    const lift = seg(u, 0.82, 1);

    let ox = 0, oy = 0, rot = 4.5, sc = 1, op = 1;
    let bodySc = 1;
    let ledgeOp = 0;

    if (u < 0.12) {
      setPhase('WAITING', 'wait');
      ox = 0; oy = 0; op = 0;
      bodySc = 1 + Math.sin(empty * Math.PI) * 0.008;
      ledgeOp = 0.35 + empty * 0.25;
    } else if (u < 0.42) {
      setPhase('RECEIVING', 'approach');
      const t = easeOutCubic(approach);
      ox = lerp(72, 0, t);
      oy = lerp(-58, 0, t);
      rot = lerp(28, 4.5, t);
      sc = lerp(0.72, 1, t);
      op = lerp(0, 1, Math.min(1, approach * 1.4));
      ledgeOp = lerp(0.55, 0.15, t);
      bodySc = 1;
    } else if (u < 0.52) {
      setPhase('SEATED', 'seat');
      const t = easeOutCubic(seat);
      // squash into the ledge then recover
      ox = 0;
      oy = lerp(0, 3, Math.sin(t * Math.PI));
      rot = lerp(4.5, 2.2, Math.sin(t * Math.PI));
      sc = lerp(1, 0.92, Math.sin(t * Math.PI));
      op = 1;
      bodySc = lerp(1, 0.975, Math.sin(t * Math.PI));
      ledgeOp = lerp(0.15, 0, t);
    } else if (u < 0.82) {
      setPhase('HELD', 'held');
      const breath = Math.sin(held * Math.PI * 2);
      ox = 0;
      oy = breath * 1.2;
      rot = 4.5 + breath * 0.8;
      sc = 1 + breath * 0.012;
      op = 1;
      bodySc = 1 + breath * 0.006;
      ledgeOp = 0;
    } else {
      setPhase('RELEASE', 'approach');
      const t = easeInOutCubic(lift);
      ox = lerp(0, 18, t);
      oy = lerp(0, -28, t);
      rot = lerp(4.5, 16, t);
      sc = lerp(1, 0.85, t);
      op = lerp(1, 0, t);
      bodySc = 1;
      ledgeOp = t * 0.4;
    }

    signal.setAttribute(
      'transform',
      `translate(${ox} ${oy}) translate(186 78) rotate(${rot}) scale(${sc}) translate(-186 -78)`
    );
    signal.setAttribute('opacity', String(op));
    body.setAttribute('transform', `scale(${bodySc})`);
    ledge.setAttribute('opacity', String(ledgeOp));
  }
});
