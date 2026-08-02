import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { livingDraft } from './living-draft.mjs';

const [version, title, ...summaryParts] = process.argv.slice(2);
const summary = summaryParts.join(' ').trim();
if (!/^v?\d+\.\d+\.\d+$/.test(version ?? '') || !title || !summary) throw new Error('Usage: patch-notes.mjs <version> <short-title> <verified-summary>');
const directory = resolve(import.meta.dirname, '../drafts');
const cleanVersion=version.replace(/^v/, '');
const path = resolve(directory, `town-patch-${cleanVersion}.html`);
await mkdir(directory, { recursive: true });
const html=livingDraft({title:`Town patch ${version} · ${title.replaceAll('-', ' ')}`,subtitle:summary,storageKey:`tiny-signal-patch-${cleanVersion}`,sections:[
  {id:'decision',label:'The town decided',value:'[FINAL POLL RESULT LINK OR LABELED HOST DECISION]',help:'Preserve the authoritative source.'},
  {id:'interpretation',label:'Human interpretation',value:'[HOW PHAENEX TRANSLATED THE SIGNAL INTO THIS SCOPE]',help:'Make the editorial responsibility visible.'},
  {id:'ai-role',label:'AI-assisted work',value:'[BOUNDED ROLE OR “NONE”]',help:'Do not imply autonomous authorship.'},
  {id:'revision',label:'Rejected or revised',value:'[WHAT THE FIRST ATTEMPT GOT WRONG + WHAT CHANGED]',help:'Show inspection and craft.'},
  {id:'shipped',label:'What changed',value:'[VERIFIED VISIBLE CHANGE]\n[ACCESSIBILITY / BEHAVIOR CHANGE]\n[VERSIONED ARTIFACT LINK]',help:'Only shipped facts.'},
  {id:'verification',label:'What we checked',value:'[AUTOMATED EVIDENCE]\n[HUMAN / PLAYTEST EVIDENCE]\n[RIGHTS / PROVENANCE EVIDENCE]',help:'Independent proof.'},
  {id:'learning',label:'What we learned',value:'[SPECIFIC FINDING]\nNext test: [SMALLEST HONEST QUESTION]',help:'A patch note teaches back.'},
  {id:'issues',label:'Known issues and uncertainty',value:'[NONE, OR LINK EACH TRACKED ISSUE]',help:'Uncertainty is more trustworthy than fake completeness.'},
  {id:'credits',label:'Verified credits',value:'[ONLY APPROVED CREDIT RECORDS]',help:'Never fabricate or infer a contributor.'},
  {id:'correction',label:'Correction path',value:'[HOW TO REPORT / LINK A CORRECTION WITHOUT REWRITING HISTORY]',help:'Preserve the original decision and link corrections.'}
]});
await writeFile(path,html,'utf8');
console.log(path);
