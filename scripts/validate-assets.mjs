import { createHash } from 'node:crypto';
import { readFile, access } from 'node:fs/promises';
const root=new URL('../',import.meta.url); const files=['brand/svg/logo-icon-dark.svg','brand/svg/logo-icon-light.svg','brand/svg/logo-icon-mono.svg','brand/svg/logo-wordmark-dark.svg','brand/svg/logo-wordmark-light.svg','brand/svg/logo-wordmark-mono.svg','brand/svg/favicon.svg','brand/identity/index.html','brand/identity/identity.css','brand/identity/palette.css','brand/identity/applications.css','brand/identity/identity.js','brand/identity/ident.html','brand/identity/ident.css','brand/identity/ident.js','brand/BRAND-GUIDE.md','brand/raster/hero-town.png','brand/templates/youtube-banner.svg','brand/templates/twitch-banner.svg','brand/templates/twitch-panel-about.svg','brand/templates/twitch-panel-schedule.svg','brand/templates/twitch-panel-support.svg','brand/templates/twitch-panel-sponsors.svg','brand/templates/discord-icon.svg','brand/templates/github-social-preview.svg','brand/templates/stream-offline.svg','brand/templates/thumbnail.svg','brand/templates/sponsor-deck-cover.svg','obs/overlays/intro.html','obs/overlays/outro.html','obs/overlays/open-channel.css','obs/overlays/motion.css','obs/overlays/motion.js','obs/overlays/lower-third.html','obs/overlays/lower-third.css','obs/overlays/lower-third.js','obs/overlays/vote.html','obs/overlays/vote.css','obs/overlays/vote-progress.css','obs/overlays/vote.js','obs/overlays/AUDIO-CREDITS.md'];
for(const file of files){await access(new URL(file,root)); console.log(`✓ ${file}`)}
const png=await readFile(new URL('brand/raster/hero-town.png',root)); if(png.readUInt32BE(16)<1200||png.readUInt32BE(20)<700)throw new Error('Hero image is below minimum dimensions');
const rasterExports={
  'brand/raster/exports/scale-monogram-avatar-512.png':[512,512],
  'brand/raster/exports/youtube-banner-2560x1440.png':[2560,1440],
  'brand/raster/exports/twitch-banner-1200x480.png':[1200,480],
  'brand/raster/exports/github-social-preview-1280x640.png':[1280,640],
  'brand/raster/exports/stream-offline-1920x1080.png':[1920,1080],
  'brand/raster/exports/thumbnail-1280x720.png':[1280,720],
  'brand/raster/exports/sponsor-deck-cover-1920x1080.png':[1920,1080]
};
for(const [file,[width,height]] of Object.entries(rasterExports)){const bytes=await readFile(new URL(file,root));if(bytes.readUInt32BE(16)!==width||bytes.readUInt32BE(20)!==height)throw new Error(`Wrong raster dimensions: ${file}`);console.log(`✓ ${file} ${width}×${height}`)}
for(const file of files.filter(f=>f.endsWith('.svg'))){const svg=await readFile(new URL(file,root),'utf8');if(/<script|javascript:/i.test(svg))throw new Error(`Unsafe SVG: ${file}`)}
const audioHashes={
  'obs/overlays/audio/city-loop.mp3':'9349982fb8e365167bc5c89f2ac50d3b5376b9f627d506ba30a9b26c8230597e',
  'obs/overlays/audio/completion-chime.mp3':'64598fb07a4fe6635ab3f5827515ea83a1b76d3b1afa4fc1d725ea7c8017c4ae'
};
for(const [file,expected] of Object.entries(audioHashes)){const bytes=await readFile(new URL(file,root));const actual=createHash('sha256').update(bytes).digest('hex');if(actual!==expected)throw new Error(`Audio provenance hash mismatch: ${file}`);console.log(`✓ ${file} provenance hash`)}
console.log('✓ hero dimensions, SVG safety, motion assets, and audio provenance checks');
