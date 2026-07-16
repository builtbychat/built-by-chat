import { env, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
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
});
