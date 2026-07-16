# Launch status — July 16, 2026

## Complete locally

- Monorepo app, Worker APIs, D1 migration/seed, per-show Durable Object, WebSocket hibernation, protected studio API boundary, Turnstile server verification, and responsive public interface.
- Brand SVGs, inspected raster hero, platform templates, OBS overlay/scene package, six Season One host packs, policies, community/sponsor drafts, scripts, and workflows.
- Versioned prompt templates, 12 adversarial eval cases, private D1 prompt ledger, immutable lifecycle/correction controls, Studio history, decision policy, retention cleanup, threat model, security headers, incident response, rights inventory, captions workflow, and privacy-safe metrics.
- Typecheck, lint, 7 Worker tests, 12 responsive Playwright checks, dependency audit, production build, local migration/seed, static/Worker security-header checks, real FFmpeg remux smoke test, overlay health, and Wrangler dry-run pass.
- Temporary static Vercel preview deployed at `https://built-by-chat.vercel.app` under `astral-productions/built-by-chat`. It uses Hobby at $0 for visual/device testing only; all nine UI routes render with response security headers and zero browser console/page errors.
- `npm run status` reads `docs/launch/PROGRESS.json` and prints the required 20-character progress board plus every pending/blocked task.

## Approval/user checkpoints

- Domain: `.com` is taken; `.live` returned unregistered via RDAP. No purchase made. Recheck the exact first-year, tax, and renewal total and request approval.
- GitHub: Phaenex CLI auth works; organization creation needs `admin:org` and approval. No remote repository created or published.
- Brand Google/social/Discord/Ko-fi accounts, 2FA, phone/CAPTCHA, and terms remain user-operated. Nothing posted or messaged.
- Cloudflare remote D1 currently has zero databases. Worker/Access/Turnstile/email resources and secrets are not created or deployed.
- Vercel preview does not provide votes, submissions, studio actions, WebSockets, D1, or email. Do not use the Hobby deployment for commercial launch or sponsorship fulfillment.
- OBS and DaVinci Resolve are installed; `ffmpeg` and `ffprobe` are available at `/opt/homebrew/bin` and remux successfully. Aitum Multistream was not found in the standard OBS plugin paths. In-app import, plugin setup, device configuration, and rehearsal remain pending.
- Rehearsal, dual streaming, transactional email tests, and public announcement remain pending explicit approval.
- Prompt failure/injection evals exist but must be replayed through the actual live operator workflow before premiere.
