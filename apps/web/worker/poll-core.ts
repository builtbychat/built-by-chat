import type { PollStatus } from '@tiny-signal-club/shared';
export function assertPollOpen(status: PollStatus | undefined): asserts status is 'open' {
  if (status !== 'open') throw new Error('poll_closed');
}
