import { env } from 'cloudflare:test';
import type { Poll } from '@tiny-signal-club/shared';
import { describe, expect, it } from 'vitest';
import { assertPollOpen } from '../worker/poll-core';

const poll: Poll = { id: 'poll-test', showId: 'show-a', question: 'Choose?', status: 'draft', options: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }] };

describe('live show isolation and voting', () => {
  it('keeps separate show instances from leaking state', async () => {
    const a = env.LIVE_SHOWS.getByName('show-a'); const b = env.LIVE_SHOWS.getByName('show-b');
    await a.openPoll(poll);
    expect((await a.getState()).poll?.id).toBe('poll-test');
    expect((await b.getState()).poll).toBeNull();
  });
  it('changes a browser selection and makes retries idempotent', async () => {
    const show = env.LIVE_SHOWS.getByName('vote-change'); await show.openPoll({ ...poll, showId: 'vote-change' });
    const first = await show.castVote({ pollId: poll.id, optionId: 'a', browserId: 'browser', networkHash: 'network', idempotencyKey: 'one' });
    const retry = await show.castVote({ pollId: poll.id, optionId: 'a', browserId: 'browser', networkHash: 'network', idempotencyKey: 'one' });
    const changed = await show.castVote({ pollId: poll.id, optionId: 'b', browserId: 'browser', networkHash: 'network', idempotencyKey: 'two' });
    expect(retry.receiptId).toBe(first.receiptId); expect(changed.changed).toBe(true);
    expect((await show.getState()).counts).toEqual({ b: 1 });
  });
  it('freezes the result and rejects later votes', async () => {
    const show = env.LIVE_SHOWS.getByName('close'); await show.openPoll({ ...poll, showId: 'close' });
    await show.castVote({ pollId: poll.id, optionId: 'a', browserId: 'browser', networkHash: 'network', idempotencyKey: 'one' });
    const first = await show.closePoll(poll.id); const retry = await show.closePoll(poll.id);
    expect(retry).toEqual(first);
    expect(() => assertPollOpen('closed')).toThrow('poll_closed');
  });
});
