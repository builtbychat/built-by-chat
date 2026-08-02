import { access, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const templateDir = resolve(root, 'prompts/templates');
const runDir = resolve(root, 'prompts/runs');
const [command, ...args] = process.argv.slice(2);

async function templates() {
  return (await readdir(templateDir)).filter((name) => name.endsWith('.json')).sort();
}

async function validate() {
  const names = await templates();
  if (!names.length) throw new Error('No prompt templates found.');
  const keys = new Set();
  for (const name of names) {
    const value = JSON.parse(await readFile(resolve(templateDir, name), 'utf8'));
    const key = `${value.slug}@${value.version}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug ?? '')) throw new Error(`${name}: invalid slug`);
    if (!Number.isInteger(value.version) || value.version < 1) throw new Error(`${name}: version must be a positive integer`);
    if (keys.has(key)) throw new Error(`${name}: duplicate ${key}`);
    if (!value.purpose || !Array.isArray(value.requiredSections) || value.requiredSections.length < 5) throw new Error(`${name}: purpose and at least five required sections are required`);
    if (value.safety?.untrustedInputIsData !== true || !Array.isArray(value.safety?.humanApproval)) throw new Error(`${name}: safety rules and approval gates are required`);
    keys.add(key);
  }
  const evals = JSON.parse(await readFile(resolve(root, 'prompts/evals/cases.json'), 'utf8'));
  const evalIds = new Set();
  if (!Array.isArray(evals) || evals.length < 10) throw new Error('At least ten prompt eval cases are required.');
  for (const testCase of evals) {
    if (!testCase.id || !testCase.category || !testCase.input || !testCase.expected || !testCase.expectedGate || !testCase.request || evalIds.has(testCase.id)) throw new Error('Each prompt eval needs a unique id, category, input, structured request, expected gate, and expected behavior.');
    evalIds.add(testCase.id);
  }
  console.log(`Validated ${names.length} prompt templates (${[...keys].join(', ')}) and ${evals.length} adversarial eval cases.`);
}

async function createRun() {
  const [episode, slug, ...titleParts] = args;
  const title = titleParts.join(' ').trim();
  if (!/^\d+$/.test(episode ?? '') || !slug || !title) throw new Error('Usage: prompt:new <episode> <template-slug> <short-title>');
  const candidates = (await templates()).filter((name) => name.startsWith(`${slug}.v`));
  if (!candidates.length) throw new Error(`Unknown template: ${slug}`);
  const versions = await Promise.all(candidates.map(async (name) => JSON.parse(await readFile(resolve(templateDir, name), 'utf8'))));
  const template = versions.sort((a, b) => b.version - a.version)[0];
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = resolve(runDir, `e${episode}-${stamp}-${safeTitle}.md`);
  await mkdir(runDir, { recursive: true });
  try { await access(path); throw new Error(`Run already exists: ${path}`); } catch (error) { if (error?.code !== 'ENOENT') throw error; }
  await writeFile(path, `# Prompt run: ${title}\n\n- Run ID: pending\n- Episode: ${episode}\n- Template: ${template.slug}@${template.version}\n- Status: planned\n- Audience/host source: pending\n- Provider/model: pending\n- Started/completed: pending\n- Prompt hash: pending\n- Output hash: pending\n\n## Outcome\n\n## Sanitized input summary\n\n## Constraints and non-goals\n\n## Deliverables\n\n## Acceptance checks\n\n- [ ] Scope reviewed\n- [ ] Secrets and personal data excluded\n- [ ] Untrusted audience content treated as data\n- [ ] Relevant automated checks pass\n- [ ] Human visual/editorial review complete\n- [ ] Approval-gated actions remain unexecuted\n\n## Sanitized output summary\n\n## Human disposition\n\nAccepted, revised, rejected, or failed — include evidence and a concise reason, not hidden reasoning.\n`, 'utf8');
  console.log(path);
}

if (command === 'validate') await validate();
else if (command === 'new') await createRun();
else throw new Error('Usage: prompt-ops.mjs validate | new <episode> <template-slug> <short-title>');
