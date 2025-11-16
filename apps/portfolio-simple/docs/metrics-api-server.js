/**
 * Enhanced Metrics API Server for Prometheus/Pushgateway Integration
 * Supports multiple metric types, batch submissions, and proper Prometheus formatting
 */

import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL || 'http://pushgateway:9091';
const PORT = process.env.PORT || 8080;

/**
 * Format a metric in Prometheus text format
 * @param {Object} metric - Metric object with name, type, value, labels
 * @returns {string} Prometheus formatted metric string
 */
const formatPrometheusMetric = (metric) => {
  const { name, type, value, labels } = metric;

  // Build label string
  const labelPairs = Object.entries(labels || {})
    .map(([key, value]) => `${key}="${value}"`)
    .join(', ');

  const labelString = labelPairs ? `{${labelPairs}}` : '';

  // Format based on metric type
  switch (type) {
    case 'counter':
    case 'gauge':
      return `${name}${labelString} ${value}`;

    case 'histogram':
      // For histograms, we create multiple metrics with buckets
      // Simplified approach: create a summary with quantiles
      const buckets = [0.001, 0.01, 0.1, 0.5, 1, 2.5, 5, 10, 30, 60];
      const lines = [];

      // Add bucket metrics
      buckets.forEach((bucket) => {
        const bucketLabel = labelPairs ? `{${labelPairs}, le="${bucket}"}` : `{le="${bucket}"}`;
        lines.push(`${name}_bucket${bucketLabel} ${value <= bucket ? 1 : 0}`);
      });

      // Add +Inf bucket
      const infLabel = labelPairs ? `{${labelPairs}, le="+Inf"}` : `{le="+Inf"}`;
      lines.push(`${name}_bucket${infLabel} 1`);

      // Add sum and count
      lines.push(`${name}_sum${labelString} ${value}`);
      lines.push(`${name}_count${labelString} 1`);

      return lines.join('\n');

    default:
      return `${name}${labelString} ${value}`;
  }
};

/**
 * Submit metrics to Pushgateway
 * @param {string} job - Job name for the metrics
 * @param {string} metricsText - Prometheus formatted metrics text
 * @returns {Promise<void>}
 */
const submitToPushgateway = async (job, metricsText) => {
  const url = `${PUSHGATEWAY_URL}/metrics/job/${job}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: metricsText,
  });

  if (!response.ok) {
    throw new Error(`Pushgateway error: ${response.status} ${response.statusText}`);
  }
};

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'metrics-api',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Legacy endpoint for backward compatibility
 * POST /track
 * Body: { site: string, page: string }
 */
app.post('/track', async (req, res) => {
  try {
    const { site, page, metrics } = req.body;

    // Handle legacy format (single page visit)
    if (site && page && !metrics) {
      const metric = `web_page_visits_total{site="${site}", page="${page}"} 1`;
      await submitToPushgateway('web_visits', metric);
      return res.json({ success: true, message: 'Metric tracked' });
    }

    // Handle new batch format
    if (metrics && Array.isArray(metrics)) {
      const formattedMetrics = metrics.map((m) => formatPrometheusMetric(m)).join('\n');

      await submitToPushgateway('web_metrics', formattedMetrics);
      return res.json({
        success: true,
        message: `Batch of ${metrics.length} metrics tracked`,
      });
    }

    // Handle single metric in new format
    if (site && metrics && typeof metrics === 'object') {
      const formatted = formatPrometheusMetric(metrics);
      await submitToPushgateway('web_metrics', formatted);
      return res.json({ success: true, message: 'Metric tracked' });
    }

    return res.status(400).json({
      success: false,
      error: 'Invalid request format',
    });
  } catch (error) {
    console.error('Error tracking metric:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Batch metrics submission endpoint
 * POST /metrics/batch
 * Body: { site: string, metrics: Metric[], timestamp: number }
 */
app.post('/metrics/batch', async (req, res) => {
  try {
    const { site, metrics, timestamp } = req.body;

    if (!site || !metrics || !Array.isArray(metrics)) {
      return res.status(400).json({
        success: false,
        error: 'Missing site or metrics array',
      });
    }

    if (metrics.length === 0) {
      return res.json({
        success: true,
        message: 'No metrics to process',
      });
    }

    // Format all metrics
    const formattedMetrics = metrics.map((metric) => formatPrometheusMetric(metric)).join('\n');

    // Submit to Pushgateway
    await submitToPushgateway('web_metrics', formattedMetrics);

    console.log(`[${new Date().toISOString()}] Processed ${metrics.length} metrics for ${site}`);

    return res.json({
      success: true,
      message: `Successfully tracked ${metrics.length} metrics`,
      timestamp: timestamp || Date.now(),
    });
  } catch (error) {
    console.error('Error processing batch:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Get metrics statistics (for debugging)
 */
app.get('/metrics/stats', async (req, res) => {
  try {
    // Query Pushgateway for current metrics
    const response = await fetch(`${PUSHGATEWAY_URL}/metrics`);
    const metricsText = await response.text();

    // Parse and count metrics
    const lines = metricsText.split('\n').filter((line) => line && !line.startsWith('#'));

    return res.json({
      success: true,
      totalMetrics: lines.length,
      timestamp: new Date().toISOString(),
      pushgatewayUrl: PUSHGATEWAY_URL,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`===========================================`);
  console.log(`Metrics API Server`);
  console.log(`===========================================`);
  console.log(`Port: ${PORT}`);
  console.log(`Pushgateway: ${PUSHGATEWAY_URL}`);
  console.log(`Health: http://localhost:${PORT}/health`);
  console.log(`===========================================`);
});

export default app;
