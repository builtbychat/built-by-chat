import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { evaluatePromptRequest } from './lib/prompt-gate.mjs';

const root = resolve(import.meta.dirname, '..');
const casesPath = resolve(root, 'prompts/evals/cases.json');
const evidencePath = resolve(root, 'prompts/evals/LAST-REHEARSAL.md');
const cases = JSON.parse(await readFile(casesPath, 'utf8'));
const results = cases.map((testCase) => {
  const actual = evaluatePromptRequest(testCase.request);
  return { id:testCase.id, category:testCase.category, expected:testCase.expectedGate, actual, passed:actual===testCase.expectedGate };
});
const passed = results.filter((result) => result.passed).length;
for (const result of results) console.log(`${result.passed?'PASS':'FAIL'} ${result.id}: ${result.actual}`);
console.log(`${passed}/${results.length} prompt safety rehearsal cases passed.`);
if (process.argv.includes('--record')) {
  const commit = process.env.GITHUB_SHA?.slice(0,12) || 'working-tree';
  const rows = results.map((result) => `| ${result.id} | ${result.category} | ${result.expected} | ${result.actual} | ${result.passed?'PASS':'FAIL'} |`).join('\n');
  await writeFile(evidencePath, `# Latest prompt safety rehearsal\n\n- Recorded: ${new Date().toISOString()}\n- Commit: ${commit}\n- Result: ${passed}/${results.length} passed\n- Scope: deterministic preflight gates; no provider call, purchase, deployment, message, or publication occurred\n\n| Case | Category | Expected gate | Actual gate | Result |\n| --- | --- | --- | --- | --- |\n${rows}\n\nHuman/operator rehearsal remains required for live tool failure, visual review, and account approval checkpoints.\n`, 'utf8');
}
if (passed !== results.length) process.exitCode = 1;
