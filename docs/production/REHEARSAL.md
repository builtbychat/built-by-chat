# Rehearsal and recovery checklist

Do not announce the premiere until every critical item passes.

## Twenty-minute local recording

- [ ] MKV recording begins and automatic MP4 remux completes.
- [ ] Microphone peaks around −12 dB; limiter catches peaks; desktop audio stays below voice.
- [ ] Camera, code, town, vote, result, break, and ending scenes have no missing source.
- [ ] Browser overlays are readable, reconnect, and show closed-poll state.
- [ ] Audio remains in sync at minute 20; recording has both audio tracks.
- [ ] `npm run recording:verify -- <file>` returns duration and codecs.

## Unlisted dual-platform rehearsal — July 30

- [ ] Obtain explicit approval before starting both streams.
- [ ] YouTube and Twitch ingest are stable for 20+ minutes.
- [ ] Chats are monitored separately; no merged cross-platform chat is shown on Twitch.
- [ ] Test vote open/change/retry/close and result snapshot.
- [ ] Simulate WebSocket drop, failed deploy, missing camera, muted mic, and one-platform outage.
- [ ] Capture desktop, tablet, mobile, studio, banner, and Twitch page screenshots for review.

## Recovery calls

1. **WebSocket outage:** keep building, announce that the vote clock is paused, restore/reload the overlay, then reopen with the same choices.
2. **Failed deploy:** remain on the last production version; do not debug a production deployment live. Use a prepared local activity.
3. **Camera failure:** switch to Full-Screen Code and continue voice-only.
4. **Microphone failure:** switch to Break, replace input, verify meters locally, return.
5. **One platform down:** continue on the healthy platform, post a prepared status only after approval, and keep site voting authoritative.
