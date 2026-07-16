#!/usr/bin/env bash
set -euo pipefail
if [[ $# -lt 1 ]]; then echo "Usage: $0 backup.sql [staging|production]" >&2; exit 2; fi
backup=$1; environment=${2:-staging}
[[ -f "$backup" ]] || { echo "Backup not found: $backup" >&2; exit 2; }
if [[ "$environment" != "staging" && "$environment" != "production" ]]; then echo "Environment must be staging or production" >&2; exit 2; fi
if [[ "${CONFIRM_EXTERNAL_MUTATIONS:-}" != "YES" ]]; then echo "Restore plan only: $backup -> $environment. Set CONFIRM_EXTERNAL_MUTATIONS=YES after explicit approval."; exit 0; fi
if [[ "$environment" == "production" && "${CONFIRM_PRODUCTION_RESTORE:-}" != "YES" ]]; then echo "Production restore needs CONFIRM_PRODUCTION_RESTORE=YES after a second explicit approval." >&2; exit 2; fi
database=built-by-chat
if [[ "$environment" == "staging" ]]; then database=built-by-chat-staging; fi
npx wrangler d1 execute "$database" --remote --env "$environment" --file "$backup"
