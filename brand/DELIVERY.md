# Tiny Signal Club brand and animation delivery

Tagline: **Small signals become big, strange things.**

## Brand files

- `svg/`: Tiny / Big dark, light, monochrome, outlined wordmark, SC monogram, and favicon masters.
- `fonts/bricolage-grotesque/`: official variable display font and SIL Open Font License.
- `identity/`: complete local specimen and controllable animated ident.
- `raster/hero-town.png`: illustrated Project One hero without embedded text.
- `raster/exports/`: upload-ready PNG avatar, banners, social preview, thumbnail, offline card, sponsor cover, and Twitch panels generated from the SVG masters.
- `templates/`: editable YouTube, Twitch, Discord, GitHub, thumbnail, offline, and sponsor-cover SVGs.
- `BRAND-GUIDE.md`: palette, typography, spacing, voice, and usage rules.

The retired speech-bubble logo and exploratory square/seat/wildcard studies are not public identity assets. They remain only in the documented exploration archive.

Keep logos and platform typography code-native. Export PNG copies from the SVG masters only at the platform’s required dimensions. Tiny Signal Club names, marks, characters, and original media remain reserved under `TRADEMARKS.md`.

Regenerate vector masters with `python3 scripts/build-brand-vectors.py`, platform masters with `python3 scripts/build-brand-templates.py`, and every PNG with `npm run brand:raster:export`; do not hand-edit generated copies.

## Animated overlays

- `animations/intro.html`: animated broadcast intro with editable episode query parameter.
- `animations/outro.html`: animated ending card with editable event/date parameters.
- `animations/lower-third.html`: reusable lower third.
- `animations/vote.html`: live vote overlay.
- `animations/audio/`: CC0 music and completion sound.
- `animations/AUDIO-CREDITS.md`: provenance and checksums.

Preview examples after starting the local site:

```text
/overlays/intro.html?episode=Episode%2001%20%C2%B7%20Founding%20Day&audio=1&volume=.22
/overlays/outro.html?event=The%20Modem%20Picnic&date=Sunday%20%C2%B7%203%3A00%20PM%20CT&audio=1&volume=.18
```

Add `motion=reduced` to either URL to verify the reduced-motion presentation. Browsers may require one click before playing audio; OBS browser sources do not use that browser autoplay restriction in the same way.

## OBS

`obs/tiny-signal-club-scenes.json` is the sanitized portable collection. It contains no camera identifiers, platform credentials, or stream keys. The separate local OBS collection/profile installed on Nicholas’s Mac uses local overlay files until the verified production hostname exists.
