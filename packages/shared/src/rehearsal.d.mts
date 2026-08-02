export type RehearsalSeverity = 'none' | 'sev1' | 'sev2' | 'sev3';
export type RehearsalStatus = 'ready' | 'running' | 'alert' | 'complete' | 'ended';
export type RehearsalLogType = 'info' | 'cue' | 'alert' | 'action' | 'reject' | 'pass';

export interface RehearsalCue { id: string; targetSeconds: number; label: string; phase: string; detail: string; }
export interface RehearsalAction { label: string; seconds: number; detail: string; unsafe?: boolean; }
export interface RehearsalScenario {
  id: string; label: string; severity: RehearsalSeverity; injectAtSeconds: number | null; targetResponseSeconds: number;
  summary: string; signals: string[]; affectedSystems: string[]; requiredActions: string[]; decoyActions: string[];
  endsShow: boolean; invariant: string; viewerMessage?: string;
}
export interface RehearsalLog { atSeconds: number; type: RehearsalLogType; message: string; }
export interface RehearsalState {
  scenarioId: string; status: RehearsalStatus; currentSeconds: number; cueIndex: number; incidentInjected: boolean;
  actionIndex: number; completedActions: string[]; responseSeconds: number; violations: number; log: RehearsalLog[];
}
export interface RehearsalScore {
  score: number; grade: 'ready' | 'review' | 'repeat'; finished: boolean; requiredComplete: boolean;
  responseSeconds: number; targetResponseSeconds: number; violations: number; invariantProtected: boolean; passed: boolean;
}

export const SHOW_CUES: readonly RehearsalCue[];
export const REHEARSAL_ACTIONS: Readonly<Record<string, RehearsalAction>>;
export const REHEARSAL_SCENARIOS: readonly RehearsalScenario[];
export function getRehearsalScenario(id: string): RehearsalScenario;
export function createRehearsal(scenarioId?: string): RehearsalState;
export function startRehearsal(state: RehearsalState): RehearsalState;
export function injectRehearsalIncident(state: RehearsalState): RehearsalState;
export function advanceRehearsal(state: RehearsalState): RehearsalState;
export function applyRehearsalAction(state: RehearsalState, actionId: string): RehearsalState;
export function rehearsalScore(state: RehearsalState): RehearsalScore;
export function runReferenceRehearsal(scenarioId: string): { state: RehearsalState; score: RehearsalScore };
export function formatRehearsalClock(seconds: number): string;
