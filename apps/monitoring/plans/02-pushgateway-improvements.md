# Plan: Pushgateway Usage Improvements

## Overview
Enhance Pushgateway usage by adding environment labels, improving grouping keys, and documenting lifecycle management strategy for stale metrics.

## Current State
- Metrics are pushed with `job="web_metrics"` grouping key
- Labels include: `site`, `page`, `section` (from metrics)
- No explicit `env` or `environment` label
- No `instance` label for multi-instance scenarios
- No documented strategy for stale metrics cleanup

## Target State
- Add `env` or `environment` label to all metrics (e.g., `env="prod"`)
- Add `instance` label if multiple metrics-api instances exist
- Document lifecycle management strategy
- Optionally implement stale metrics cleanup mechanism

## Implementation Steps

### 1. Update Metrics API to Add Environment Labels

**File:** `metrics-api/server.js`

**Changes:**
- Add environment variable: `ENVIRONMENT` or `ENV` (default: "prod")
- Include `env` label in all metrics pushed to Pushgateway
- Optionally add `instance` label (could use hostname or instance ID)

**Location:** In the `submitToPushgateway` function or when formatting metrics

**Example:**
```javascript
const ENVIRONMENT = process.env.ENVIRONMENT || process.env.ENV || 'prod';
const INSTANCE_ID = process.env.INSTANCE_ID || require('os').hostname();

// When formatting metrics, ensure env label is included
const defaultLabels = {
  env: ENVIRONMENT,
  instance: INSTANCE_ID,
  // ... existing labels
};
```

### 2. Update Metrics Formatting Logic

**File:** `metrics-api/server.js`

**Changes:**
- Modify `formatPrometheusMetrics` or metric submission to ensure `env` label is always present
- Merge default labels with metric-specific labels
- Ensure labels are properly escaped

**Note:** Be careful not to overwrite existing labels - merge instead of replace.

### 3. Update Docker Compose Configuration

**File:** `docker-compose.yml`

**Changes:**
- Add environment variable to metrics-api service:
  ```yaml
  metrics-api:
    environment:
      - ENVIRONMENT=${ENVIRONMENT:-prod}
      - INSTANCE_ID=${INSTANCE_ID:-metrics-api-1}
  ```

### 4. Update Environment File

**File:** `.env` (if exists)

**Changes:**
- Add `ENVIRONMENT=prod` (or appropriate value)
- Add `INSTANCE_ID=metrics-api-1` (if using multiple instances)

### 5. Document Lifecycle Management Strategy

**File:** Create `PUSHGATEWAY_LIFECYCLE.md` or update existing docs

**Content:**
- Explain Pushgateway's behavior (metrics persist until deleted)
- Document when metrics should be cleaned up
- Provide cleanup commands/scripts
- Explain grouping key structure

**Example cleanup script:**
```bash
#!/bin/bash
# Clean up stale metrics from Pushgateway
# Usage: ./cleanup-pushgateway.sh [job] [grouping_key]

PUSHGATEWAY_URL="${PUSHGATEWAY_URL:-http://localhost:9091}"
JOB="${1:-web_metrics}"

# Delete all metrics for a job
curl -X DELETE "${PUSHGATEWAY_URL}/metrics/job/${JOB}"

# Or delete specific grouping key
# curl -X DELETE "${PUSHGATEWAY_URL}/metrics/job/${JOB}/env/prod"
```

### 6. Optional: Implement Automatic Cleanup

**Option A:** Add cleanup endpoint to metrics-api
- Endpoint: `POST /cleanup` or `DELETE /metrics/:job`
- Requires authentication/authorization
- Calls Pushgateway DELETE API

**Option B:** Cron job or scheduled task
- Periodically delete stale metrics older than X hours
- Run via systemd timer or cron
- Document in lifecycle management doc

### 7. Update Prometheus Configuration (if needed)

**File:** `prometheus/prometheus.yml`

**Changes:**
- Verify `honor_labels: true` is set (already present)
- This ensures labels from Pushgateway (including new `env` label) are preserved

### 8. Update Grafana Dashboards (if needed)

**File:** `grafana/dashboards/website-visitors.json`

**Changes:**
- Queries may benefit from filtering by `env` label
- Example: `sum by (site, page) (increase(web_page_visits_total{env="prod"}[$__rate_interval]))`
- Add environment selector to dashboard templating (optional)

## Testing

### 1. Verify Labels in Metrics
```bash
# Check metrics include env label
curl http://pushgateway:9091/metrics | grep env
```

### 2. Verify Metrics Still Work
- Send test metrics via metrics-api
- Verify they appear in Prometheus
- Verify Grafana dashboards still function

### 3. Test Cleanup (if implemented)
- Send test metrics
- Verify cleanup endpoint/script works
- Verify metrics are removed from Pushgateway

## Files to Modify
- `metrics-api/server.js` - Add env/instance labels
- `docker-compose.yml` - Add environment variables
- `.env` - Add ENVIRONMENT and INSTANCE_ID (if used)
- `prometheus/prometheus.yml` - Verify honor_labels (no changes needed)
- `grafana/dashboards/website-visitors.json` - Optional: filter by env
- Create `PUSHGATEWAY_LIFECYCLE.md` - Documentation

## Dependencies
- Metrics API must be updated first
- Environment variables must be set
- Pushgateway DELETE API must be accessible (internal network)

## Rollback Plan
- Remove environment variables from docker-compose.yml
- Revert server.js changes
- Metrics will continue working without env labels

## Testing Checklist
- [ ] Environment labels appear in Pushgateway metrics
- [ ] Prometheus scrapes metrics with env labels
- [ ] Grafana dashboards still work (may need query updates)
- [ ] Multiple instances (if applicable) have unique instance labels
- [ ] Cleanup mechanism works (if implemented)
- [ ] Documentation is complete
