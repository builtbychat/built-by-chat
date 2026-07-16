import { chromium } from '@playwright/test';

const origin = (process.argv[2] ?? 'https://built-by-chat.vercel.app').replace(/\/$/, '');
const routes = ['/', '/live', '/town', '/roadmap', '/credits', '/feedback', '/support', '/privacy', '/terms'];
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', (message) => { if (message.type() === 'error') errors.push(`console ${message.text()}`); });
page.on('pageerror', (error) => errors.push(`page ${error.message}`));
try {
  for (const route of routes) {
    const response = await page.goto(`${origin}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });
    if (!response?.ok()) throw new Error(`${route}: HTTP ${response?.status() ?? 'no response'}`);
    const heading = (await page.locator('h1').first().textContent())?.trim();
    if (!heading) throw new Error(`${route}: missing rendered h1`);
    const headers = await response.allHeaders();
    if (!headers['content-security-policy']?.includes("default-src 'self'")) throw new Error(`${route}: missing CSP`);
    if (headers['x-content-type-options'] !== 'nosniff') throw new Error(`${route}: missing nosniff`);
    console.log(`✓ ${route} ${response.status()} · ${heading}`);
  }
  const studioBoundary = await page.request.get(`${origin}/studio/api/prompts/runs`);
  if (studioBoundary.status() !== 401) throw new Error(`/studio/api boundary: expected 401, received ${studioBoundary.status()}`);
  console.log('✓ /studio/api 401 · Access identity required');
  if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);
  console.log(`✓ ${routes.length}/${routes.length} public routes, security headers present, 0 browser errors`);
} finally {
  await browser.close();
}
