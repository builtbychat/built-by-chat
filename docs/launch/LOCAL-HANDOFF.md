# Local launch handoff dashboard

Run from the repository root:

```bash
npm run handoff
```

The dashboard opens at `http://127.0.0.1:4317`. Complete any useful fields and press **Save for Codex**. The localhost-only server atomically writes:

```text
private/handoff/user-input.json
```

That directory is git-ignored and the file is created with owner-only permissions. Confirm the saved content from a terminal with `npm run handoff:status`. Codex can read the same file in a later turn after the user says it has been saved.

Never enter passwords, OTPs, recovery codes, stream keys, API keys, tokens, payment-card data, or private moderation information. The server rejects common secret formats, but the user remains responsible for keeping credentials in the relevant password manager or provider UI.

The domain section records research preferences only. It never authorizes a purchase; Codex must still present the exact vendor, first-year charge, tax if known, billing period, and renewal price and then receive explicit approval.
