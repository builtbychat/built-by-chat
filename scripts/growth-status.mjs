import { futureProjectCatalog as projects, scoreFutureProject } from '../packages/shared/src/future-projects.mjs';
import { growthCatalog as growth } from '../packages/shared/src/growth-experiments.mjs';
const failures = [];
const requireValue = (condition, message) => { if (!condition) failures.push(message); };

requireValue(projects.version === 1, 'Future-project catalog version must be 1.');
requireValue(growth.version === 1, 'Growth-experiment catalog version must be 1.');
requireValue(Object.values(projects.weights).reduce((sum, value) => sum + value, 0) === 100, 'Project score weights must total 100.');

const projectIds = new Set();
for (const project of projects.projects) {
  requireValue(typeof project.id === 'string' && !projectIds.has(project.id), `Project ID must be unique: ${project.id}`);
  projectIds.add(project.id);
  requireValue(['front-runner','candidate','wildcard','hold'].includes(project.status), `Invalid project status: ${project.id}`);
  requireValue(project.premise?.length >= 30 && project.prototype?.length >= 30 && project.growthHook?.length >= 30, `Project needs premise, prototype, and growth hook: ${project.id}`);
  requireValue(Array.isArray(project.audienceControls) && project.audienceControls.length >= 3, `Project needs at least three bounded audience controls: ${project.id}`);
  requireValue(Array.isArray(project.risks) && project.risks.length >= 2, `Project needs at least two named risks: ${project.id}`);
  for (const scoreName of Object.keys(projects.weights)) requireValue(Number.isInteger(project.scores?.[scoreName]) && project.scores[scoreName] >= 1 && project.scores[scoreName] <= 5, `Invalid ${scoreName} score: ${project.id}`);
}

const experimentIds = new Set();
for (const experiment of growth.experiments) {
  requireValue(typeof experiment.id === 'string' && !experimentIds.has(experiment.id), `Experiment ID must be unique: ${experiment.id}`);
  experimentIds.add(experiment.id);
  requireValue(['ready','blocked','backlog'].includes(experiment.status), `Invalid experiment status: ${experiment.id}`);
  requireValue(['launch','season-one','intermission','future'].includes(experiment.phase), `Invalid experiment phase: ${experiment.id}`);
  requireValue(experiment.hypothesis?.length >= 30 && experiment.action?.length >= 30 && experiment.decisionRule?.length >= 30, `Experiment needs hypothesis, action, and decision rule: ${experiment.id}`);
  requireValue(experiment.source === 'local-policy' || /^https:\/\//.test(experiment.source), `Experiment needs an official source or local-policy marker: ${experiment.id}`);
}

requireValue(growth.funnel.map((stage) => stage.id).join(',') === 'discover,understand,participate,return,belong', 'Growth funnel order changed unexpectedly.');

const rank = (project) => scoreFutureProject(project);
const ranked = projects.projects.map((project) => ({ ...project, score: rank(project) })).sort((a,b) => b.score - a.score || a.title.localeCompare(b.title));

console.log(`Growth north star · ${growth.northStar}`);
console.log(`Future portfolio · ${ranked.length} concepts · ${ranked.filter((project) => project.status === 'front-runner').length} front-runners`);
for (const [index, project] of ranked.entries()) console.log(`${String(index + 1).padStart(2)} · ${String(project.score).padStart(4)} · ${project.status.padEnd(12)} · ${project.title}`);
console.log(`Growth experiments · ${growth.experiments.length} total`);
for (const phase of ['launch','season-one','intermission','future']) {
  const rows = growth.experiments.filter((experiment) => experiment.phase === phase);
  console.log(`  ${phase.padEnd(12)} ${rows.length} · ${rows.map((row) => `${row.title} [${row.status}]`).join('; ')}`);
}

if (failures.length) {
  console.error('\nGrowth plan validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else console.log('PASS · Portfolio scoring, experiment rules, funnel, and source fields are structurally complete.');
