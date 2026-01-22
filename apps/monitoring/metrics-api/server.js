/**
 * Enhanced Metrics API Server for Prometheus/Pushgateway Integration
 * Supports multiple metric types, batch submissions, and proper Prometheus formatting
 */

import express from 'express';
import fetch from 'node-fetch';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const app = express();
app.use(express.json());

// Add CORS support
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const PUSHGATEWAY_URL = process.env.PUSHGATEWAY_URL || 'http://pushgateway:9091';
const PORT = process.env.PORT || 8080;
const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS) || 15000; // Timeout for Pushgateway requests
const ALLOWED_METRIC_TYPES = ['gauge', 'counter', 'histogram']; // Supported Prometheus metric types
const COUNTER_STATE_FILE_PATH = process.env.COUNTER_STATE_FILE_PATH || '/data/counter-state.json';
const MAX_PUSH_RETRIES = Number(process.env.MAX_PUSH_RETRIES) || 3;
const PUSH_RETRY_BASE_DELAY_MS = 250;
const ENVIRONMENT = process.env.ENVIRONMENT || process.env.ENV || 'prod';
const INSTANCE_ID = process.env.INSTANCE_ID || os.hostname();

/**
 * In Pushgateway, pushes overwrite the current value for a series.
 * If clients send counter "deltas" (e.g. value=1 per event), we must convert them to
 * cumulative totals before pushing, otherwise counters never increase and Grafana
 * queries like increase() will stay at 0.
 */
const counterTotalsBySeriesKey = new Map();
let isCounterStateSaveScheduled = false;

/**
 * Create a stable key from labels so we can track totals per series.
 * @param {Record<string, unknown>} labels
 * @returns {string}
 */
const createLabelsKey = (labels = {}) =>
  JSON.stringify(Object.entries(labels).sort(([a], [b]) => a.localeCompare(b)));

/**
 * @param {string} name
 * @param {Record<string, unknown>} labels
 * @returns {string}
 */
const createCounterSeriesKey = (name, labels = {}) => `${name}:${createLabelsKey(labels)}`;

/**
 * Load counter totals from disk (best-effort).
 * @returns {Promise<void>}
 */
const loadCounterState = async () => {
  try {
    const fileContents = await fs.readFile(COUNTER_STATE_FILE_PATH, 'utf8');
    const parsed = JSON.parse(fileContents);
    if (!parsed || typeof parsed !== 'object') {
      return;
    }
    for (const [seriesKey, value] of Object.entries(parsed)) {
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) {
        counterTotalsBySeriesKey.set(seriesKey, numericValue);
      }
    }
  } catch (err) {
    // Ignore missing file / first run
  }
};

/**
 * Save counter totals to disk (best-effort).
 * @returns {Promise<void>}
 */
const saveCounterState = async () => {
  try {
    const dirPath = path.dirname(COUNTER_STATE_FILE_PATH);
    await fs.mkdir(dirPath, { recursive: true });
    const asObject = Object.fromEntries(counterTotalsBySeriesKey.entries());
    await fs.writeFile(COUNTER_STATE_FILE_PATH, JSON.stringify(asObject), 'utf8');
  } catch (err) {
    console.error('Failed to save counter state:', err);
  }
};

/**
 * Schedule a counter state save (debounced per event loop tick).
 * @returns {void}
 */
const scheduleCounterStateSave = () => {
  if (isCounterStateSaveScheduled) {
    return;
  }
  isCounterStateSaveScheduled = true;
  setTimeout(async () => {
    isCounterStateSaveScheduled = false;
    await saveCounterState();
  }, 0);
};

await loadCounterState();

/**
 * Validate a single metric object
 * @param {Object} metric - Metric object to validate
 * @param {number} index - Index of the metric in the array (for error reporting)
 * @returns {Object} Validation result with { isValid: boolean, error?: string }
 */
const validateMetric = (metric, index) => {
  const errors = [];

  // Check if metric is an object
  if (!metric || typeof metric !== 'object') {
    return {
      isValid: false,
      error: `Metric at index ${index}: must be an object`,
    };
  }

  // Validate name field
  if (!metric.name || typeof metric.name !== 'string' || metric.name.trim() === '') {
    errors.push('name must be a non-empty string');
  }

  // Validate type field
  if (!metric.type || typeof metric.type !== 'string') {
    errors.push('type must be a string');
  } else if (!ALLOWED_METRIC_TYPES.includes(metric.type)) {
    errors.push(`type must be one of: ${ALLOWED_METRIC_TYPES.join(', ')}`);
  }

  // Validate value field
  if (metric.value === undefined || metric.value === null) {
    errors.push('value is required');
  } else {
    const numericValue = Number(metric.value);
    if (isNaN(numericValue) || !isFinite(numericValue)) {
      errors.push('value must be a number or numeric string');
    }
  }

  // Return validation result
  if (errors.length > 0) {
    return {
      isValid: false,
      error: `Metric at index ${index}: ${errors.join(', ')}`,
    };
  }

  return { isValid: true };
};

/**
 * Format a single metric line (without TYPE declaration)
 * @param {Object} metric - Metric object with name, type, value, labels
 * @returns {string} Prometheus formatted metric line
 */
const formatMetricLine = (metric) => {
  const { name, value, labels } = metric;

  const labelPairs = Object.entries(labels || {})
    .map(
      ([key, value]) =>
        `${key}="${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
    )
    .join(', ');

  const labelString = labelPairs ? `{${labelPairs}}` : '';
  return `${name}${labelString} ${value}`;
};

/**
 * Format multiple metrics in Prometheus text format with proper grouping
 * Groups metrics by name to avoid duplicate TYPE declarations
 * Deduplicates metrics with same name and labels (keeps last value)
 * @param {Array} metrics - Array of metric objects
 * @returns {string} Prometheus formatted metrics text
 */
const formatPrometheusMetrics = (metrics) => {
  // Group metrics by name and deduplicate by labels
  const metricsByName = new Map();

  for (const metric of metrics) {
    const { name, type, labels } = metric;

    if (!metricsByName.has(name)) {
      metricsByName.set(name, {
        type: type === 'counter' || type === 'gauge' ? type : 'gauge',
        instances: new Map(), // Use Map to deduplicate by label signature
      });
    }

    // Create a stable key from sorted labels
    const labelKey = JSON.stringify(
      Object.entries(labels || {}).sort(([a], [b]) => a.localeCompare(b)),
    );

    // Store metric, overwriting if same labels exist (keeps last value)
    metricsByName.get(name).instances.set(labelKey, metric);
  }

  // Build output with one TYPE declaration per metric name
  const output = [];
  for (const [name, { type, instances }] of metricsByName.entries()) {
    // Add TYPE declaration once per metric name
    output.push(`# TYPE ${name} ${type}`);

    // Add all unique instances of this metric
    for (const metric of instances.values()) {
      output.push(formatMetricLine(metric));
    }
  }

  return output.join('\n');
};

/**
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
const waitForMilliseconds = async (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Submit metrics to Pushgateway
 * @param {string} job - Job name for the metrics
 * @param {Object} groupingKeyLabels - Grouping key labels for Pushgateway URL
 * @param {string} metricsText - Prometheus formatted metrics text
 * @returns {Promise<void>}
 */
const submitToPushgateway = async (job, groupingKeyLabels, metricsText) => {
  const encodedJob = encodeURIComponent(job);
  const env = encodeURIComponent(String(groupingKeyLabels.env));
  const instance = encodeURIComponent(String(groupingKeyLabels.instance));
  const url = `${PUSHGATEWAY_URL}/metrics/job/${encodedJob}/env/${env}/instance/${instance}`;

  console.log('==== SENDING TO PUSHGATEWAY ====');
  console.log(metricsText);
  console.log('==== END ====');

  for (let attempt = 1; attempt <= MAX_PUSH_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST', // POST adds/updates metrics; PUT would replace ALL metrics for the job
        headers: {
          'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
        },
        body: metricsText,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (response.ok) {
        return;
      }
      const errorBody = await response.text();
      console.error(`Pushgateway error: ${response.status} ${response.statusText}`);
      console.error(`Error body: ${errorBody}`);
      throw new Error(`Pushgateway error: ${response.status} ${response.statusText}`);
    } catch (error) {
      const isLastAttempt = attempt >= MAX_PUSH_RETRIES;
      console.error(`Pushgateway request attempt ${attempt} failed:`, error);
      if (isLastAttempt) {
        throw error;
      }
      await waitForMilliseconds(PUSH_RETRY_BASE_DELAY_MS * attempt);
    }
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
 * Batch metrics submission endpoint
 * POST /track
 * Body: { site: string, metrics: Metric[], timestamp: number }
 */
app.post('/track', async (req, res) => {
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

    // Validate all metrics before processing
    const validationErrors = [];
    for (let i = 0; i < metrics.length; i++) {
      const validationResult = validateMetric(metrics[i], i);
      if (!validationResult.isValid) {
        validationErrors.push(validationResult.error);
      }
    }

    // If validation errors exist, return 400 with detailed error information
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Metric validation failed',
        validationErrors: validationErrors,
        totalMetrics: metrics.length,
        invalidCount: validationErrors.length,
      });
    }

    const defaultLabels = {
      env: ENVIRONMENT,
      instance: INSTANCE_ID,
    };

    const metricsWithDefaultLabels = metrics.map((metric) => {
      const labels = metric.labels && typeof metric.labels === 'object' ? metric.labels : {};
      const siteLabel = labels.site ? labels.site : site;
      return {
        ...metric,
        labels: {
          ...defaultLabels,
          ...labels,
          site: siteLabel,
        },
      };
    });

    // Convert counter deltas -> cumulative totals per series (per metric name + labels)
    const processedMetrics = metricsWithDefaultLabels.map((metric) => {
      if (metric.type !== 'counter') {
        return metric;
      }
      const labels = metric.labels || {};
      const seriesKey = createCounterSeriesKey(metric.name, labels);
      const previousTotal = counterTotalsBySeriesKey.get(seriesKey) || 0;
      const delta = Number(metric.value);
      const nextTotal = Number.isFinite(delta) ? previousTotal + delta : previousTotal;
      counterTotalsBySeriesKey.set(seriesKey, nextTotal);
      return { ...metric, value: nextTotal };
    });
    scheduleCounterStateSave();

    // Format all metrics with proper grouping and spacing
    const formattedMetrics = formatPrometheusMetrics(processedMetrics) + '\n'; // Add trailing newline for Pushgateway

    // Submit to Pushgateway (use grouping keys for easier lifecycle management)
    await submitToPushgateway(
      'web_metrics',
      { env: ENVIRONMENT, instance: INSTANCE_ID },
      formattedMetrics,
    );

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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    // Query Pushgateway for current metrics with timeout
    const response = await fetch(`${PUSHGATEWAY_URL}/metrics`, {
      signal: controller.signal,
    });
    const metricsText = await response.text();

    // Clear timeout on successful completion
    clearTimeout(timeoutId);

    // Parse and count metrics
    const lines = metricsText.split('\n').filter((line) => line && !line.startsWith('#'));

    return res.json({
      success: true,
      totalMetrics: lines.length,
      timestamp: new Date().toISOString(),
      pushgatewayUrl: PUSHGATEWAY_URL,
    });
  } catch (error) {
    // Clear timeout in case of other errors
    clearTimeout(timeoutId);

    // Check if the error is due to abort/timeout
    if (error.name === 'AbortError') {
      console.error('Request to Pushgateway timed out:', error);
      return res.status(504).json({
        success: false,
        error: 'Gateway timeout: Pushgateway did not respond in time',
        timeout: FETCH_TIMEOUT_MS,
      });
    }

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
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`===========================================`);
    console.log(`Metrics API Server`);
    console.log(`===========================================`);
    console.log(`Port: ${PORT}`);
    console.log(`Pushgateway: ${PUSHGATEWAY_URL}`);
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`===========================================`);
  });
}

export default app;
