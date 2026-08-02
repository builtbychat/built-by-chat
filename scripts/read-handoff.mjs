import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const path = resolve(import.meta.dirname, '../private/handoff/user-input.json');
try {
  const value = JSON.parse(await readFile(path, 'utf8'));
  console.log(`Saved: ${value.savedAt ?? 'unknown'}`);
  console.log(`Source: ${value.source ?? 'unknown'}`);
  console.log(JSON.stringify(value.fields ?? {}, null, 2));
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.log('No saved handoff yet. Run `npm run handoff`, complete the form, and press Save for Codex.');
    process.exitCode = 1;
  } else throw error;
}
