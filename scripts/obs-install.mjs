import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const obsRoot = '/Users/damato/Library/Application Support/obs-studio';
const portablePath = resolve(root, 'obs/tiny-signal-club-scenes.json');
const install = process.argv.includes('--install');
const force = process.argv.includes('--force');
const scenePath = resolve(obsRoot, 'basic/scenes/Tiny Signal Club.json');
const profilePath = resolve(obsRoot, 'basic/profiles/Tiny Signal Club/basic.ini');
const canvasUuid = '6c69626f-6273-4c00-9d88-c5136d61696e';
const uuid = (name) => { const hex=createHash('sha256').update(`tiny-signal-club:${name}`).digest('hex').slice(0,32); return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`; };
const sceneNames = ['Starting Soon','Welcome / Previously On','Live Build','Full-Screen Code','Town Tour','Active Vote','Results','Break','Ending / Next Stream'];
const overlayFiles = { 'Starting Soon':'intro.html', 'Welcome / Previously On':'lower-third.html', 'Active Vote':'vote.html', Results:'vote.html', Break:'lower-third.html', 'Ending / Next Stream':'outro.html' };
const query = { 'Starting Soon':'?audio=1&volume=.22&episode=Episode%2001%20%C2%B7%20Founding%20Day', 'Welcome / Previously On':'?label=TINY%20SIGNAL%20CLUB', 'Active Vote':'?showId=show-001', Results:'?showId=show-001', Break:'?label=BACK%20IN%205%20MINUTES', 'Ending / Next Stream':'?audio=1&volume=.18&duration=18&event=The%20Modem%20Picnic&date=Sunday%20%C2%B7%203%3A00%20PM%20CT' };

function baseSource(name,id,settings,mixers=0) { return { prev_ver:536936450,name,uuid:uuid(name),id,versioned_id:id,settings,mixers,sync:0,flags:0,volume:1,balance:.5,enabled:true,muted:false,'push-to-mute':false,'push-to-mute-delay':0,'push-to-talk':false,'push-to-talk-delay':0,hotkeys:{},deinterlace_mode:0,deinterlace_field_order:0,monitoring_type:0,private_settings:{} }; }
function overlaySource(sceneName, local) {
  const name=`${sceneName} Overlay`; const file=overlayFiles[sceneName]; const suffix=query[sceneName]??'';
  const settings = local ? { url:`${pathToFileURL(resolve(root,`apps/web/public/overlays/${file}`)).href}${suffix}`,width:1920,height:1080,fps:30,restart_when_active:sceneName.includes('Starting')||sceneName.includes('Ending'),shutdown:sceneName.includes('Starting')||sceneName.includes('Ending') } : { url:`https://YOUR_VERIFIED_HOST/overlays/${file}${suffix}`,width:1920,height:1080,fps:30,restart_when_active:false,shutdown:false };
  return baseSource(name,'browser_source',settings);
}
function sceneSource(name, itemSource) {
  const settings={id_counter:itemSource?1:0,custom_size:false,items:itemSource?[{name:itemSource.name,source_uuid:itemSource.uuid,visible:true,locked:true,rot:0,scale_ref:{x:1920,y:1080},align:5,bounds_type:2,bounds_align:0,bounds_crop:false,crop_left:0,crop_top:0,crop_right:0,crop_bottom:0,id:1,group_item_backup:false,pos:{x:0,y:0},scale:{x:1,y:1},bounds:{x:1920,y:1080},scale_filter:'disable',blend_method:'default',blend_type:'normal',show_transition:{duration:300},hide_transition:{duration:300},private_settings:{}}]:[]};
  const source=baseSource(name,'scene',settings); source.canvas_uuid=canvasUuid; source.hotkeys={'OBSBasic.SelectScene':[]}; return source;
}
function collection(local=false) {
  const overlays=sceneNames.filter(name=>overlayFiles[name]).map(name=>overlaySource(name,local));
  const scenes=sceneNames.map(name=>sceneSource(name,overlays.find(source=>source.name===`${name} Overlay`)));
  return {name:'Tiny Signal Club',sources:[...overlays,...scenes],groups:[],scene_order:sceneNames.map(name=>({name})),current_scene:'Starting Soon',current_program_scene:'Starting Soon',canvases:[],current_transition:'Fade',transition_duration:300,transitions:[],quick_transitions:[{name:'Cut',duration:300,hotkeys:[],id:1,fade_to_black:false},{name:'Fade',duration:300,hotkeys:[],id:2,fade_to_black:false}],saved_projectors:[],preview_locked:false,scaling_enabled:false,scaling_level:0,scaling_off_x:0,scaling_off_y:0,'virtual-camera':{type2:3},modules:{},resolution:{x:1920,y:1080},version:2};
}
async function atomicWrite(path, content) { await mkdir(dirname(path),{recursive:true}); const temp=`${path}.tmp`; await writeFile(temp,content,'utf8'); await rename(temp,path); }
const portable=`${JSON.stringify(collection(false),null,2)}\n`;
await writeFile(portablePath,portable,'utf8');
if (!install) { console.log(`Prepared sanitized collection: ${portablePath}`); console.log('Use --install for a non-destructive local OBS collection and profile.'); process.exit(0); }
for (const path of [scenePath,profilePath]) { try { await readFile(path); if(!force) throw new Error(`Refusing to overwrite ${path}; use --force after reviewing it.`); } catch(error) { if(error?.code!=='ENOENT' && !String(error?.message).startsWith('Refusing')) throw error; if(String(error?.message).startsWith('Refusing')) throw error; } }
await atomicWrite(scenePath,`${JSON.stringify(collection(true),null,2)}\n`);
await atomicWrite(profilePath,`[General]\nName=Tiny Signal Club\n\n[Output]\nMode=Simple\nFilenameFormatting=tsc_%CCYY-%MM-%DD_%hh-%mm-%ss\nReconnect=true\nRetryDelay=2\nMaxRetries=25\n\n[SimpleOutput]\nFilePath=${resolve(root,'recordings')}\nRecFormat2=mkv\nVBitrate=6000\nABitrate=160\nRecQuality=Small\nStreamEncoder=x264\nRecEncoder=apple_h264\nRecTracks=1\n\n[Video]\nBaseCX=1920\nBaseCY=1080\nOutputCX=1920\nOutputCY=1080\nFPSType=0\nFPSCommon=30\nScaleType=bicubic\nColorFormat=NV12\nColorSpace=709\nColorRange=Partial\nAutoRemux=true\n\n[Audio]\nSampleRate=48000\nChannelSetup=Stereo\n`);
await mkdir(resolve(root,'recordings'),{recursive:true});
console.log(`Installed new OBS scene collection: ${scenePath}`); console.log(`Installed new OBS profile: ${profilePath}`); console.log('Existing Untitled scene collection/profile and all service credentials were untouched.');
