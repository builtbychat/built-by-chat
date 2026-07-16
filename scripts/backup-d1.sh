#!/usr/bin/env bash
set -euo pipefail
environment=${1:-production}; stamp=$(date -u +%Y%m%dT%H%M%SZ); mkdir -p backups
npx wrangler d1 export built-by-chat --remote --env "$environment" --output "backups/town-${environment}-${stamp}.sql"
