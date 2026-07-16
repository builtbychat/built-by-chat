# Season One production book

Every Thursday show follows this two-hour clock: 0:00 Starting Soon; 0:05 welcome and recap; 0:12 objective; 0:18 build block one; 0:42 vote one; 0:52 audience questions; 1:00 break; 1:05 result and build block two; 1:35 final vote; 1:48 town tour; 1:55 next stream and credits; 2:00 hard out. The host repeats every choice aloud, states when voting opens/closes, and never treats platform-chat volume as a result.

## 1. Founding Day

**Promise:** Turn an empty map into a place with a name, first landmark, and first resident.

- Cold open: “Tonight, this map stops belonging to me.” Tour Town Hall, river, three open lots, and Pip.
- Votes: shortlist the moderated town names; choose the first landmark; choose the first new resident’s role.
- Build beats: rename town state, instantiate a data-driven building, add resident appearance/trait, write the founding event.
- Fallback: design three town flags in code; read pre-screened “town motto” ideas.
- Thumbnail: `EPISODE 01 · FOUNDING DAY · YOU CHOSE: [LANDMARK]`.
- Recap title: `The Internet Founded a Town (and Chose Its First Landmark)`.
- Sunday agenda: keyboard map tour, mobile vote review, landmark interaction test, name/pronunciation feedback.

## 2. Main Street

**Promise:** Give the town its first business and decide what it contributes.

- Recap Founding Day with a 60-second map diff.
- Votes: business type; owner archetype; facade palette; civic function.
- Build beats: business schema entry, storefront SVG layers, owner resident, interaction panel.
- Fallback: name three menu items/products and draw one sign without changing the winning business.
- Thumbnail: `EPISODE 02 · MAIN STREET · [BUSINESS] WINS`.
- Sunday agenda: storefront accessibility, owner dialogue, purpose clarity, bug triage.

## 3. Meet the Neighbors

**Promise:** Add homes, traits, relationships, and a real community need.

- Votes: household shape; standout resident trait; two-resident relationship; urgent community need.
- Build beats: two homes, residents, relationship edge, need indicator on civic dashboard.
- Fallback: write neighbor notes and mailbox details from moderated prompts.
- Thumbnail: `EPISODE 03 · MEET THE NEIGHBORS · [TRAIT]`.
- Sunday agenda: resident navigation, readable relationship language, representation review.

## 4. The Town’s First Crisis

**Promise:** Introduce a controlled absurd problem and build the response.

- Votes: crisis from three pre-scoped choices; first response; unexpected helper; memorial/reminder.
- Build beats: timed event state, visual map layer, response meter, resolution history entry.
- Guardrail: no real-world disaster imagery likely to distress viewers; host can veto unsafe chat nominations.
- Fallback: emergency poster copy and supply inventory.
- Thumbnail: `EPISODE 04 · OUR FIRST CRISIS · [PROBLEM]`.
- Sunday agenda: replay event in staging, reduced-motion alternative, recovery-state test.

## 5. The Internet Town Council

**Promise:** Give the town visible priorities and rules without turning the show into a policy fight.

- Votes: resource priority; one playful local law; dashboard metric; council meeting ritual.
- Build beats: priority cards, public resource values, law/event history, accessible dashboard.
- Fallback: design council badges and write a meeting agenda.
- Thumbnail: `EPISODE 05 · TOWN COUNCIL · NEW LAW: [SHORT]`.
- Sunday agenda: metric comprehension, keyboard filters, governance feedback.

## 6. The First Festival

**Promise:** Celebrate the season, revisit community history, and choose the next direction.

- Votes: festival theme; centerpiece; resident performance; expansion vs. new project shortlist.
- Build beats: festival decorations, event schedule, season timeline, final snapshot.
- Fallback: superlatives and a narrated before/after map tour.
- Thumbnail: `EPISODE 06 · FIRST FESTIVAL · WHAT COMES NEXT?`.
- Sunday agenda: full-season playtest, contribution credits, next-season retrospective.

## Host recovery lines

- **Build breaks:** “The town found a pothole. Give me five minutes; the backup activity is ready.”
- **Vote unavailable:** “The clock is paused. Chat can discuss, but no result counts until the site is back.”
- **Choice out of scope:** “Great direction, wrong-sized promise for tonight. I’m saving it for the roadmap.”
- **Tie:** use the pre-announced host tiebreak only if a 60-second runoff cannot run.

## Required publishing pack per episode

Within 24 hours prepare, but do not publish without approval: an 8–15 minute recap; three vertical clips (decision, build reveal, human moment); viewer-friendly patch notes; Sunday agenda; roadmap update; YouTube title/description/chapters/tags; Twitch schedule copy; and the next thumbnail SVG export. Use `scripts/extract-clips.sh` with a reviewed marker CSV.
