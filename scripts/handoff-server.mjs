import { createServer } from 'node:http';
import { readFile, mkdir, rename, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const publicDir = resolve(root, 'tools/handoff');
const savePath = process.env.HANDOFF_SAVE_PATH ? resolve(process.env.HANDOFF_SAVE_PATH) : resolve(root, 'private/handoff/user-input.json');
const saveDir = dirname(savePath);
const progressPath = resolve(root, 'docs/launch/PROGRESS.json');
const host = '127.0.0.1';
const port = Number(process.env.HANDOFF_PORT || 4317);
const maxBodyBytes = 256 * 1024;

const staticFiles = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/style.css', ['style.css', 'text/css; charset=utf-8']]
]);

const agentTasks = [
  'After the final name is saved, rerun exact domain and logged-in handle checks and produce a rename manifest before changing anything.',
  'Prepare the repository-only rename branch, preserving stable infrastructure identifiers until replacement deployments pass.',
  'Turn the saved viewer defaults into first-time orientation, catch-up cues, readable vote timing, and consistent platform copy.',
  'Build the private host cockpit around one clock, one cue list, health signals, markers, and rehearsed emergency actions.',
  'Run and record the prompt-failure and injection rehearsal with the approved operator workflow.',
  'Research exact domain offers and show vendor, first-year total, tax if known, billing period, and renewal before any purchase.',
  'Configure Cloudflare Access after the allowed email addresses are supplied.',
  'Configure production Turnstile after the final hostname is owned; staging keeps official test keys.',
  'Configure email routing and transactional acknowledgements after the domain and destination inbox exist.',
  'Prepare account biographies, banners, descriptions, schedules, commands, and moderation copy for each platform.',
  'Finish cost-alert configuration after providers and notification destinations are selected.',
  'Keep CI, staging, backups, prompt history, patch notes, and launch documentation current.',
  'Prepare production deployment and launch drafts, stopping for explicit approval before deploy or publication.'
];

const humanTasks = [
  'Choose the umbrella display name, plain handle, Phaenex pronunciation, and tagline in section 01.',
  'Approve or reject the repository-only rename; account claims and purchases stay separate checkpoints.',
  'Save honest workload limits, control preferences, and physical fallback availability in sections 09–12.',
  'Confirm a primary moderator and backup, then participate in the short escalation and recovery rehearsal.',
  'Confirm “Require two-factor authentication” remains enabled in the current or renamed GitHub organization.',
  'Add a trusted reviewer so protected pull requests can receive the required independent approval.',
  'Create the brand Google account and complete its recovery email, CAPTCHA, terms, and 2FA screens.',
  'Review the exact domain quote; explicitly approve or reject it. No purchase occurs from this form alone.',
  'Complete OTP/CAPTCHA/terms checkpoints for YouTube, Twitch, Discord, and social accounts.',
  'Import the OBS collection, confirm camera/microphone/audio tracks, and install or confirm Aitum Multistream.',
  'Run the 20-minute recording, failure drills, and unlisted YouTube/Twitch simulcast rehearsal.',
  'Approve production deployment, platform schedules, public announcements, and going live.'
];

function headers(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  };
}

function sendJson(response, status, value) {
  response.writeHead(status, headers());
  response.end(JSON.stringify(value));
}

async function existingHandoff() {
  try { return JSON.parse(await readFile(savePath, 'utf8')); }
  catch (error) { if (error?.code === 'ENOENT') return null; throw error; }
}

function containsSensitiveValue(value) {
  const text = JSON.stringify(value);
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
    /\b(?:ghp_|github_pat_|sk-)[A-Za-z0-9_-]{20,}\b/,
    /\bAKIA[0-9A-Z]{16}\b/,
    /\b(?:password|passcode|stream[ _-]?key|recovery[ _-]?code|api[ _-]?token|api[ _-]?key)\s*[:=]\s*\S+/i,
    /"(?:otp|oneTimeCode|recoveryCode|password|token|secret|streamKey)"\s*:\s*"[^"]+"/i
  ];
  return patterns.some((pattern) => pattern.test(text));
}

async function readBody(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBodyBytes) throw new Error('too_large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', `http://${request.headers.host || `${host}:${port}`}`);
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) return sendJson(response, 403, { error: 'localhost_only' });

    if (request.method === 'GET' && url.pathname === '/api/bootstrap') {
      const [progress, handoff] = await Promise.all([
        readFile(progressPath, 'utf8').then(JSON.parse),
        existingHandoff()
      ]);
      return sendJson(response, 200, { progress, handoff, agentTasks, humanTasks, savePath });
    }

    if (request.method === 'POST' && url.pathname === '/api/handoff') {
      const contentType = request.headers['content-type'] || '';
      if (!contentType.startsWith('application/json')) return sendJson(response, 415, { error: 'json_required' });
      const body = JSON.parse(await readBody(request));
      if (!body || body.version !== 1 || typeof body.fields !== 'object' || Array.isArray(body.fields)) return sendJson(response, 400, { error: 'invalid_handoff' });
      if (containsSensitiveValue(body)) return sendJson(response, 422, { error: 'sensitive_value_detected', message: 'Remove passwords, OTPs, recovery codes, keys, secrets, and tokens before saving.' });
      const saved = { ...body, savedAt: new Date().toISOString(), source: 'local-launch-handoff' };
      await mkdir(saveDir, { recursive: true });
      const temporaryPath = `${savePath}.tmp`;
      await writeFile(temporaryPath, `${JSON.stringify(saved, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
      await rename(temporaryPath, savePath);
      return sendJson(response, 200, { ok: true, savedAt: saved.savedAt, savePath });
    }

    if (request.method === 'GET' && url.pathname === '/health') return sendJson(response, 200, { ok: true });

    const staticEntry = staticFiles.get(url.pathname);
    if (request.method === 'GET' && staticEntry) {
      const [file, contentType] = staticEntry;
      response.writeHead(200, headers(contentType));
      response.end(await readFile(resolve(publicDir, file)));
      return;
    }
    sendJson(response, 404, { error: 'not_found' });
  } catch (error) {
    const status = error?.message === 'too_large' ? 413 : error instanceof SyntaxError ? 400 : 500;
    sendJson(response, status, { error: status === 500 ? 'server_error' : error.message });
  }
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}`;
  console.log(`Built by Chat handoff dashboard: ${url}`);
  console.log(`Private save file: ${savePath}`);
  console.log('Press Ctrl+C to stop.');
  if (process.platform === 'darwin' && process.env.HANDOFF_NO_OPEN !== '1') {
    const child = spawn('open', [url], { stdio: 'ignore', detached: true });
    child.unref();
  }
});
