import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const path = resolve(import.meta.dirname, '../docs/launch/PROGRESS.json');
const data = JSON.parse(await readFile(path, 'utf8'));
const width = 20;
const rows = data.workstreams.map((stream) => {
  const done = stream.tasks.filter((task) => task.status === 'done').length;
  const percent = Math.round((done / stream.tasks.length) * 100);
  const filled = Math.round((percent / 100) * width);
  return { ...stream, done, percent, bar: `${'█'.repeat(filled)}${'░'.repeat(width - filled)}` };
});
const done = rows.reduce((sum, row) => sum + row.done, 0);
const total = rows.reduce((sum, row) => sum + row.tasks.length, 0);
const complete = rows.filter((row) => row.done === row.tasks.length).length;
const percent = Math.round((done / total) * 100);
const filled = Math.round((percent / 100) * width);
console.log(`Overall launch readiness [${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${String(percent).padStart(3)}% (${done}/${total} tasks; ${complete}/${rows.length} workstreams complete)`);
for (const row of rows) console.log(`${row.name.padEnd(24)} [${row.bar}] ${String(row.percent).padStart(3)}% (${row.done}/${row.tasks.length})`);
console.log(`Last verified: ${data.lastVerified}`);
console.log('\nRemaining:');
for (const row of rows) {
  const remaining = row.tasks.filter((task) => task.status !== 'done');
  if (remaining.length) console.log(`- ${row.name}: ${remaining.map((task) => `${task.label} [${task.status}]`).join('; ')}`);
}
