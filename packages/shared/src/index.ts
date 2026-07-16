export type ShowStatus = 'draft' | 'scheduled' | 'live' | 'ended';
export type PollStatus = 'draft' | 'open' | 'closed';

export interface Show {
  id: string;
  episodeNumber: number;
  title: string;
  objective: string;
  startsAt: string;
  status: ShowStatus;
}

export interface PollOption { id: string; label: string; description?: string; }
export interface Poll {
  id: string;
  showId: string;
  question: string;
  options: PollOption[];
  status: PollStatus;
  openedAt?: string;
  closedAt?: string;
}
export interface VoteReceipt {
  receiptId: string;
  pollId: string;
  optionId: string;
  acceptedAt: string;
  changed: boolean;
}
export interface Idea { id: string; title: string; body: string; creditName?: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string; }
export interface Building { id: string; name: string; kind: string; x: number; y: number; width: number; height: number; color: string; status: 'planned' | 'built'; }
export interface Resident { id: string; name: string; role: string; x: number; y: number; color: string; }
export interface TownEvent { id: string; type: string; title: string; description: string; occurredAt: string; }
export interface TownState { width: 12; height: 8; name: string; buildings: Building[]; residents: Resident[]; events: TownEvent[]; version: number; }
export interface OverlayEvent { id: string; showId: string; type: 'vote-open' | 'vote-update' | 'vote-result' | 'message'; payload: Record<string, unknown>; createdAt: string; }
export interface ReleaseEntry { id: string; version: string; title: string; summary: string; publishedAt: string; }
export type PromptSourceType = 'poll_result' | 'approved_idea' | 'host_decision' | 'issue';
export type PromptDisposition = 'planned' | 'running' | 'accepted' | 'revised' | 'rejected' | 'failed';
export interface PromptRun {
  id: string;
  showId?: string;
  templateSlug: string;
  templateVersion: number;
  sourceType: PromptSourceType;
  sourceId: string;
  purpose: string;
  provider?: string;
  model?: string;
  promptHash?: string;
  outputHash?: string;
  inputSummary: string;
  outputSummary?: string;
  verificationSummary?: string;
  disposition: PromptDisposition;
  decisionSummary?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}
export type ShowPhase = 'pre_show' | 'welcome' | 'build' | 'vote' | 'results' | 'break' | 'tour' | 'ending' | 'emergency' | 'ended';
export interface ShowControl {
  showId: string; phase: ShowPhase; catchUp: string; showStartedAt?: string; phaseStartedAt?: string;
  emergencyMessage?: string; updatedAt: string; updatedBy?: string;
}
export interface ShowCue {
  id: string; showId: string; label: string; kind: 'cue' | 'checkpoint' | 'break' | 'vote';
  targetSeconds: number; status: 'pending' | 'done' | 'skipped'; displayOrder: number; completedAt?: string;
}
export interface StudioHealth { database: 'ok'; coordinator: 'ok'; accessConfigured: boolean; secretsConfigured: boolean; }
export interface StudioSnapshot { show: Show; control: ShowControl; cues: ShowCue[]; live: LiveState; health: StudioHealth; serverNow: string; }
export interface LiveState { show: Show | null; poll: Poll | null; counts: Record<string, number>; connectedViewers: number; control?: ShowControl; }
export interface FeedbackContext { show: Show | null; accepting: boolean; }
export interface FeedbackSummary { showId: string; responseCount: number; clarity: number; agency: number; accessibility: number; pendingNotes: number; }
export interface HostWorkload {
  showId: string; prepMinutes: number; liveMinutes: number; postMinutes: number; adminMinutes: number;
  stress: number; recovery: number; notes?: string; recordedAt: string;
}
export interface WorkloadSummary { entries: HostWorkload[]; fourWeekMinutes: number; averageStress: number; averageRecovery: number; }
