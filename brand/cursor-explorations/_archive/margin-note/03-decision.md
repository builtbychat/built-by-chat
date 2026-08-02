# Margin Note — decision log

Status: **awaiting human keep / change / reject**

Date: 2026-07-16  
Author: Cursor (Composer)

## Provisional Cursor verdict (not approval)

Margin Note and Proof Stack both scored 89. Margin Note is the specimen primary because the silhouette is less likely to read as a UI control than stacked bars, and it stays far from Codex’s asterisk territory for a cleaner A/B.

## Verification (2026-07-16)

| Check | Result |
| --- | --- |
| SVG title/desc, no raster | PASS |
| Spelling Tiny Signal Club | PASS |
| Transparent mark viewBoxes | PASS |
| Mono currentColor | PASS |
| Play / Pause / Replay on all 6 Cursor iframes | PASS |
| `cursorBrandReady` in each motion study | PASS |
| prefers-reduced-motion / specimen reduced iframe | PASS |
| No runtime network dependency | PASS |
| Specimen CSP (external CSS, no inline style attrs) | PASS |
| Handoff tests + brand concept tests | PASS |
| Motion frames differ (proof-stack t1/t2 pixel diff in mark region) | PASS |
| Human keep/change/reject | OPEN |

Screenshots: `docs/playtest/screenshots/cursor-brand/`

## Honest risks

- Bracket can read “developer tool” or citation mark.
- Quiet next to louder streamer packaging.
- 16 px needs care; 24 px is the practical floor.

Not approved. Not published. Does not replace `brand/svg` or OBS production scenes.
