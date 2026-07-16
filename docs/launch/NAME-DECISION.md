# Umbrella brand name decision

Status: **decision required; nothing has been renamed or purchased**  
Preliminary screening date: **July 16, 2026**

## Recommendation

Use **Build With Phaenex** as the working first choice, with **Tiny Internet Town** remaining the title of the first project.

It says what viewers are invited to do, gives the studio a distinctive owner, and still works if later seasons are not towns or even software. It also leaves the roles easy to explain:

> You decide. AI assists. Phaenex builds it live.

The existing house/chat/terminal icon can survive the rename. The wordmark, account handles, domains, email addresses, platform text, and embedded metadata cannot.

## Ranked shortlist

Scores are directional brand judgments, not legal clearance. Each category is scored from 1–5.

| Rank | Candidate | Fit | Clear aloud | Distinctive | Future-proof | Preliminary availability | Total / 25 | Main caution |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1 | **Build With Phaenex** | 5 | 5 | 5 | 5 | 5 | **25** | People may initially misspell Phaenex |
| 2 | **Phaenex & You** | 5 | 4 | 5 | 5 | 5 | **24** | Does not signal building or AI by itself |
| 3 | **Prompt Phaenex** | 5 | 3 | 5 | 5 | 5 | **23** | Sounds like a command; needs explanation |
| 4 | **Phaenex Assembly** | 4 | 3 | 5 | 5 | 5 | **22** | Feels more like an organization than a show |
| 5 | **People & Prompts** | 5 | 4 | 3 | 4 | 4 | **20** | Generic search terms; weak ownership |
| 6 | **Crowd & Cursor** | 5 | 4 | 3 | 4 | 5 | **21** | Reject despite the score: “Cursor” risks confusion with the established AI product brand |

## Preliminary availability screen

The checks below are snapshots, not reservations and not promises that a platform will allow a claim later. A final logged-in availability check must happen immediately before account creation. Domain registration must be rechecked at checkout with the exact first-year price, taxes/fees, and renewal price. No purchase is authorized by this document or the handoff form.

| Candidate handle | .com | .live | GitHub | YouTube | Twitch | TikTok | Bluesky | Instagram / X | Web/name collision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `buildwithphaenex` | RDAP not found | RDAP not found | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | no exact-match result found |
| `phaenexandyou` | RDAP not found | inconclusive | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | no exact-match result found |
| `promptphaenex` | RDAP not found | RDAP not found | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | no exact-match result found |
| `phaenexassembly` | RDAP not found | RDAP not found | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | no exact-match result found |
| `peopleandprompts` | inconclusive | RDAP not found | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | generic phrase risk |
| `crowdandcursor` | RDAP not found | RDAP not found | no user/org | no channel page | no account returned | no account page | no resolution | inconclusive | product-confusion risk |

“RDAP not found” usually means no current registration record was returned; it is not a price quote or purchase guarantee. “No account/page” means the public check did not find an existing identity at that exact handle. Instagram and X could not be verified reliably without their logged-in claim flows.

The exact-phrase web screen and preliminary USPTO/Justia-index searches returned no obvious exact-match brand records for the leading Phaenex candidates. That is only a knockout search, not a legal trademark opinion. Before meaningful sponsorship revenue, merchandise, or a trademark filing, run a professional clearance search for confusingly similar marks.

YouTube channel names can overlap, while handles are unique and distinct from channel names. The existing name collision therefore does not necessarily block the current channel, but a more distinctive searchable brand is still the better launch choice.

## Decision gate

Do not start the rename until Nicholas saves all of the following in the local handoff dashboard:

1. selected display name;
2. selected plain handle;
3. preferred primary domain and fallback;
4. spoken pronunciation guidance for Phaenex;
5. approved tagline;
6. explicit approval to begin the no-purchase rename pass.

Account claims and domain purchases remain separate checkpoints. Every purchase requires a fresh exact quote and explicit approval.

## Rename blast radius

The current repository contains about **80 files** with a Built by Chat name, slug, handle, URL, or package reference. The rename should be one controlled migration, not a blind find-and-replace.

### Safe to rename together

- Visible product text, page titles, metadata, footer copy, legal-policy names, documentation, draft publishing copy, and calendar labels.
- Code-native wordmarks, banners, panels, preview cards, animated intro/outro copy, lower thirds, thumbnail templates, and accessible SVG titles.
- Local dashboard title, fields, recommended accounts, domain choices, download filename, and operator task text.
- Public handle references and contact addresses after the destination accounts/domain actually exist.

### Keep stable initially

- Local folder `/Users/damato/Projects/built-by-chat` so scripts and open tools do not break mid-migration.
- Existing Cloudflare D1 database IDs and migration history. Internal database names can remain legacy identifiers because changing them adds risk without viewer value.
- Existing Vercel and Cloudflare preview URLs until replacement deployments are verified.
- Existing Git commit history, already-published PR links, and historical backup filenames.
- The **Tiny Internet Town** project title and town data model.

### Rename only with platform checkpoints

- GitHub organization and repository URLs; configure redirects and update branch protection/workflow secrets afterward.
- npm workspace scopes such as `@built-by-chat/*`; update imports, lockfile, build configuration, and tests in one commit.
- Cloudflare Worker names, routes, production origin, Access application, Turnstile hostname, email routes, and deployment workflows.
- Vercel project/alias, YouTube/Twitch/Discord/social identities, calendar UIDs, public email addresses, and OBS browser-source URLs.
- Domain, support page, sponsor contact, social preview, and public announcements.

## Controlled migration order

1. Save and approve the final identity decision; rerun the final exact-handle and domain screen.
2. Create a rename manifest mapping old display name, slug, scope, handle, hostnames, and email addresses to the new values.
3. Update repository-visible copy and code-native assets on a dedicated branch; keep infrastructure identifiers stable.
4. Run type, lint, unit, integration, Playwright, asset, overlay, calendar, and secret checks.
5. Verify every public page, Studio page, overlay, mobile view, link, email label, and downloadable file locally.
6. Claim free handles through user-operated platform checkpoints. Do not publish announcements yet.
7. Request an exact domain quote. Purchase only after explicit amount approval.
8. Configure and verify the new domain, email, Cloudflare, Vercel alias, OBS sources, and account links.
9. Preserve redirects/aliases from old URLs where the provider supports them.
10. Run an unlisted rehearsal using only new visible branding.
11. Publish the rename once, with a short “same town, clearer name” message, after final approval.

## Rollback rule

Until the new domain, platform identities, email forwarding, site, OBS collection, and rehearsal all pass, the rename branch must remain reversible. Do not delete the old Cloudflare Worker, Vercel alias, GitHub organization, or account identifiers during the transition.
