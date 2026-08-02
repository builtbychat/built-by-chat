import { chromium } from '@playwright/test';

const origin = (process.argv[2] ?? 'https://built-by-chat.vercel.app').replace(/\/$/, '');
const routes = ['/', '/demo', '/live', '/town', '/roadmap', '/making', '/playbook', '/future', '/credits', '/feedback', '/support', '/privacy', '/terms'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
const failures = [];
let passedRoutes = 0;
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console ${message.text()}`); });
page.on('pageerror', (error) => errors.push(`page ${error.message}`));
try {
  for (const route of routes) {
    try {
      const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });
      if (!response?.ok()) throw new Error(`HTTP ${response?.status() ?? 'no response'}`);
      const heading = (await page.locator('h1').first().textContent({ timeout: 5_000 }))?.trim();
      if (!heading) throw new Error('missing rendered h1');
      const headers = await response.allHeaders();
      if (!headers['content-security-policy']?.includes("default-src 'self'")) throw new Error('missing CSP');
      if (headers['x-content-type-options'] !== 'nosniff') throw new Error('missing nosniff');
      console.log(`✓ ${route} ${response.status()} · ${heading}`);
      passedRoutes += 1;
    } catch (error) {
      const detail = error instanceof Error ? error.message.split('\n')[0] : 'unknown failure';
      failures.push(`${route}: ${detail}`);
      console.error(`✗ ${route} · ${detail}`);
    }
  }
  const studioBoundary = await page.request.get(`${origin}/studio/api/prompts/runs`);
  if (studioBoundary.status() !== 401) failures.push(`/studio/api boundary: expected 401, received ${studioBoundary.status()}`);
  else console.log('✓ /studio/api 401 · Access identity required');
  if (errors.length) failures.push(`Browser errors:\n${errors.join('\n')}`);
  if (failures.length) throw new Error(`Preview verification failed (${passedRoutes}/${routes.length} route checks passed):\n${failures.join('\n')}`);
  console.log(`✓ ${routes.length}/${routes.length} public routes, security headers present, 0 browser errors`);
} finally {
  await browser.close();
}
