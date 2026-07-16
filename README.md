# Tiny Signal Club

**Small signals become big, strange things.**

Tiny Signal Club is a public, audience-directed live-making studio hosted by Phaenex. Small signals—ideas, prompts, votes, tests, and contributions—become real projects in public. Project One, **Tiny Internet Town**, is an accessible illustrated town whose buildings, residents, civic choices, and strange little problems are chosen through protected live votes. Future club projects are not limited to towns or software.

Temporary visual test site: [built-by-chat.vercel.app](https://built-by-chat.vercel.app). This static $0 preview does not enable voting, submissions, studio mutations, or the Cloudflare real-time backend.

## Launch schedule

- Private rehearsal: Thursday, July 30, 2026
- Public premiere: Thursday, August 6, 2026 at 7:00 PM CT
- First **Modem Picnic** playtest/town hall: Sunday, August 9, 2026 at 3:00 PM CT
- Thursdays: two-hour live build simulcast to YouTube and Twitch
- Sundays: **The Modem Picnic** playtest and town hall

No account is required to participate. Support is optional and never buys votes or creative control.

## Architecture

This npm-workspaces monorepo uses React, Vite, Cloudflare Workers Static Assets, D1, and one SQLite-backed Durable Object per show. The Durable Object persists poll state and the latest browser selection before broadcasting WebSocket events through the Hibernation API. Closing a poll writes an immutable hashed result snapshot to D1.

The private Studio uses persisted show phases and run-of-show cues, provides one host clock plus health/emergency controls, and sends durable catch-up state to viewers and OBS. Production Studio APIs validate the signed Cloudflare Access JWT in the Worker in addition to the edge policy; placeholder Access configuration fails closed.

```text
apps/web           React interface + Worker + Durable Object
packages/shared    Shared TypeScript contracts
migrations         D1 schema and seed state
brand              Code-native marks, raster hero, editable templates
obs                Sanitized scene collection and browser overlays
scripts            Diagnostics, content, recording, backup automation
docs               Brand, launch, episode, community, and production guides
prompts            Versioned templates + sanitized run-record workflow
```

## Start locally

```sh
npm install
npm run cf:types
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Copy `.env.example` only as a reference. Put local Worker secrets in `apps/web/.dev.vars`; production secrets must be created interactively with Wrangler. Official Turnstile test keys are used until a production widget is explicitly approved.

## Safety and licensing

Source code is MIT licensed. Brand names, logo, characters, and original media are reserved; see [TRADEMARKS.md](TRADEMARKS.md). Never commit account credentials, recovery codes, stream keys, API tokens, raw viewer IPs, or private moderation exports.

External purchases, publishing, sending messages, production deployment, and going live always require explicit owner approval.

AI-assisted production follows the auditable workflow in [Prompt operations](docs/production/PROMPT-OPERATIONS.md). Validate templates with `npm run prompt:validate`; create a sanitized episode run record with `npm run prompt:new -- <episode> <template-slug> <short-title>`.

Run `npm run status` for the repository-backed launch progress board and complete list of remaining tasks.

The living gate catalog is documented in [Launch completeness audit](docs/launch/COMPLETENESS-AUDIT.md); new risks must be added to `docs/launch/PROGRESS.json` instead of being left in chat.
