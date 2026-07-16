import { DurableObject } from 'cloudflare:workers';
import type { LiveState, Poll, VoteReceipt } from '@built-by-chat/shared';
import { assertPollOpen } from './poll-core';

interface VoteRow extends Record<string, SqlStorageValue> { browser_id: string; option_id: string; receipt_id: string; accepted_at: string; idempotency_key: string; }
interface PollRow extends Record<string, SqlStorageValue> { id: string; payload: string; status: string; opened_at: string | null; closed_at: string | null; }

export class LiveShow extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    void ctx.blockConcurrencyWhile(() => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS poll_state (
          id TEXT PRIMARY KEY, payload TEXT NOT NULL, status TEXT NOT NULL,
          opened_at TEXT, closed_at TEXT
        );
        CREATE TABLE IF NOT EXISTS votes (
          poll_id TEXT NOT NULL, browser_id TEXT NOT NULL, option_id TEXT NOT NULL,
          receipt_id TEXT NOT NULL, accepted_at TEXT NOT NULL, idempotency_key TEXT NOT NULL,
          PRIMARY KEY (poll_id, browser_id), UNIQUE (poll_id, browser_id, idempotency_key)
        );
        CREATE TABLE IF NOT EXISTS rate_limits (
          network_hash TEXT NOT NULL, bucket TEXT NOT NULL, attempts INTEGER NOT NULL,
          PRIMARY KEY (network_hash, bucket)
        );
        CREATE TABLE IF NOT EXISTS overlay_events (
          id TEXT PRIMARY KEY, type TEXT NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL
        );
      `);
      return Promise.resolve();
    });
  }

  getState(): LiveState {
    const row = this.ctx.storage.sql.exec<PollRow>("SELECT * FROM poll_state WHERE status IN ('open','closed') ORDER BY opened_at DESC LIMIT 1").toArray()[0];
    const poll = row ? JSON.parse(row.payload) as Poll : null;
    return { show: null, poll, counts: poll ? this.counts(poll.id) : {}, connectedViewers: this.ctx.getWebSockets().length };
  }

  openPoll(poll: Poll): LiveState {
    const now = new Date().toISOString();
    const opened = { ...poll, status: 'open' as const, openedAt: now };
    this.ctx.storage.sql.exec(
      `INSERT INTO poll_state (id,payload,status,opened_at) VALUES (?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,status=excluded.status,opened_at=excluded.opened_at,closed_at=NULL`,
      poll.id, JSON.stringify(opened), 'open', now
    );
    const state = this.getState();
    this.broadcast({ type: 'poll-open', state });
    return state;
  }

  async castVote(input: { pollId: string; optionId: string; browserId: string; networkHash: string; idempotencyKey: string }): Promise<VoteReceipt> {
    await Promise.resolve();
    const pollRow = this.ctx.storage.sql.exec<PollRow>('SELECT * FROM poll_state WHERE id = ?', input.pollId).toArray()[0];
    if (!pollRow) throw new Error('poll_closed');
    assertPollOpen(pollRow.status as Poll['status']);
    const poll = JSON.parse(pollRow.payload) as Poll;
    if (!poll.options.some((option) => option.id === input.optionId)) throw new Error('invalid_option');
    const bucket = new Date().toISOString().slice(0, 16);
    const attempts = this.ctx.storage.sql.exec<{ attempts: number }>('SELECT attempts FROM rate_limits WHERE network_hash=? AND bucket=?', input.networkHash, bucket).toArray()[0]?.attempts ?? 0;
    if (attempts >= 30) throw new Error('rate_limited');
    this.ctx.storage.sql.exec(
      `INSERT INTO rate_limits (network_hash,bucket,attempts) VALUES (?,?,1)
       ON CONFLICT(network_hash,bucket) DO UPDATE SET attempts=attempts+1`, input.networkHash, bucket
    );
    const existing = this.ctx.storage.sql.exec<VoteRow>('SELECT * FROM votes WHERE poll_id=? AND browser_id=?', input.pollId, input.browserId).toArray()[0];
    if (existing?.idempotency_key === input.idempotencyKey) {
      return { receiptId: existing.receipt_id, pollId: input.pollId, optionId: existing.option_id, acceptedAt: existing.accepted_at, changed: false };
    }
    const now = new Date().toISOString();
    const receiptId = crypto.randomUUID();
    this.ctx.storage.sql.exec(
      `INSERT INTO votes (poll_id,browser_id,option_id,receipt_id,accepted_at,idempotency_key) VALUES (?,?,?,?,?,?)
       ON CONFLICT(poll_id,browser_id) DO UPDATE SET option_id=excluded.option_id,receipt_id=excluded.receipt_id,accepted_at=excluded.accepted_at,idempotency_key=excluded.idempotency_key`,
      input.pollId, input.browserId, input.optionId, receiptId, now, input.idempotencyKey
    );
    const receipt = { receiptId, pollId: input.pollId, optionId: input.optionId, acceptedAt: now, changed: Boolean(existing) };
    this.broadcast({ type: 'vote-update', pollId: input.pollId, counts: this.counts(input.pollId) });
    return receipt;
  }

  closePoll(pollId: string): { counts: Record<string, number>; finalizedAt: string } {
    const row = this.ctx.storage.sql.exec<PollRow>('SELECT * FROM poll_state WHERE id=?', pollId).toArray()[0];
    if (!row) throw new Error('poll_not_found');
    if (row.status === 'closed' && row.closed_at) return { counts: this.counts(pollId), finalizedAt: row.closed_at };
    if (row.status !== 'open') throw new Error('poll_not_open');
    const finalizedAt = new Date().toISOString();
    const poll = { ...(JSON.parse(row.payload) as Poll), status: 'closed' as const, closedAt: finalizedAt };
    this.ctx.storage.sql.exec('UPDATE poll_state SET payload=?,status=?,closed_at=? WHERE id=?', JSON.stringify(poll), 'closed', finalizedAt, pollId);
    const result = { counts: this.counts(pollId), finalizedAt };
    this.broadcast({ type: 'poll-result', poll, ...result });
    return result;
  }

  emitOverlay(event: { id: string; type: string; payload: Record<string, unknown>; createdAt: string }): void {
    this.ctx.storage.sql.exec('INSERT INTO overlay_events (id,type,payload,created_at) VALUES (?,?,?,?)', event.id, event.type, JSON.stringify(event.payload), event.createdAt);
    this.broadcast({ type: 'overlay', event });
  }

  purgePrivateState(beforeIso: string): void {
    this.ctx.storage.sql.exec('DELETE FROM votes WHERE poll_id IN (SELECT id FROM poll_state WHERE closed_at IS NOT NULL AND closed_at < ?)', beforeIso);
    this.ctx.storage.sql.exec('DELETE FROM rate_limits WHERE bucket < ?', beforeIso.slice(0, 16));
    this.ctx.storage.sql.exec('DELETE FROM overlay_events WHERE created_at < ?', beforeIso);
  }

  override fetch(request: Request): Response {
    if (request.headers.get('Upgrade') !== 'websocket') return new Response('Expected WebSocket', { status: 426 });
    const pair = new WebSocketPair();
    this.ctx.acceptWebSocket(pair[1]);
    pair[1].send(JSON.stringify({ type: 'state', state: this.getState() }));
    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  override webSocketMessage(socket: WebSocket, message: string | ArrayBuffer): void {
    if (typeof message === 'string' && message === 'ping') socket.send('pong');
  }

  override webSocketClose(socket: WebSocket, code: number, reason: string): void {
    socket.close(code, reason);
  }

  private counts(pollId: string): Record<string, number> {
    const rows = this.ctx.storage.sql.exec<{ option_id: string; count: number }>('SELECT option_id, COUNT(*) AS count FROM votes WHERE poll_id=? GROUP BY option_id', pollId).toArray();
    return Object.fromEntries(rows.map((row) => [row.option_id, row.count]));
  }

  private broadcast(event: unknown): void {
    const payload = JSON.stringify(event);
    for (const socket of this.ctx.getWebSockets()) {
      try { socket.send(payload); } catch { socket.close(1011, 'Delivery failed'); }
    }
  }
}
