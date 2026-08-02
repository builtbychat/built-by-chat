import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { livingDraft } from './living-draft.mjs';

const [episode, ...titleParts] = process.argv.slice(2);
const title = titleParts.join(' ').trim();
if (!/^\d+$/.test(episode ?? '') || !title) throw new Error('Usage: publishing-draft.mjs <episode> <title>');
const number = String(episode).padStart(2, '0');
const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const directory = resolve(import.meta.dirname, '../drafts');
const path = resolve(directory, `episode-${number}-${slug}-publishing.html`);
await mkdir(directory, { recursive: true });
const html=livingDraft({title:`Episode ${number} · ${title}`,subtitle:'Editable publishing workspace. Replace brackets only with verified episode records.',storageKey:`tiny-signal-publishing-${number}-${slug}`,sections:[
  {id:'youtube-title',label:'YouTube title',value:`[VERIFIED RESULT] — ${title} | Tiny Signal Club`,multiline:false,help:'Lead with the concrete audience-made result; keep episode number secondary.'},
  {id:'description',label:'Description lead',value:'Signal received: [VERIFIED RESULT]. Phaenex interpreted it as [HUMAN INTERPRETATION] and built [VERIFIED CHANGE] live. Participation is free.',help:'Promise, responsibility, and result before schedule or links.'},
  {id:'decision',label:'Audience decision',value:'[FINAL POLL / APPROVED IDEA + RECEIPT LINK]',help:'Never infer this from chat volume.'},
  {id:'interpretation',label:'Human interpretation',value:'[WHAT PHAENEX DECIDED THE SIGNAL MEANT]',help:'Name the consequential editorial judgment.'},
  {id:'ai-role',label:'AI-assisted work',value:'[BOUNDED TOOL ROLE OR “NONE”]',help:'Describe the role, not a theatrical prompt transcript.'},
  {id:'revision',label:'Rejected or revised',value:'[SPECIFIC GENERIC, WRONG, UNSAFE, OR INCOHERENT DRAFT + HUMAN CHANGE]',help:'A release needs visible inspection and craft.'},
  {id:'verification',label:'Independent verification',value:'[BEHAVIOR · ACCESSIBILITY · SAFETY · RIGHTS · HUMAN PLAYTEST]',help:'Checks must be independent of the generation step.'},
  {id:'shipped',label:'What shipped',value:'[ARTIFACT + VERSION + LINK]',help:'Give the work a durable home.'},
  {id:'learning',label:'What we learned',value:'[SPECIFIC FINDING + SMALLEST NEXT TEST]',help:'The lesson is part of the episode artifact.'},
  {id:'platform-disclosure',label:'Platform synthetic-content setting',value:'[NOT REQUIRED / YES — WITH REASON AND REVIEWER]',help:'Use Yes for meaningfully altered or photorealistic synthetic media under current YouTube guidance.'},
  {id:'chapters',label:'Verified chapters',value:'00:00 Starting soon\n[VERIFY EVERY MARKER FROM FINAL RECORDING]',help:'Do not publish placeholder timecodes.'},
  {id:'twitch',label:'Twitch schedule copy',value:`Episode ${episode}: ${title} — a real audience choice becomes a tested artifact. Thursday, 7:00–9:00 PM CT.`,help:'Concrete promise; no generic go-live filler.'},
  {id:'picnic',label:'Modem Picnic agenda',value:'Tour the shipped change\nTest [VERIFIED FEATURE]\nReview open defects\nChoose one finding to carry into Thursday',help:'Sunday findings become Thursday proof.'},
  {id:'clips',label:'One contextualized clip',value:'[DECISION + CONSEQUENCE + REVEAL + TIMECODE + NEXT EVENT]',help:'One complete story before additional social output.'}
]});
await writeFile(path,html,'utf8');
console.log(path);
