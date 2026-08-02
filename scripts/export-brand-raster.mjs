import { createServer } from 'node:http';
import { mkdir, readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '..');
const brandRoot = resolve(root, 'brand');
const outputRoot = resolve(brandRoot, 'raster', 'exports');
const jobs = [
  ['templates/discord-icon.svg', 'scale-monogram-avatar-512.png', 512, 512],
  ['templates/youtube-banner.svg', 'youtube-banner-2560x1440.png', 2560, 1440],
  ['templates/twitch-banner.svg', 'twitch-banner-1200x480.png', 1200, 480],
  ['templates/github-social-preview.svg', 'github-social-preview-1280x640.png', 1280, 640],
  ['templates/stream-offline.svg', 'stream-offline-1920x1080.png', 1920, 1080],
  ['templates/thumbnail.svg', 'thumbnail-1280x720.png', 1280, 720],
  ['templates/sponsor-deck-cover.svg', 'sponsor-deck-cover-1920x1080.png', 1920, 1080],
  ['templates/twitch-panel-about.svg', 'twitch-panel-about-320x160.png', 320, 160],
  ['templates/twitch-panel-schedule.svg', 'twitch-panel-schedule-320x160.png', 320, 160],
  ['templates/twitch-panel-support.svg', 'twitch-panel-support-320x160.png', 320, 160],
  ['templates/twitch-panel-sponsors.svg', 'twitch-panel-sponsors-320x160.png', 320, 160]
];

const types = { '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://127.0.0.1').pathname).replace(/^\//, '');
    const candidate = resolve(brandRoot, pathname);
    if (!candidate.startsWith(`${brandRoot}/`)) throw new Error('invalid path');
    const data = await readFile(candidate);
    response.writeHead(200, { 'Content-Type': types[extname(candidate)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(data);
  } catch {
    response.writeHead(404).end();
  }
});

await mkdir(outputRoot, { recursive: true });
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Could not allocate local export port.');
const origin = `http://127.0.0.1:${address.port}`;
const browser = await chromium.launch({ headless: true });

try {
  for (const [source, output, width, height] of jobs) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(`${origin}/${source}`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: resolve(outputRoot, output), clip: { x: 0, y: 0, width, height } });
    await page.close();
    console.log(`✓ ${output} ${width}×${height}`);
  }
} finally {
  await browser.close();
  await new Promise((resolveClose, rejectClose) => server.close((error) => error ? rejectClose(error) : resolveClose()));
}
