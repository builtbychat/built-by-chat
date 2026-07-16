# Launch operations

## Local

Run diagnostics, install dependencies, generate binding types, migrate/seed local D1, then run checks. Use Wrangler local persistence for API/DO work and Vite for UI iteration. Secrets live only in ignored `.dev.vars` or Wrangler’s encrypted store.

## Timeline

- July 16–23: local feature complete; account/domain checkpoints; moderator recruitment.
- July 24–29: production bindings, Access, email, platform artwork, run-throughs.
- July 30: private unlisted dual-platform rehearsal after explicit go-live approval.
- July 31–August 5: resolve rehearsal blockers; freeze risky changes 24 hours before air.
- August 6: public premiere, only after rehearsal sign-off.
- August 9: first playtest/town hall.

## Release checklist

- `npm run check`, dependency audit, Worker dry-run, Playwright desktop/tablet/mobile.
- Local D1 backup restore into staging.
- Production Turnstile, Access OTP, email routing/sending controlled tests.
- Screenshot review: landing, town, open vote, results, studio, banners, mobile.
- OBS local recording and unlisted rehearsal completed.
- Owner approves tag/deploy and separately approves any announcement or post.

## Data after every public show

Close all polls, confirm D1 immutable result rows, create a versioned town snapshot and release entry, then run the reviewed remote backup script. Store backups outside the public repository. Draft patch notes from the release entry and request publishing approval.
