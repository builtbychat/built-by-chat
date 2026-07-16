import { cp, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const destination = resolve(root, 'apps/web/public/brand');
await mkdir(destination, { recursive: true });
await cp(resolve(root, 'brand/svg'), destination, { recursive: true });
try { await cp(resolve(root, 'brand/raster/hero-town.png'), resolve(destination, 'hero-town.png')); } catch { /* Generated during brand workflow. */ }
try { await cp(resolve(root, 'public/built-by-chat.ics'), resolve(root, 'apps/web/public/built-by-chat.ics')); } catch { /* Optional during first build. */ }
await mkdir(resolve(root, 'apps/web/public/overlays'), { recursive: true });
await cp(resolve(root, 'obs/overlays'), resolve(root, 'apps/web/public/overlays'), { recursive: true });
