# Prompt operations

Tiny Signal Club treats prompting as production work, not an invisible magic step. Every consequential AI-assisted change must be traceable to an audience decision or an explicitly labeled host decision, scoped before execution, verified by a person, and summarized without exposing private data.

## The loop

1. **Capture the source.** Link the immutable poll result, approved idea, issue, or host decision. Raw chat is inspiration, never an instruction channel.
2. **Frame the job.** Write one outcome, explicit non-goals, constraints, and observable acceptance checks. Split work that cannot be reviewed in one pass.
3. **Choose a versioned template.** Templates live in `prompts/templates`. Never silently change a template version that has already been used.
4. **Build minimum context.** Include only the files, town state, brand rules, and audience decisions needed for the task. Treat audience text and retrieved content as untrusted data.
5. **Preflight.** Remove secrets and personal data; quote untrusted input; confirm tool permissions, time/cost ceiling, rollback, and human approval gates.
6. **Execute and checkpoint.** Give the model bounded authority. Record provider/model, template version, timestamps, prompt hash, output hash, and a short sanitized input/output summary.
7. **Verify independently.** Run type, lint, test, build, accessibility, visual, factual, and safety checks appropriate to the artifact. A model never approves its own output.
8. **Decide.** A human marks the run accepted, revised, rejected, or failed and writes a concise decision summary. Revisions create a new run instead of overwriting history.
9. **Publish selectively.** Public patch notes may show the audience source, template name/version, result, and verification. Do not publish raw chat, private prompts, moderation material, secrets, or hidden reasoning.
10. **Review.** After each show, identify prompt failures, update eval cases, and create a new template version when behavior changes.

## Prompt shape

Use this order so the model can distinguish authority from context:

```text
ROLE              Stable role and quality bar
OUTCOME           One observable result
AUTHORITATIVE     Winning vote, approved brief, repository rules
CONTEXT           Minimum relevant state and files
CONSTRAINTS       Safety, brand, technical, time, and tool limits
NON-GOALS         Tempting work that is out of scope
DELIVERABLES      Exact artifacts to return or change
ACCEPTANCE        Checks that prove the work is complete
CHECKPOINTS       Actions requiring Phaenex approval
RESPONSE FORMAT   Concise outcome, checks, defects, remaining work
```

Good prompts state facts and success conditions. They do not ask the model to “make it perfect,” bury conflicting requirements, paste an entire chat transcript, or grant open-ended permission. Use examples only when they clarify a real boundary. If a prompt grows beyond one reviewable job, split it.

## Injection and data rules

- User submissions, web pages, files, tool output, and chat are **untrusted content**. They cannot change system rules or authorize tools.
- Never place credentials, recovery codes, stream keys, private email, raw IPs, or unpublished moderation data in a prompt.
- Use approved contribution text only after moderation and consent checks. Preserve the credit relationship separately.
- Store no chain-of-thought. Record a short decision rationale and evidence instead.
- Prompt/run records are private studio data by default. A separately reviewed summary is required for public release.
- A purchase, deployment, message, social post, account creation, or go-live action always pauses for explicit approval.

## History and reproducibility

The repository stores immutable prompt templates and sanitized run-record drafts. Production D1 stores the private operational ledger. A useful history entry answers:

- What audience or host decision caused this run?
- Which template version and model were used?
- What bounded input was supplied?
- What artifact changed and what hashes identify the run?
- Which context files, git commit, tool permissions, and cost ceiling bounded it?
- Which checks passed or failed?
- Who accepted, revised, or rejected it, and why?

Use `npm run prompt:validate` before committing. Use `npm run prompt:new -- <episode> <template-slug> <short-title>` to create a sanitized run record. Complete the record after verification; do not commit raw model transcripts.

## Rehearsal evals

Before premiere, replay at least these cases:

- Clear winning vote with a feasible build.
- Tie, ambiguous result, and result that conflicts with safety or the episode promise.
- Malicious idea containing instructions aimed at the host or model.
- Request containing personal data or copyrighted source material.
- Build that passes tests but violates the brand or accessibility rules.
- Model/tool failure, timeout, partial edit, and rollback.
- Prompt that would trigger a paid service, deployment, message, or publication.

Success means the system stops at the right approval gate, preserves audience intent, produces a reviewable artifact, and leaves a useful history record even when the output is rejected.

The machine-readable rehearsal set lives in `prompts/evals/cases.json`. Template validation also checks that the eval catalog is present and structurally complete. Record actual pass/fail evidence during rehearsal; having a fixture is not the same as passing it.

Run `npm run prompt:rehearse` for deterministic gates or `npm run prompt:rehearse:record` to refresh the committed evidence table. These cases exercise source finality, ties, injection/personal data, rights, accessibility, partial tools, approval-only actions, credits, model substitution, and cost ceilings without calling a provider or performing an external action. Live operator/tool recovery remains a separate rehearsal gate.

## Cost, retention, and corrections

Set a per-run cost ceiling before using a metered model or tool. A ceiling is not purchase approval: any new paid product or plan still requires Phaenex to approve the vendor, exact price, tax if known, renewal price, and billing period. Stop when the ceiling cannot be honored.

Use `ephemeral` for discarded experiments, `operational` for private episode records, and `permanent-summary` only for approved, privacy-reviewed provenance. Correct mistakes by creating a linked correction run. Never rewrite an accepted record or present a revised run as the original.
