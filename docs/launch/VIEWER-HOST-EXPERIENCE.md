# Viewer-first, host-sustainable operating plan

This is the operating layer between “the technology works” and “people want to return.” It is deliberately independent of the final umbrella brand name.

## Launch promise

Every viewer should be able to answer these questions within 15 seconds:

1. What are we making?
2. What can I decide right now?
3. Where do I vote?
4. When will the result affect the build?
5. What did the audience already change?

The host should be able to run a normal episode from one show clock, one cue list, one authoritative vote page, one private moderator channel, and a small set of rehearsed emergency actions.

## Recommended pilot defaults

- Stream at 1080p30 initially. It is easier to encode, read, record, and simulcast reliably than 60 fps for a show centered on speech, code, and illustrated UI.
- Use YouTube **low latency**, not ultra-low latency, for the pilot; keep DVR on. Low latency balances interaction with buffering risk, while DVR lets late viewers rewind and catch up.
- Keep site voting authoritative. Platform chats can discuss and nominate, but do not create competing final polls.
- Open major polls for 6 minutes, give spoken and visual warnings at 60 and 15 seconds, and allow choice changes until close.
- Show all options in readable text, read each aloud once, explain the practical consequence, and display a private receipt without identifying voters publicly.
- Run a 5-minute Starting Soon screen, a 45-second “previously on,” a 90-second first-time-viewer orientation, one 5-minute break, and an 18-second outro.
- Repeat the 15-second orientation after the break and immediately before the final vote. Pin the vote link and keep `!vote`, `!town`, `!schedule`, `!rules`, and `!help` commands consistent.
- Use captions on both platforms, verbal descriptions for important visual changes, no color-only state, reduced-motion alternatives, and a low-bandwidth town/status view.
- Staff one primary moderator and one backup for the premiere. If only one is available, reduce idea intake and chat complexity rather than asking the host to moderate while building.
- Keep the host’s weekly production budget explicit. Cut optional clips or social posts before cutting sleep, rehearsal, captions, backups, or moderation.

## The viewer journey

### Before the show

- One canonical event page in local time and Central time, with calendar download and platform links.
- A short trailer that demonstrates the loop: audience chooses → Phaenex builds with AI → tests run → town remembers.
- Discord Scheduled Event and announcement draft; interested members can opt into event notifications.
- A plain agenda naming the night’s objective, likely decisions, participation rules, and accessibility notes.
- Never require Discord membership, payment, or an account to watch or cast a core vote.

### Arrival

- Starting Soon screen includes exact start time, captions status, vote URL/QR code, sound-check indicator, and “new here?” explanation.
- Welcome says what the show is, who Phaenex is, how AI is used, what viewers control, and what the host retains responsibility for.
- “Previously on” shows the last verified audience decision and the shipped result, not a vague montage.
- The live page shows current objective, progress, active/next vote, recent change, platform links, and connection state without making viewers hunt.

### During the build

- Never leave a first-time viewer without context for more than about five minutes. Use a small persistent objective/progress label.
- Explain outcomes, not every keystroke. Narrate why a prompt is being shaped, what evidence is checked, and what the test proves.
- Make AI visible but not theatrical: show a sanitized prompt summary, model/tool class, accepted/rejected output, edits, and verification result.
- Use a “host call” label for safety, feasibility, legal, or time-box decisions that the audience does not control.
- Create a marker whenever a vote opens/closes, a build reveals, something funny happens, a fallback begins, or a correction is issued.
- Do not read private logs, raw IPs, moderation evidence, secrets, or unreviewed audience submissions on screen.

### Voting ritual

1. State the decision in one sentence.
2. Explain each option and its likely consequence.
3. State the close time and whether the outcome is binding, advisory, or a nomination.
4. Open the site poll only after state is persisted.
5. Confirm receipt and allow changes; keep identities private.
6. Warn at 60 and 15 seconds.
7. Close once, save the immutable result, and display the same result on site and overlay.
8. Say what happens next and when viewers will see it.
9. If tied, unsafe, infeasible, or technically invalid, follow the published decision policy and label the intervention.

### Break and re-entry

- Five-minute countdown with return time, muted-mic indicator, current town view, and vote state.
- On return, deliver a 20-second recap and repeat the participation link.
- The host gets water, posture, audio, dropped-frame, disk-space, chat-safety, and next-cue checks—not production chores.

### Ending and aftercare

- Tour exactly what changed, show the winning result, list known defects, thank credited contributors, and name the next event.
- Do not pretend incomplete work shipped. Move it to the roadmap with an owner/status.
- Publish viewer-friendly patch notes from verified release data.
- Produce one recap and the strongest clips first. Three shorts are a target, not a promise that overrides quality or recovery.
- Sunday town hall tests the shipped change, collects structured feedback, reviews defects, and nominates the next shortlist; final decisions remain on the site.

## Host cockpit

The private `/studio` surface should eventually become the only operational dashboard needed during the show:

- show clock, segment clock, overrun warning, current objective, next cue, and break reminder;
- stream/recording indicators, dropped frames, reconnect state, free disk, captions status, and platform health links;
- active poll state, exact counts, open/close/warn actions, immutable result confirmation, and overlay state;
- sanitized prompt run status, risk flags, tests, accept/reject/defer controls, and marker button;
- moderator presence, private escalation signal, paused-submission state, and safety notes;
- large rehearsed actions: hide overlay, close poll, pause submissions, switch to fallback, mute desktop, BRB, and end safely.

Use OBS Profiles to separate stream/recording settings from Scene Collections. Export both after rehearsal without secrets. Map a small hotkey set for starting/stopping recording, scene changes, microphone mute, markers, and the emergency break scene; print the map beside the host.

## Pacing template for the two-hour Thursday show

| Time | Segment | Viewer outcome | Host load |
| --- | --- | --- | --- |
| -05:00 | Starting Soon | Join, check sound/captions, learn how to vote | Final preflight only |
| 00:00 | Intro + welcome | Understand the premise | Rehearsed script |
| 03:00 | Previously on + town tour | See continuity and impact | Tour known state |
| 10:00 | Objective + first vote | Make first meaningful choice | Poll ritual |
| 20:00 | Build block 1 | Watch decision become a scoped change | Narrate outcomes |
| 45:00 | Verify + reveal | See tests and visible result | Use checklist |
| 55:00 | Break | Return at a known time | Actual rest |
| 60:00 | Re-entry + second vote | Rejoin without lost context | 20-second recap |
| 70:00 | Build block 2 | Shape detail or behavior | Narrate outcomes |
| 100:00 | Tour + defects | See honest shipped state | Stop adding scope |
| 110:00 | Final vote / roadmap | Influence next work | Persist result |
| 117:00 | Thanks + next event | Know what happens next | Rehearsed outro |

If 15 minutes behind, drop optional polish. If 30 minutes behind, stop the second build block and turn it into a scoped roadmap item. Never steal from the closing result/tour or safe shutdown.

## Moderation and community care

- Primary moderator watches public chat; backup covers breaks and escalations. Phaenex is not the first-line moderator while live building.
- Use a private moderator channel with three signals: **yellow** slow/redirect, **orange** pause submissions or hide content, **red** switch scene/mute/end.
- Prewrite responses for spoilers, repeated spam, personal attacks, unsafe suggestions, doxxing, sexual content, self-harm threats, illegal instructions, and platform raids.
- Never display a removed submission to explain why it was removed. Preserve minimum private evidence under the retention policy.
- Welcome disagreement about ideas; prohibit attacks on people. Correct mistakes visibly and record material corrections in patch notes.
- Discord onboarding should default newcomers into the few most useful channels and let them opt into interest/role channels without an intimidating wall of choices.

## Reliability ladder

1. **Normal:** direct dual output, local MKV recording, captions, site voting, separate chats.
2. **Degraded interaction:** stream remains live; freeze new votes/submissions and narrate the outage.
3. **Platform loss:** keep the surviving platform and site status authoritative; do not improvise merged chat.
4. **Site loss:** stop binding votes; use chat only for nonbinding nominations and publish the rescheduled authoritative poll.
5. **Host equipment issue:** switch to BRB, use backup microphone/camera only if rehearsed, then continue or end.
6. **Safety incident:** hide audience content, pause submissions, preserve minimal evidence, notify moderators, and end if needed.
7. **Full outage:** local recording continues if safe; post a status update only after service returns and approval is given.

Rehearse wired-network loss, WebSocket reconnect, closed poll, failed deploy, caption failure, missing camera, muted microphone, full disk warning, one-platform outage, malicious submission, and emergency end.

## Delight without extra host burden

- A 45-second “previously on” generated from verified snapshots.
- “You decided / we shipped” cards and a public town history trail.
- Resident or building spotlight chosen from existing data, not a new weekly production obligation.
- A local-only “town passport” remembering visited buildings and watched recaps without requiring an account.
- Consistent gentle audio cues for vote open, 60-second warning, result, and patch shipped, each paired with visual text.
- A town bulletin board that reuses patch notes, roadmap items, schedules, and credits instead of creating separate content.
- A visible community credit ritual with opt-out and pronunciation fields.
- One recurring closing question: “What should we test Sunday?” Answers feed moderation, not an unbounded promise queue.

## Sustainability rules

- Choose a maximum weekly production-hours budget before premiere and track actual time for four weeks.
- Batch event copy, episode shells, thumbnail text, and moderator briefs from one source record.
- Maintain one canonical schedule and one canonical result; generate platform drafts from them.
- No requirement to post daily. Prefer the live show, recap, patch notes, and one strong short over platform churn.
- Keep at least one no-production recovery block after Thursday and after the premiere rehearsal.
- If there is no moderator, captions are broken, recording storage is unsafe, or the authoritative voting path is unreliable, reduce scope or postpone rather than asking the host to carry hidden operational risk.

## Success signals for the first four weeks

Use privacy-safe aggregate counts and qualitative notes:

- unique live participants, vote completion, changed-choice rate, and reconnect success;
- returning voters and returning town-hall participants, without cross-site behavioral profiling;
- median time from poll close to visible audience-driven change;
- percentage of first-time viewers who can identify the current objective in a short survey;
- caption availability, dropped frames, buffering/reconnect incidents, moderation events, and recovery time;
- recap completion, calendar adds, Discord event interest, and roadmap follow-through;
- host preparation time, post-show time, total weekly hours, stress rating, and sleep/recovery notes.

The pilot succeeds when viewers understand their influence and return, the town accumulates coherent history, and the host can sustain the cadence—not when raw chat volume is maximized.

## Premiere acceptance gate

- Final umbrella identity approved and visible consistently in the rehearsal build.
- First-time orientation, previously-on segment, vote ritual, break re-entry, closing tour, and emergency ending rehearsed.
- Captions, readable overlays, reduced motion, keyboard navigation, mobile vote path, low-bandwidth state, and time-zone display verified.
- One primary moderator and one backup have the brief, escalation channel, commands, and incident policy.
- OBS profile/scene export, wired bandwidth headroom, MKV/remux, disk, audio sync, separate chats, and dual-output rehearsal pass.
- Poll changes, retries, close snapshot, reconnect, show isolation, Turnstile, rate limiting, and Studio authorization pass.
- Backup restore and fallback scenes pass; every open defect has a severity and owner.
- Nicholas explicitly approves the premiere only after watching the rehearsal recording.
