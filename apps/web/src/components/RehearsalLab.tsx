import { useEffect, useMemo, useState } from 'react';
import {
  REHEARSAL_ACTIONS,
  REHEARSAL_SCENARIOS,
  SHOW_CUES,
  advanceRehearsal,
  applyRehearsalAction,
  createRehearsal,
  formatRehearsalClock,
  getRehearsalScenario,
  injectRehearsalIncident,
  rehearsalScore,
  runReferenceRehearsal,
  startRehearsal
} from '@tiny-signal-club/shared';
import type { RehearsalState } from '@tiny-signal-club/shared';
import { Link } from 'react-router-dom';
import '../styles/rehearsal.css';

interface RehearsalRecord {
  id: string;
  scenarioId: string;
  scenarioLabel: string;
  recordedAt: string;
  score: number;
  passed: boolean;
  responseSeconds: number;
  violations: number;
}

const historyKey = 'tiny-signal-rehearsal-history-v1';

function readHistory(): RehearsalRecord[] {
  try {
    const value = JSON.parse(localStorage.getItem(historyKey) ?? '[]') as unknown;
    return Array.isArray(value) ? value.filter((item): item is RehearsalRecord => Boolean(item && typeof item === 'object' && 'scenarioId' in item)) : [];
  } catch { return []; }
}

function downloadEvidence(history: RehearsalRecord[]) {
  const body = JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), scope: 'local-sanitized-rehearsal-evidence', runs: history }, null, 2);
  const url = URL.createObjectURL(new Blob([body], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `tiny-signal-rehearsal-${new Date().toISOString().slice(0,10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function RehearsalLab() {
  const [scenarioId, setScenarioId] = useState('vote-path-loss');
  const [state, setState] = useState<RehearsalState>(() => createRehearsal('vote-path-loss'));
  const [history, setHistory] = useState<RehearsalRecord[]>(readHistory);
  const [recorded, setRecorded] = useState(false);
  const scenario = getRehearsalScenario(scenarioId);
  const score = rehearsalScore(state);
  const finished = state.status === 'complete' || state.status === 'ended';
  const currentCue = SHOW_CUES[Math.max(0, state.cueIndex)];
  const nextCue = SHOW_CUES[state.cueIndex + 1];
  const progress = Math.min(100, state.currentSeconds / 7200 * 100);

  const availableActions = useMemo(() => [...scenario.requiredActions, ...scenario.decoyActions], [scenario]);

  useEffect(() => {
    if (!finished || recorded) return;
    const record: RehearsalRecord = {
      id: crypto.randomUUID(),
      scenarioId,
      scenarioLabel: scenario.label,
      recordedAt: new Date().toISOString(),
      score: score.score,
      passed: score.passed,
      responseSeconds: score.responseSeconds,
      violations: score.violations
    };
    const next = [record, ...history].slice(0, 30);
    localStorage.setItem(historyKey, JSON.stringify(next));
    setHistory(next);
    setRecorded(true);
  }, [finished, history, recorded, scenario.label, scenarioId, score.passed, score.responseSeconds, score.score, score.violations]);

  const loadScenario = (id: string) => {
    setScenarioId(id);
    setState(createRehearsal(id));
    setRecorded(false);
  };

  const reset = () => loadScenario(scenarioId);
  const autoRun = () => {
    setState(runReferenceRehearsal(scenarioId).state);
    setRecorded(false);
  };

  return <section className="page rehearsal-page">
    <header className="rehearsal-heading">
      <div><p className="eyebrow coral">PRIVATE STUDIO · REHEARSAL LAB</p><h1>Practice the bad minute.</h1><p className="lede">Compress the two-hour Founding Day run, inject an incident, rehearse the response in order, and leave with sanitized evidence instead of a vague “we tested it.”</p></div>
      <aside><span>LOCAL SIMULATION</span><strong>No provider calls or production mutations</strong><p>Runs stay in this browser unless you download the sanitized evidence file.</p><Link to="/playbook?view=rehearsal">Interactive rehearsal guide ↗</Link><Link to="/studio">← Back to Studio</Link></aside>
    </header>

    <section className="rehearsal-console" aria-label="Rehearsal simulator">
      <div className="rehearsal-toolbar">
        <label>Scenario<select name="rehearsal-scenario" value={scenarioId} onChange={(event) => loadScenario(event.target.value)}>{REHEARSAL_SCENARIOS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
        <div className="rehearsal-clock"><span>SHOW CLOCK</span><strong>{formatRehearsalClock(state.currentSeconds)}</strong><small>{currentCue?.phase ?? 'ready'} · {state.status}</small></div>
        <div className={`rehearsal-score ${score.grade}`}><span>LIVE SCORE</span><strong>{score.score}</strong><small>{score.grade}</small></div>
        <div className="rehearsal-controls">
          <button className="button primary" onClick={() => setState((value) => value.status === 'ready' ? startRehearsal(value) : advanceRehearsal(value))} disabled={state.status === 'alert' || finished}>{state.status === 'ready' ? 'Start rehearsal' : 'Advance to next cue'}</button>
          <button className="button secondary" onClick={() => setState((value) => injectRehearsalIncident(value))} disabled={scenario.injectAtSeconds === null || state.incidentInjected || finished}>Inject incident now</button>
          <button className="button secondary" onClick={autoRun}>Auto-run reference</button>
          <button className="button secondary" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="rehearsal-progress" role="progressbar" aria-label="Show timeline progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{ width: `${progress}%` }} /></div>

      <div className="rehearsal-dashboard">
        <section className="rehearsal-timeline" aria-labelledby="timeline-title">
          <div className="rehearsal-section-head"><div><span>RUN OF SHOW</span><h2 id="timeline-title">Two-hour timeline</h2></div><small>{nextCue ? `Next · ${formatRehearsalClock(nextCue.targetSeconds)} · ${nextCue.label}` : 'Timeline complete'}</small></div>
          <ol>
            {SHOW_CUES.map((cue, index) => <li key={cue.id} className={index < state.cueIndex ? 'done' : index === state.cueIndex ? 'current' : ''}>
              <time>{formatRehearsalClock(cue.targetSeconds).slice(0,5)}</time><i /><div><strong>{cue.label}</strong><span>{cue.phase}</span><p>{cue.detail}</p></div>
            </li>)}
          </ol>
        </section>

        <aside className="rehearsal-side">
          <section className={`incident-card ${scenario.severity} ${state.status === 'alert' ? 'active' : ''}`} aria-live="assertive">
            <div className="incident-label"><span>{scenario.severity === 'none' ? 'CONTROL' : scenario.severity.toUpperCase()}</span><small>{state.incidentInjected ? 'INJECTED' : `AT ${scenario.injectAtSeconds === null ? '—' : formatRehearsalClock(scenario.injectAtSeconds)}`}</small></div>
            <h2>{scenario.label}</h2><p>{scenario.summary}</p>
            {state.status === 'alert' && <><div className="incident-timer"><span>RESPONSE BUDGET</span><strong>{state.responseSeconds}s / {scenario.targetResponseSeconds}s</strong></div><ul>{scenario.signals.map((signal) => <li key={signal}>{signal}</li>)}</ul><blockquote>{scenario.viewerMessage}</blockquote></>}
            <div className="invariant"><span>PROTECTED INVARIANT</span><strong>{scenario.invariant}</strong></div>
          </section>

          <section className="action-card">
            <div className="rehearsal-section-head"><div><span>RECOVERY PLAYBOOK</span><h2>Operator actions</h2></div><small>{state.actionIndex}/{scenario.requiredActions.length}</small></div>
            {scenario.requiredActions.length === 0 ? <p className="micro">This control run has no incident actions. Advance through the complete cue sheet.</p> : <ol className="recovery-steps">{scenario.requiredActions.map((actionId, index) => <li key={actionId} className={index < state.actionIndex ? 'done' : index === state.actionIndex && state.status === 'alert' ? 'next' : ''}><span>{index < state.actionIndex ? '✓' : index + 1}</span><div><strong>{REHEARSAL_ACTIONS[actionId]?.label}</strong><small>{REHEARSAL_ACTIONS[actionId]?.detail}</small></div></li>)}</ol>}
            {state.status === 'alert' && <div className="action-buttons">{availableActions.map((actionId) => { const action = REHEARSAL_ACTIONS[actionId]; return <button key={actionId} className={action?.unsafe ? 'unsafe' : ''} disabled={state.completedActions.includes(actionId)} onClick={() => setState((value) => applyRehearsalAction(value, actionId))}>{action?.label}</button>; })}</div>}
            {finished && <div className={`run-result ${score.passed ? 'pass' : 'fail'}`}><span>{score.passed ? 'PASS' : 'REPEAT'}</span><strong>{score.score}/100 · {score.violations} rejected action{score.violations === 1 ? '' : 's'}</strong><p>{score.passed ? 'The reference order, response budget, and protected invariant all held.' : 'Review the event log, reset, and repeat this scenario before counting it as rehearsal evidence.'}</p></div>}
          </section>
        </aside>
      </div>

      <section className="rehearsal-log" aria-labelledby="event-log-title">
        <div className="rehearsal-section-head"><div><span>ALERT + EVENT TRACKER</span><h2 id="event-log-title">Timestamped run log</h2></div><small>{state.log.length} events · sanitized</small></div>
        <div>{[...state.log].reverse().map((entry, index) => <article key={`${entry.atSeconds}-${index}`} className={entry.type}><time>{formatRehearsalClock(entry.atSeconds)}</time><span>{entry.type}</span><p>{entry.message}</p></article>)}</div>
      </section>
    </section>

    <section className="coverage-section">
      <div className="rehearsal-section-head"><div><p className="eyebrow">LOCAL COVERAGE TRACKER</p><h2>Every failure gets practiced.</h2></div><button className="button secondary" disabled={!history.length} onClick={() => downloadEvidence(history)}>Download sanitized evidence</button></div>
      <div className="coverage-grid">
        {REHEARSAL_SCENARIOS.map((item) => {
          const runs = history.filter((record) => record.scenarioId === item.id);
          const best = runs.reduce<RehearsalRecord | null>((winner, record) => !winner || record.score > winner.score ? record : winner, null);
          return <article key={item.id} className={best?.passed ? 'covered' : ''}><span>{best?.passed ? '✓ COVERED' : '○ NOT PASSED'}</span><h3>{item.label}</h3><p>{item.invariant}</p><footer><strong>{best ? `Best ${best.score}` : 'No local run'}</strong><small>{runs.length} attempt{runs.length === 1 ? '' : 's'}</small></footer></article>;
        })}
      </div>
      {history.length > 0 && <div className="recent-runs"><h3>Recent local runs</h3>{history.slice(0,8).map((record) => <div key={record.id}><time>{new Date(record.recordedAt).toLocaleString()}</time><strong>{record.scenarioLabel}</strong><span className={record.passed ? 'pass' : 'fail'}>{record.passed ? 'PASS' : 'REPEAT'} · {record.score}</span><small>{record.responseSeconds}s response · {record.violations} rejected</small></div>)}</div>}
    </section>
  </section>;
}
