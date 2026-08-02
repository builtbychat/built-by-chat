export const growthCatalog = {
  "version": 1,
  "northStar": "People return to see their choice become real.",
  "funnel": [
    { "id": "discover", "label": "Discover", "question": "Did the promise reach the right people?", "metrics": ["impressions by source", "new viewers", "external referrals"] },
    { "id": "understand", "label": "Understand", "question": "Did a newcomer grasp the episode quickly?", "metrics": ["30-second retention", "objective clarity pulse", "intro drop-off"] },
    { "id": "participate", "label": "Participate", "question": "Did viewers make a meaningful choice?", "metrics": ["valid final selections", "votes per peak concurrent viewer", "vote-path errors"] },
    { "id": "return", "label": "Return", "question": "Did people come back for the consequence?", "metrics": ["returning viewers", "recap to next-live bridge", "Sunday repeat participation"] },
    { "id": "belong", "label": "Belong", "question": "Did contribution become durable community memory?", "metrics": ["approved ideas", "verified credits", "playtest issues resolved"] }
  ],
  "experiments": [
    {
      "id": "result-first-packaging", "title": "Result-first episode packaging", "lane": "appeal", "phase": "launch", "status": "ready",
      "hypothesis": "A concrete audience-made result is clearer to new viewers than an episode number or generic live-coding label.",
      "action": "Title and thumbnail lead with the verified transformation; keep Tiny Signal Club and episode number secondary.",
      "primaryMetric": "YouTube impressions and CTR interpreted together by traffic source",
      "decisionRule": "After three comparable uploads, keep the pattern only if it improves watch time from impressions or broadens impressions without harming average view duration.",
      "cost": "low", "cadence": "Every recap", "dependency": "Verified result and reviewed thumbnail",
      "source": "https://support.google.com/youtube/answer/16559650?hl=en"
    },
    {
      "id": "thumbnail-title-test", "title": "Native title + thumbnail test", "lane": "appeal", "phase": "season-one", "status": "blocked",
      "hypothesis": "Two genuinely different promise frames will reveal whether transformation or curiosity better attracts satisfied viewers.",
      "action": "After an archived livestream or long-form recap is eligible, test up to three truthful packages in YouTube Studio.",
      "primaryMetric": "YouTube watch-time share winner/preferred result",
      "decisionRule": "Use the native result; do not call a winner when YouTube reports no statistical difference.",
      "cost": "medium", "cadence": "At most one active test per eligible recap", "dependency": "Channel advanced features and enough impressions",
      "source": "https://support.google.com/youtube/answer/16391400?hl=en"
    },
    {
      "id": "promise-in-30", "title": "Promise delivered in 30 seconds", "lane": "engagement", "phase": "launch", "status": "ready",
      "hypothesis": "Showing the finished change and tonight’s decision immediately will reduce intro abandonment.",
      "action": "Open recaps with result, consequence, and next question before history, branding, or process detail.",
      "primaryMetric": "YouTube intro retention and first major dip",
      "decisionRule": "Compare at least three videos of similar format and length; move recurring top moments earlier and remove repeated dip causes.",
      "cost": "low", "cadence": "Every recap", "dependency": "Reviewed final edit",
      "source": "https://support.google.com/youtube/answer/9314415?hl=en-GB"
    },
    {
      "id": "decision-reveal-short", "title": "Decision → reveal short", "lane": "discovery", "phase": "season-one", "status": "ready",
      "hypothesis": "A self-contained decision and visible payoff can introduce the format without requiring a two-hour commitment.",
      "action": "Cut one vertical clip that states the choice, shows the winning result, and ends on the next live question.",
      "primaryMetric": "New viewers who continue to another channel format",
      "decisionRule": "Keep only if the clip creates meaningful follow-on viewing or event interest; raw short views alone are insufficient.",
      "cost": "medium", "cadence": "One strong short per episode", "dependency": "Verified marker and captions",
      "source": "https://support.google.com/youtube/answer/9314416?hl=en"
    },
    {
      "id": "five-minute-orientation", "title": "Persistent five-minute orientation", "lane": "engagement", "phase": "launch", "status": "ready",
      "hypothesis": "A viewer arriving mid-build will stay longer if the objective, participation link, and last decision remain visible.",
      "action": "Keep the catch-up card current and verbally re-orient after the break and before each vote.",
      "primaryMetric": "Objective clarity pulse and live average view duration",
      "decisionRule": "Revise wording when clarity declines or moderators repeatedly answer the same premise question.",
      "cost": "low", "cadence": "Every live show", "dependency": "Studio catch-up control",
      "source": "https://support.google.com/youtube/answer/12942217?co=YOUTUBE._YTVideoType%3Dlivestream&hl=en"
    },
    {
      "id": "next-event-bridge", "title": "Every artifact points to one next event", "lane": "return", "phase": "launch", "status": "ready",
      "hypothesis": "One specific next promise is more likely to create a return than a generic request to follow everywhere.",
      "action": "End live show, recap, patch note, and short with the same next date and one unresolved audience question.",
      "primaryMetric": "Returning viewers and calendar/event interest",
      "decisionRule": "Keep one canonical next action; remove secondary calls to action that dilute it.",
      "cost": "low", "cadence": "Every artifact", "dependency": "Canonical schedule",
      "source": "https://support.google.com/youtube/answer/9314416?hl=en"
    },
    {
      "id": "twitch-notification-test", "title": "Twitch go-live promise test", "lane": "appeal", "phase": "season-one", "status": "blocked",
      "hypothesis": "A concrete decision/reveal promise will outperform a generic go-live notification.",
      "action": "Rotate reviewed notification framing by episode and compare the three strongest messages in Twitch Analytics.",
      "primaryMetric": "Go-live notification clicks and live views",
      "decisionRule": "Reuse the strongest truthful structure after at least three streams; do not optimize toward bait that misstates the episode.",
      "cost": "low", "cadence": "One reviewed notification per stream", "dependency": "Twitch channel and three completed streams",
      "source": "https://www.twitch.tv/creatorcamp/en/paths/establish-your-brand/channel-analytics/"
    },
    {
      "id": "twitch-discovery-fit", "title": "Twitch category + tag fit", "lane": "discovery", "phase": "season-one", "status": "blocked",
      "hypothesis": "Consistent truthful Creative/Coding positioning and reviewed tags will help the right adjacent viewers find the show.",
      "action": "Track category referrals, tag traffic, viewer-preferred categories, and channels in common after each stream.",
      "primaryMetric": "Twitch views breakdown and tag performance",
      "decisionRule": "Change one category/tag variable at a time and keep only changes associated with relevant viewer retention.",
      "cost": "low", "cadence": "Weekly review", "dependency": "Twitch analytics access",
      "source": "https://www.twitch.tv/creatorcamp/en/paths/establish-your-brand/channel-analytics/"
    },
    {
      "id": "clip-with-context", "title": "Twitch clip with context", "lane": "discovery", "phase": "season-one", "status": "ready",
      "hypothesis": "Clips that contain the decision and payoff can travel farther than context-free funny moments.",
      "action": "Prioritize one complete story clip and reuse it in a substantive social post rather than posting to satisfy a quota.",
      "primaryMetric": "Top Clips plus external/referral traffic",
      "decisionRule": "Repeat the story structure—not merely the topic—when clips create relevant referral traffic.",
      "cost": "medium", "cadence": "One per episode", "dependency": "Verified markers and approved publishing",
      "source": "https://www.twitch.tv/creatorcamp/en/paths/establish-your-brand/social-media-strategy/"
    },
    {
      "id": "sunday-return-loop", "title": "Sunday findings become Thursday proof", "lane": "return", "phase": "season-one", "status": "ready",
      "hypothesis": "Opening Thursday with a Sunday-found issue that was fixed demonstrates that returning participation matters.",
      "action": "Choose one verified Sunday finding for the 45-second previously-on segment and patch note.",
      "primaryMetric": "Repeat Sunday participation and returning live viewers",
      "decisionRule": "Continue when playtest findings visibly ship without increasing the issue backlog or host load.",
      "cost": "low", "cadence": "Weekly", "dependency": "Sunday issue record",
      "source": "https://support.google.com/youtube/answer/9314416?hl=en"
    },
    {
      "id": "adjacent-creator-table", "title": "Small adjacent-creator table", "lane": "community", "phase": "intermission", "status": "backlog",
      "hypothesis": "One honest collaboration with an accessibility, creative-coding, illustration, or worldbuilding creator can introduce mutually relevant audiences.",
      "action": "Invite one guest to test or contribute a bounded specialty; never request audience swaps or mass outreach.",
      "primaryMetric": "Relevant referral traffic and returning viewers after the collaboration",
      "decisionRule": "Repeat only when the artifact and both communities benefit independent of follower counts.",
      "cost": "high", "cadence": "At most once per season", "dependency": "Stable production and explicit guest consent",
      "source": "https://www.twitch.tv/creatorcamp/en/"
    },
    {
      "id": "host-load-stop-rule", "title": "Growth workload stop rule", "lane": "sustainability", "phase": "launch", "status": "ready",
      "hypothesis": "A smaller reliable publishing pack will outperform an ambitious cadence that weakens the live show or causes burnout.",
      "action": "Protect live show, recap, captions, patch note, and one strong clip; cut additional social output first when the weekly budget is exceeded.",
      "primaryMetric": "Four-week production hours, stress, recovery, and required artifact completion",
      "decisionRule": "If the weekly cap is exceeded twice in four weeks, remove the lowest-return artifact before adding any new experiment.",
      "cost": "low", "cadence": "Weekly", "dependency": "Private workload check-in",
      "source": "local-policy"
    }
  ]
};
