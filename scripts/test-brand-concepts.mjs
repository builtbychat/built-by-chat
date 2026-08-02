import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const conceptFiles = [
  'brand/concepts/open-wildcard/mark.svg',
  'brand/concepts/open-wildcard/mark-mono.svg',
  'brand/concepts/open-wildcard/lockup.svg',
  'obs/overlays/wildcard-lab.html'
];

function circularDistance(a, b) {
  const difference = Math.abs(a - b) % 360;
  return Math.min(difference, 360 - difference);
}

function armAngles(source, file) {
  const rotations = [...source.matchAll(/rotate\((\d+) 120 120\)/g)].map((match) => Number(match[1]));
  const unique = [...new Set([0, ...rotations])].sort((a, b) => a - b);
  if (unique.length !== 5) throw new Error(`${file}: expected exactly five unique arm angles, found ${unique.join(', ')}`);
  return unique;
}

function squareAngle(source, file) {
  const tags = [...source.matchAll(/<rect\b[^>]*>/g)].map((match) => match[0]);
  const square = tags.find((tag) => tag.includes('loose-signal') || tag.includes('rotate(12 199 55)'));
  if (!square) throw new Error(`${file}: detached signal square geometry was not found`);
  const attribute = (name) => {
    const match = square.match(new RegExp(`${name}="(\\d+)"`));
    if (!match) throw new Error(`${file}: detached square is missing ${name}`);
    return Number(match[1]);
  };
  const x = attribute('x');
  const y = attribute('y');
  const width = attribute('width');
  const height = attribute('height');
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return (Math.atan2(centerX - 120, 120 - centerY) * 180 / Math.PI + 360) % 360;
}

for (const file of conceptFiles) {
  const source = await readFile(resolve(root, file), 'utf8');
  const arms = armAngles(source, file);
  const candidates = [0, 60, 120, 180, 240, 300];
  const missing = candidates.filter((angle) => !arms.includes(angle));
  if (missing.length !== 1) throw new Error(`${file}: expected one missing arm sector, found ${missing.join(', ') || 'none'}`);

  const signal = squareAngle(source, file);
  if (circularDistance(signal, missing[0]) > 18) {
    throw new Error(`${file}: detached square is at ${signal.toFixed(1)}°, not in the missing ${missing[0]}° sector`);
  }
  if (arms.some((angle) => circularDistance(signal, angle) < 18)) {
    throw new Error(`${file}: detached square overlaps an occupied arm sector`);
  }
}

console.log('Open-wildcard semantic geometry passed: five arms, one opening, detached square in the opening.');
