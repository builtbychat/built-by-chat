import type { PollStatus } from '@built-by-chat/shared';
export function assertPollOpen(status: PollStatus | undefined): asserts status is 'open' {
  if (status !== 'open') throw new Error('poll_closed');
}
