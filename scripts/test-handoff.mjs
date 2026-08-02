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
  if (!dashboard.includes('Previous brand and broadcast previews') || !dashboard.includes('ANIMATED INTRO') || !dashboard.includes('Project One hero')) throw new Error('Rejected brand comparison is missing.');
  if (!dashboard.includes('Playable motion studies') || !dashboard.includes('Patch Signal') || !dashboard.includes('data-motion-action="replay"')) throw new Error('Playable identity motion lab is missing.');
  if (!dashboard.includes('One idea, tested as a system') || !dashboard.includes('Open wildcard mark') || !dashboard.includes('Project architecture')) throw new Error('Round 03 wildcard system is missing.');
  const [logo, hero, intro, wildcard, identityReset, cursorPrompts] = await Promise.all([
    fetch(`${origin}/showcase/brand/svg/logo-wordmark-dark.svg`),
    fetch(`${origin}/showcase/brand/raster/hero-town.png`),
    fetch(`${origin}/showcase/overlays/intro.html?motion=reduced`),
    fetch(`${origin}/showcase/overlays/wildcard-lab.html?mode=mark`),
    fetch(`${origin}/showcase/brand-docs/IDENTITY-RESET.md`),
    fetch(`${origin}/showcase/brand-docs/CURSOR-BRAND-PROMPTS.md`)
  ]);
  if (!logo.ok || !logo.headers.get('content-type')?.includes('svg')) throw new Error('Brand logo is not served safely.');
  if (!hero.ok || !hero.headers.get('content-type')?.includes('png')) throw new Error('Brand hero is not served safely.');
  if (!intro.ok || intro.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Animation preview is not same-origin frameable.');
  if (!wildcard.ok || wildcard.headers.get('x-frame-options') !== 'SAMEORIGIN') throw new Error('Wildcard preview is not same-origin frameable.');
  if (!identityReset.ok || !identityReset.headers.get('content-type')?.includes('markdown')) throw new Error('Identity reset reasoning is not served safely.');
  if (!cursorPrompts.ok || !cursorPrompts.headers.get('content-type')?.includes('markdown')) throw new Error('Cursor brand prompt pack is not served safely.');

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
