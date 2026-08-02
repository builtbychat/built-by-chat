export interface CraftCheck {
  id: string;
  label: string;
  question: string;
  failureAction: string;
}

export interface DisclosureMaterial {
  id: string;
  label: string;
  use: string;
  copy: string;
}

export const craftReleaseChecks:CraftCheck[] = [
  {id:'promise',label:'Specific promise',question:'Can a stranger say what this artifact is for?',failureAction:'Rewrite the promise before making more output.'},
  {id:'agency',label:'Real audience consequence',question:'Can we point to what the audience decided and what changed because of it?',failureAction:'Do not imply participation until the consequence is visible.'},
  {id:'accountability',label:'Named human responsibility',question:'Is Phaenex visibly accountable for the judgment, edit, and final release?',failureAction:'Name the responsible human and the decision they made.'},
  {id:'revision',label:'Visible revision',question:'Can we name something the AI draft got wrong, generic, or unsafe—and how it changed?',failureAction:'Inspect and revise; prompt-to-publish is not an accepted workflow.'},
  {id:'provenance',label:'Clear provenance and rights',question:'Are the decision source, tool role, asset rights, and credits inspectable?',failureAction:'Hold the artifact until the source and rights record is complete.'},
  {id:'verification',label:'Independent verification',question:'Did a person run the relevant behavior, accessibility, safety, and quality checks?',failureAction:'Run checks outside the generation step and record the result.'},
  {id:'memory',label:'Durable artifact',question:'Does this become a coherent project state, receipt, lesson, or archive—not disposable feed filler?',failureAction:'Give it a durable home or do not publish it.'},
  {id:'restraint',label:'Worth the attention and workload',question:'Would we still publish this without a posting quota, and can the host sustain it?',failureAction:'Cut the lowest-value output and protect the core artifact.'}
];

export const makingStages = [
  {label:'Signal',question:'What did a real person or verified decision ask for?',proof:'Poll receipt, approved idea, or labeled host decision'},
  {label:'Hypothesis',question:'What do we believe could work, and what would prove us wrong?',proof:'One bounded claim and acceptance checks'},
  {label:'Attempt',question:'What did human and machine each try?',proof:'Sanitized tool role—not a raw private transcript'},
  {label:'Inspect',question:'What is generic, incorrect, inaccessible, unsafe, or incoherent?',proof:'Named finding and rejected/revised draft'},
  {label:'Make',question:'What judgment and craft turned the attempt into this artifact?',proof:'Human edit, implementation, and authorship'},
  {label:'Verify',question:'Does it work for people outside the prompt?',proof:'Behavior, accessibility, safety, and rights evidence'},
  {label:'Remember',question:'What changed, what did we learn, and what remains uncertain?',proof:'Release receipt, project state, and next question'}
];

export const disclosureMaterials:DisclosureMaterial[] = [
  {id:'channel',label:'Channel description',use:'YouTube, Twitch, profile, or About panel',copy:'Tiny Signal Club is an audience-directed live-making studio. Viewers make bounded creative choices; Phaenex interprets, builds, tests, and remains accountable for what ships. AI assists with scoped drafts and production work—it never supplies votes, fake community activity, or automatic publishing.'},
  {id:'spoken',label:'Thirty-second spoken orientation',use:'Premiere and first-time-viewer reset',copy:'You choose among the real options on the site. I use AI as one workshop tool for bounded drafts and implementation help, but I decide what it means, revise what is weak, run the checks, and take responsibility for the result. The site vote is final, and we keep a receipt of what changed.'},
  {id:'description',label:'Episode process receipt',use:'Video description, recap, and patch note',copy:'HOW THIS WAS MADE\nAudience decision: [verified choice + receipt]\nHuman interpretation: [what Phaenex decided it meant]\nAI-assisted work: [bounded role or “none”]\nRejected or revised: [specific weakness and change]\nVerification: [behavior, accessibility, safety, rights]\nWhat shipped: [artifact/version]\nWhat we learned: [finding + next question]'},
  {id:'clip',label:'Clip end card',use:'Short-form and contextualized social clip',copy:'A real audience choice → human judgment and revision → a verified artifact. See the decision and making receipt at Tiny Signal Club.'},
  {id:'sponsor',label:'Sponsor boundary',use:'Media kit and sponsored episode copy',copy:'Sponsors may fund the workshop but cannot buy votes, creative outcomes, tool choices, favorable findings, moderation influence, or ownership of community decisions. Any supplied claim or asset receives the same human review, rights check, and disclosure as the rest of the episode.'},
  {id:'correction',label:'Correction notice',use:'When a released artifact or receipt is wrong',copy:'CORRECTION · [date]\nWhat was wrong: [specific claim, behavior, credit, or provenance]\nHow it happened: [plain-language cause]\nWhat changed: [linked correction/version]\nWhat remains preserved: [original decision and history]\nPrevention: [new check, constraint, or lesson]'}
];

export const aiCan = [
  'Explore bounded alternatives after the real decision is known',
  'Draft code, tests, visual studies, captions, outlines, and repetitive production material',
  'Help surface edge cases, implementation risks, and questions for human review',
  'Accelerate reversible work whose output can be inspected and independently tested'
];

export const aiNever = [
  'Invent viewers, votes, chat, testimonials, credits, demand, or community consensus',
  'Choose the official result, silently reinterpret it, or override a protected vote',
  'Impersonate a person, clone someone else’s voice, or fabricate a real event',
  'Receive secrets, raw private chat, identities, unpublished moderation material, or unrestricted authority',
  'Publish, purchase, message, deploy, or go live without the required human approval',
  'Turn speed or output volume into a reason to ship work that lacks purpose or craft'
];

export function craftVerdict(checks:Record<string,boolean>) {
  const passed=craftReleaseChecks.filter(check=>checks[check.id]).length;
  if(passed===craftReleaseChecks.length) return {passed,label:'Ready for human release review',detail:'The anti-slop gate is complete. Final editorial approval is still required.'};
  if(passed>=5) return {passed,label:'Revise before release',detail:'The artifact has a foundation, but missing proof could make it feel generic or unaccountable.'};
  return {passed,label:'Hold the artifact',detail:'More output will not solve the missing purpose, agency, authorship, or evidence.'};
}
