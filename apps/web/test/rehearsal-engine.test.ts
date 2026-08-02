import { describe, expect, it } from 'vitest';
import {
  REHEARSAL_SCENARIOS,
  applyRehearsalAction,
  createRehearsal,
  injectRehearsalIncident,
  rehearsalScore,
  runReferenceRehearsal,
  startRehearsal
} from '@tiny-signal-club/shared';

describe('rehearsal engine', () => {
  it('passes every complete reference playbook inside its response budget', () => {
    for (const scenario of REHEARSAL_SCENARIOS) {
      const result = runReferenceRehearsal(scenario.id);
      expect(result.score, scenario.id).toEqual(expect.objectContaining({ score: 100, passed: true, invariantProtected: true }));
    }
  });

  it('rejects chat reactions without advancing the vote-loss recovery', () => {
    const alert = injectRehearsalIncident(startRehearsal(createRehearsal('vote-path-loss')));
    const rejected = applyRehearsalAction(alert, 'infer-chat-winner');
    expect(rejected.status).toBe('alert');
    expect(rejected.actionIndex).toBe(0);
    expect(rejected.violations).toBe(1);
    expect(rejected.log.at(-1)?.type).toBe('reject');
  });

  it('moves a compressed incident to the cue it interrupts', () => {
    const alert = injectRehearsalIncident(startRehearsal(createRehearsal('microphone-loss')));
    expect(alert.currentSeconds).toBe(4050);
    expect(alert.cueIndex).toBe(7);
    expect(alert.log).toContainEqual(expect.objectContaining({ message: 'Compressed timeline to Build block two.' }));
  });

  it('ends rather than resumes after the credential-exposure playbook', () => {
    const result = runReferenceRehearsal('credential-exposure');
    expect(result.state.status).toBe('ended');
    expect(rehearsalScore(result.state).passed).toBe(true);
  });
});
