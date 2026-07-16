import { access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const checks = [];
function command(name, args=['--version']) { const normalized=Array.isArray(args)?args:[args]; const r=spawnSync(name,normalized,{encoding:'utf8'}); const output=typeof r.stdout==='string'?r.stdout:typeof r.stderr==='string'?r.stderr:''; checks.push({name,ok:r.status===0,detail:output.trim().split('\n')[0]||'not found'}); }
command('node'); command('npm'); command('git'); command('ffmpeg'); command('ffprobe'); command('obs','--version');
for (const file of ['package.json','apps/web/wrangler.jsonc','migrations/0001_initial.sql','brand/svg/logo-icon-dark.svg']) { try { await access(new URL(`../${file}`,import.meta.url)); checks.push({name:file,ok:true,detail:'present'}); } catch { checks.push({name:file,ok:false,detail:'missing'}); } }
for (const secret of ['CLOUDFLARE_API_TOKEN','TURNSTILE_SECRET','IDENTITY_SIGNING_SECRET','NETWORK_HASH_SECRET']) checks.push({name:secret,ok:Boolean(process.env[secret]),detail:process.env[secret]?'present (value hidden)':'not set'});
console.table(checks); process.exitCode=checks.some(c=>!c.ok&&!c.name.includes('SECRET')&&c.name!=='CLOUDFLARE_API_TOKEN'&&c.name!=='obs')?1:0;
