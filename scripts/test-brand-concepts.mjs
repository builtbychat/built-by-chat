import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = (file) => readFile(resolve(root, file), 'utf8');
const icons = ['dark', 'light', 'mono'].map((theme) => `brand/svg/logo-icon-${theme}.svg`);
const wordmarks = ['dark', 'light', 'mono'].map((theme) => `brand/svg/logo-wordmark-${theme}.svg`);

for (const file of [...icons, ...wordmarks]) {
  const source = await read(file);
  if (source.includes('<text')) throw new Error(`${file}: logo must use exact outlined geometry, not live text`);
  if ((source.match(/<path\b/g) || []).length < 5) throw new Error(`${file}: outlined Bricolage letter geometry is incomplete`);
  if (/M181 58C164 38|stroke-width="38"|speech bubble/i.test(source)) throw new Error(`${file}: rejected Open Channel or speech-bubble geometry remains`);
}

for (const file of icons) {
  const source = await read(file);
  if (!source.includes('scale monogram') || !source.includes('Signal Club monogram')) throw new Error(`${file}: scale-monogram accessibility copy is missing`);
}

for (const file of wordmarks) {
  const source = await read(file);
  if (!source.includes('deliberately small') || !source.includes('<rect x="20" y="25"')) throw new Error(`${file}: Tiny / Big hierarchy is missing`);
}

const favicon = await read('brand/svg/favicon.svg');
if (!favicon.includes('rx="44"') || !favicon.includes('#3157ff') || !favicon.includes('#ff5b3d') || favicon.includes('<text')) throw new Error('Favicon is not the simplified outlined Tiny-T / SC mark.');

const identity = await read('brand/identity/index.html');
if (!identity.includes('Tiny is a scale rule.') || !identity.includes('REAL-WORLD SIZES') || /style="/i.test(identity)) throw new Error('Identity specimen is incomplete or violates the local CSP.');

const ident = await read('brand/identity/ident.html');
const identCss = await read('brand/identity/ident.css');
const identScript = await read('brand/identity/ident.js');
if (!ident.includes('ONE VIEWER SIGNAL') || !ident.includes('ADD A NIGHT MARKET') || !ident.includes('BUILT + TESTED') || !ident.includes('data-animated')) throw new Error('Animated ident does not show a real input becoming a verified result.');
if (!identCss.includes('infinite both') || !identCss.includes('body:not(.force-motion)') || !identCss.includes('body.reduced')) throw new Error('Animated ident must loop and preserve explicit full/reduced motion modes.');
if (!identScript.includes("channel !== 'tiny-signal-ident'") || !identScript.includes('event.origin !== location.origin') || !identScript.includes("motion === 'full'")) throw new Error('Animated ident controls or full-motion review mode are incomplete.');

const platformTemplates = [
  'youtube-banner.svg', 'twitch-banner.svg', 'github-social-preview.svg', 'stream-offline.svg',
  'thumbnail.svg', 'sponsor-deck-cover.svg', 'discord-icon.svg'
];
for (const name of platformTemplates) {
  const source = await read(`brand/templates/${name}`);
  if (!source.includes('#3157ff') && !source.includes('#171613')) throw new Error(`${name}: approved primary field is missing`);
  if (name === 'discord-icon.svg') {
    if (!source.includes('../svg/logo-icon-dark.svg')) throw new Error('discord-icon.svg: outlined monogram reference is missing');
  } else if (!source.includes('#f1eadb') || !source.includes('#ff5b3d')) throw new Error(`${name}: cream/coral identity contrast is missing`);
  if (!source.includes('Bricolage') && name !== 'discord-icon.svg') throw new Error(`${name}: packaged display system is missing`);
  if (/#0b1026|#5de4e7|#ff7b72/i.test(source)) throw new Error(`${name}: retired palette remains`);
}

const motionCss = await read('obs/overlays/motion.css');
const motionScript = await read('obs/overlays/motion.js');
if (!motionCss.includes('body:not(.force-motion)') || !motionScript.includes("params.get('motion') === 'full'")) throw new Error('OBS review scenes do not provide explicit full-motion playback.');

const voteOverlay = await read('obs/overlays/vote.js');
if (voteOverlay.includes('innerHTML') || !voteOverlay.includes('textContent')) throw new Error('Vote overlay must render poll labels without HTML injection.');

console.log('Tiny / Big identity passed: outlined logo family, scale monogram, looping ident, platform masters, and safe overlays.');
