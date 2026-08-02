# Threat model

## Protected assets

Vote integrity, immutable results, town history, private moderation records, prompt provenance, admin authority, account credentials, stream keys, recordings, brand reputation, and service availability.

## Trust boundaries

- Public browser ↔ Worker APIs and Turnstile.
- Worker ↔ per-show Durable Object and D1.
- Cloudflare Access ↔ private Studio APIs.
- OBS browser sources ↔ public live WebSocket state.
- Operator workstation ↔ GitHub, Cloudflare, YouTube, Twitch, Discord, and local recordings.
- Audience submissions, chat, web content, generated output, and files are untrusted input.

## Primary threats and controls

| Threat | Current control | Remaining validation |
|---|---|---|
| Duplicate/automated votes | Signed HttpOnly identity, Turnstile, rotating network hash, idempotency, one current selection | Burst and abuse rehearsal |
| Cross-show state leak | One Durable Object name per show | Isolation test exists; remote rehearsal |
| Result mutation | Persist-before-broadcast and immutable D1 snapshots/hashes | Backup/restore and correction drill |
| Studio impersonation | Cloudflare Access boundary and authenticated email audit | Configure OTP allowlist and test both identities |
| Prompt injection | Moderation, minimum context, permission allowlist, approval gates, adversarial evals | Run eval catalog with production workflow |
| Secret or personal-data disclosure | No secrets/raw IPs in git; bounded summaries; private ledger | Secret scan and operator rehearsal |
| Malicious payload/oversized input | JSON size limits, schema/length checks, parameterized SQL | Fuzz/error tests |
| XSS/content injection | React escaping, structured data, no raw HTML from submissions | Add and test response security headers |
| Cost or paid-action escalation | Per-run ceilings plus explicit purchase approval | Configure provider/account budget alerts |
| Account loss | Dedicated identities, 2FA requirement, offline recovery | Complete account setup and recovery drill |
| Recording/stream-key exposure | Sanitized OBS collection; keys excluded from git | Import inspection and recording storage policy |
| Dependency compromise | Lockfile, Dependabot, audit, required CI; the app uses `BrowserRouter` and does not enable unstable React Router RSC APIs | Resolve or record the RSC-only GHSA-qwww-vcr4-c8h2 audit exception before production; upgrade before any RSC adoption |

## Incident priorities

Protect people and credentials first, stop unauthorized actions second, preserve evidence third, restore verified state fourth, and communicate a factual correction last. Never erase an immutable vote or accepted prompt record to hide an incident; link a correction.
