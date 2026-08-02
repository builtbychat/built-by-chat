import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'tiny-signal-club-handoff-'));
const savePath = join(temporaryDirectory, 'user-input.json');
const port = 4318;
const origin = `http://127.0.0.1:${port}`;
const child = spawn(process.execPath, [resolve(root, 'scripts/handoff-server.mjs')], {
  cwd: root,
  env: { ...process.env, HANDOFF_PORT: String(port), HANDOFF_NO_OPEN: '1', HANDOFF_SAVE_PATH: savePath },
  stdio: ['ignore', 'pipe', 'pipe']
});

async function waitForServer() {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(`${origin}/health`)).ok) return; } catch { /* starting */ }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 50));
  }
  throw new Error('Handoff test server did not start.');
}

try {
  await waitForServer();
  const bootstrap = await fetch(`${origin}/api/bootstrap`).then((response) => response.json());
  if (!Array.isArray(bootstrap.progress?.workstreams) || !bootstrap.agentTasks?.length || !bootstrap.humanTasks?.length) throw new Error('Bootstrap response is incomplete.');
  const dashboard = await fetch(origin).then((response) => response.text());
  if (!dashboard.includes('Approved umbrella identity') || !dashboard.includes('Tiny Signal Club') || !dashboard.includes('Combined vote')) throw new Error('Naming decision record is missing.');
  if (!dashboard.includes('Domain options and purchase gate') || !dashboard.includes('tinysignal.club') || !dashboard.includes('$9.08') || !dashboard.includes('Cloudflare')) throw new Error('Domain comparison is missing.');
  if (!dashboard.includes('Identity 02 · Tiny / Big') || !dashboard.includes('A logo built from the actual name') || !dashboard.includes('/showcase/brand/identity/ident.html')) throw new Error('Tiny / Big identity workbench is missing.');
  if (!dashboard.includes('class="brand-logo"') || !dashboard.includes('/showcase/brand/svg/logo-wordmark-dark.svg') || !dashboard.includes('ONE CREATOR SIGNAL') || !dashboard.includes('LAUNCH<br>STUDIO')) throw new Error('Tiny / Big branding is not applied to the local dashboard shell.');
  if ((dashboard.match(/data-overlay-replay/g) || []).length !== 2 || !dashboard.includes('/showcase/overlays/intro.html?motion=full') || !dashboard.includes('/showcase/overlays/outro.html?motion=full') || (dashboard.match(/Open \+ audio/g) || []).length !== 2) throw new Error('Playable intro/outro previews or audio launch links are missing.');
  if (dashboard.includes('class="brand-icon"') || dashboard.includes('Corner Seat · Classic')) throw new Error('Rejected branding remains in the local dashboard shell or feedback form.');
  if (dashboard.includes('role="tablist"') || dashboard.includes('data-brand-tab')) throw new Error('Rejected shape variants must not remain primary workbench tabs.');
  if (!dashboard.includes('finalists.html') || !dashboard.includes('Open prior audit')) throw new Error('Prior identity audit link is missing.');
  if (!dashboard.includes('/showcase/cursor-explorations/_archive/README.md') || !dashboard.includes('Archive index')) throw new Error('Archive note is missing.');
  if (dashboard.includes('data-brand-tab="type-bite"') || dashboard.includes('data-brand-tab="inset-void"') || dashboard.includes('data-brand-tab="proof-stack"')) throw new Error('Archived brand tabs should not remain in the workbench.');
  const [logo, hero, intro, wildcard, identityReset, cursorPrompts, cornerSeat, signalSeat, clubBench, clubPeriod, archiveReadme, specimen, finalists, tinyScaleRemade, tinyScaleMark, tinyScaleReadme, openChannelIdentity, openChannelIdent, openChannelMark, openChannelMono, brandGuide] = await Promise.all([
    fetch(`${origin}/showcase/brand/svg/logo-wordmark-dark.svg`),
    fetch(`${origin}/showcase/brand/raster/hero-town.png`),
    fetch(`${origin}/showcase/overlays/intro.html?motion=reduced`),
    fetch(`${origin}/showcase/overlays/wildcard-lab.html?mode=mark`),
    fetch(`${origin}/showcase/brand-docs/IDENTITY-RESET.md`),
    fetch(`${origin}/showcase/brand-docs/CURSOR-BRAND-PROMPTS.md`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/corner-seat/motion.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/signal-seat/motion.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/club-bench/motion.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/club-period/motion.html`),
    fetch(`${origin}/showcase/cursor-explorations/_archive/README.md`),
    fetch(`${origin}/showcase/cursor-explorations/specimen.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/finalists.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/tiny-scale-remade/motion.html`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/tiny-scale-remade/mark.svg`),
    fetch(`${origin}/showcase/cursor-explorations/tiny-scale-versions/tiny-scale-remade/README.md`),
    fetch(`${origin}/showcase/brand/identity/index.html`),
    fetch(`${origin}/showcase/brand/identity/ident.html`),
    fetch(`${origin}/showcase/brand/svg/logo-icon-dark.svg`),
    fetch(`${origin}/showcase/brand/svg/logo-icon-mono.svg`),
    fetch(`${origin}/showcase/brand/BRAND-GUIDE.md`)
  ]);
  if (!logo.ok || !logo.headers.get('content-type')?.includes('svg')) throw new Error('Brand logo is not served safely.');
  if (!hero.ok || !hero.headers.get('content-type')?.includes('png')) throw new Error('Brand hero is not served safely.');
  if (!intro.ok || intro.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Animation preview is not same-origin frameable.');
  if (!wildcard.ok || wildcard.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Wildcard preview is not same-origin frameable.');
  if (!identityReset.ok || !identityReset.headers.get('content-type')?.includes('markdown')) throw new Error('Identity reset reasoning is not served safely.');
  if (!cursorPrompts.ok || !cursorPrompts.headers.get('content-type')?.includes('markdown')) throw new Error('Cursor brand prompt pack is not served safely.');
  if (!cornerSeat.ok || cornerSeat.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Corner Seat preview is not same-origin frameable.');
  if (!signalSeat.ok || signalSeat.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Signal Seat preview is not same-origin frameable.');
  if (!clubBench.ok || clubBench.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Club Bench preview is not same-origin frameable.');
  if (!clubPeriod.ok || clubPeriod.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Club Period preview is not same-origin frameable.');
  if (!(await cornerSeat.text()).includes('_motion-engine.js')) throw new Error('Corner Seat must use continuous motion engine.');
  if (!(await signalSeat.text()).includes('_motion-engine.js')) throw new Error('Signal Seat must use continuous motion engine.');
  if (!archiveReadme.ok || !archiveReadme.headers.get('content-type')?.includes('markdown')) throw new Error('Archive README is not served safely.');
  if (!specimen.ok || !specimen.headers.get('content-type')?.includes('html')) throw new Error('Specimen sheet is not served.');
  if (!finalists.ok || !finalists.headers.get('content-type')?.includes('html')) throw new Error('Finalists comparison page is not served.');
  if (!(await finalists.text()).includes('finalists.css')) throw new Error('Finalists page must use an external stylesheet (CSP blocks inline CSS).');
  if (!tinyScaleRemade.ok || tinyScaleRemade.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Remade Tiny Scale preview is not same-origin frameable.');
  if (!(await tinyScaleRemade.text()).includes('_motion-engine.js')) throw new Error('Remade Tiny Scale must use the continuous motion engine.');
  if (!tinyScaleMark.ok || !tinyScaleMark.headers.get('content-type')?.includes('svg')) throw new Error('Remade Tiny Scale avatar mark is not served safely.');
  if (!tinyScaleReadme.ok || !tinyScaleReadme.headers.get('content-type')?.includes('markdown')) throw new Error('Remade Tiny Scale reasoning is not served safely.');
  if (!openChannelIdentity.ok || !openChannelIdentity.headers.get('content-type')?.includes('html')) throw new Error('Tiny / Big identity specimen is not served.');
  if (!openChannelIdent.ok || openChannelIdent.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Tiny / Big ident is not same-origin frameable.');
  if (!openChannelMark.ok || !openChannelMark.headers.get('content-type')?.includes('svg')) throw new Error('Scale monogram is not served safely.');
  if (!openChannelMono.ok || !openChannelMono.headers.get('content-type')?.includes('svg')) throw new Error('Scale monogram monochrome asset is not served safely.');
  if (!brandGuide.ok || !brandGuide.headers.get('content-type')?.includes('markdown')) throw new Error('Tiny / Big brand guide is not served safely.');
  // Archived assets must still resolve for history links
  const archived = await fetch(`${origin}/showcase/cursor-explorations/_archive/margin-note/mark.svg`);
  if (!archived.ok) throw new Error('Archived exploration assets are not served.');
  // Old live paths must 404 cleanly without crashing the server
  const movedAway = await fetch(`${origin}/showcase/cursor-explorations/margin-note/motion.html`);
  if (movedAway.status !== 404) throw new Error(`Moved exploration should 404, got ${movedAway.status}`);
  const stillHealthy = await fetch(`${origin}/health`);
  if (!stillHealthy.ok) throw new Error('Handoff server unhealthy after missing showcase asset.');

  const accepted = await fetch(`${origin}/api/handoff`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, fields: { naming: { selectedCandidate: 'Tiny Signal Club', finalChoice: true }, identity: { brandGoogleEmail: 'qa@example.com' }, domain: { quotedChoice: 'tinysignalclub.com', readyForExactQuote: true } } })
  });
  if (!accepted.ok) throw new Error(`Valid handoff rejected: ${accepted.status}`);
  const saved = JSON.parse(await readFile(savePath, 'utf8'));
  if (saved.fields.naming.selectedCandidate !== 'Tiny Signal Club' || saved.fields.identity.brandGoogleEmail !== 'qa@example.com' || saved.fields.domain.quotedChoice !== 'tinysignalclub.com' || saved.source !== 'local-launch-handoff') throw new Error('Saved handoff does not match input.');

  const rejected = await fetch(`${origin}/api/handoff`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, fields: { launch: { notes: 'password: must-not-save' } } })
  });
  if (rejected.status !== 422) throw new Error(`Sensitive handoff was not rejected: ${rejected.status}`);
  const preserved = JSON.parse(await readFile(savePath, 'utf8'));
  if (preserved.fields.identity.brandGoogleEmail !== 'qa@example.com') throw new Error('Rejected handoff overwrote valid state.');
  console.log('Handoff bootstrap, atomic save, persistence, and sensitive-value rejection passed.');
} finally {
  child.kill('SIGTERM');
  await rm(temporaryDirectory, { recursive: true, force: true });
}
