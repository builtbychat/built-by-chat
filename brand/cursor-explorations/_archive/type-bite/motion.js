const { createLoop, easeOutCubic, easeInOutCubic, lerp, seg } = window.TinyScaleMotion;

const bodyFull = document.querySelector('.body-full');
const bodyBitten = document.querySelector('.body-bitten');
const crumb = document.querySelector('.crumb');
const jaws = document.querySelector('.jaws');
const jawTop = document.querySelector('.jaw-top');
const jawBot = document.querySelector('.jaw-bot');
const tiny = document.querySelector('.tiny');
const phase = document.querySelector('[data-phase]');
const letters = ['.L0', '.L1', '.L2', '.L3'].map((s) => document.querySelector(s));

function setPhase(text, state) {
  if (phase.textContent !== text) phase.textContent = text;
  if (phase.dataset.state !== state) phase.dataset.state = state;
}

createLoop({
  durationMs: 6400,
  reducedAt: 0.72,
  onFrame(u) {
    // WHOLE → APPROACH (jaws open) → CHOMP (chunk flies) → SEAT → HOLD → HEAL
    const whole = seg(u, 0, 0.12);
    const approach = seg(u, 0.12, 0.36);
    const chomp = seg(u, 0.36, 0.5);
    const seat = seg(u, 0.5, 0.62);
    const held = seg(u, 0.62, 0.84);
    const heal = seg(u, 0.84, 1);

    let fullOp = 1;
    let bittenOp = 0;
    let crumbOp = 0;
    let crumbX = 0;
    let crumbY = 0;
    let crumbRot = 0;
    let crumbSc = 1;
    let jawsOp = 0;
    let jawSpread = 0;
    let tinyOp = 0;
    let tinyX = 0;
    let tinyY = 0;
    let tinySc = 1;
    let letterSpread = 0;

    if (u < 0.12) {
      setPhase('WHOLE', 'open');
      fullOp = 1;
      bittenOp = 0;
      // idle pulse on the complete period
      const pulse = 1 + Math.sin(whole * Math.PI) * 0.008;
      bodyFull.setAttribute('transform', `translate(128 128) scale(${pulse}) translate(-128 -128)`);
      bodyBitten.setAttribute('transform', '');
    } else if (u < 0.36) {
      setPhase('HUNGRY', 'bite');
      const t = easeOutCubic(approach);
      fullOp = 1;
      bittenOp = 0;
      jawsOp = lerp(0, 1, Math.min(1, approach * 2));
      jawSpread = lerp(18, 8, t);
      tinyOp = lerp(0, 1, Math.min(1, approach * 1.6));
      tinyX = lerp(70, 18, t);
      tinyY = lerp(-50, -18, t);
      tinySc = lerp(1.15, 1.05, t);
      letterSpread = lerp(10, 5, t); // mouth open
      bodyFull.setAttribute('transform', '');
    } else if (u < 0.5) {
      setPhase('CHOMP', 'bite');
      const t = easeOutCubic(chomp);
      // snap jaws, punch the wound open, spit the crumb
      jawsOp = lerp(1, 0, t);
      jawSpread = lerp(8, 0, t);
      letterSpread = lerp(5, 0, t);
      tinyOp = 1;
      tinyX = lerp(18, 0, t);
      tinyY = lerp(-18, 0, t);
      tinySc = lerp(1.05, 0.92 + Math.sin(t * Math.PI) * 0.08, t);

      fullOp = lerp(1, 0, Math.min(1, t * 1.4));
      bittenOp = lerp(0, 1, Math.min(1, t * 1.4));
      crumbOp = t < 0.15 ? lerp(0, 1, t / 0.15) : lerp(1, 0.35, (t - 0.15) / 0.85);
      crumbX = lerp(0, 56, t);
      crumbY = lerp(0, -42, t);
      crumbRot = lerp(0, 28, t);
      crumbSc = lerp(1, 0.7, t);

      // impact squash on bitten body
      const squash = 1 - Math.sin(t * Math.PI) * 0.04;
      bodyBitten.setAttribute('transform', `translate(128 128) scale(${squash}) translate(-128 -128)`);
      bodyFull.setAttribute('transform', '');
    } else if (u < 0.62) {
      setPhase('SEATED', 'seat');
      const t = easeOutCubic(seat);
      fullOp = 0;
      bittenOp = 1;
      jawsOp = 0;
      letterSpread = 0;
      tinyOp = 1;
      tinyX = 0;
      tinyY = lerp(2, 0, t);
      tinySc = lerp(0.94, 1, t);
      crumbOp = lerp(0.35, 0, t);
      crumbX = lerp(56, 72, t);
      crumbY = lerp(-42, -58, t);
      crumbRot = lerp(28, 40, t);
      crumbSc = lerp(0.7, 0.45, t);
      bodyBitten.setAttribute('transform', '');
    } else if (u < 0.84) {
      setPhase('HELD', 'held');
      const breath = Math.sin(held * Math.PI * 2);
      fullOp = 0;
      bittenOp = 1;
      crumbOp = 0;
      jawsOp = 0;
      tinyOp = 1;
      tinyX = 0;
      tinyY = breath * 1.1;
      tinySc = 1 + breath * 0.012;
      letterSpread = 0;
      bodyBitten.setAttribute('transform', `translate(128 128) scale(${1 + breath * 0.006}) translate(-128 -128)`);
    } else {
      setPhase('HEAL', 'open');
      const t = easeInOutCubic(heal);
      // TINY leaves, wound closes, period becomes whole again
      tinyOp = lerp(1, 0, t);
      tinyX = lerp(0, 28, t);
      tinyY = lerp(0, -30, t);
      tinySc = lerp(1, 0.85, t);
      letterSpread = lerp(0, 6, t);
      bittenOp = lerp(1, 0, t);
      fullOp = lerp(0, 1, t);
      crumbOp = 0;
      jawsOp = 0;
      bodyFull.setAttribute('transform', '');
      bodyBitten.setAttribute('transform', '');
    }

    bodyFull.setAttribute('opacity', String(fullOp));
    bodyBitten.setAttribute('opacity', String(bittenOp));

    crumb.setAttribute('opacity', String(crumbOp));
    crumb.setAttribute(
      'transform',
      `translate(${crumbX} ${crumbY}) translate(179 82) rotate(${crumbRot}) scale(${crumbSc}) translate(-179 -82)`
    );

    jaws.setAttribute('opacity', String(jawsOp));
    jawTop.setAttribute('transform', `translate(0 ${-jawSpread})`);
    jawBot.setAttribute('transform', `translate(0 ${jawSpread})`);

    tiny.setAttribute('opacity', String(tinyOp));
    tiny.setAttribute(
      'transform',
      `translate(${150 + tinyX} ${72 + tinyY}) translate(36 11) scale(${tinySc}) translate(-36 -11)`
    );

    letters.forEach((el, i) => {
      if (!el) return;
      const side = i < 1.5 ? -1 : 1;
      const lx = side * letterSpread * (0.35 + i * 0.2);
      const ly = (i % 2 === 0 ? -1 : 1) * letterSpread * 0.25;
      el.setAttribute('transform', `translate(${lx} ${ly})`);
    });
  }
});
