# Three strategic identity routes

Date: 2026-07-16  
Author: Cursor (Composer)  
Source: audit `00-audit.md` + brand docs  
Status: exploration — prototypes earn a seat, not approval

Scores use the scorecard in `docs/brand/CURSOR-BRAND-PROMPTS.md`. Reject below 75.

---

## Route A — Tiny Scale Type

**Slug:** `tiny-scale-type`  
**Organizing idea:** The word Tiny is a physical scale rule: it sits inside a notched period that never quite closes until a contribution arrives.

**Why it belongs here:** The name’s awkward word becomes the system. Participation is the closing of the notch, not a radio metaphor.

**Icon construction rule:** 120×120 viewBox. Soft-black square period 72×72 centered, with a 22×22 corner notch cut from the upper-right using a second path/mask. A 16×16 persimmon square sits half-in the notch, rotated 8°. No arcs, no arms, no faces.

**Wordmark:** `TINY` in mono caps at ~0.38× the cap height of `SIGNAL` / `CLUB`. Stacked: TINY (persimmon bar), SIGNAL, CLUB with acid period. Horizontal lockup places the notched period left of the stack.

**Palette (5):** Workshop paper `#f1eadb`, Soft black `#171613`, Persimmon `#ff5b3d`, Ultramarine `#3157ff`, Acid leaf `#c8ef52`. Same semantic roles as Identity Reset.

**Type candidates:** Space Grotesk or Syne (OFL) for display width; Source Sans 3 (OFL) for text; IBM Plex Mono (OFL) for TINY and data. Prototype uses system narrow grotesk + mono until fonts are packaged locally.

**Composition / motion:** Editorial asymmetry. Motion: persimmon square enters notch → period settles → wordmark weight locks. Reduced motion: final nested square.

**Project inheritance:** Town cards use the notched period as a small parent bug; civic art is separate. Unrelated project swaps ultramarine field for acid or black without changing the notch rule.

**Small sizes:** At 16–24 px show only the notched period + inset square. Monochrome: currentColor fill for body, square remains a cut or a second currentColor shape with opacity 1.

**Risks:** (1) Reads as “incomplete app icon.” (2) Notch lost at 16 px. (3) Typographic brands that already do tiny-word hierarchy.

**Reject if:** The notch needs a caption to read as intentional rather than a rendering error.

| Criterion | Score |
| --- | ---: |
| Participation mechanic | 16 |
| Distinctiveness | 17 |
| Fit with name | 15 |
| Future projects | 14 |
| Wordmark / small size | 8 |
| Motion | 8 |
| Practicality | 9 |
| **Total** | **87** |

---

## Route B — Proof Stack

**Slug:** `proof-stack`  
**Organizing idea:** Verified contributions stack like proof stamps; the newest piece is still arriving, so the stack is never closed.

**Why it belongs here:** The show’s real climax is “it passed.” Stacking is assembly without asterisk sparkle territory.

**Icon construction rule:** Four soft-black horizontal slabs, widths 96 / 78 / 64 / 50, heights 18, corner radius 3, left-aligned with 6 px vertical gaps, stacked from bottom. One persimmon slab width 36 height 14 floats 14 px above the top slab, offset +28 px right, rotated −6°. Central vertical void is the left gutter (no radial symmetry).

**Wordmark:** Mark left; `TINY SIGNAL` small mono line; `CLUB` huge. Or stacked SIGNAL/CLUB with TINY as a stamp on the top black slab in lockups.

**Palette:** Same five colors. Persimmon = incoming proof. Acid = shipped stack complete for an episode end-card only.

**Type:** Same OFL candidates. Utility mono for stamp text (“PASS”, episode ids).

**Composition / motion:** Slabs rise into place bottom-up; orange slab drops with overshoot; micro gap remains. Paper fiber texture optional at large sizes only.

**Project inheritance:** Town rearranges slabs into a stepped skyline without houses in the mark. Future project may rotate the stack 90° into a spine of chapters.

**Small sizes:** At 24 px reduce to three black bars + one orange bar. Monochrome keeps the floating offset as the tell.

**Risks:** (1) Looks like a loading bar or equalizer. (2) Resembles checklist UI. (3) “Stack” brands in productivity software.

**Reject if:** Motion is only bounce decoration and the floating bar reads as a progress thumb.

| Criterion | Score |
| --- | ---: |
| Participation mechanic | 18 |
| Distinctiveness | 16 |
| Fit with name | 12 |
| Future projects | 15 |
| Wordmark / small size | 9 |
| Motion | 9 |
| Practicality | 10 |
| **Total** | **89** |

---

## Route C — Margin Note

**Slug:** `margin-note`  
**Organizing idea:** The club lives in the margin: a heavy editorial bracket holds space while a tiny square annotation changes what the bracket is saying.

**Why it belongs here:** Footnotes and margin notes are how shared history is recorded. Participation is literally an annotation on unfinished work. Non-technical, adult, workshop-adjacent.

**Icon construction rule:** Soft-black bracket built from three rectangles: vertical stem 28×112 at x=40; top arm 70×22; bottom arm 70×22. Interior open to the right. Persimmon 24×24 square sits in the open mouth at (92, 78), rotated 11°. Optional hairline gap between square and stem (8 px clear). No eyes, no arcs.

**Wordmark:** Bracket mark left of stacked TINY / SIGNAL / CLUB with TINY small. On ultramarine fields, mark inverts to paper.

**Palette:** Same five. Ultramarine for umbrella fields; paper default.

**Type:** Display grotesk with aggressive negative tracking on SIGNAL/CLUB; mono for TINY and “presents” lines.

**Composition / motion:** Square slides in from the right; bracket arms ease open 4 px then settle; square seats. Loop every ~2.8 s. Reduced motion: seated final state.

**Project inheritance:** Town uses bracket as a parent bug; map art separate. Unrelated project may flip bracket to a closing `]` for “archive” episodes without new metaphors.

**Small sizes:** At 16 px simplify arms to 2 px strokes still reading as `[` + square. Monochrome: all currentColor; square can be a counter (cutout) in print.

**Risks:** (1) Reads as code/JSON bracket tech brand. (2) Confused with citation or legal marks. (3) Too quiet beside louder streamer logos.

**Reject if:** It only works next to long copy and fails as a mute channel avatar.

| Criterion | Score |
| --- | ---: |
| Participation mechanic | 17 |
| Distinctiveness | 18 |
| Fit with name | 13 |
| Future projects | 15 |
| Wordmark / small size | 8 |
| Motion | 9 |
| Practicality | 9 |
| **Total** | **89** |

---

## Later additions (tab workbench)

| Route | Slug | Idea |
| --- | --- | --- |
| D Stamp Seal | `stamp-seal` | Heavy club ring with one bitten gap; contribution is the missing bite |
| E Split Dash | `split-dash` | Broken dash bridged by a tiny piece |

These ship in the localhost brand tab bar alongside A–C.

## Comparison and prototype order

| Route | Score | Prototype? |
| --- | ---: | --- |
| A Tiny Scale Type | 87 | Yes — typographic control |
| B Proof Stack | 89 | Yes — modular control |
| C Margin Note | 89 | Yes — metaphor control; primary decision candidate tied with B |
| D Stamp Seal | — | Yes — club seal metaphor |
| E Split Dash | — | Yes — connection / bridged gap |

Codex Round 03 open-wildcard is retained as the prior modular asterisk route. Cursor also builds three geometry studies under `open-wildcard-geometry/` that keep Codex’s idea but reject the pill-burst silhouette.

**Human decision happens on the handoff page tabs.** No route is approved here.
