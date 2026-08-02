# Data retention and deletion

Collect the minimum needed for voting, moderation, credits, security, and reproducibility. The schedule below is the launch default and must be reflected in automated cleanup before production.

| Record | Default retention | End-of-life action |
|---|---|---|
| Raw network address | Never stored in application data | Hash in memory with rotating secret |
| Active vote selection and rate-limit state | Through show plus 30 days | Delete browser/network-level records; keep aggregate result |
| Final aggregate poll result and snapshot hash | Permanent town history | Preserve; correct with linked record only |
| Pending idea | 90 days | Delete if not moderated; retain consent audit only when legally needed |
| Rejected idea | 30 days after moderation | Delete content and optional credit name |
| Approved/used idea and credit relationship | While publicly used | Preserve contribution/consent provenance; honor lawful requests where possible |
| Studio audit log | 1 year | Export security-critical summary if needed, then delete |
| Ephemeral prompt run | 7 days | Delete private run; keep no public summary |
| Operational prompt run | 1 year | Delete private summaries; retain approved permanent summary if applicable |
| Approved prompt provenance summary | Permanent with release | Correct through linked record; never rewrite silently |
| Post-show pulse ratings and optional note | 90 days | Delete the show-scoped pseudonymous row and note |
| Host workload totals/ratings | Operational history | Remove private recovery note and operator identity after 1 year |
| Transactional email/provider logs | Provider minimum, target 30 days | Delete/export according to provider controls |
| Local raw recordings | Target 90 days after final edits | Delete after verified master and backup; preserve published masters per content policy |

No newsletter list or behavioral ad profile is created at launch. Public deletion/contact requests will go to `privacy@tinysignalclub.com` only after domain ownership and mail routing are verified; until then the repository’s private Security Advisory/contact workflow is the controlled fallback. Requests are authenticated before disclosing or deleting private records.

Quarterly, verify cleanup jobs, provider retention, backup expiration, and restoration behavior. A backup is not exempt from deletion: expired backups must rotate out on schedule.
