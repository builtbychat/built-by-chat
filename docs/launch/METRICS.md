# Privacy-safe pilot metrics

The pilot answers one question: does a recurring audience show up, make understandable decisions, and return to see those decisions become a stable town? No third-party behavioral advertising or cross-site tracking is needed.

## Operational metrics

| Metric | Source | Pilot use |
|---|---|---|
| Valid final selections per poll | Immutable D1 aggregate | Participation and option clarity |
| Selection changes before close | Aggregate Durable Object counter/export | Whether choices need clarification |
| Rejected/rate-limited attempts | Aggregate security log | Abuse and false-positive tuning |
| WebSocket reconnect/error rate | Aggregate Worker observability | Live reliability |
| Vote-open to result latency | Audit timestamps | Operator/system responsiveness |
| Deploy/rollback and overlay failures | Incident log | Production stability |
| Approved ideas and credited contributors | D1 moderation/credit records | Community contribution health |
| Sunday issues found/resolved | Episode issue | Playtest usefulness |
| Recap/clip reach and return viewers | Platform aggregate dashboards | Format and schedule learning |

## Guardrails

- Do not export voter identities, raw IPs, full chat logs, or per-person cross-platform profiles.
- Report small cohorts conservatively and avoid combining fields that could identify a participant.
- If a new analytics product, cookie, pixel, or paid dashboard is proposed, document purpose, fields, retention, processor, consent need, exact cost, and obtain approval before enabling it.
- Platform numbers are directional and not directly comparable; note definition changes.

## Six-episode review

Compare episode-to-episode participation, poll completion, returning aggregate audience, error rate, idea quality/moderation load, Sunday findings, recap completion, and production hours. Continue or expand only if participation recurs without compromising vote integrity, accessibility, privacy, or operator sustainability.
