export const SHOW_CUES = Object.freeze([
  { id: 'signal-check', targetSeconds: 0, label: 'Signal check', phase: 'pre-show', detail: 'Recording, captions, audio meters, both outputs, site, overlays, moderators.' },
  { id: 'welcome', targetSeconds: 300, label: 'Welcome + contract', phase: 'welcome', detail: 'State the promise, audience controls, boundaries, and authoritative vote path.' },
  { id: 'town-tour', targetSeconds: 720, label: 'Town tour', phase: 'tour', detail: 'Show the current verified snapshot and known issues.' },
  { id: 'build-one', targetSeconds: 1080, label: 'Build block one', phase: 'build', detail: 'Narrate scope and prepare the first bounded decision.' },
  { id: 'vote-one', targetSeconds: 2520, label: 'Vote one', phase: 'vote', detail: 'Read options twice, open the site poll, announce close time and tie rule.' },
  { id: 'result-one', targetSeconds: 3420, label: 'Verify result', phase: 'results', detail: 'Close the poll and verify the immutable result before announcing it.' },
  { id: 'break', targetSeconds: 3600, label: 'Scheduled break', phase: 'break', detail: 'Five-minute host, moderator, and technical reset.' },
  { id: 'build-two', targetSeconds: 3900, label: 'Build block two', phase: 'build', detail: 'Implement the verified winner or use the prepared fallback.' },
  { id: 'vote-two', targetSeconds: 5700, label: 'Final decision', phase: 'vote', detail: 'Open the second bounded choice only if the build and vote path are healthy.' },
  { id: 'result-tour', targetSeconds: 6420, label: 'Result + town tour', phase: 'results', detail: 'Verify the final decision and show what shipped.' },
  { id: 'ending', targetSeconds: 6900, label: 'Ending + credits', phase: 'ending', detail: 'Next stream, Sunday agenda, credits, and viewer-safe ending.' },
  { id: 'hard-out', targetSeconds: 7200, label: 'Hard out', phase: 'ended', detail: 'Stop streams, then recording; preserve and verify the media.' }
]);

export const REHEARSAL_ACTIONS = Object.freeze({
  'freeze-authoritative-decision': { label: 'Freeze the decision', seconds: 8, detail: 'Pause the vote clock and make no result claim.' },
  'announce-vote-clock-paused': { label: 'Announce the paused vote clock', seconds: 12, detail: 'Tell viewers discussion may continue but no result counts.' },
  'switch-prepared-fallback': { label: 'Switch to the prepared fallback', seconds: 15, detail: 'Use the scoped town tour or local activity.' },
  'restore-vote-path': { label: 'Restore the vote path', seconds: 55, detail: 'Recover the site/overlay without changing choices.' },
  'verify-authoritative-state': { label: 'Verify authoritative state', seconds: 30, detail: 'Check poll ID, choices, current selections, and Studio/overlay agreement.' },
  'reopen-same-choices': { label: 'Reopen with the same choices', seconds: 15, detail: 'Restart the announced clock only after state verification.' },
  'switch-brb': { label: 'Switch to the BRB scene', seconds: 8, detail: 'Move to the rehearsed holding scene before changing equipment.' },
  'mute-program-audio': { label: 'Mute unsafe program audio', seconds: 5, detail: 'Prevent echo, private talk, or device noise from reaching the stream.' },
  'select-backup-mic': { label: 'Select the rehearsed backup mic', seconds: 35, detail: 'Use only the known backup input and routing.' },
  'verify-meters-local': { label: 'Verify meters locally', seconds: 25, detail: 'Confirm source, level, limiter, sync, and monitoring before return.' },
  'return-live': { label: 'Return live with a short recap', seconds: 10, detail: 'Orient viewers without pretending the interruption did not happen.' },
  'name-platform-outage': { label: 'Name the platform outage', seconds: 10, detail: 'Tell the surviving audience which output is unavailable.' },
  'verify-participation-fair': { label: 'Verify participation remains fair', seconds: 30, detail: 'Confirm the site vote and current objective remain equally available.' },
  'continue-healthy-output': { label: 'Continue on the healthy output', seconds: 15, detail: 'Continue only after the fairness check passes.' },
  'queue-approved-status': { label: 'Queue an approved status draft', seconds: 20, detail: 'Prepare but do not publish external status copy without approval.' },
  'hide-sensitive-source': { label: 'Hide the sensitive source', seconds: 5, detail: 'Remove the exposed credential or private data from program output.' },
  'end-affected-streams': { label: 'End affected streams', seconds: 10, detail: 'Stop the damaging output immediately.' },
  'preserve-minimal-evidence': { label: 'Preserve minimal evidence', seconds: 20, detail: 'Record timestamps and affected systems without copying the secret.' },
  'confirm-revocation-checkpoint': { label: 'Confirm human revocation checkpoint', seconds: 60, detail: 'A human uses the provider UI; the simulator records only confirmation.' },
  'invalidate-exposed-sessions': { label: 'Invalidate exposed sessions', seconds: 30, detail: 'End related sessions after provider-side credential rotation.' },
  'end-rehearsal': { label: 'End the rehearsal safely', seconds: 5, detail: 'Do not resume with uncertain credentials.' },
  'freeze-result': { label: 'Freeze the result', seconds: 5, detail: 'Do not call or implement a winner.' },
  'preserve-original-poll': { label: 'Preserve the original poll', seconds: 20, detail: 'Keep records intact for correction and investigation.' },
  'mark-result-invalid': { label: 'Mark the result invalid', seconds: 15, detail: 'Add a reason category without editing history in place.' },
  'create-linked-repoll': { label: 'Create a linked replacement poll', seconds: 35, detail: 'Use the same reviewed options and retain provenance.' },
  'announce-no-result': { label: 'Announce that no result exists', seconds: 10, detail: 'State the correction plainly and avoid implying a winner.' },
  'infer-chat-winner': { label: 'Use chat reactions as the winner', seconds: 5, detail: 'Unsafe: chat volume is not the authoritative result.', unsafe: true },
  'debug-production-live': { label: 'Debug production live', seconds: 30, detail: 'Unsafe: remain on the last verified version and use the fallback.', unsafe: true },
  'continue-without-mic': { label: 'Continue without verified audio', seconds: 5, detail: 'Unsafe: viewers cannot reliably follow the objective or decisions.', unsafe: true },
  'publish-status-unapproved': { label: 'Publish an improvised status', seconds: 10, detail: 'Unsafe: external publishing still requires approval.', unsafe: true },
  'keep-streaming-sensitive-source': { label: 'Keep streaming while investigating', seconds: 20, detail: 'Unsafe: the exposure must be stopped before investigation.', unsafe: true },
  'delete-original-poll': { label: 'Delete the original poll', seconds: 10, detail: 'Unsafe: immutable decision history must be preserved.', unsafe: true }
});

export const REHEARSAL_SCENARIOS = Object.freeze([
  {
    id: 'clean-show', label: 'Clean show', severity: 'none', injectAtSeconds: null, targetResponseSeconds: 0,
    summary: 'Run the complete cue sheet with no injected incident.',
    signals: ['All systems nominal'], affectedSystems: [], requiredActions: [], decoyActions: [], endsShow: false,
    invariant: 'Every authoritative decision is verified before announcement.'
  },
  {
    id: 'vote-path-loss', label: 'Vote path loss', severity: 'sev2', injectAtSeconds: 2700, targetResponseSeconds: 180,
    summary: 'The public vote request and live overlay stop responding during Vote One.',
    signals: ['Vote API errors', 'Overlay count is stale', 'WebSocket reconnect loop'], affectedSystems: ['Vote API', 'Live overlay'],
    requiredActions: ['freeze-authoritative-decision','announce-vote-clock-paused','switch-prepared-fallback','restore-vote-path','verify-authoritative-state','reopen-same-choices'],
    decoyActions: ['infer-chat-winner','debug-production-live'], endsShow: false,
    invariant: 'No winner is inferred, announced, or built while the authoritative path is uncertain.',
    viewerMessage: 'The vote clock is paused. Discussion can continue, but no result counts until the site is verified.'
  },
  {
    id: 'microphone-loss', label: 'Microphone loss', severity: 'sev2', injectAtSeconds: 4050, targetResponseSeconds: 120,
    summary: 'The host microphone disappears immediately after the break.',
    signals: ['Voice meter is flat', 'Moderator reports no host audio', 'Desktop audio remains live'], affectedSystems: ['Host microphone'],
    requiredActions: ['switch-brb','mute-program-audio','select-backup-mic','verify-meters-local','return-live'],
    decoyActions: ['continue-without-mic','debug-production-live'], endsShow: false,
    invariant: 'No decision continues until the host audio path is locally verified.',
    viewerMessage: 'Brief audio reset. The show and vote state are safe; we will return after a local sound check.'
  },
  {
    id: 'one-platform-loss', label: 'One-platform outage', severity: 'sev2', injectAtSeconds: 5100, targetResponseSeconds: 120,
    summary: 'Twitch ingest fails while YouTube, the site, and local recording remain healthy.',
    signals: ['Twitch output disconnected', 'YouTube healthy', 'Site vote healthy', 'Local MKV healthy'], affectedSystems: ['Twitch output'],
    requiredActions: ['name-platform-outage','verify-participation-fair','continue-healthy-output','queue-approved-status'],
    decoyActions: ['publish-status-unapproved','infer-chat-winner'], endsShow: false,
    invariant: 'The show continues only if the authoritative participation path remains fair.',
    viewerMessage: 'Twitch is unavailable. The site vote remains authoritative; the show is continuing on the healthy output.'
  },
  {
    id: 'credential-exposure', label: 'Credential exposure', severity: 'sev1', injectAtSeconds: 1500, targetResponseSeconds: 180,
    summary: 'A private provider credential appears in a captured source.',
    signals: ['Sensitive pattern visible on program', 'Moderator escalation'], affectedSystems: ['Program output', 'Provider credential'],
    requiredActions: ['hide-sensitive-source','end-affected-streams','preserve-minimal-evidence','confirm-revocation-checkpoint','invalidate-exposed-sessions','end-rehearsal'],
    decoyActions: ['keep-streaming-sensitive-source','publish-status-unapproved'], endsShow: true,
    invariant: 'Stop exposure first; never copy the credential into the incident log or resume before rotation.',
    viewerMessage: 'The broadcast is ending for a safety issue. A factual update will follow only after review.'
  },
  {
    id: 'corrupt-result', label: 'Uncertain vote result', severity: 'sev1', injectAtSeconds: 3420, targetResponseSeconds: 150,
    summary: 'The closed-poll total and immutable snapshot do not agree.',
    signals: ['Count mismatch', 'Snapshot verification failure', 'Result overlay withheld'], affectedSystems: ['Decision record', 'Result overlay'],
    requiredActions: ['freeze-result','preserve-original-poll','mark-result-invalid','create-linked-repoll','announce-no-result','switch-prepared-fallback'],
    decoyActions: ['delete-original-poll','infer-chat-winner'], endsShow: false,
    invariant: 'The original record remains intact and no winner exists until a linked replacement poll closes.',
    viewerMessage: 'The result did not pass verification, so there is no winner yet. The original record is preserved and the build is deferred.'
  }
]);

const scenarioById = new Map(REHEARSAL_SCENARIOS.map((scenario) => [scenario.id, scenario]));

function event(atSeconds, type, message) {
  return { atSeconds, type, message };
}

export function getRehearsalScenario(id) {
  const scenario = scenarioById.get(id);
  if (!scenario) throw new Error(`Unknown rehearsal scenario: ${id}`);
  return scenario;
}

export function createRehearsal(scenarioId = 'clean-show') {
  const scenario = getRehearsalScenario(scenarioId);
  return {
    scenarioId,
    status: 'ready',
    currentSeconds: 0,
    cueIndex: -1,
    incidentInjected: false,
    actionIndex: 0,
    completedActions: [],
    responseSeconds: 0,
    violations: 0,
    log: [event(0, 'info', `Loaded scenario: ${scenario.label}.`)]
  };
}

export function startRehearsal(state) {
  if (state.status !== 'ready') return state;
  return { ...state, status: 'running', log: [...state.log, event(0, 'cue', 'Rehearsal clock started. Complete the signal check.')] };
}

export function injectRehearsalIncident(state) {
  const scenario = getRehearsalScenario(state.scenarioId);
  if (state.incidentInjected || scenario.injectAtSeconds === null || ['complete','ended'].includes(state.status)) return state;
  const atSeconds = Math.max(state.currentSeconds, scenario.injectAtSeconds);
  const interruptedCueIndex = SHOW_CUES.findLastIndex((cue) => cue.targetSeconds <= atSeconds);
  const cueIndex = Math.max(state.cueIndex, interruptedCueIndex);
  const interruptedCue = SHOW_CUES[cueIndex];
  const log = [...state.log];
  if (cueIndex > state.cueIndex && interruptedCue) log.push(event(atSeconds, 'cue', `Compressed timeline to ${interruptedCue.label}.`));
  log.push(event(atSeconds, 'alert', `${scenario.severity.toUpperCase()} injected: ${scenario.summary}`));
  return {
    ...state,
    status: 'alert',
    currentSeconds: atSeconds,
    cueIndex,
    incidentInjected: true,
    log
  };
}

export function advanceRehearsal(state) {
  if (state.status === 'ready') return startRehearsal(state);
  if (state.status !== 'running') return state;
  const scenario = getRehearsalScenario(state.scenarioId);
  const nextCue = SHOW_CUES[state.cueIndex + 1];
  if (!nextCue) return { ...state, status: 'complete', log: [...state.log, event(state.currentSeconds, 'pass', 'Run of show complete.')] };
  if (!state.incidentInjected && scenario.injectAtSeconds !== null && scenario.injectAtSeconds <= nextCue.targetSeconds) return injectRehearsalIncident(state);
  const nextState = {
    ...state,
    currentSeconds: nextCue.targetSeconds,
    cueIndex: state.cueIndex + 1,
    log: [...state.log, event(nextCue.targetSeconds, 'cue', `${nextCue.label}: ${nextCue.detail}`)]
  };
  if (nextCue.id === 'hard-out') return { ...nextState, status: 'complete', log: [...nextState.log, event(nextCue.targetSeconds, 'pass', 'Safe ending reached; streams stop before recording.')] };
  return nextState;
}

export function applyRehearsalAction(state, actionId) {
  const action = REHEARSAL_ACTIONS[actionId];
  if (!action) throw new Error(`Unknown rehearsal action: ${actionId}`);
  const scenario = getRehearsalScenario(state.scenarioId);
  if (state.status !== 'alert') {
    return { ...state, violations: state.violations + 1, log: [...state.log, event(state.currentSeconds, 'reject', `${action.label} rejected: no active incident requires it.`)] };
  }
  const expected = scenario.requiredActions[state.actionIndex];
  const responseSeconds = state.responseSeconds + action.seconds;
  if (actionId !== expected) {
    return {
      ...state,
      responseSeconds,
      violations: state.violations + 1,
      log: [...state.log, event(state.currentSeconds + responseSeconds, 'reject', `${action.label} rejected. ${action.detail}`)]
    };
  }
  const completedActions = [...state.completedActions, actionId];
  const actionIndex = state.actionIndex + 1;
  const resolved = actionIndex === scenario.requiredActions.length;
  const status = resolved ? (scenario.endsShow ? 'ended' : 'running') : 'alert';
  const log = [...state.log, event(state.currentSeconds + responseSeconds, 'action', `${action.label}: ${action.detail}`)];
  if (resolved) log.push(event(state.currentSeconds + responseSeconds, 'pass', scenario.endsShow ? 'Incident contained; rehearsal ended safely.' : 'Incident contained; return to the verified run of show.'));
  return { ...state, status, actionIndex, completedActions, responseSeconds, log };
}

export function rehearsalScore(state) {
  const scenario = getRehearsalScenario(state.scenarioId);
  const finished = ['complete','ended'].includes(state.status);
  const requiredComplete = state.completedActions.length === scenario.requiredActions.length;
  const overtime = scenario.targetResponseSeconds ? Math.max(0, state.responseSeconds - scenario.targetResponseSeconds) : 0;
  const score = Math.max(0, Math.round(100 - state.violations * 12 - Math.min(24, overtime / 5) - (finished ? 0 : 20) - (requiredComplete ? 0 : 25)));
  return {
    score,
    grade: score >= 90 ? 'ready' : score >= 75 ? 'review' : 'repeat',
    finished,
    requiredComplete,
    responseSeconds: state.responseSeconds,
    targetResponseSeconds: scenario.targetResponseSeconds,
    violations: state.violations,
    invariantProtected: state.violations === 0 && requiredComplete,
    passed: finished && requiredComplete && state.violations === 0 && overtime === 0
  };
}

export function runReferenceRehearsal(scenarioId) {
  const scenario = getRehearsalScenario(scenarioId);
  let state = startRehearsal(createRehearsal(scenarioId));
  while (state.status === 'running') state = advanceRehearsal(state);
  if (state.status === 'alert') for (const actionId of scenario.requiredActions) state = applyRehearsalAction(state, actionId);
  while (state.status === 'running') state = advanceRehearsal(state);
  return { state, score: rehearsalScore(state) };
}

export function formatRehearsalClock(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remaining = Math.floor(seconds % 60);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`;
}
