import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const [version, title, ...summaryParts] = process.argv.slice(2);
const summary = summaryParts.join(' ').trim();
if (!/^v?\d+\.\d+\.\d+$/.test(version ?? '') || !title || !summary) throw new Error('Usage: patch-notes.mjs <version> <short-title> <verified-summary>');
const directory = resolve(import.meta.dirname, '../drafts');
const path = resolve(directory, `town-patch-${version.replace(/^v/, '')}.md`);
await mkdir(directory, { recursive: true });
await writeFile(path, `# DRAFT · Town patch ${version}\n\n## ${title.replaceAll('-', ' ')}\n\n${summary}\n\n## The town decided\n\n[LINK FINAL POLL RESULT OR LABEL HOST DECISION]\n\n## What changed\n\n- [VERIFIED VISIBLE CHANGE]\n- [ACCESSIBILITY/BEHAVIOR CHANGE]\n\n## What we checked\n\n- [AUTOMATED CHECK EVIDENCE]\n- [HUMAN/PLAYTEST EVIDENCE]\n\n## Known issues\n\n- [NONE, OR LINK TRACKED ISSUE]\n\n## Credits\n\n[ONLY VERIFIED APPROVED CREDIT RECORDS]\n\nThis is a draft. Publishing requires explicit Phaenex approval.\n`, 'utf8');
console.log(path);
