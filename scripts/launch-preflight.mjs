import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const config = JSON.parse(await readFile(resolve(root, 'apps/web/wrangler.jsonc'), 'utf8'));
const environment = process.argv.includes('--staging') ? 'staging' : 'production';
const target = config.env?.[environment];
if (!target) throw new Error(`Missing Wrangler environment: ${environment}`);
const vars = target.vars ?? {};
const d1 = target.d1_databases?.find((binding) => binding.binding === 'DB');
const failures = [];
const requireValue = (condition, message) => { if (!condition) failures.push(message); };
requireValue(/^https:\/\//.test(vars.PUBLIC_ORIGIN ?? '') && !String(vars.PUBLIC_ORIGIN).includes('.invalid'), 'PUBLIC_ORIGIN must be the reviewed HTTPS hostname.');
requireValue(/^https:\/\/[a-z0-9-]+\.cloudflareaccess\.com$/.test(vars.ACCESS_TEAM_DOMAIN ?? ''), 'ACCESS_TEAM_DOMAIN must be the real Cloudflare Access team URL.');
requireValue(typeof vars.ACCESS_AUD === 'string' && vars.ACCESS_AUD.length >= 16 && !vars.ACCESS_AUD.includes('replace-before'), 'ACCESS_AUD must be the real application audience tag.');
if (environment === 'production') requireValue(vars.TURNSTILE_SITE_KEY !== '1x00000000000000000000AA', 'Production must not use the public Turnstile test site key.');
requireValue(/^[a-f0-9]{32}$/.test(target.account_id ?? ''), 'Cloudflare account ID is missing or malformed.');
requireValue(/^[a-f0-9-]{36}$/.test(d1?.database_id ?? ''), 'D1 database binding is missing or malformed.');
requireValue(target.observability?.enabled ?? config.observability?.enabled, 'Worker observability must be enabled.');

console.log(`${environment} launch configuration preflight:`);
if (failures.length) for (const failure of failures) console.log(`BLOCKED · ${failure}`);
else console.log('PASS · Non-secret launch configuration is complete. Continue with secret-presence, OTP, migration, backup, and owner-approval gates.');
if (failures.length && !process.argv.includes('--report')) process.exitCode = 1;
