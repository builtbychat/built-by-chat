# Cloudflare provisioning and security

Run all external commands only after explicit approval. Local development is available without provisioning.

## Resources

1. Create `built-by-chat-staging` and `built-by-chat` D1 databases; replace placeholder IDs in `wrangler.jsonc` or use the current Wrangler automatic-provisioning workflow after reviewing its plan.
2. Apply migrations locally, then staging, then production. Seed only local/staging; production seed must be reviewed.
3. Create a managed Turnstile widget for `localhost`, `127.0.0.1`, the selected production hostname, and staging. Store `TURNSTILE_SECRET` using interactive `wrangler secret put`; never write it to source.
4. Set `IDENTITY_SIGNING_SECRET` and `NETWORK_HASH_SECRET` to separate high-entropy values using interactive secret prompts.
5. Deploy the Worker with Static Assets, D1, one SQLite Durable Object class, and the Email Sending binding.

## Access

Create a self-hosted Cloudflare Access application for `https://<domain>/studio/*` only. Add an Allow policy using one-time PIN for the brand Google address and the existing personal recovery address. Public routes and `/api/*` must remain outside the Access application; `/studio/api/*` stays inside. Test an unauthenticated 401 and both authorized OTP identities before launch.

## Turnstile validation

The browser widget includes `data-action="turnstile-spin-v2"`. Votes and ideas send the token to the Worker; only the Worker calls canonical `siteverify` and gates persistence on `success === true`. Production refuses missing secrets. Official test site key `1x00000000000000000000AA` is committed; its matching secret must remain local and uncommitted.

## Email

After domain approval:

```sh
npx wrangler email routing enable <domain>
npx wrangler email routing addresses create <brand-google-address>
npx wrangler email sending enable <domain>
```

Create the three forwarding rules in the dashboard/CLI and send controlled tests from/to real owned addresses. Confirm SPF, DKIM, and DMARC before transactional acknowledgements. Never use Email Sending for promotion or bulk mail.

## Release and rollback

Protected `main` runs CI. A `v*` tag enters the GitHub `production` environment, which must require owner approval before applying migrations and deploying. If health checks fail, use a reviewed Wrangler version rollback; do not migrate destructively during a show.
