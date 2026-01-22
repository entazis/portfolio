# Plan: Evaluate Replacing Pushgateway with Direct Scraping

## Overview
Evaluate the feasibility and benefits of replacing Pushgateway with direct Prometheus scraping of metrics-api, and create an implementation plan if the decision is made to proceed.

## Current Architecture

```
Website → Metrics API (8080) → Pushgateway (9091) → Prometheus (9090) → Grafana
```

## Proposed Architecture

```
Website → Metrics API (8080) → /metrics endpoint → Prometheus (9090) → Grafana
```

## Current State Analysis

### Advantages of Current Setup (Pushgateway)
- ✅ Works with current architecture
- ✅ Metrics-api handles batching and aggregation
- ✅ Counter state persistence (handled in metrics-api)
- ✅ No changes needed to external clients
- ✅ Pushgateway handles temporary storage

### Disadvantages of Current Setup
- ❌ Pushgateway adds complexity (extra service)
- ❌ Stale metrics can accumulate
- ❌ Not ideal for continuous metrics (designed for short-lived jobs)
- ❌ Additional network hop
- ❌ Additional resource usage

### Advantages of Direct Scraping
- ✅ Simpler architecture (one less service)
- ✅ More standard Prometheus pattern
- ✅ Automatic metric expiration (via scrape interval)
- ✅ Better for continuous metrics
- ✅ Reduced resource usage
- ✅ No stale metrics issues

### Disadvantages of Direct Scraping
- ❌ Requires metrics-api to expose `/metrics` endpoint
- ❌ Requires counter state handling in metrics-api (already done)
- ❌ Requires Prometheus to scrape metrics-api
- ❌ Migration effort required

## Evaluation Criteria

### 1. Technical Feasibility
**Status:** ✅ Feasible
- Metrics-api already handles counter aggregation
- Can expose Prometheus-formatted `/metrics` endpoint
- Prometheus can scrape HTTP endpoints

### 2. Migration Complexity
**Status:** Medium
- Need to add `/metrics` endpoint to metrics-api
- Update Prometheus scrape config
- Remove Pushgateway from docker-compose
- Update documentation
- Test thoroughly

### 3. Risk Assessment
**Status:** Low-Medium
- Low risk if tested properly
- Can run both in parallel during transition
- Easy rollback (keep Pushgateway)

### 4. Benefits vs. Effort
**Status:** Medium benefit, Medium effort
- Simplifies architecture
- Better alignment with Prometheus best practices
- But current setup works fine

## Decision Matrix

| Factor | Pushgateway (Current) | Direct Scraping | Winner |
|--------|----------------------|-----------------|--------|
| Simplicity | Medium | High | Direct Scraping |
| Standard Practice | Low | High | Direct Scraping |
| Current Functionality | High | Medium | Pushgateway |
| Migration Effort | N/A | Medium | Pushgateway |
| Resource Usage | Medium | Low | Direct Scraping |
| Stale Metrics | Issue | No Issue | Direct Scraping |

## Recommendation

**Option A: Keep Pushgateway (Recommended for now)**
- Current setup works well
- No migration risk
- Metrics-api counter handling is good
- Can revisit if issues arise

**Option B: Migrate to Direct Scraping**
- Better long-term architecture
- More standard Prometheus pattern
- Simplifies stack
- Worth doing if you have time for migration

## Implementation Plan (If Proceeding with Migration)

### Phase 1: Add /metrics Endpoint to Metrics-API

**File:** `metrics-api/server.js`

**Add endpoint:**
```javascript
/**
 * Prometheus metrics endpoint
 * Exposes current counter state and other metrics in Prometheus format
 */
app.get('/metrics', async (req, res) => {
  try {
    const metrics = [];
    
    // Export all counter totals as Prometheus metrics
    for (const [seriesKey, total] of counterTotalsBySeriesKey.entries()) {
      // Parse seriesKey format: "metric_name:{labels}"
      const [metricName, labelsJson] = seriesKey.split(':');
      const labels = JSON.parse(labelsJson);
      
      metrics.push({
        name: metricName,
        type: 'counter',
        value: total,
        labels: labels,
      });
    }
    
    // Format as Prometheus text format
    const prometheusText = formatPrometheusMetrics(metrics);
    
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    res.send(prometheusText);
  } catch (error) {
    console.error('Error generating metrics:', error);
    res.status(500).send('# Error generating metrics\n');
  }
});
```

### Phase 2: Update Prometheus Configuration

**File:** `prometheus/prometheus.yml`

**Add scrape config:**
```yaml
scrape_configs:
  - job_name: 'pushgateway'
    honor_labels: true
    static_configs:
      - targets: ['pushgateway:9091']

  # New: Direct scraping of metrics-api
  - job_name: 'metrics-api'
    scrape_interval: 30s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['metrics-api:8080']
```

### Phase 3: Dual Operation (Testing)

**Duration:** 1-2 weeks

**Action:**
- Keep both Pushgateway and direct scraping running
- Compare metrics from both sources
- Verify data consistency
- Update Grafana dashboards to use new metric source

### Phase 4: Remove Pushgateway

**File:** `docker-compose.yml`

**Remove:**
```yaml
# Remove pushgateway service
# Remove pushgateway volume (if exists)
```

**File:** `prometheus/prometheus.yml`

**Remove:**
```yaml
# Remove pushgateway scrape config
```

**File:** `metrics-api/server.js`

**Remove:**
- Pushgateway submission logic (keep `/metrics` endpoint)
- Or keep as fallback option

### Phase 5: Update Documentation

**Files to update:**
- `README.md` - Update architecture diagram
- `METRICS.md` - Update metrics flow
- Remove Pushgateway references

## Rollback Plan

If issues occur:
1. Re-add Pushgateway to docker-compose.yml
2. Re-add Pushgateway scrape config
3. Revert metrics-api changes (or keep both)
4. Services continue working

## Testing Plan

### 1. Unit Tests
- Test `/metrics` endpoint format
- Verify counter totals are correct
- Verify Prometheus format compliance

### 2. Integration Tests
- Prometheus can scrape `/metrics`
- Metrics appear in Prometheus
- Grafana queries work
- Compare with Pushgateway metrics (during dual operation)

### 3. Load Tests
- Verify scraping doesn't impact metrics-api performance
- Verify Prometheus scrape interval is appropriate

## Files to Modify (If Proceeding)

- `metrics-api/server.js` - Add `/metrics` endpoint
- `prometheus/prometheus.yml` - Add metrics-api scrape config
- `docker-compose.yml` - Remove pushgateway service
- Documentation files - Update architecture

## Alternative: Hybrid Approach

**Keep both:**
- Use Pushgateway for batch submissions (current)
- Expose `/metrics` for direct scraping (new)
- Let Prometheus scrape both
- Gradually migrate to direct scraping

## Conclusion

**Current Recommendation:** Keep Pushgateway for now, but plan migration for future.

**Reasons:**
1. Current setup works well
2. Migration requires testing and validation
3. Can be done incrementally
4. Low priority compared to security/healthcheck improvements

**When to Revisit:**
- If you experience stale metrics issues
- If you want to simplify architecture
- If you have time for thorough testing
- During next major refactoring

## Next Steps (If Proceeding)

1. Create feature branch
2. Implement `/metrics` endpoint
3. Add Prometheus scrape config
4. Test in parallel with Pushgateway
5. Compare metrics for 1-2 weeks
6. Migrate Grafana dashboards
7. Remove Pushgateway
8. Update documentation
