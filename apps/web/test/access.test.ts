import { env, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import type { StudioSnapshot } from '@tiny-signal-club/shared';
import { authenticateStudio } from '../worker/access';
describe('studio boundary', () => {
  it('blocks requests without Cloudflare Access identity and applies security headers', async () => { const response=await SELF.fetch('https://example.com/studio/api/polls',{method:'POST'}); expect(response.status).toBe(401); expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'self'"); expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff'); });
  it('records, updates, and lists a sanitized prompt run for an authorized operator', async () => {
    const headers = { 'Content-Type': 'application/json', 'Cf-Access-Authenticated-User-Email': 'operator@example.com' };
    const created = await SELF.fetch('https://example.com/studio/api/prompts/runs', { method: 'POST', headers, body: JSON.stringify({ templateSlug: 'build-task', templateVersion: 1, sourceType: 'issue', sourceId: 'issue-42', purpose: 'Build the chosen landmark', inputSummary: 'Approved scope and acceptance checks only.', contextManifest: ['apps/web/src/App.tsx'], gitCommit: 'working-tree', toolPermissions: ['read-repo', 'edit-repo', 'run-tests'], costCeilingCents: 0 }) });
    expect(created.status).toBe(201);
    const { id } = await created.json<{ id: string }>();
    const started = await SELF.fetch(`https://example.com/studio/api/prompts/runs/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ disposition: 'running', provider: 'test-provider', model: 'test-model' }) });
    expect(started.status).toBe(200);
    const updated = await SELF.fetch(`https://example.com/studio/api/prompts/runs/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ disposition: 'accepted', promptHash: 'a'.repeat(64), outputHash: 'b'.repeat(64), outputSummary: 'Landmark implemented.', verificationSummary: 'Type, lint, test, and build passed.', decisionSummary: 'Accepted after review.', actualCostCents: 0, publicSummary: 'Built the audience-selected landmark.', approvePublicSummary: true }) });
    expect(updated.status).toBe(200);
    const listed = await SELF.fetch('https://example.com/studio/api/prompts/runs', { headers });
    expect(listed.status).toBe(200);
    const rows = await listed.json<Array<{ id: string; disposition: string }>>();
    expect(rows).toContainEqual(expect.objectContaining({ id, disposition: 'accepted' }));
    const audit = await env.DB.prepare("SELECT COUNT(*) AS count FROM audit_log WHERE subject_id=?").bind(id).first<{ count: number }>();
    expect(audit?.count).toBe(3);
    const overwrite = await SELF.fetch(`https://example.com/studio/api/prompts/runs/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ disposition: 'running', provider: 'other', model: 'other' }) });
    expect(overwrite.status).toBe(409);
  });
  it('rejects approval-gated tool permissions in a prompt run', async () => {
    const response = await SELF.fetch('https://example.com/studio/api/prompts/runs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Cf-Access-Authenticated-User-Email': 'operator@example.com' }, body: JSON.stringify({ templateSlug: 'build-task', templateVersion: 1, sourceType: 'issue', sourceId: 'issue-99', purpose: 'Publish automatically', inputSummary: 'Unsafe authority request.', toolPermissions: ['publish'] }) });
    expect(response.status).toBe(400);
  });
  it('does not trust a spoofed Access email outside development', async () => {
    const request = new Request('https://example.com/studio/api/control', { headers: { 'Cf-Access-Authenticated-User-Email': 'operator@example.com' } });
    await expect(authenticateStudio(request, { ENVIRONMENT: 'production', ACCESS_TEAM_DOMAIN: 'https://replace-before-access.invalid', ACCESS_AUD: 'replace-before-access' })).resolves.toBeNull();
  });
  it('persists show phases and cue completion for the host cockpit', async () => {
    const id = `show-control-${crypto.randomUUID()}`;
    const cueId = `cue-${crypto.randomUUID()}`;
    await env.DB.batch([
      env.DB.prepare('INSERT INTO shows (id,episode_number,title,objective,starts_at,status) VALUES (?,?,?,?,?,?)').bind(id, Math.floor(Math.random()*1_000_000)+100, 'Control Test', 'Keep viewers oriented.', '2026-08-01T00:00:00Z', 'scheduled'),
      env.DB.prepare("INSERT INTO show_control (show_id,phase,catch_up) VALUES (?,'pre_show',?)").bind(id, 'Waiting to begin.'),
      env.DB.prepare("INSERT INTO show_cues (id,show_id,label,kind,target_seconds,display_order) VALUES (?,?,?,'checkpoint',0,0)").bind(cueId, id, 'Check the signal')
    ]);
    const headers = { 'Content-Type': 'application/json', 'Cf-Access-Authenticated-User-Email': 'operator@example.com' };
    const changed = await SELF.fetch(`https://example.com/studio/api/shows/${id}/control`, { method: 'PATCH', headers, body: JSON.stringify({ phase: 'welcome', catchUp: 'We are welcoming everyone and explaining the vote.' }) });
    expect(changed.status).toBe(200);
    expect(await changed.json()).toEqual(expect.objectContaining({ phase: 'welcome', catchUp: 'We are welcoming everyone and explaining the vote.' }));
    const cue = await SELF.fetch(`https://example.com/studio/api/shows/${id}/cues/${cueId}`, { method: 'PATCH', headers, body: JSON.stringify({ status: 'done' }) });
    expect(cue.status).toBe(200);
    const snapshot = await SELF.fetch(`https://example.com/studio/api/control?showId=${id}`, { headers });
    expect(snapshot.status).toBe(200);
    const snapshotBody = await snapshot.json<StudioSnapshot>();
    expect(snapshotBody.control.phase).toBe('welcome');
    expect(snapshotBody.cues).toContainEqual(expect.objectContaining({ id: cueId, status: 'done' }));
    const emergency = await SELF.fetch(`https://example.com/studio/api/shows/${id}/control`, { method: 'PATCH', headers, body: JSON.stringify({ phase: 'emergency', catchUp: 'Paused.' }) });
    expect(emergency.status).toBe(400);
    const audit = await env.DB.prepare("SELECT COUNT(*) AS count FROM audit_log WHERE subject_id IN (?,?)").bind(id, cueId).first<{ count: number }>();
    expect(audit?.count).toBe(2);
  });
  it('summarizes privacy-safe feedback and records a private workload check-in', async () => {
    const id = `show-feedback-${crypto.randomUUID()}`;
    const max = await env.DB.prepare('SELECT COALESCE(MAX(episode_number),0) AS value FROM shows').first<{ value: number }>();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO shows (id,episode_number,title,objective,starts_at,status) VALUES (?,?,?,?,?,?)').bind(id, (max?.value ?? 0)+1, 'Feedback Test', 'Learn carefully.', '2026-07-01T00:00:00Z', 'ended'),
      env.DB.prepare("INSERT INTO viewer_feedback (show_id,browser_hash,clarity,agency,accessibility,note,note_status) VALUES (?,?,?,?,?,?,'pending')").bind(id, 'scoped-hash', 5, 4, 3, 'Private note')
    ]);
    const headers = { 'Content-Type': 'application/json', 'Cf-Access-Authenticated-User-Email': 'operator@example.com' };
    const feedback = await SELF.fetch(`https://example.com/studio/api/feedback?showId=${id}`, { headers });
    expect(feedback.status).toBe(200);
    expect(await feedback.json()).toEqual(expect.objectContaining({ showId: id, responseCount: 1, clarity: 5, agency: 4, accessibility: 3, pendingNotes: 1 }));
    const saved = await SELF.fetch('https://example.com/studio/api/workload', { method: 'POST', headers, body: JSON.stringify({ showId:id,prepMinutes:180,liveMinutes:120,postMinutes:90,adminMinutes:30,stress:3,recovery:4,notes:'Recovery block protected.' }) });
    expect(saved.status).toBe(201);
    const workload = await SELF.fetch('https://example.com/studio/api/workload', { headers });
    expect(workload.status).toBe(200);
    const summary = await workload.json<{ entries: Array<{ showId: string }>; fourWeekMinutes: number }>();
    expect(summary.entries).toContainEqual(expect.objectContaining({ showId: id }));
    expect(summary.fourWeekMinutes).toBeGreaterThanOrEqual(420);
  });
});
