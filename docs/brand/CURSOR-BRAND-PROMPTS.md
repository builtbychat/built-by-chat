# Cursor prompt pack for Tiny Signal Club branding

Use these prompts in order. Do not start with “make a cool logo.” The purpose of this sequence is to force a coherent brand idea, document the reasoning, build editable prototypes, and reject weak work before it spreads across the repository.

## Before you begin

Open the repository at:

```text
/Users/damato/Projects/built-by-chat
```

Read these files before changing anything:

```text
docs/brand/IDENTITY-RESET.md
docs/brand/BRAND-GUIDE.md
docs/launch/NAME-DECISION.md
docs/launch/VIEWER-HOST-EXPERIENCE.md
TRADEMARKS.md
```

The current public-facing brand assets are rejected references, not an approved foundation. Do not silently overwrite them.

Create explorations under:

```text
brand/cursor-explorations/<route-slug>/
```

Store prompt and decision history for each route:

```text
brand/cursor-explorations/<route-slug>/
├── 00-brief.md
├── 01-rationale.md
├── 02-self-critique.md
├── 03-decision.md
├── mark.svg
├── mark-mono.svg
├── lockup.svg
├── motion.html
├── motion.css
└── motion.js
```

Do not purchase anything, claim accounts, publish, deploy, change domains, or replace production assets. Do not add paid fonts, unlicensed images, stock graphics, or secrets. Open-source dependencies must include their license and source.

## Non-negotiable brand facts

- Tiny Signal Club is the umbrella identity, not a town brand.
- Tiny Internet Town is Project One. Future projects may be games, stories, utilities, experiments, physical builds, or formats that do not yet exist.
- The show mechanic is: a viewer contributes something small; contributions shape a build; the host and AI build and test it; the result becomes shared history.
- “Tiny” describes the input, not the ambition.
- “Club” means recurring participation and belonging, not exclusivity.
- The personality is ingenious, mischievous, candid, participatory, and carefully made.
- It must feel playful for adults—not childish, corporate, gamer-edgy, or faux-cozy.
- The current tagline is: **Small signals become big, strange things.** You may critique it, but do not silently replace it.

## Forbidden shortcuts

Do not use these as the primary identity idea:

- radio, modem, antenna, Wi-Fi arcs, broadcast tower, waveform, plug, cable, receiver, CRT, terminal cursor, or chat bubble;
- house, town map, resident, street, or civic building in the umbrella mark;
- robot, cute appliance, moth, mascot, face, eyes, or lore character;
- generic AI sparkle, gradient orb, neural-network nodes, magic particles, or “AI blue/purple” glow;
- default dark SaaS interface, neon night sky, perspective grid, scanlines, or nostalgic electronics collage;
- a random monogram whose only justification is that its shapes resemble T, S, or C;
- a collection of unrelated moodboard objects presented as a brand system.

A forbidden object may appear inside project-specific editorial art when genuinely relevant. It may not substitute for the umbrella identity idea.

---

## Prompt 1 — Audit before designing

Copy this entire prompt into Cursor:

```text
You are acting as a skeptical senior identity designer and design-systems lead. Do not create files yet.

Read:
- docs/brand/IDENTITY-RESET.md
- docs/brand/BRAND-GUIDE.md
- docs/launch/NAME-DECISION.md
- docs/launch/VIEWER-HOST-EXPERIENCE.md
- the existing SVG assets under brand/svg
- the rejected studies under brand/concepts and obs/overlays

Audit the current Tiny Signal Club identity work. Explain:
1. what the brand must communicate in under five seconds;
2. why the rejected visual metaphors fail;
3. which parts of the name are opportunities and which create risk;
4. what a future-proof identity must do across a channel avatar, livestream overlay, thumbnail, website, sponsor deck, one-color print, Tiny Internet Town, and an unrelated future project;
5. what visual territories are crowded or likely to resemble existing technology, media, AI, gaming, or community brands.

Be blunt and specific. Do not praise work merely because it exists. Do not claim customer research or external validation. End with ten measurable acceptance criteria. Save the result as brand/cursor-explorations/00-audit.md and make no other changes.
```

Stop and read the audit before continuing. If it merely repeats the brief or proposes radios, signals, mascots, or generic sparks, revise the audit first.

---

## Prompt 2 — Develop three strategic routes

```text
Using the audit and source documents, propose exactly three genuinely different identity routes for Tiny Signal Club. These are strategic systems, not three variations of one icon.

Route requirements:
- Route A must be primarily typographic and derive personality from the name’s hierarchy and custom lettering behavior.
- Route B must use a modular visual rule that demonstrates small contributions combining into an unexpected result.
- Route C must be an unexpected non-technical metaphor grounded in participation, making, testing, or shared history.

For each route provide:
- a one-sentence organizing idea;
- why that idea belongs specifically to Tiny Signal Club;
- a precise icon construction rule that could be recreated without tracing a generated image;
- wordmark behavior and hierarchy;
- a five-color maximum palette with semantic roles and accessible pairings;
- open-source typography candidates, their licenses, and why they fit;
- composition, texture, illustration, photography, and motion rules;
- how Tiny Internet Town inherits the parent system without defining it;
- how an unrelated second project inherits the system;
- channel-avatar, favicon, monochrome, 24 px, and reduced-motion behavior;
- the three greatest confusion or similarity risks;
- one reason to reject the route.

Do not generate SVGs yet. Do not describe moodboards full of objects. Do not use any forbidden shortcut listed in docs/brand/CURSOR-BRAND-PROMPTS.md. Score each route from 0–100 using the scorecard in that document. Save the comparison as brand/cursor-explorations/01-routes.md.
```

## Route scorecard

Use the same scoring weights for every route:

| Criterion | Points |
| --- | ---: |
| Clear connection to the participation/build/test mechanic | 20 |
| Distinctiveness and ownable construction | 20 |
| Fit with “Tiny Signal Club” | 15 |
| Ability to cover unrelated future projects | 15 |
| Wordmark and small-size legibility | 10 |
| Meaningful motion potential | 10 |
| Practicality in SVG, print, overlays, and templates | 10 |

Reject any route below 75. A high score is not approval; it only earns a prototype.

---

## Prompt 3 — Challenge the winning route

Replace `<ROUTE>` with the strongest route from Prompt 2.

```text
Adversarially review <ROUTE> before building it.

Assume the first idea is too obvious. Search the local reference material for internal contradictions. Identify ways the mark could be mistaken for:
- a generic sparkle or loading indicator;
- a software, telecom, gaming, or AI logo;
- a children’s brand;
- a town-only identity;
- an arbitrary geometric symbol with a story added afterward.

Test whether the route’s explanation is visible in the form itself. If the explanation depends on a paragraph, redesign the construction rule. Produce a corrected route specification with exact geometry, spacing, color roles, type hierarchy, motion sequence, minimum sizes, and prohibited variations.

Save the critique and corrected specification inside brand/cursor-explorations/<route-slug>/01-rationale.md and 02-self-critique.md. Do not create polished mockups yet.
```

---

## Prompt 4 — Build an editable prototype

```text
Build a code-native prototype of the corrected route under brand/cursor-explorations/<route-slug>/.

Required files:
- mark.svg — transparent, accessible title/description, exact geometry, no embedded raster data;
- mark-mono.svg — true single-color version using currentColor;
- lockup.svg — horizontal or stacked primary lockup with exact Tiny Signal Club spelling;
- motion.html, motion.css, motion.js — a local 16:9 motion study with Play, Pause, Replay, keyboard controls, and prefers-reduced-motion support;
- 00-brief.md, 01-rationale.md, 02-self-critique.md, 03-decision.md;
- README.md — palette, typography, clear space, minimum size, misuse, project-extension, and licensing notes.

Also create one HTML specimen sheet showing:
- icon at 16, 24, 32, 64, and 256 px;
- color, monochrome, reversed, and paper-background versions;
- primary wordmark;
- a Tiny Internet Town project card;
- a deliberately unrelated future-project card;
- a thumbnail crop and channel-avatar crop;
- reduced-motion final state.

Use exact HTML/SVG text, not generated text inside a raster image. Do not touch brand/svg, brand/templates, apps/web public branding, or OBS production scenes. Do not publish or deploy.
```

---

## Prompt 5 — Verify instead of decorating

```text
Audit the new prototype as if you intend to reject it.

Run or create deterministic checks for:
- valid and safe SVG markup;
- correct Tiny Signal Club spelling;
- viewBox and transparent-background behavior;
- recognizable 24 px rendering;
- one-color rendering;
- WCAG AA text contrast for functional pairings;
- no clipped text at 16:9, 4:3, and mobile portrait sizes;
- Play, Pause, Replay, repeated Replay, keyboard controls, and reduced motion;
- no external network dependency at runtime;
- no raster data embedded in logo SVGs;
- no unlicensed font or image dependency.

Capture desktop, mobile, 24 px, monochrome, and reduced-motion screenshots. Inspect them visually. Record failures honestly in 03-decision.md. Do not fix a weak concept by adding glow, texture, extra colors, a mascot, or decorative objects. If the mark is conceptually weak, reject it and return to Prompt 2.
```

---

## Prompt 6 — Present for a human decision

```text
Prepare a decision page inside the existing localhost-only handoff dashboard.

Show the new route before rejected work. Include:
- the one-sentence idea;
- color and monochrome marks;
- primary lockup;
- playable motion with Play, Pause, and Replay;
- Tiny Internet Town and unrelated-project examples;
- known weaknesses and similarity risks;
- direct links to editable source files;
- fields for “keep,” “change,” “reject,” and confidence;
- a clear statement that saving feedback does not approve publication or replacement.

Keep all rejected work visibly labeled as rejected. Do not change public assets, deploy, purchase, claim accounts, or mark the branding workstream complete.
```

## Optional prompt — Improve the open-wildcard route specifically

Use this only if the open-wildcard idea is worth continuing. It is not an instruction to preserve the current geometry.

```text
Evaluate the current open-wildcard route in:
- docs/brand/IDENTITY-RESET.md
- brand/concepts/open-wildcard/
- obs/overlays/wildcard-lab.*

The intended idea is: five assembled components, one genuinely missing arm, and one detached contribution positioned in that opening. The mark should communicate wildcard, footnote, ongoing participation, and reconfiguration.

Do not assume the current pill geometry is good. It may resemble a generic sparkle, loading indicator, fan, flower, or Walmart-style burst. Produce three geometry studies that preserve the organizing idea but address those risks:
1. a typographic asterisk with a visibly interrupted stroke;
2. a modular construction with non-radial pieces and an intentional central void;
3. an editorial footnote/bracket form where a tiny input visibly changes a larger structure.

For each study show 16 px, 24 px, monochrome, reversed, wordmark, animation keyframes, Tiny Internet Town extension, and an unrelated-project extension. Explain what makes the geometry ownable without relying on color. Reject any study that needs a paragraph to stop looking generic.

Build explorations only under brand/cursor-explorations/open-wildcard-geometry/. Do not overwrite the current concept or production assets.
```

## Prompt-history rules

For every Cursor run:

1. Paste the full prompt into the route’s brief or history file before implementation.
2. Record the Cursor model and date if available.
3. Summarize what files changed; do not paste secrets or hidden reasoning.
4. Record screenshots and test results.
5. Write a human-readable decision: keep, revise, or reject, with reasons.
6. Never describe a route as “approved” without Nicholas explicitly approving it.
7. Never replace production assets merely because the prototype builds successfully.

The goal is not to produce the most options. The goal is to find one idea with enough meaning and discipline to survive every application.
