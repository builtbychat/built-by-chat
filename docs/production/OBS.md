# OBS production setup

Import `obs/built-by-chat-scenes.json`, then add local camera, microphone, display/window capture, and town browser sources to the named scenes. The collection is intentionally sanitized: it contains no service credentials, stream keys, camera identifiers, or local file paths.

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
