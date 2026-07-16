import { spawnSync } from 'node:child_process';
const apply=process.argv.includes('--apply'); const environment=process.argv.includes('--production')?'production':'staging';
const commands=[['npx',['wrangler','d1','create',`built-by-chat${environment==='staging'?'-staging':''}`]],['npx',['wrangler','d1','migrations','apply','built-by-chat','--remote','--env',environment]]];
console.log(`Cloudflare ${environment} provisioning plan:`);for(const [cmd,args] of commands)console.log(`  ${cmd} ${args.join(' ')}`);
if(!apply){console.log('Dry plan only. Re-run with --apply after explicit external-mutation approval.');process.exit(0)}
if(process.env.CONFIRM_EXTERNAL_MUTATIONS!=='YES'){throw new Error('Set CONFIRM_EXTERNAL_MUTATIONS=YES only after explicit approval.')}
for(const [cmd,args] of commands){const result=spawnSync(cmd,args,{stdio:'inherit'});if(result.status!==0)process.exit(result.status??1)}
