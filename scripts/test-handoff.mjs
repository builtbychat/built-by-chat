import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const temporaryDirectory = await mkdtemp(join(tmpdir(), 'built-by-chat-handoff-'));
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

  const accepted = await fetch(`${origin}/api/handoff`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version: 1, fields: { identity: { brandGoogleEmail: 'qa@example.com' }, domain: { readyForExactQuote: true } } })
  });
  if (!accepted.ok) throw new Error(`Valid handoff rejected: ${accepted.status}`);
  const saved = JSON.parse(await readFile(savePath, 'utf8'));
  if (saved.fields.identity.brandGoogleEmail !== 'qa@example.com' || saved.source !== 'local-launch-handoff') throw new Error('Saved handoff does not match input.');

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
