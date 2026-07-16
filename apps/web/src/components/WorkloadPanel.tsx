import { useEffect, useState } from 'react';
import type { StudioSnapshot, WorkloadSummary } from '@tiny-signal-club/shared';
import { api } from '../lib/api';

const initial = { prepMinutes: 0, liveMinutes: 120, postMinutes: 0, adminMinutes: 0, stress: 3, recovery: 3, notes: '' };

export function WorkloadPanel({ snapshot }: { snapshot: StudioSnapshot | null }) {
  const [form, setForm] = useState(initial);
  const [summary, setSummary] = useState<WorkloadSummary | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { void api.workload().then(setSummary).catch(() => setMessage('Workload history unavailable.')); }, []);
  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!snapshot) return;
    try {
      await api.saveWorkload({ showId: snapshot.show.id, ...form });
      setSummary(await api.workload()); setMessage('Private workload check-in saved.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save workload.'); }
  };
  return <article className="workload-card"><span>FOUR-WEEK HOST LOAD · PRIVATE</span><h2>{summary ? `${(summary.fourWeekMinutes / 60).toFixed(1)} hours recorded` : 'Loading history…'}</h2><p className="micro">Average stress {summary?.averageStress.toFixed(1) ?? '—'} / 5 · recovery {summary?.averageRecovery.toFixed(1) ?? '—'} / 5</p><form onSubmit={(event) => void save(event)}><div className="workload-fields">{(['prepMinutes','liveMinutes','postMinutes','adminMinutes'] as const).map(key => <label key={key}>{key.replace('Minutes',' minutes')}<input type="number" min="0" max="10080" value={form[key]} onChange={event => setForm({...form,[key]:Number(event.target.value)})} /></label>)}<label>Stress (1–5)<input type="number" min="1" max="5" value={form.stress} onChange={event => setForm({...form,stress:Number(event.target.value)})} /></label><label>Recovery (1–5)<input type="number" min="1" max="5" value={form.recovery} onChange={event => setForm({...form,recovery:Number(event.target.value)})} /></label></div><label>Private recovery note<textarea maxLength={1000} value={form.notes} onChange={event => setForm({...form,notes:event.target.value})} /></label><button className="button secondary" disabled={!snapshot}>Save workload check-in</button><p className="micro" aria-live="polite">{message}</p></form></article>;
}
