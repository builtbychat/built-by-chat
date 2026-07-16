# Contributing

Thank you for helping build the town. Open an issue before substantial work so live-show plans and code changes do not collide. Keep pull requests focused, include tests for behavior changes, and run `npm run check` before submitting.

By contributing code, you agree it may be distributed under MIT. Audience idea submissions use the separate [submission terms](docs/legal/SUBMISSION-TERMS.md). Do not commit secrets, credentials, stream keys, recordings, private moderation data, or raw viewer identifiers.

## Local setup

1. Install Node 22 or later and run `npm install`.
2. Run `npm run assets:validate`, `npm run db:migrate:local`, and `npm run db:seed:local`.
3. Set local secrets in `apps/web/.dev.vars`; never commit that file.
4. Run the Worker with `npm run dev -w @tiny-signal-club/web -- --host` and the chosen Cloudflare local workflow documented in [operations](docs/launch/OPERATIONS.md).
