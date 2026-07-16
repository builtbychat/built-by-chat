# Launch operations

## Local

Run diagnostics, install dependencies, generate binding types, migrate/seed local D1, then run checks. Use Wrangler local persistence for API/DO work and Vite for UI iteration. Secrets live only in ignored `.dev.vars` or Wrangler’s encrypted store.

## Studio control and Access

The Studio is backed by D1 `show_control` and `show_cues` records. Phase changes persist before a `show-control` overlay event is broadcast. The live page reloads the durable catch-up state when that event arrives. The control room exposes one elapsed clock, run-of-show cue completion, current poll health, configuration health, and rehearsable technical-pause, hold-screen, and ending actions.

Development accepts the Access email header so local Worker tests and previews work. Staging and production do not trust that header by itself: they verify `Cf-Access-Jwt-Assertion` against the configured team-domain JWKS, issuer, audience, expiry, and signature. After creating the Access application, replace `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` in both environment blocks, regenerate types, and run the unauthorized/authorized OTP checks. Placeholder values intentionally deny every production Studio request.

Host sequence:

1. Open `/studio`, confirm all four health indicators, and complete the signal-check cue.
2. Keep the catch-up message useful on its own, then select the current phase.
3. Mark cues done or skipped as the show moves; the clock always uses the persisted show start.
4. Use Technical pause or Hold screen only for rehearsed recoverable failures. End show changes the durable show status to ended.
5. Confirm the viewer `/live` context and OBS overlay before continuing after any emergency action.

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
