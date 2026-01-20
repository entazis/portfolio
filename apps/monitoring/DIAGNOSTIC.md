# Metrics Pipeline Diagnostic Guide

## Issues Identified

### 1. ✅ FIXED: Metrics API Dockerfile Issue

**Problem**: The `server.js` uses ES6 `import` syntax but there was no `package.json` with `"type": "module"`, which would cause the Node.js runtime to fail.

**Fix Applied**:

- Created `package.json` with `"type": "module"`
- Updated Dockerfile to copy `package.json` before installing dependencies

**Action Required**: Rebuild the metrics-api container:

```bash
cd apps/monitoring
docker-compose build metrics-api
docker-compose up -d metrics-api
```

### 2. Potential Issues to Investigate

#### A. Reverse Proxy Routing

**Question**: How is `https://entazis.dev/api/track` routed to the metrics-api service?

The portfolio-simple site sends metrics to:

- `https://entazis.dev/api/track` (from `metricsService.ts`)

The metrics-api service listens on:

- Port 8080 inside Docker network
- Endpoint: `/track`

**Check**: Is there a reverse proxy (nginx, traefik, etc.) that routes `/api/track` to `http://monitoring-metrics-api-1:8080/track`?

#### B. CORS Configuration

The metrics-api has CORS enabled (allows all origins), so this should be fine.

#### C. Prometheus Scraping

**Current Config**: Prometheus scrapes Pushgateway every 30s.

**Potential Issue**: Pushgateway metrics expire after a period of inactivity. If metrics aren't being pushed frequently enough, they might expire before Prometheus scrapes them.

#### D. Metric Name Verification

**Dashboard Queries**:

- `web_page_visits_total` ✅ (matches code)
- `web_section_views_total` ✅ (matches code)
- `web_vitals_lcp` ✅ (matches code - sent as gauge)
- `web_vitals_fcp` ✅ (matches code)
- `web_vitals_ttfb` ✅ (matches code)

## Diagnostic Steps

### Step 1: Check Metrics API Health

```bash
# From the server
curl http://localhost:8080/health

# Expected response:
# {"status":"healthy","service":"metrics-api","timestamp":"..."}
```

### Step 2: Check Metrics API Stats

```bash
curl http://localhost:8080/metrics/stats

# This shows if Pushgateway is reachable and has metrics
```

### Step 3: Check Pushgateway Directly

```bash
# Check if Pushgateway has any metrics
curl http://localhost:9091/metrics | grep web_

# Should show metrics like:
# web_page_visits_total{site="entazis.dev",page="/"} 1.0
```

### Step 4: Check Prometheus Targets

1. Open `http://your-server:9090` (Prometheus UI)
2. Go to Status → Targets
3. Verify `pushgateway` target is UP and shows "Last Scrape" time

### Step 5: Query Prometheus Directly

In Prometheus UI (`http://your-server:9090`), try these queries:

```promql
# Check if metrics exist
web_page_visits_total

# Check with site label
web_page_visits_total{site="entazis.dev"}

# Check web vitals
web_vitals_lcp{site="entazis.dev"}
```

### Step 6: Test Metrics Submission

```bash
# Test sending a metric directly to metrics-api
curl -X POST http://localhost:8080/track \
  -H "Content-Type: application/json" \
  -d '{
    "site": "entazis.dev",
    "metrics": [{
      "name": "web_page_visits_total",
      "type": "counter",
      "value": 1,
      "labels": {
        "site": "entazis.dev",
        "page": "/test"
      }
    }],
    "timestamp": '$(date +%s000)'
  }'

# Then check Pushgateway:
curl http://localhost:9091/metrics | grep web_page_visits_total
```

### Step 7: Check Browser Network Tab

1. Open `https://entazis.dev` in browser
2. Open Developer Tools → Network tab
3. Filter by "track" or "api"
4. Look for POST requests to `/api/track` or `/track`
5. Check:
   - Are requests being made?
   - What's the response status?
   - Are there any CORS errors?

### Step 8: Check Container Logs

```bash
# Check metrics-api logs
docker logs monitoring-metrics-api-1

# Check for errors, especially:
# - Connection errors to Pushgateway
# - Request processing errors
# - Metric formatting errors

# Check Pushgateway logs
docker logs monitoring-pushgateway-1

# Check Prometheus logs
docker logs monitoring-prometheus-1
```

## Common Issues and Solutions

### Issue: Metrics API not receiving requests

**Symptoms**: No logs in metrics-api container
**Solutions**:

1. Verify reverse proxy configuration
2. Check if metrics are enabled in portfolio-simple (check browser console)
3. Verify API URL in portfolio-simple environment

### Issue: Pushgateway not receiving metrics

**Symptoms**: `curl http://localhost:9091/metrics` shows no web_* metrics
**Solutions**:

1. Check metrics-api logs for Pushgateway connection errors
2. Verify `PUSHGATEWAY_URL` environment variable
3. Test direct submission to Pushgateway

### Issue: Prometheus not scraping metrics

**Symptoms**: Metrics in Pushgateway but not in Prometheus
**Solutions**:

1. Check Prometheus targets page
2. Verify network connectivity between Prometheus and Pushgateway
3. Check Prometheus logs for scrape errors

### Issue: Metrics expiring too quickly

**Symptoms**: Metrics appear briefly then disappear
**Solutions**:

1. Reduce Prometheus scrape interval (currently 30s)
2. Ensure metrics are being pushed regularly
3. Consider using a different approach for continuous metrics (not Pushgateway)

## Next Steps

1. **Rebuild metrics-api container** with the fixed Dockerfile
2. **Run diagnostic steps** above to identify where the pipeline breaks
3. **Check reverse proxy configuration** to ensure routing is correct
4. **Verify metrics are being sent** from the browser (check network tab)
