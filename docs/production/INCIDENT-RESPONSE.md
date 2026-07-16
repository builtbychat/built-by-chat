# Incident and live recovery

## Severity

- **SEV-1:** credential/stream-key exposure, unauthorized admin action, personal-data disclosure, corrupted vote result, or account takeover. Stop the affected system or stream immediately.
- **SEV-2:** incorrect live counts, broken voting, unsafe content on broadcast, failed deploy, or major platform outage. Freeze decisions and move to the announced fallback.
- **SEV-3:** overlay, cosmetic, clip, caption, or non-authoritative display problem. Continue only if the audience can still understand and participate fairly.

## First response

1. Name the incident and start a timestamped private log.
2. Stop the damaging action: close/freeze the poll, hide the source, revoke the credential, or switch scenes.
3. Preserve D1 snapshots, audit records, local logs, recording timecodes, and the deployed version. Do not paste secrets or personal data into the incident log.
4. Use a rehearsed fallback: verbal vote deferral, local town tour, prepared activity, holding card, or ending the stream.
5. Rotate/revoke affected credentials from the provider interface. This is a human checkpoint.
6. Restore the last verified code/town snapshot and independently verify it.
7. Publish a concise correction only after facts are confirmed and Phaenex approves it.

## Decision integrity

If vote integrity is uncertain, do not infer a winner. Preserve the original poll, label it invalid with a reason category, and run a new linked poll. If prompt history is wrong, create a correction run. Never edit a final record in place.

## Afterward

Within 48 hours, document impact, timeline, root cause, detection gap, corrective work, and owner. Add a regression test or rehearsal scenario. Review whether users, platforms, sponsors, or authorities need notification; obtain appropriate legal advice for a real data incident.
