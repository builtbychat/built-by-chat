# OBS production setup

Import `obs/tiny-signal-club-scenes.json`, then add local camera, microphone, display/window capture, and town browser sources to the named scenes. The collection is intentionally sanitized: it contains no service credentials, stream keys, camera identifiers, or local file paths. `npm run obs:install-local` installs a separate local collection and 1080p30 profile with MKV recording and automatic MP4 remux without changing an existing profile or collection.

On Nicholas’s current Mac, the separate collection and profile were installed on July 16, 2026 while OBS was closed. Select **Scene Collection → Tiny Signal Club** and **Profile → Tiny Signal Club**. The browser overlays point to the local repository so they can be checked before a hostname exists. The existing Untitled collection/profile remains unchanged. Installation does not add camera, microphone, display capture, Aitum outputs, or service credentials; those require an attended visual/audio checkpoint.

Aitum Multistream 1.0.8 was installed as a per-user plugin on July 16, 2026 from the official GitHub release. The package SHA-256 matched `10850620fe0d85a36be092e8104524750a0031668031c66408c8c6f3ee8bf3d4`; Apple reported an Aitum LTD developer signature and trusted notarization, and the copied bundle passed strict code-signing verification. No root installer was run. YouTube/Twitch output creation and keys remain intentionally unconfigured.

## Scene intent

| Scene | Minimum sources |
|---|---|
| Starting Soon | countdown, music, next objective |
| Welcome / Previously On | host camera, recap lower third |
| Live Build | camera, app/code capture, lower third |
| Full-Screen Code | code capture, small host camera |
| Town Tour | `/town`, host voice |
| Active Vote | app/build capture plus Vote Overlay |
| Results | Vote Overlay after close event |
| Break | break card, music, return time |
| Ending / Next Stream | next date/objective, credits |

Set the base/output canvas to 1920×1080 at 30 fps for the pilot. Record to MKV with separate microphone and desktop-audio tracks; enable automatic remux to MP4 in Advanced Settings. Confirm Aitum Multistream is current, then configure direct YouTube and Twitch outputs locally—never in the exported collection. If rehearsal upload or encoder load is unstable, obtain approval before enabling a paid relay.

## Browser source health check

Load the overlay URLs in an ordinary browser first, then in OBS. Open a test poll, change a vote, close it, disconnect the network for ten seconds, and confirm automatic reconnect. Keep all overlay text inside 60 px safe margins and readable on a phone-sized preview.

The animated intro and outro live at `/overlays/intro.html` and `/overlays/outro.html`. Their query-string copy is editable without changing source files; the sanitized collection includes starting values. Enable **Control audio via OBS**, meter the music below the host microphone, and verify that scene deactivation stops audio. The exact CC0 sources, checksums, and reduced-motion option are documented in `obs/overlays/AUDIO-CREDITS.md`.
