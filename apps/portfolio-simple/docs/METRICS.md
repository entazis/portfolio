# Metrics Tracking Implementation Guide

## Overview

This document provides comprehensive information about the metrics tracking system implemented for the portfolio-simple application. The system tracks Web Vitals, user interactions, section visibility, and scroll depth, all integrated with Prometheus/Grafana via Pushgateway.

## Architecture

```
React SPA → MetricsService → Metrics API (Express) → Pushgateway → Prometheus → Grafana
```

### Components

1. **React Application**: Client-side metrics collection using custom hooks
2. **MetricsService**: Centralized service for batching and sending metrics
3. **Metrics API**: Express server that formats and submits metrics to Pushgateway
4. **Pushgateway**: Temporary metrics storage for Prometheus scraping
5. **Prometheus**: Time-series database for metrics storage
6. **Grafana**: Visualization and dashboarding

## Metrics Catalog

### Web Vitals (Performance Metrics)

These metrics track Core Web Vitals as defined by Google:

#### `web_vitals_cls`
- **Type**: Histogram
- **Description**: Cumulative Layout Shift - measures visual stability
- **Labels**: `site`, `page`, `rating`, `navigation_type`
- **Good**: < 0.1
- **Needs Improvement**: 0.1 - 0.25
- **Poor**: > 0.25

#### `web_vitals_fcp_seconds`
- **Type**: Histogram
- **Description**: First Contentful Paint - time until first content renders
- **Labels**: `site`, `page`, `rating`, `navigation_type`
- **Good**: < 1.8s
- **Needs Improvement**: 1.8s - 3.0s
- **Poor**: > 3.0s

#### `web_vitals_inp_seconds`
- **Type**: Histogram
- **Description**: Interaction to Next Paint - measures responsiveness
- **Labels**: `site`, `page`, `rating`, `navigation_type`
- **Good**: < 200ms
- **Needs Improvement**: 200ms - 500ms
- **Poor**: > 500ms

#### `web_vitals_lcp_seconds`
- **Type**: Histogram
- **Description**: Largest Contentful Paint - loading performance
- **Labels**: `site`, `page`, `rating`, `navigation_type`
- **Good**: < 2.5s
- **Needs Improvement**: 2.5s - 4.0s
- **Poor**: > 4.0s

#### `web_vitals_ttfb_seconds`
- **Type**: Histogram
- **Description**: Time to First Byte - server response time
- **Labels**: `site`, `page`, `rating`, `navigation_type`
- **Good**: < 800ms
- **Needs Improvement**: 800ms - 1800ms
- **Poor**: > 1800ms

### User Engagement Metrics

#### `web_page_visits_total`
- **Type**: Counter
- **Description**: Total page visits
- **Labels**: `site`, `page`

#### `web_section_views_total`
- **Type**: Counter
- **Description**: Number of times a section entered the viewport
- **Labels**: `site`, `section`
- **Sections**: `hero`, `about`, `skills`, `experience`, `projects`, `contact`

#### `web_section_time_spent_seconds`
- **Type**: Histogram
- **Description**: Time spent viewing each section
- **Labels**: `site`, `section`
- **Unit**: Seconds

#### `web_button_clicks_total`
- **Type**: Counter
- **Description**: Button click events
- **Labels**: `site`, `button_label`, `target`
- **Examples**: `View Projects`, `Contact Me`

#### `web_external_link_clicks_total`
- **Type**: Counter
- **Description**: External link clicks
- **Labels**: `site`, `url`, `label`
- **Examples**: LinkedIn, GitHub, Email

#### `web_scroll_depth_percent`
- **Type**: Histogram
- **Description**: How far users scroll on the page
- **Labels**: `site`, `page`
- **Values**: 0-100 (percentage)
- **Milestones**: 25%, 50%, 75%, 100%

## Implementation Details

### Client-Side Integration

#### 1. Metrics Service Initialization

In `src/main.tsx`:

```typescript
import { initializeMetrics } from './services/metricsService';

initializeMetrics({
  enabled: true,
  apiUrl: 'https://entazis.dev/track',
  siteName: 'entazis.dev',
  sampleRate: 1.0,
  batchSize: 10,
  batchInterval: 5000,
  debug: import.meta.env.DEV,
});
```

#### 2. Web Vitals Tracking

In `src/App.tsx`:

```typescript
import { useWebVitals } from './hooks/useWebVitals';
import { useScrollDepth } from './hooks/useScrollDepth';

const App = () => {
  useWebVitals();
  useScrollDepth();
  // ... rest of app
};
```

#### 3. Section Visibility Tracking

In any section component:

```typescript
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

const MySection = () => {
  const sectionRef = useSectionVisibility('section-name');
  
  return (
    <section ref={sectionRef as React.RefObject<HTMLElement>}>
      {/* content */}
    </section>
  );
};
```

#### 4. Click Tracking

In components with interactive elements:

```typescript
import { useClickTracking } from '@/hooks/useClickTracking';

const MyComponent = () => {
  const { trackClick, trackExternalLink } = useClickTracking();
  
  const handleClick = () => {
    trackClick('Button Label', 'target-section');
  };
  
  const handleLinkClick = () => {
    trackExternalLink('https://example.com', 'Link Label');
  };
  
  return (
    <>
      <button onClick={handleClick}>Click Me</button>
      <a href="https://example.com" onClick={handleLinkClick}>External Link</a>
    </>
  );
};
```

### Server-Side Setup

#### Enhanced Metrics API

The metrics API server (`docs/metrics-api-server.js`) provides:

- **Backward compatibility**: Supports legacy `/track` endpoint
- **Batch processing**: `/metrics/batch` endpoint for efficient metric submission
- **Prometheus formatting**: Proper metric formatting with labels and types
- **Health checks**: `/health` endpoint for monitoring
- **Statistics**: `/metrics/stats` endpoint for debugging

#### Running the Metrics API

```bash
# Set environment variables
export PUSHGATEWAY_URL=http://localhost:9091
export PORT=8080

# Run the server
node docs/metrics-api-server.js
```

Or with Docker:

```bash
docker run -d \
  -p 8080:8080 \
  -e PUSHGATEWAY_URL=http://pushgateway:9091 \
  --name metrics-api \
  monitoring-metrics-api
```

### Configuration

Environment variables (`.env`):

```bash
# Enable/disable metrics
VITE_METRICS_ENABLED=true

# API endpoint
VITE_METRICS_API_URL=https://entazis.dev/track

# Site identifier
VITE_SITE_NAME=entazis.dev

# Sample rate (0.0-1.0)
VITE_METRICS_SAMPLE_RATE=1.0

# Batch settings
VITE_METRICS_BATCH_SIZE=10
VITE_METRICS_BATCH_INTERVAL=5000

# Debug mode
VITE_METRICS_DEBUG=false
```

## Grafana Dashboards

### Dashboard Setup

1. Add Prometheus as a data source in Grafana
2. Point it to your Prometheus instance (e.g., `http://prometheus:9090`)
3. Create a new dashboard
4. Add panels with the queries below

### Recommended Panels

#### 1. Page Visits Over Time

**Panel Type**: Time series graph

**Query**:
```promql
rate(web_page_visits_total{site="entazis.dev"}[5m])
```

**Legend**: `{{page}}`

#### 2. Web Vitals Summary

**Panel Type**: Stat

**Queries**:
```promql
# LCP (75th percentile)
histogram_quantile(0.75, 
  sum(rate(web_vitals_lcp_seconds_bucket{site="entazis.dev"}[5m])) by (le)
)

# CLS (75th percentile)
histogram_quantile(0.75, 
  sum(rate(web_vitals_cls_bucket{site="entazis.dev"}[5m])) by (le)
)

# INP (75th percentile)
histogram_quantile(0.75, 
  sum(rate(web_vitals_inp_seconds_bucket{site="entazis.dev"}[5m])) by (le)
)
```

**Thresholds**:
- LCP: Green < 2.5s, Yellow < 4s, Red >= 4s
- CLS: Green < 0.1, Yellow < 0.25, Red >= 0.25
- INP: Green < 0.2s, Yellow < 0.5s, Red >= 0.5s

#### 3. Section Engagement

**Panel Type**: Bar chart

**Query**:
```promql
sum by (section) (
  rate(web_section_views_total{site="entazis.dev"}[1h])
)
```

#### 4. Average Time Spent Per Section

**Panel Type**: Bar chart

**Query**:
```promql
histogram_quantile(0.5, 
  sum by (le, section) (
    rate(web_section_time_spent_seconds_bucket{site="entazis.dev"}[1h])
  )
)
```

#### 5. Button Click-Through Rates

**Panel Type**: Time series

**Query**:
```promql
sum by (button_label) (
  rate(web_button_clicks_total{site="entazis.dev"}[5m])
)
```

#### 6. Scroll Depth Distribution

**Panel Type**: Histogram

**Query**:
```promql
histogram_quantile(0.5, 
  sum(rate(web_scroll_depth_percent_bucket{site="entazis.dev"}[1h])) by (le)
)
```

**Description**: Shows what percentage of users reach various scroll depths

#### 7. External Link Engagement

**Panel Type**: Table

**Query**:
```promql
topk(10, 
  sum by (label, url) (
    increase(web_external_link_clicks_total{site="entazis.dev"}[24h])
  )
)
```

## Best Practices

### Performance Considerations

1. **Batching**: Metrics are batched every 5 seconds or when 10 metrics accumulate
2. **Sampling**: Use `VITE_METRICS_SAMPLE_RATE < 1.0` for high-traffic sites
3. **Async Submission**: All metrics are sent asynchronously using `sendBeacon` or `fetch`
4. **Debouncing**: High-frequency events (scroll) are automatically throttled

### Privacy

- No personal identifiable information (PII) is collected
- No cookies are set
- No IP addresses are tracked in metrics
- All data is anonymous and aggregated

### Error Handling

- Failed metric submissions are retried up to 3 times
- Metrics are sent via `sendBeacon` on page unload for reliability
- Service gracefully degrades if the API is unavailable
- All errors are logged to console in debug mode

### Production Deployment

1. Ensure `VITE_METRICS_ENABLED=true` in production `.env`
2. Set `VITE_METRICS_DEBUG=false` in production
3. Configure appropriate `VITE_METRICS_SAMPLE_RATE` based on traffic
4. Monitor Prometheus and Pushgateway health
5. Set up Grafana alerts for critical Web Vitals thresholds

## Troubleshooting

### Metrics Not Appearing in Grafana

1. Check if metrics are reaching the API:
   ```bash
   curl http://localhost:8080/health
   ```

2. Verify Pushgateway is receiving metrics:
   ```bash
   curl http://localhost:9091/metrics
   ```

3. Check Prometheus is scraping Pushgateway:
   - Open Prometheus UI (`http://localhost:9090`)
   - Go to Status → Targets
   - Verify pushgateway target is UP

4. Enable debug mode:
   ```bash
   VITE_METRICS_DEBUG=true npm run dev
   ```

### High Memory Usage

- Reduce `VITE_METRICS_BATCH_SIZE`
- Increase `VITE_METRICS_BATCH_INTERVAL`
- Lower `VITE_METRICS_SAMPLE_RATE`

### Metrics Delayed

- Check `VITE_METRICS_BATCH_INTERVAL` (default: 5000ms)
- Verify network connectivity to metrics API
- Check Pushgateway disk space

## Future Enhancements

The following features are planned for future implementation:

1. **User Journey Tracking**: Session IDs and funnel analysis
2. **A/B Testing Infrastructure**: Variant tracking and conversion metrics
3. **Error Boundary Metrics**: Automatic error reporting
4. **Device Segmentation**: Browser, device type, screen size labels
5. **Performance Marks**: React component render time tracking
6. **Custom Events**: Business-specific event tracking
7. **Offline Support**: Queue metrics when offline, sync when online

## Support

For questions or issues:
- Review this documentation
- Check the implementation in `src/services/metricsService.ts`
- Enable debug mode for detailed logging
- Review Grafana dashboards for metric validation

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Author**: Bence Szabó

