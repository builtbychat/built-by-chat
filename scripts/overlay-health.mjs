const origin = (process.argv[2] ?? 'http://localhost:8787').replace(/\/$/, '');
const paths = ['/overlays/vote.html', '/overlays/lower-third.html', '/overlays/intro.html', '/overlays/outro.html', '/overlays/audio/city-loop.mp3', '/overlays/audio/completion-chime.mp3', '/api/state'];
let failed = false;
for (const path of paths) {
  try {
    const response = await fetch(`${origin}${path}`, { signal: AbortSignal.timeout(5000) });
    const type = response.headers.get('content-type') ?? '';
    const expected = path.endsWith('.html') ? type.includes('text/html') : type.includes('application/json');
    console.log(`${response.ok && expected ? '✓' : '✗'} ${path} ${response.status} ${type}`);
    if (!response.ok || !expected) failed = true;
  } catch (error) {
    failed = true; console.error(`✗ ${path} ${error instanceof Error ? error.message : 'request failed'}`);
  }
}
if (failed) process.exitCode = 1;
