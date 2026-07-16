import type { LiveState, PromptRun, ShowControl, ShowCue, ShowPhase, StudioSnapshot, TownState, VoteReceipt } from '@tiny-signal-club/shared';

const isStaticPreview = import.meta.env.VITE_PREVIEW_MODE === 'true';
const previewTown: TownState = {
  width: 12, height: 8, name: 'Tiny Internet Town', version: 1,
  buildings: [
    { id: 'town-hall', name: 'Town Hall', kind: 'civic', x: 4, y: 2, width: 2, height: 2, color: '#ff7b72', status: 'built' },
    { id: 'lot-one', name: 'Empty Lot A', kind: 'empty', x: 1, y: 1, width: 2, height: 2, color: '#26345c', status: 'planned' },
    { id: 'lot-two', name: 'Empty Lot B', kind: 'empty', x: 8, y: 1, width: 2, height: 2, color: '#26345c', status: 'planned' },
    { id: 'lot-three', name: 'Empty Lot C', kind: 'empty', x: 8, y: 5, width: 2, height: 2, color: '#26345c', status: 'planned' }
  ],
  residents: [{ id: 'resident-pip', name: 'Pip', role: 'Town caretaker', x: 6, y: 4, color: '#5de4c7' }], events: []
};
const previewState: LiveState = {
  show: { id: 'show-001', episodeNumber: 1, title: 'Founding Day', objective: 'Name the town and choose its first landmark.', startsAt: '2026-08-07T00:00:00Z', status: 'scheduled' },
  poll: null, counts: {}, connectedViewers: 0,
  control: { showId: 'show-001', phase: 'pre_show', catchUp: 'Founding Day starts Thursday at 7:00 PM CT. The first landmark vote is ready.', updatedAt: '2026-07-16T18:00:00Z' }
};
const previewSnapshot: StudioSnapshot = {
  show: previewState.show!, control: previewState.control!, live: previewState,
  cues: [
    { id: 'cue-signal', showId: 'show-001', label: 'Verify camera, mic, recording, both streams, and overlay', kind: 'checkpoint', targetSeconds: 0, status: 'pending', displayOrder: 0 },
    { id: 'cue-welcome', showId: 'show-001', label: 'Welcome and explain how protected voting works', kind: 'cue', targetSeconds: 300, status: 'pending', displayOrder: 1 },
    { id: 'cue-vote', showId: 'show-001', label: 'Open the first landmark vote', kind: 'vote', targetSeconds: 1800, status: 'pending', displayOrder: 2 },
    { id: 'cue-break', showId: 'show-001', label: 'Take the scheduled break', kind: 'break', targetSeconds: 3600, status: 'pending', displayOrder: 3 }
  ],
  health: { database: 'ok', coordinator: 'ok', accessConfigured: false, secretsConfigured: false }, serverNow: new Date().toISOString()
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, headers: { 'Content-Type': 'application/json', ...init?.headers } });
  const body = await response.json<T & { message?: string }>();
  if (!response.ok) throw new Error(body.message ?? 'Request failed');
  return body;
}

export const api = {
  session: () => isStaticPreview ? Promise.resolve({ ready: true as const }) : call<{ ready: true }>('/api/session', { method: 'POST' }),
  state: () => isStaticPreview ? Promise.resolve(previewState) : call<LiveState>('/api/state'),
  town: () => isStaticPreview ? Promise.resolve(previewTown) : call<TownState>('/api/town'),
  promptRuns: () => isStaticPreview ? Promise.resolve([] as PromptRun[]) : call<PromptRun[]>('/studio/api/prompts/runs'),
  studio: () => isStaticPreview ? Promise.resolve(previewSnapshot) : call<StudioSnapshot>('/studio/api/control'),
  updateControl: (showId: string, body: { phase: ShowPhase; catchUp: string; emergencyMessage?: string }) =>
    isStaticPreview ? Promise.resolve({ ...previewSnapshot.control, ...body }) : call<ShowControl>(`/studio/api/shows/${showId}/control`, { method: 'PATCH', body: JSON.stringify(body) }),
  updateCue: (showId: string, cueId: string, status: ShowCue['status']) =>
    isStaticPreview ? Promise.resolve({ id: cueId, status }) : call<{ id: string; status: ShowCue['status']; completedAt?: string }>(`/studio/api/shows/${showId}/cues/${cueId}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  vote: (pollId: string, optionId: string, turnstileToken: string, idempotencyKey: string) =>
    isStaticPreview ? Promise.reject(new Error('Voting is disabled on the static preview.')) : call<VoteReceipt>(`/api/polls/${pollId}/vote`, { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify({ optionId, turnstileToken }) }),
  idea: (body: { title: string; body: string; creditName: string; consent: boolean; turnstileToken: string }) =>
    isStaticPreview ? Promise.reject(new Error('Idea submission is disabled on the static preview.')) : call<{ id: string; status: string }>('/api/ideas', { method: 'POST', body: JSON.stringify(body) })
};
