#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
cleanup-pushgateway.sh

Deletes Pushgateway metrics for the configured grouping keys used by `metrics-api`.

Usage:
  ./scripts/cleanup-pushgateway.sh --job web_metrics --env prod --instance metrics-api-1
  ./scripts/cleanup-pushgateway.sh --job web_metrics --all

Options:
  --job <name>        Pushgateway job name (default: web_metrics)
  --env <name>        Environment grouping key (required unless --all)
  --instance <name>   Instance grouping key (required unless --all)
  --all               Delete ALL metrics for the job (destructive)

Notes:
  - This script executes the DELETE from inside the `metrics-api` container so it can
    reach Pushgateway on the internal Docker network.
EOF
}

JOB="web_metrics"
ENVIRONMENT=""
INSTANCE_ID=""
IS_ALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --job)
      JOB="${2:-}"
      shift 2
      ;;
    --env)
      ENVIRONMENT="${2:-}"
      shift 2
      ;;
    --instance)
      INSTANCE_ID="${2:-}"
      shift 2
      ;;
    --all)
      IS_ALL=true
      shift 1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

if [[ -z "${JOB}" ]]; then
  echo "Missing --job" >&2
  exit 2
fi

if [[ "${IS_ALL}" != "true" ]]; then
  if [[ -z "${ENVIRONMENT}" || -z "${INSTANCE_ID}" ]]; then
    echo "Missing --env and/or --instance (or use --all)" >&2
    exit 2
  fi
fi

if [[ "${IS_ALL}" == "true" ]]; then
  DELETE_PATH="/metrics/job/${JOB}"
else
  DELETE_PATH="/metrics/job/${JOB}/env/${ENVIRONMENT}/instance/${INSTANCE_ID}"
fi

echo "Deleting Pushgateway path: ${DELETE_PATH}"

docker compose exec -T metrics-api node --input-type=module -e "
import fetch from 'node-fetch';
const baseUrl = process.env.PUSHGATEWAY_URL || 'http://pushgateway:9091';
const deletePath = process.env.DELETE_PATH;
const url = new URL(deletePath, baseUrl).toString();
const response = await fetch(url, { method: 'DELETE' });
const body = await response.text();
if (!response.ok) {
  console.error('Delete failed:', response.status, response.statusText);
  console.error(body);
  process.exit(1);
}
console.log('Delete succeeded:', response.status);
" -- DELETE_PATH="${DELETE_PATH}"

