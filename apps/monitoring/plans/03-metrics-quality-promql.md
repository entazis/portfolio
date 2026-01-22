# Plan: Metrics Quality & PromQL Best Practices

## Overview
Improve metrics quality by converting web vitals from gauges to histograms, enabling percentile analysis (p50/p95/p99) and better performance monitoring.

## Current State
- Web vitals (LCP, FCP, TTFB) are stored as **gauges**
- Dashboard queries use simple gauge values: `web_vitals_lcp{site="entazis.dev"}`
- Can only show current/latest values, not percentiles
- Counters (visits) are correctly using `increase()` and `rate()`

## Target State
- Web vitals converted to **histograms** for percentile analysis
- Dashboard shows p50, p95, p99 percentiles
- Maintain backward compatibility during transition
- Proper PromQL queries using `histogram_quantile()`

## Implementation Steps

### 1. Understand Histogram Structure

Prometheus histograms require:
- Metric name with `_bucket` suffix for buckets
- Metric name with `_count` suffix for count
- Metric name with `_sum` suffix for sum
- `le` (less than or equal) label for buckets

Example:
```
web_vitals_lcp_bucket{le="100"} 10
web_vitals_lcp_bucket{le="250"} 25
web_vitals_lcp_bucket{le="500"} 50
web_vitals_lcp_bucket{le="1000"} 75
web_vitals_lcp_bucket{le="+Inf"} 100
web_vitals_lcp_count 100
web_vitals_lcp_sum 45000
```

### 2. Update Metrics API to Support Histograms

**File:** `metrics-api/server.js`

**Changes:**

**A. Add histogram bucket configuration:**
```javascript
const HISTOGRAM_BUCKETS = {
  lcp: [100, 250, 500, 1000, 2500, 5000], // milliseconds
  fcp: [100, 250, 500, 1000, 2000],
  ttfb: [100, 200, 300, 500, 1000],
  // Add +Inf bucket automatically
};
```

**B. Add function to convert gauge value to histogram:**
```javascript
/**
 * Convert a gauge value to histogram format
 * @param {string} metricName - Base metric name (e.g., "web_vitals_lcp")
 * @param {number} value - The gauge value
 * @param {number[]} buckets - Bucket boundaries
 * @param {Object} labels - Metric labels
 * @returns {Array} Array of metric objects for histogram
 */
const convertGaugeToHistogram = (metricName, value, buckets, labels) => {
  const metrics = [];
  const sortedBuckets = [...buckets, Infinity].sort((a, b) => a - b);
  
  // Count how many buckets the value falls into
  let count = 0;
  for (const bucket of sortedBuckets) {
    if (value <= bucket) {
      count++;
    }
  }
  
  // Create bucket metrics
  let cumulativeCount = 0;
  for (const bucket of sortedBuckets) {
    if (value <= bucket) {
      cumulativeCount++;
    }
    const bucketLabels = { ...labels, le: bucket === Infinity ? '+Inf' : String(bucket) };
    metrics.push({
      name: `${metricName}_bucket`,
      type: 'counter', // Histogram buckets are counters
      value: cumulativeCount,
      labels: bucketLabels,
    });
  }
  
  // Create count metric
  metrics.push({
    name: `${metricName}_count`,
    type: 'counter',
    value: 1, // Each observation increments count
    labels: labels,
  });
  
  // Create sum metric
  metrics.push({
    name: `${metricName}_sum`,
    type: 'counter',
    value: value, // Sum of all observations
    labels: labels,
  });
  
  return metrics;
};
```

**C. Update metric processing to detect web vitals and convert:**
```javascript
// In the metric processing logic
if (metric.name.startsWith('web_vitals_') && metric.type === 'gauge') {
  const vitalType = metric.name.replace('web_vitals_', '');
  const buckets = HISTOGRAM_BUCKETS[vitalType] || HISTOGRAM_BUCKETS.lcp;
  
  // Convert to histogram format
  const histogramMetrics = convertGaugeToHistogram(
    metric.name,
    Number(metric.value),
    buckets,
    metric.labels || {}
  );
  
  // Replace single gauge with histogram metrics
  // (handle in the metrics array processing)
}
```

**D. Update `formatPrometheusMetrics` to handle histogram TYPE declarations:**
- Ensure `# TYPE metric_name histogram` is declared for histogram metrics

### 3. Update Metrics Formatting

**File:** `metrics-api/server.js`

**Changes:**
- Update `formatPrometheusMetrics` to:
  - Group histogram metrics together (_bucket, _count, _sum)
  - Declare `# TYPE metric_name histogram` for histogram metrics
  - Ensure proper ordering (buckets, count, sum)

### 4. Update Prometheus Configuration

**File:** `prometheus/prometheus.yml`

**Changes:**
- No changes needed - Prometheus automatically recognizes histogram format
- Verify scrape interval is appropriate (30s is fine)

### 5. Update Grafana Dashboard Queries

**File:** `grafana/dashboards/website-visitors.json`

**Changes:**

**Current query (gauge):**
```json
{
  "expr": "web_vitals_lcp{site=\"entazis.dev\"}",
  "legendFormat": "LCP - {{page}}"
}
```

**New query (histogram with percentiles):**
```json
{
  "expr": "histogram_quantile(0.50, sum(rate(web_vitals_lcp_bucket{site=\"entazis.dev\"}[5m])) by (le, page))",
  "legendFormat": "LCP p50 - {{page}}"
},
{
  "expr": "histogram_quantile(0.95, sum(rate(web_vitals_lcp_bucket{site=\"entazis.dev\"}[5m])) by (le, page))",
  "legendFormat": "LCP p95 - {{page}}"
},
{
  "expr": "histogram_quantile(0.99, sum(rate(web_vitals_lcp_bucket{site=\"entazis.dev\"}[5m])) by (le, page))",
  "legendFormat": "LCP p99 - {{page}}"
}
```

**Update all web vitals panels:**
- LCP panel: Add p50, p95, p99 queries
- FCP panel: Add p50, p95, p99 queries
- TTFB panel: Add p50, p95, p99 queries

### 6. Migration Strategy

**Option A: Dual Metrics (Recommended)**
- Keep sending both gauge and histogram for transition period
- Update dashboard to use histograms
- Remove gauge metrics after verification

**Option B: Immediate Switch**
- Stop sending gauge metrics
- Start sending histogram metrics
- Update dashboard immediately

**Recommendation:** Use Option A for safer migration.

### 7. Update Documentation

**File:** Create or update `METRICS.md`

**Content:**
- Document histogram structure
- Explain bucket selection
- Provide PromQL examples
- Document migration from gauges to histograms

## Testing

### 1. Unit Tests for Histogram Conversion
- Test `convertGaugeToHistogram` function
- Verify bucket counts are correct
- Verify sum and count metrics

### 2. Integration Tests
- Send test web vitals metrics
- Verify histogram format in Pushgateway
- Verify Prometheus scrapes correctly
- Verify Grafana queries work

### 3. Dashboard Verification
- Check percentile calculations are correct
- Verify p50, p95, p99 values are reasonable
- Compare with previous gauge values (if dual metrics)

## Files to Modify
- `metrics-api/server.js` - Add histogram conversion logic
- `grafana/dashboards/website-visitors.json` - Update queries to use histograms
- Create/update `METRICS.md` - Document histogram usage

## Dependencies
- Metrics API must support histogram format
- Prometheus automatically handles histograms (no config needed)
- Grafana dashboard must be updated to use new queries

## Rollback Plan
- Revert server.js changes
- Revert dashboard JSON changes
- Metrics will continue as gauges
- No data loss (histograms and gauges can coexist)

## Considerations
- **Bucket Selection:** Choose buckets appropriate for web vitals (milliseconds)
- **Cardinality:** Histograms increase metric cardinality (more time series)
- **Storage:** Histograms use more storage than gauges
- **Query Performance:** Histogram queries can be slower than simple gauge queries

## Testing Checklist
- [ ] Histogram conversion function works correctly
- [ ] Metrics API sends histogram format
- [ ] Pushgateway receives histogram metrics
- [ ] Prometheus scrapes histogram metrics
- [ ] Grafana queries return percentile values
- [ ] Dashboard displays p50, p95, p99 correctly
- [ ] Values are reasonable compared to previous data
- [ ] Documentation is complete
