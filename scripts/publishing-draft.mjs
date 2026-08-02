import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [episode, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ').trim();
if (!/^\d+$/.test(episode ?? '') || !title) throw new Error('Usage: publishing-draft.mjs <episode> <title>');
const number = String(episode).padStart(2, '0');
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const directory = resolve(import.meta.dirname, '../drafts');
const path = resolve(directory, `episode-${number}-${slug}-publishing.md`);
await mkdir(directory, { recursive: true });
await writeFile(path, `# DRAFT · Episode ${number}: ${title}\n\nPublishing requires explicit Phaenex approval. Replace every bracketed field with verified episode records.\n\n## YouTube title\n\nTiny Internet Town #${episode} — ${title} | Tiny Signal Club\n\n## Description\n\nSignal received: [VERIFIED RESULT]. Tiny Signal Club built [VERIFIED CHANGE] live.\n\nWatch Thursdays at 7:00 PM CT and join The Modem Picnic Sunday at 3:00 PM CT. Participation is free.\n\n[STREAM/VERIFIED SITE LINKS AFTER APPROVAL]\n\n## Chapters\n\n00:00 Starting soon\n[VERIFY FROM FINAL RECORDING]\n\n## Tags\n\nTiny Signal Club, Tiny Internet Town, live coding, creative coding, audience participation\n\n## Thumbnail copy\n\n- Title: ${title}\n- Episode capsule: EP ${number}\n- Result line: [2–5 WORD VERIFIED RESULT]\n- Phaenex portrait: lower right\n\n## Twitch schedule copy\n\nEpisode ${episode}: ${title} — the club sends signals, Phaenex builds, and the project remembers. Thursday, 7:00–9:00 PM CT.\n\n## The Modem Picnic agenda\n\n- Tour the shipped change\n- Test [VERIFIED FEATURE]\n- Review open defects\n- Nominate next choices; final votes stay on the site\n\n## Short clips\n\n1. [DECISION MOMENT + TIMECODE]\n2. [BUILD REVEAL + TIMECODE]\n3. [FUNNY/USEFUL MOMENT + TIMECODE]\n`, 'utf8');
console.log(path);
