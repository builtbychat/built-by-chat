const { createLoop, easeOutCubic, easeInOutCubic, lerp, seg } = window.TinyScaleMotion;

const wedge = document.querySelector('.wedge');
const period = document.querySelector('.period');
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
    let wx = 0, wy = 0, wsc = 1, wop = 1, wrot = 0;
    let pop = 0, py = 0, psc = 1;
    let bodySc = 1, ledgeOp = 0;

    if (u < 0.1) {
      setPhase('WAITING', 'wait');
      wop = 0; pop = 0;
      bodySc = 1 + Math.sin(seg(u, 0, 0.1) * Math.PI) * 0.008;
      ledgeOp = 0.45;
    } else if (u < 0.38) {
      setPhase('DIVING', 'approach');
      const t = easeOutCubic(seg(u, 0.1, 0.38));
      wx = lerp(40, 0, t);
      wy = lerp(-60, 0, t);
      wrot = lerp(-25, 0, t);
      wsc = lerp(0.6, 1, t);
      wop = lerp(0, 1, Math.min(1, seg(u, 0.1, 0.38) * 1.5));
      pop = 0; ledgeOp = lerp(0.55, 0.12, t);
    } else if (u < 0.48) {
      setPhase('SEATED', 'seat');
      const t = easeOutCubic(seg(u, 0.38, 0.48));
      const hit = Math.sin(t * Math.PI);
      wy = hit * 5; wsc = 1 - hit * 0.1; wop = 1;
      bodySc = 1 - hit * 0.03; ledgeOp = lerp(0.12, 0, t);
    } else if (u < 0.62) {
      setPhase('CLUB.', 'seat');
      const t = easeOutCubic(seg(u, 0.48, 0.62));
      wop = 1; wx = 0; wy = 0; wsc = 1;
      pop = lerp(0, 1, t);
      py = lerp(-40, 0, t);
      psc = lerp(0.3, 1, t);
      if (t > 0.75) py = Math.sin((t - 0.75) / 0.25 * Math.PI) * -4;
    } else if (u < 0.84) {
      setPhase('HELD', 'held');
      const breath = Math.sin(seg(u, 0.62, 0.84) * Math.PI * 2);
      wop = 1; pop = 1;
      wy = breath * 1.2; wsc = 1 + breath * 0.015;
      psc = 1 + breath * 0.025; py = breath * 0.6;
      bodySc = 1 + breath * 0.005;
    } else {
      setPhase('RELEASE', 'approach');
      const t = easeInOutCubic(seg(u, 0.84, 1));
      wy = lerp(0, -36, t); wop = lerp(1, 0, t); wrot = lerp(0, 15, t);
      pop = lerp(1, 0, t); py = lerp(0, 18, t);
      ledgeOp = t * 0.4;
    }

    wedge.setAttribute('transform', `translate(${wx} ${wy}) translate(178 74) rotate(${wrot}) scale(${wsc}) translate(-178 -74)`);
    wedge.setAttribute('opacity', String(wop));
    period.setAttribute('transform', `translate(0 ${py}) translate(210 192) scale(${psc}) translate(-210 -192)`);
    period.setAttribute('opacity', String(pop));
    body.setAttribute('transform', `translate(128 128) scale(${bodySc}) translate(-128 -128)`);
    ledge.setAttribute('opacity', String(ledgeOp));
  }
});
