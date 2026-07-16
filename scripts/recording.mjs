import { mkdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { extname, resolve } from 'node:path';

const [action, first = '00', second = 'untitled'] = process.argv.slice(2);
const root = resolve(import.meta.dirname, '../recordings');

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  if (result.status !== 0) throw new Error(result.stderr || `${command} failed`);
  return result.stdout;
}

if (action === 'prepare') {
  const slug = second.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'untitled';
  const dir = resolve(root, `${new Date().toISOString().slice(0, 10)}_e${String(first).padStart(2, '0')}_${slug}`);
  await mkdir(dir, { recursive: true });
  console.log(dir);
} else if (action === 'verify') {
  const file = resolve(process.cwd(), first);
  const info = await stat(file);
  if (info.size < 1024 * 1024) throw new Error('Recording is suspiciously small.');
  console.log(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration,size:stream=index,codec_name,codec_type,sample_rate,channels', '-of', 'json', file]));
} else if (action === 'remux') {
  const input = resolve(process.cwd(), first);
  if (extname(input).toLowerCase() !== '.mkv') throw new Error('Remux input must be an MKV recording.');
  const output = resolve(process.cwd(), second === 'untitled' ? input.replace(/\.mkv$/i, '.mp4') : second);
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-n', '-i', input, '-map', '0', '-c', 'copy', '-movflags', '+faststart', output]);
  console.log(output);
} else {
  console.error('Usage: recording.mjs prepare <episode> <slug> | verify <file> | remux <input.mkv> [output.mp4]');
  process.exit(2);
}
