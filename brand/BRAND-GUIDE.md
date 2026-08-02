# Tiny Signal Club identity guide

Identity name: **Tiny / Big**  
Tagline: **Small signals become big, strange things.**  
Status: local master awaiting Nicholas’s visual approval before publication.

## Core idea

The name supplies the identity rule. `TINY` is deliberately small; `SIGNAL CLUB` is bold. Episode graphics repeat the same behavior with real content: one specific viewer input appears small, the build/test state advances, and the verified result takes the large field.

The system does not need a Wi‑Fi glyph, chat bubble, sparkle, modem, mascot, or invented participation token. That keeps it useful after Tiny Internet Town.

## Logo family

| Use | File |
| --- | --- |
| Primary wordmark on blue or dark | `svg/logo-wordmark-dark.svg` |
| Primary wordmark on cream or light | `svg/logo-wordmark-light.svg` |
| One-color wordmark | `svg/logo-wordmark-mono.svg` |
| Avatar on blue or dark | `svg/logo-icon-dark.svg` |
| Avatar on cream or light | `svg/logo-icon-light.svg` |
| One-color avatar | `svg/logo-icon-mono.svg` |
| Browser and sub-24-pixel use | `svg/favicon.svg` |

The primary wordmark is the logo. The avatar is an overlapping `SC` monogram with the word `TINY` held at a deliberately smaller scale. The favicon reduces `TINY` to a single coral `T`; pretending four letters remain legible at 16 pixels would add noise.

All logo letters are converted to exact SVG paths. They render without an installed or network-loaded font.

## Typography

The display face is **Bricolage Grotesque**, weight 800, optical size 96, width 84. The official font and its SIL Open Font License are packaged in `fonts/bricolage-grotesque/`.

- Logo masters use outlined Bricolage geometry.
- Editable platform headlines use the packaged variable font.
- Operational labels use a system monospace stack.
- Body copy uses a readable system sans stack.
- Do not fake the wordmark with a substitute typeface.

Rebuild the outlined logo masters with:

```text
python3 scripts/build-brand-vectors.py
```

## Clear space and minimum size

- Keep clear space around the wordmark equal to the height of the coral `TINY` tag.
- Keep clear space around the avatar equal to half the height of its small `TINY` line.
- Do not use the full wordmark below 160 CSS pixels wide.
- Use the avatar from 24 to 159 pixels.
- Use `favicon.svg` below 24 pixels.
- Never squeeze, stretch, rotate, outline, or re-track the supplied files.

## Color

| Token | Hex | Role |
| --- | --- | --- |
| Signal Blue | `#3157FF` | primary public field and broadcast energy |
| Room Cream | `#F1EADB` | warm type and light field |
| Live Coral | `#FF5B3D` | real input, action, live state, warnings |
| Proof Lime | `#C8EF52` | verified state, completion, availability |
| Studio Ink | `#171613` | control surfaces, copy, monochrome logo |

Use cream instead of pure white. The logo uses only ink/cream plus coral; lime is reserved for verified or live status. Do not make lime a large field or add extra logo colorways.

## Layout rule

```text
ONE REAL VIEWER SIGNAL
“Add a night market”

──────── build · test · ship

LARGE VERIFIED RESULT
NIGHT MARKET
```

- Input copy must be an actual idea, choice, correction, or constraint.
- Proof language may only claim a state the system can verify.
- Result copy names what was actually decided or shipped.
- Never invent a viewer quote or imply unanimity.
- Project art may be expressive; umbrella-brand layouts remain aligned and quiet.

## Motion

The canonical looping ident is `identity/ident.html`.

1. One real input appears at a small scale.
2. The build/test line advances.
3. The verified result arrives at a large scale.
4. The wordmark signs the frame.
5. The loop opens for the next signal.

The local review surface forces full motion with `?motion=full`, even when the operating system requests reduced motion. Normal public use respects the OS setting. `?motion=reduced` resolves immediately to the final wordmark. Play, Pause, and Replay must remain functional.

OBS intro and outro scenes are one-shot entrance animations by design. The local dashboard gives each scene a Replay button so the animation does not finish before the reviewer scrolls to it.

## Platform system

Editable SVG masters live in `templates/`. Rebuild them with:

```text
python3 scripts/build-brand-templates.py
```

Export upload-ready PNGs with:

```text
npm run brand:raster:export
```

Rules:

- one dominant message per frame;
- one alignment system per asset;
- one coral action cue;
- no decorative grids, giant rings, diagonal wedges, or fake portrait circles;
- use town art only for Tiny Internet Town assets;
- keep the optional host-cutout group hidden until a real cutout exists.

## Voice

Warm, specific, inviting, and lightly strange.

Prefer:

- “The club chose night buses. We built the first route.”
- “Signal received. Testing starts now.”
- “That failed safely; here’s what changed.”

Avoid fake urgency, invented consensus, certainty before testing, corporate community jargon, and any suggestion that payment buys votes, ownership, or moderation influence.

## Project hierarchy

Tiny Signal Club is the umbrella. Project names may become larger in project-specific art:

```text
TINY SIGNAL CLUB PRESENTS
TINY INTERNET TOWN
```

The wordmark and monogram remain stable. Project art, characters, and setting-specific motifs may change.

## Accessibility

- Logo SVGs include titles and descriptions.
- Decorative instances use empty alt text when adjacent copy already names the club.
- Never encode status by color alone.
- Reduced-motion use resolves to a stable final frame.
- Use the favicon rather than illegible microtype below 24 pixels.
- Keep functional text contrast at WCAG AA or better.

## Prohibited uses

- Do not restore the retired speech bubble, open-C rays, detached square, petal/propeller, bead, bench, wedge, or wildcard studies.
- Do not add Wi‑Fi arcs, sparkles, chat containers, arbitrary stickers, or a mascot to the umbrella logo.
- Do not overlap the wordmark with project titles.
- Do not place the logo directly over busy art without an ink, cream, or blue protection field.
- Do not publish, reserve accounts, buy a domain, or purchase branded products without explicit approval and an exact price.

## Review surface

Run `npm run handoff` and open:

```text
http://127.0.0.1:4317/
```

The dashboard contains the looping ident, playable intro/outro previews, logo files, complete specimen, progress tracker, and private handoff fields.
