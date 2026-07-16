import { access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const checks = [];
function command(name, args=['--version'], label=name) { const normalized=Array.isArray(args)?args:[args]; const r=spawnSync(name,normalized,{encoding:'utf8'}); const output=typeof r.stdout==='string'&&r.stdout.trim()?r.stdout:typeof r.stderr==='string'?r.stderr:''; checks.push({name:label,ok:r.status===0,detail:output.trim().split('\n')[0]||'not found'}); }
command('node'); command('npm'); command('git'); command('ffmpeg','-version'); command('ffprobe','-version'); command('/Applications/OBS.app/Contents/MacOS/OBS','--version','OBS');
try { await access('/Users/damato/Library/Application Support/obs-studio/basic/scenes/Tiny Signal Club.json'); checks.push({name:'OBS Tiny Signal Club collection',ok:true,detail:'installed'}); } catch { checks.push({name:'OBS Tiny Signal Club collection',ok:false,detail:'not installed'}); }
try { await access('/Users/damato/Library/Application Support/obs-studio/plugins/aitum-multistream.plugin'); checks.push({name:'Aitum Multistream',ok:true,detail:'1.0.8 signed user plugin installed; outputs not configured'}); } catch { checks.push({name:'Aitum Multistream',ok:false,detail:'not detected; attended install required'}); }
for (const file of ['package.json','apps/web/wrangler.jsonc','migrations/0001_initial.sql','brand/svg/logo-icon-dark.svg']) { try { await access(new URL(`../${file}`,import.meta.url)); checks.push({name:file,ok:true,detail:'present'}); } catch { checks.push({name:file,ok:false,detail:'missing'}); } }
for (const secret of ['CLOUDFLARE_API_TOKEN','TURNSTILE_SECRET','IDENTITY_SIGNING_SECRET','NETWORK_HASH_SECRET']) checks.push({name:secret,ok:Boolean(process.env[secret]),detail:process.env[secret]?'present (value hidden)':'not set'});
console.table(checks); process.exitCode=checks.some(c=>!c.ok&&!c.name.includes('SECRET')&&c.name!=='CLOUDFLARE_API_TOKEN'&&c.name!=='Aitum Multistream')?1:0;
