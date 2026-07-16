import type { Building, LiveState, Poll, PromptDisposition, PromptRun, PromptSourceType, Resident, Show, TownEvent, TownState } from '@built-by-chat/shared';
import { LiveShow } from './live-show';
import { cookieValue, createIdentity, hashIdentifier, identityCookie, readJson, verifyIdentity, verifyTurnstile } from './security';

export { LiveShow };

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' };
const json = (data: unknown, status = 200, headers?: HeadersInit): Response =>
  Response.json(data, { status, headers: { ...jsonHeaders, ...headers } });
const error = (code: string, status: number, message: string): Response => json({ error: code, message }, status);
const promptTemplates = new Set(['build-task@1', 'visual-asset@1', 'episode-recap@1']);
function withSecurityHeaders(response: Response, request: Request, env: Env): Response {
  if (response.status === 101) return response;
  const secured = new Response(response.body, response);
  secured.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com wss:; frame-src https://challenges.cloudflare.com; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'self'");
  secured.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  secured.headers.set('X-Content-Type-Options', 'nosniff');
  secured.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  secured.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  if (env.ENVIRONMENT === 'production' && new URL(request.url).protocol === 'https:') secured.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  return secured;
}
function requiredSecret(env: object, name: string): string {
  const value: unknown = Reflect.get(env, name);
  if (typeof value !== 'string' || value.length < 16) throw new Error(`missing_secret:${name}`);
  return value;
}

function accessEmail(request: Request): string | null {
  return request.headers.get('Cf-Access-Authenticated-User-Email');
}

async function getActiveShow(env: Env): Promise<Show | null> {
  return await env.DB.prepare(
    `SELECT id, episode_number AS episodeNumber, title, objective, starts_at AS startsAt, status
     FROM shows WHERE status IN ('live','scheduled') ORDER BY CASE status WHEN 'live' THEN 0 ELSE 1 END, starts_at LIMIT 1`
  ).first<Show>();
}

async function getPoll(env: Env, showId: string): Promise<Poll | null> {
  const row = await env.DB.prepare(
    `SELECT id, show_id AS showId, question, status, opened_at AS openedAt, closed_at AS closedAt
     FROM polls WHERE show_id=? AND status IN ('open','draft') ORDER BY created_at DESC LIMIT 1`
  ).bind(showId).first<Omit<Poll, 'options'>>();
  if (!row) return null;
  const options = await env.DB.prepare('SELECT id,label,description FROM poll_options WHERE poll_id=? ORDER BY display_order').bind(row.id).all<Poll['options'][number]>();
  return { ...row, options: options.results };
}

async function townState(env: Env): Promise<TownState> {
  const [buildings, residents, events] = await Promise.all([
    env.DB.prepare('SELECT id,name,kind,x,y,width,height,color,status FROM buildings ORDER BY created_at').all<Building>(),
    env.DB.prepare('SELECT id,name,role,x,y,color FROM residents ORDER BY created_at').all<Resident>(),
    env.DB.prepare('SELECT id,type,title,description,occurred_at AS occurredAt FROM town_events ORDER BY occurred_at DESC LIMIT 50').all<TownEvent>()
  ]);
  return { width: 12, height: 8, name: 'Tiny Internet Town', buildings: buildings.results, residents: residents.results, events: events.results, version: events.results.length };
}

async function publicApi(request: Request, env: Env, url: URL): Promise<Response | null> {
  if (request.method === 'POST' && url.pathname === '/api/session') {
    const existing = cookieValue(request, 'bbc_identity');
    const identitySecret = requiredSecret(env, 'IDENTITY_SIGNING_SECRET');
    const id = await verifyIdentity(identitySecret, existing);
    if (id) return json({ ready: true });
    const signed = await createIdentity(identitySecret);
    return json({ ready: true }, 201, { 'Set-Cookie': identityCookie(signed) });
  }
  if (request.method === 'GET' && url.pathname === '/api/town') return json(await townState(env));
  if (request.method === 'GET' && url.pathname === '/api/events') {
    const rows = await env.DB.prepare('SELECT id,type,title,description,occurred_at AS occurredAt FROM town_events ORDER BY occurred_at DESC LIMIT 50').all<TownEvent>();
    return json(rows.results);
  }
  if (request.method === 'GET' && (url.pathname === '/api/state' || url.pathname === '/api/polls/active')) {
    const show = await getActiveShow(env);
    if (!show) return json(url.pathname.endsWith('active') ? null : { show: null, poll: null, counts: {}, connectedViewers: 0 });
    const poll = await getPoll(env, show.id);
    const live = await env.LIVE_SHOWS.getByName(show.id).getState();
    return json(url.pathname.endsWith('active') ? poll : { ...live, show, poll: live.poll ?? poll } satisfies LiveState);
  }
  const liveMatch = url.pathname.match(/^\/api\/live\/([^/]+)(\/socket)?$/);
  if (liveMatch?.[1] && request.method === 'GET') {
    const stub = env.LIVE_SHOWS.getByName(liveMatch[1]);
    return liveMatch[2] ? stub.fetch(request) : json(await stub.getState());
  }
  const voteMatch = url.pathname.match(/^\/api\/polls\/([^/]+)\/vote$/);
  if (voteMatch?.[1] && request.method === 'POST') {
    const signed = cookieValue(request, 'bbc_identity');
    const browserId = await verifyIdentity(requiredSecret(env, 'IDENTITY_SIGNING_SECRET'), signed);
    if (!browserId) return error('session_required', 401, 'Start a browser session before voting.');
    const body = await readJson<{ optionId?: string; turnstileToken?: string }>(request);
    if (!body.optionId || !body.turnstileToken) return error('invalid_vote', 400, 'An option and Turnstile token are required.');
    const poll = await env.DB.prepare('SELECT show_id AS showId,status FROM polls WHERE id=?').bind(voteMatch[1]).first<{ showId: string; status: string }>();
    if (!poll || poll.status !== 'open') return error('poll_closed', 409, 'This poll is not open.');
    const remoteIp = request.headers.get('CF-Connecting-IP') ?? 'local';
    const idempotencyKey = request.headers.get('Idempotency-Key') ?? crypto.randomUUID();
    if (!await verifyTurnstile(requiredSecret(env, 'TURNSTILE_SECRET'), body.turnstileToken, remoteIp, idempotencyKey)) return error('challenge_failed', 403, 'Bot protection could not verify this vote.');
    const networkSecret = requiredSecret(env, 'NETWORK_HASH_SECRET');
    const networkHash = await hashIdentifier(networkSecret, remoteIp);
    try {
      const receipt = await env.LIVE_SHOWS.getByName(poll.showId).castVote({ pollId: voteMatch[1], optionId: body.optionId, browserId, networkHash, idempotencyKey });
      return json(receipt, 202);
    } catch (caught) {
      const code = caught instanceof Error ? caught.message : 'vote_failed';
      return error(code, code === 'rate_limited' ? 429 : 409, 'The vote could not be accepted.');
    }
  }
  if (url.pathname === '/api/ideas' && request.method === 'POST') {
    const signed = cookieValue(request, 'bbc_identity');
    const browserId = await verifyIdentity(requiredSecret(env, 'IDENTITY_SIGNING_SECRET'), signed);
    if (!browserId) return error('session_required', 401, 'Start a browser session before submitting an idea.');
    const body = await readJson<{ title?: string; body?: string; creditName?: string; consent?: boolean; turnstileToken?: string }>(request);
    if (!body.title?.trim() || !body.body?.trim() || body.consent !== true || !body.turnstileToken) return error('invalid_idea', 400, 'Title, idea, consent, and verification are required.');
    if (body.title.length > 120 || body.body.length > 2000 || (body.creditName?.length ?? 0) > 80) return error('invalid_idea', 400, 'One or more fields are too long.');
    const remoteIp = request.headers.get('CF-Connecting-IP') ?? 'local';
    if (!await verifyTurnstile(requiredSecret(env, 'TURNSTILE_SECRET'), body.turnstileToken, remoteIp, crypto.randomUUID())) return error('challenge_failed', 403, 'Bot protection could not verify this submission.');
    const networkSecret = requiredSecret(env, 'NETWORK_HASH_SECRET');
    const id = crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO ideas (id,title,body,credit_name,consent_version,browser_hash,network_hash) VALUES (?,?,?,?,?,?,?)`).bind(
      id, body.title.trim(), body.body.trim(), body.creditName?.trim() || null, '2026-07-16', await hashIdentifier(networkSecret, browserId), await hashIdentifier(networkSecret, remoteIp)
    ).run();
    return json({ id, status: 'pending' }, 202);
  }
  return null;
}

async function adminApi(request: Request, env: Env, url: URL): Promise<Response | null> {
  if (!url.pathname.startsWith('/studio/api/')) return null;
  const email = accessEmail(request);
  if (!email) return error('access_required', 401, 'Cloudflare Access authentication is required.');
  if (url.pathname === '/studio/api/prompts/runs' && request.method === 'GET') {
    const showId = url.searchParams.get('showId');
    const sql = `SELECT id,show_id AS showId,template_slug AS templateSlug,template_version AS templateVersion,
      source_type AS sourceType,source_id AS sourceId,purpose,provider,model,prompt_hash AS promptHash,
      output_hash AS outputHash,input_summary AS inputSummary,output_summary AS outputSummary,
      verification_summary AS verificationSummary,disposition,decision_summary AS decisionSummary,
      started_at AS startedAt,completed_at AS completedAt,created_at AS createdAt
      FROM prompt_runs ${showId ? 'WHERE show_id=?' : ''} ORDER BY created_at DESC LIMIT 100`;
    const rows = showId ? await env.DB.prepare(sql).bind(showId).all<PromptRun>() : await env.DB.prepare(sql).all<PromptRun>();
    return json(rows.results);
  }
  if (url.pathname === '/studio/api/prompts/runs' && request.method === 'POST') {
    const body = await readJson<{
      showId?: string; templateSlug?: string; templateVersion?: number; sourceType?: PromptSourceType;
      sourceId?: string; purpose?: string; provider?: string; model?: string; inputSummary?: string;
      contextManifest?: string[]; gitCommit?: string; toolPermissions?: string[]; costCeilingCents?: number; correctionOfRunId?: string;
      retentionClass?: 'ephemeral' | 'operational' | 'permanent-summary';
    }>(request);
    const sourceTypes: PromptSourceType[] = ['poll_result', 'approved_idea', 'host_decision', 'issue'];
    const safePermissions = new Set(['read-repo', 'edit-repo', 'run-tests', 'local-preview', 'web-read', 'image-generation']);
    if (!body.templateSlug?.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/) || !Number.isInteger(body.templateVersion) || (body.templateVersion ?? 0) < 1 || !body.sourceType || !sourceTypes.includes(body.sourceType) || !body.sourceId?.trim() || !body.purpose?.trim() || !body.inputSummary?.trim()) return error('invalid_prompt_run', 400, 'Template, source, purpose, and sanitized input summary are required.');
    if (!promptTemplates.has(`${body.templateSlug}@${body.templateVersion}`)) return error('unknown_prompt_template', 400, 'Prompt template and version are not registered in this release.');
    if ((body.purpose?.length ?? 0) > 500 || (body.inputSummary?.length ?? 0) > 4000 || (body.sourceId?.length ?? 0) > 200) return error('invalid_prompt_run', 400, 'Prompt run text exceeds its limit.');
    if ((body.contextManifest?.length ?? 0) > 50 || body.contextManifest?.some((item) => item.length > 300) || (body.toolPermissions ?? []).some((item) => !safePermissions.has(item))) return error('invalid_prompt_run', 400, 'Context or tool permissions are invalid.');
    if (body.costCeilingCents !== undefined && (!Number.isInteger(body.costCeilingCents) || body.costCeilingCents < 0)) return error('invalid_prompt_run', 400, 'Cost ceiling must be a non-negative integer in cents.');
    if (body.gitCommit && !/^(?:[a-f0-9]{7,40}|working-tree)$/.test(body.gitCommit)) return error('invalid_prompt_run', 400, 'Git commit must be a commit hash or working-tree.');
    if (body.sourceType === 'poll_result' && !await env.DB.prepare('SELECT 1 FROM poll_results WHERE poll_id=? LIMIT 1').bind(body.sourceId).first()) return error('source_not_final', 409, 'Poll source must have a finalized result.');
    if (body.sourceType === 'approved_idea' && !await env.DB.prepare("SELECT 1 FROM ideas WHERE id=? AND status='approved'").bind(body.sourceId).first()) return error('source_not_approved', 409, 'Idea source must be approved.');
    if (body.correctionOfRunId && !await env.DB.prepare('SELECT 1 FROM prompt_runs WHERE id=?').bind(body.correctionOfRunId).first()) return error('correction_not_found', 409, 'Correction must reference an existing prompt run.');
    const id = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare(`INSERT INTO prompt_runs
        (id,show_id,template_slug,template_version,source_type,source_id,purpose,provider,model,input_summary,context_manifest,git_commit,tool_permissions,cost_ceiling_cents,retention_class,correction_of_run_id,actor_email)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(id, body.showId ?? null, body.templateSlug, body.templateVersion, body.sourceType, body.sourceId.trim(), body.purpose.trim(), body.provider?.trim() || null, body.model?.trim() || null, body.inputSummary.trim(), JSON.stringify(body.contextManifest ?? []), body.gitCommit ?? null, JSON.stringify(body.toolPermissions ?? []), body.costCeilingCents ?? null, body.retentionClass ?? 'operational', body.correctionOfRunId ?? null, email),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), 'prompt_run.create', 'prompt_run', id, email)
    ]);
    return json({ id, disposition: 'planned' }, 201);
  }
  const promptRun = url.pathname.match(/^\/studio\/api\/prompts\/runs\/([^/]+)$/);
  if (promptRun?.[1] && request.method === 'PATCH') {
    const body = await readJson<{
      disposition?: Exclude<PromptDisposition, 'planned'>; promptHash?: string; outputHash?: string;
      outputSummary?: string; verificationSummary?: string; decisionSummary?: string;
      actualCostCents?: number; publicSummary?: string; approvePublicSummary?: boolean; provider?: string; model?: string;
    }>(request);
    const dispositions: PromptDisposition[] = ['running', 'accepted', 'revised', 'rejected', 'failed'];
    if (!body.disposition || !dispositions.includes(body.disposition)) return error('invalid_disposition', 400, 'A valid next disposition is required.');
    const validHash = (value?: string) => value === undefined || /^[a-f0-9]{64}$/.test(value);
    if (!validHash(body.promptHash) || !validHash(body.outputHash) || (body.outputSummary?.length ?? 0) > 4000 || (body.verificationSummary?.length ?? 0) > 4000 || (body.decisionSummary?.length ?? 0) > 2000 || (body.publicSummary?.length ?? 0) > 2000) return error('invalid_prompt_run', 400, 'A hash or summary is invalid.');
    if (body.actualCostCents !== undefined && (!Number.isInteger(body.actualCostCents) || body.actualCostCents < 0)) return error('invalid_prompt_run', 400, 'Actual cost must be a non-negative integer in cents.');
    if (body.approvePublicSummary === true && (!body.publicSummary?.trim() || !['accepted', 'revised'].includes(body.disposition))) return error('invalid_public_summary', 400, 'Only accepted or revised runs can approve a non-empty public summary.');
    const current = await env.DB.prepare('SELECT disposition,cost_ceiling_cents AS costCeilingCents,provider,model FROM prompt_runs WHERE id=?').bind(promptRun[1]).first<{ disposition: PromptDisposition; costCeilingCents: number | null; provider: string | null; model: string | null }>();
    if (!current) return error('prompt_run_not_found', 404, 'Prompt run not found.');
    const transitions: Record<PromptDisposition, PromptDisposition[]> = {
      planned: ['running', 'rejected', 'failed'], running: ['accepted', 'revised', 'rejected', 'failed'], accepted: [], revised: [], rejected: [], failed: []
    };
    if (!transitions[current.disposition].includes(body.disposition)) return error('invalid_transition', 409, 'Final prompt records are immutable; create a correction run instead.');
    if (current.costCeilingCents !== null && body.actualCostCents !== undefined && body.actualCostCents > current.costCeilingCents) return error('cost_ceiling_exceeded', 409, 'Actual cost exceeds the recorded ceiling and requires review.');
    if (body.disposition === 'running' && !(body.provider?.trim() || current.provider) || body.disposition === 'running' && !(body.model?.trim() || current.model)) return error('model_required', 400, 'Provider and model are required when a run starts.');
    if (['accepted', 'revised'].includes(body.disposition) && (!body.promptHash || !body.outputHash || !body.outputSummary?.trim() || !body.verificationSummary?.trim() || !body.decisionSummary?.trim())) return error('evidence_required', 400, 'Accepted and revised runs require hashes plus output, verification, and decision summaries.');
    if (['rejected', 'failed'].includes(body.disposition) && !body.decisionSummary?.trim()) return error('decision_required', 400, 'Rejected and failed runs require a decision summary.');
    const completedAt = body.disposition === 'running' ? null : new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare(`UPDATE prompt_runs SET disposition=?,prompt_hash=COALESCE(?,prompt_hash),output_hash=COALESCE(?,output_hash),
        output_summary=COALESCE(?,output_summary),verification_summary=COALESCE(?,verification_summary),decision_summary=COALESCE(?,decision_summary),
        actual_cost_cents=COALESCE(?,actual_cost_cents),public_summary=COALESCE(?,public_summary),
        public_summary_approved_at=CASE WHEN ? THEN CURRENT_TIMESTAMP ELSE public_summary_approved_at END,
        started_at=CASE WHEN ?='running' THEN COALESCE(started_at,CURRENT_TIMESTAMP) ELSE started_at END,
        provider=COALESCE(?,provider),model=COALESCE(?,model),completed_at=COALESCE(?,completed_at) WHERE id=?`).bind(body.disposition, body.promptHash ?? null, body.outputHash ?? null, body.outputSummary?.trim() || null, body.verificationSummary?.trim() || null, body.decisionSummary?.trim() || null, body.actualCostCents ?? null, body.publicSummary?.trim() || null, body.approvePublicSummary === true ? 1 : 0, body.disposition, body.provider?.trim() || null, body.model?.trim() || null, completedAt, promptRun[1]),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email,metadata) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), 'prompt_run.update', 'prompt_run', promptRun[1], email, JSON.stringify({ disposition: body.disposition, publicSummaryApproved: body.approvePublicSummary === true }))
    ]);
    return json({ id: promptRun[1], disposition: body.disposition });
  }
  if (url.pathname === '/studio/api/shows' && request.method === 'POST') {
    const body = await readJson<{ episodeNumber?: number; title?: string; objective?: string; startsAt?: string }>(request);
    if (!Number.isInteger(body.episodeNumber) || !body.title?.trim() || !body.objective?.trim() || !body.startsAt || Number.isNaN(Date.parse(body.startsAt))) return error('invalid_show', 400, 'Episode number, title, objective, and start time are required.');
    const id = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO shows (id,episode_number,title,objective,starts_at,status) VALUES (?,?,?,?,?,?)').bind(id, body.episodeNumber, body.title.trim(), body.objective.trim(), body.startsAt, 'draft'),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), 'show.create', 'show', id, email)
    ]);
    return json({ id }, 201);
  }
  const createPoll = url.pathname === '/studio/api/polls' && request.method === 'POST';
  if (createPoll) {
    const body = await readJson<{ showId?: string; question?: string; options?: Array<{ label: string; description?: string }> }>(request);
    if (!body.showId || !body.question || !body.options || body.options.length < 2 || body.options.length > 8) return error('invalid_poll', 400, 'A show, question, and 2–8 options are required.');
    const id = crypto.randomUUID();
    const statements = [env.DB.prepare('INSERT INTO polls (id,show_id,question,status) VALUES (?,?,?,?)').bind(id, body.showId, body.question, 'draft')];
    body.options.forEach((option, index) => statements.push(env.DB.prepare('INSERT INTO poll_options (id,poll_id,label,description,display_order) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), id, option.label, option.description ?? null, index)));
    await env.DB.batch(statements);
    return json({ id }, 201);
  }
  const pollAction = url.pathname.match(/^\/studio\/api\/polls\/([^/]+)\/(open|close)$/);
  if (pollAction?.[1] && pollAction[2] && request.method === 'POST') {
    const poll = await getPollById(env, pollAction[1]);
    if (!poll) return error('poll_not_found', 404, 'Poll not found.');
    const stub = env.LIVE_SHOWS.getByName(poll.showId);
    if (pollAction[2] === 'open') {
      const state = await stub.openPoll(poll);
      await env.DB.batch([
        env.DB.prepare("UPDATE polls SET status='closed',closed_at=CURRENT_TIMESTAMP WHERE show_id=? AND status='open' AND id<>?").bind(poll.showId, poll.id),
        env.DB.prepare("UPDATE polls SET status='open',opened_at=CURRENT_TIMESTAMP WHERE id=?").bind(poll.id),
        env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), 'poll.open', 'poll', poll.id, email)
      ]);
      return json(state);
    }
    const result = await stub.closePoll(poll.id);
    const snapshotHash = await sha256(JSON.stringify({ pollId: poll.id, ...result }));
    const statements: D1PreparedStatement[] = [env.DB.prepare("UPDATE polls SET status='closed',closed_at=? WHERE id=?").bind(result.finalizedAt, poll.id)];
    for (const option of poll.options) statements.push(env.DB.prepare('INSERT OR IGNORE INTO poll_results (poll_id,option_id,vote_count,finalized_at,snapshot_hash) VALUES (?,?,?,?,?)').bind(poll.id, option.id, result.counts[option.id] ?? 0, result.finalizedAt, snapshotHash));
    statements.push(env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email,metadata) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), 'poll.close', 'poll', poll.id, email, JSON.stringify({ snapshotHash })));
    await env.DB.batch(statements);
    return json({ ...result, snapshotHash });
  }
  const moderation = url.pathname.match(/^\/studio\/api\/ideas\/([^/]+)\/moderate$/);
  if (moderation?.[1] && request.method === 'POST') {
    const body = await readJson<{ status?: 'approved' | 'rejected' }>(request);
    if (body.status !== 'approved' && body.status !== 'rejected') return error('invalid_status', 400, 'Moderation status must be approved or rejected.');
    const result = await env.DB.batch([
      env.DB.prepare('UPDATE ideas SET status=?,moderated_at=CURRENT_TIMESTAMP WHERE id=?').bind(body.status, moderation[1]),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email,metadata) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(), 'idea.moderate', 'idea', moderation[1], email, JSON.stringify({ status: body.status }))
    ]);
    return json({ updated: (result[0]?.meta.changes ?? 0) > 0 });
  }
  if (url.pathname === '/studio/api/town/events' && request.method === 'POST') {
    const body = await readJson<{ type?: string; title?: string; description?: string; payload?: Record<string, unknown> }>(request);
    if (!body.type?.trim() || !body.title?.trim() || !body.description?.trim()) return error('invalid_event', 400, 'Type, title, and description are required.');
    const id = crypto.randomUUID(); const occurredAt = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO town_events (id,type,title,description,occurred_at,payload) VALUES (?,?,?,?,?,?)').bind(id, body.type.trim(), body.title.trim(), body.description.trim(), occurredAt, JSON.stringify(body.payload ?? {})),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), 'town.event', 'town_event', id, email)
    ]);
    return json({ id, occurredAt }, 201);
  }
  if (url.pathname === '/studio/api/overlay' && request.method === 'POST') {
    const body = await readJson<{ showId?: string; type?: string; payload?: Record<string, unknown> }>(request);
    if (!body.showId || !body.type) return error('invalid_overlay', 400, 'Show and overlay type are required.');
    const event = { id: crypto.randomUUID(), type: body.type, payload: body.payload ?? {}, createdAt: new Date().toISOString() };
    await env.LIVE_SHOWS.getByName(body.showId).emitOverlay(event);
    return json(event, 202);
  }
  if (url.pathname === '/studio/api/releases' && request.method === 'POST') {
    const body = await readJson<{ version?: string; title?: string; summary?: string }>(request);
    if (!body.version?.trim() || !body.title?.trim() || !body.summary?.trim()) return error('invalid_release', 400, 'Version, title, and summary are required.');
    const id = crypto.randomUUID(); const publishedAt = new Date().toISOString();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO releases (id,version,title,summary,published_at) VALUES (?,?,?,?,?)').bind(id, body.version.trim(), body.title.trim(), body.summary.trim(), publishedAt),
      env.DB.prepare('INSERT INTO audit_log (id,action,subject_type,subject_id,actor_email) VALUES (?,?,?,?,?)').bind(crypto.randomUUID(), 'release.create', 'release', id, email)
    ]);
    return json({ id, publishedAt }, 201);
  }
  return error('not_found', 404, 'Studio action not found.');
}

async function getPollById(env: Env, id: string): Promise<Poll | null> {
  const row = await env.DB.prepare('SELECT id,show_id AS showId,question,status,opened_at AS openedAt,closed_at AS closedAt FROM polls WHERE id=?').bind(id).first<Omit<Poll, 'options'>>();
  if (!row) return null;
  const options = await env.DB.prepare('SELECT id,label,description FROM poll_options WHERE poll_id=? ORDER BY display_order').bind(id).all<Poll['options'][number]>();
  return { ...row, options: options.results };
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function runRetention(env: Env, now = new Date()): Promise<void> {
  const daysAgo = (days: number) => new Date(now.getTime() - days * 86_400_000).toISOString();
  const voteCutoff = daysAgo(30); const promptWeek = daysAgo(7); const promptYear = daysAgo(365); const auditYear = daysAgo(365);
  const shows = await env.DB.prepare("SELECT DISTINCT show_id AS showId FROM polls WHERE status='closed' AND closed_at < ?").bind(voteCutoff).all<{ showId: string }>();
  await Promise.all(shows.results.map((row) => env.LIVE_SHOWS.getByName(row.showId).purgePrivateState(voteCutoff)));
  await env.DB.batch([
    env.DB.prepare("DELETE FROM ideas WHERE status='rejected' AND moderated_at < ? AND NOT EXISTS (SELECT 1 FROM credits WHERE credits.idea_id=ideas.id)").bind(daysAgo(30)),
    env.DB.prepare("DELETE FROM ideas WHERE status='pending' AND created_at < ? AND NOT EXISTS (SELECT 1 FROM credits WHERE credits.idea_id=ideas.id)").bind(daysAgo(90)),
    env.DB.prepare("UPDATE prompt_runs SET input_summary='[expired]',output_summary=NULL,verification_summary=NULL,actor_email=NULL,context_manifest='[]',tool_permissions='[]' WHERE retention_class='ephemeral' AND created_at < ?").bind(promptWeek),
    env.DB.prepare("UPDATE prompt_runs SET input_summary='[expired]',output_summary=NULL,verification_summary=NULL,actor_email=NULL,context_manifest='[]',tool_permissions='[]' WHERE retention_class='operational' AND created_at < ?").bind(promptYear),
    env.DB.prepare('DELETE FROM audit_log WHERE created_at < ?').bind(auditYear)
  ]);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      const response = await publicApi(request, env, url) ?? await adminApi(request, env, url);
      if (response) return withSecurityHeaders(response, request, env);
      return withSecurityHeaders(await env.ASSETS.fetch(request), request, env);
    } catch (caught) {
      console.error(JSON.stringify({ event: 'request_error', path: url.pathname, error: caught instanceof Error ? caught.message : 'unknown' }));
      if (caught instanceof SyntaxError) return error('invalid_json', 400, 'The request body is not valid JSON.');
      if (caught instanceof Error && caught.message === 'payload_too_large') return error('payload_too_large', 413, 'The request body is too large.');
      return error('internal_error', 500, 'Something went wrong.');
    }
  },
  scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext): void {
    ctx.waitUntil(runRetention(env));
  }
} satisfies ExportedHandler<Env>;
