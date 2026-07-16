# Temporary Vercel preview

The Vercel deployment is a static visual/device-testing surface only. Cloudflare remains the production backend for voting, D1, Durable Objects, Access, Turnstile, and transactional email.

Build with `VITE_PREVIEW_MODE=true` so public pages use deterministic local preview data and do not issue unavailable API calls. Votes, idea persistence, studio actions, WebSockets, and email are intentionally disabled in this static preview.

`npm run preview:verify -- https://built-by-chat.vercel.app` renders all nine UI routes, requires CSP and `nosniff`, and fails on browser console/page errors. The current verified deployment passes 9/9 routes with zero browser errors.

The project uses the authenticated personal Hobby account at $0. Hobby is restricted to personal/non-commercial use, so do not use this preview for sponsorship fulfillment, monetization, or the public commercial launch. Never upgrade the plan or add billing without presenting the exact price and receiving explicit approval.
