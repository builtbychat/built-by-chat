import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import {
  REHEARSAL_SCENARIOS,
  advanceRehearsal,
  applyRehearsalAction,
  createRehearsal,
  rehearsalScore,
  runReferenceRehearsal,
  startRehearsal
} from '../packages/shared/src/rehearsal.mjs';

const root = resolve(import.meta.dirname, '..');
const outputDir = resolve(root, 'private/rehearsal-sims');
const outputPath = resolve(outputDir, 'latest.json');
const runsArg = process.argv.find((value) => value.startsWith('--runs='));
const seedArg = process.argv.find((value) => value.startsWith('--seed='));
const runCount = Number(runsArg?.split('=')[1] ?? 600);
let seed = Number(seedArg?.split('=')[1] ?? 20260801) >>> 0;
if (!Number.isInteger(runCount) || runCount < 1 || runCount > 100000) throw new Error('--runs must be an integer from 1 to 100000.');

function random() {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return (seed >>> 0) / 4294967296;
}

function getToIncident(scenarioId) {
  let state = startRehearsal(createRehearsal(scenarioId));
  while (state.status === 'running') state = advanceRehearsal(state);
  return state;
}

function finish(state) {
  while (state.status === 'running') state = advanceRehearsal(state);
  return state;
}

const references = REHEARSAL_SCENARIOS.map((scenario) => {
  const result = runReferenceRehearsal(scenario.id);
  return { scenarioId: scenario.id, label: scenario.label, ...result.score };
});

const guardrails = REHEARSAL_SCENARIOS.filter((scenario) => scenario.decoyActions.length).map((scenario) => {
  const initial = getToIncident(scenario.id);
  const decoy = scenario.decoyActions[0];
  const rejected = applyRehearsalAction(initial, decoy);
  const passed = rejected.violations === 1 && rejected.actionIndex === 0 && rejected.status === 'alert';
  return { scenarioId: scenario.id, decoy, passed };
});

const incidentScenarios = REHEARSAL_SCENARIOS.filter((scenario) => scenario.requiredActions.length);
const randomRuns = [];
const rejectedActions = new Map();
for (let index = 0; index < runCount; index += 1) {
  const scenario = incidentScenarios[index % incidentScenarios.length];
  let state = getToIncident(scenario.id);
  for (const expected of scenario.requiredActions) {
    if (random() < 0.32) {
      const candidates = [...scenario.decoyActions, ...scenario.requiredActions.filter((action) => action !== expected && !state.completedActions.includes(action))];
      const wrong = candidates[Math.floor(random() * candidates.length)] ?? scenario.decoyActions[0];
      if (wrong) {
        state = applyRehearsalAction(state, wrong);
        rejectedActions.set(wrong, (rejectedActions.get(wrong) ?? 0) + 1);
      }
    }
    state = applyRehearsalAction(state, expected);
  }
  state = finish(state);
  randomRuns.push({ scenarioId: scenario.id, ...rehearsalScore(state) });
}

const referencePassed = references.every((result) => result.passed);
const guardrailsPassed = guardrails.every((result) => result.passed);
const randomPassed = randomRuns.filter((result) => result.passed).length;
const averageScore = randomRuns.reduce((sum, result) => sum + result.score, 0) / randomRuns.length;
const scenarioStats = incidentScenarios.map((scenario) => {
  const rows = randomRuns.filter((result) => result.scenarioId === scenario.id);
  return {
    scenarioId: scenario.id,
    label: scenario.label,
    runs: rows.length,
    cleanRuns: rows.filter((row) => row.passed).length,
    averageScore: Number((rows.reduce((sum, row) => sum + row.score, 0) / rows.length).toFixed(1)),
    averageResponseSeconds: Number((rows.reduce((sum, row) => sum + row.responseSeconds, 0) / rows.length).toFixed(1))
  };
});
const commonRejectedActions = [...rejectedActions.entries()].sort((a,b) => b[1] - a[1]).slice(0,8).map(([actionId,count]) => ({ actionId, count }));

const report = {
  version: 1,
  generatedAt: new Date().toISOString(),
  seed: Number(seedArg?.split('=')[1] ?? 20260801),
  scope: 'deterministic local simulation; no provider call, deployment, message, stream, account action, or production mutation',
  referencePassed,
  guardrailsPassed,
  referenceRuns: references,
  guardrailChecks: guardrails,
  randomized: {
    runs: runCount,
    cleanRuns: randomPassed,
    cleanRate: Number((randomPassed / runCount * 100).toFixed(1)),
    averageScore: Number(averageScore.toFixed(1)),
    scenarioStats,
    commonRejectedActions
  }
};

for (const result of references) console.log(`${result.passed ? 'PASS' : 'FAIL'} reference · ${result.label} · score ${result.score} · ${result.responseSeconds}s`);
for (const result of guardrails) console.log(`${result.passed ? 'PASS' : 'FAIL'} guardrail · ${result.scenarioId} rejects ${result.decoy}`);
console.log(`Randomized operator simulation · ${runCount} runs · ${report.randomized.cleanRate}% clean · average score ${report.randomized.averageScore}`);
for (const result of scenarioStats) console.log(`  ${result.label.padEnd(22)} ${String(result.cleanRuns).padStart(3)}/${result.runs} clean · score ${result.averageScore} · response ${result.averageResponseSeconds}s`);

if (process.argv.includes('--record')) {
  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  console.log(`Sanitized local evidence: ${outputPath}`);
}

if (!referencePassed || !guardrailsPassed) process.exitCode = 1;
