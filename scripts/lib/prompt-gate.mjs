const approvalActions = new Set(['purchase','deploy-production','publish','send-message','create-account','go-live']);

export function evaluatePromptRequest(request) {
  if (request.unsafeContent) return 'safety-block';
  if (request.source === 'tie') return 'runoff-required';
  if (request.source === 'unfinalized') return 'source-block';
  if (request.rights === 'exact-imitation') return 'rights-block';
  if (request.quality === 'accessibility-failed') return 'quality-block';
  if (request.toolState === 'partial-failure' || request.toolState === 'failed') return 'recovery-review';
  if ((request.requestedActions ?? []).some((action) => approvalActions.has(action))) return 'approval-required';
  if (request.credits === 'unverified') return 'integrity-block';
  if (request.model === 'unavailable') return 'comparison-run-required';
  if (Number.isInteger(request.costCeilingCents) && Number.isInteger(request.estimatedCostCents) && request.estimatedCostCents > request.costCeilingCents) return 'cost-review';
  return 'allow';
}
