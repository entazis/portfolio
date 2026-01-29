/**
 * Metrics API Server (direct Prometheus scrape)
 * - Apps POST events to /track (same-origin via nginx)
 * - Prometheus scrapes /metrics
 */

import express from 'express';
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

const PORT = process.env.PORT || 8080;
const ALLOWED_METRIC_TYPES = ['gauge', 'counter', 'histogram']; // Supported Prometheus metric types
const COUNTER_STATE_FILE_PATH = process.env.COUNTER_STATE_FILE_PATH || '/data/counter-state.json';
const ENVIRONMENT = process.env.ENVIRONMENT || process.env.ENV || 'prod';
const INSTANCE_ID = process.env.INSTANCE_ID || os.hostname();

/**
 * Histogram bucket configuration.
 * These buckets are intentionally coarse to keep cardinality and storage reasonable.
 * Values are assumed to be:
 * - web vitals: ms (except CLS which is unitless)
 * - scroll depth: percent (0-100)
 * - section time: seconds
 */
const HISTOGRAM_BUCKETS_BY_METRIC = {
  // Web vitals (ms)
  web_vitals_lcp: [500, 1000, 1500, 2000, 2500, 3000, 4000, 5000, 8000],
  web_vitals_fcp: [200, 400, 600, 800, 1000, 1500, 2000, 3000],
  web_vitals_ttfb: [100, 200, 300, 500, 800, 1000, 1500, 2000],
  web_vitals_inp: [50, 100, 200, 300, 500, 800, 1000, 2000],
  // CLS (unitless)
  web_vitals_cls: [0.01, 0.025, 0.05, 0.1, 0.15, 0.25, 0.3, 0.5, 1],

  // Engagement
  web_scroll_depth_percent: [10, 25, 50, 75, 90, 100],
  web_section_time_spent_seconds: [1, 2, 3, 5, 10, 20, 30, 60, 120, 300],
};

/**
 * Convert a single observation into Prometheus histogram counter deltas.
 * This emits:
 * - <name>_bucket{le="..."} counter deltas (cumulative buckets)
 * - <name>_count counter delta
 * - <name>_sum counter delta
 *
 * Note: we rely on the existing counter delta -> cumulative conversion logic.
 *
 * @param {Object} input
 * @param {string} input.name
 * @param {number} input.value
 * @param {Record<string, unknown>} input.labels
 * @returns {Array<{name: string, type: 'counter', value: number, labels: Record<string, unknown>}>}
 */
const observationToHistogramCounters = ({ name, value, labels }) => {
  const buckets = HISTOGRAM_BUCKETS_BY_METRIC[name];
  if (!buckets || buckets.length === 0) {
    return [];
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return [];
  }

  const sortedBuckets = [...buckets].sort((a, b) => a - b);
  const seriesLabels = labels && typeof labels === 'object' ? labels : {};

  const deltas = [];

  // Buckets: cumulative counters (increment if observation <= le)
  for (const le of sortedBuckets) {
    deltas.push({
      name: `${name}_bucket`,
      type: 'counter',
      value: numericValue <= le ? 1 : 0,
      labels: { ...seriesLabels, le: String(le) },
    });
  }

  // +Inf bucket always increments
  deltas.push({
    name: `${name}_bucket`,
    type: 'counter',
    value: 1,
    labels: { ...seriesLabels, le: '+Inf' },
  });

  // count/sum
  deltas.push({
    name: `${name}_count`,
    type: 'counter',
    value: 1,
    labels: { ...seriesLabels },
  });

  deltas.push({
    name: `${name}_sum`,
    type: 'counter',
    value: numericValue,
    labels: { ...seriesLabels },
  });

  return deltas;
};

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
const createSeriesKey = (name, labels = {}) => `${name}:${createLabelsKey(labels)}`;

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
  const output = [];

  // 1) Group histogram families by base metric name.
  // Prometheus expects: `# TYPE <base> histogram`, then lines for `<base>_bucket`, `<base>_sum`, `<base>_count`.
  const histogramFamilies = new Map(); // base -> { buckets: Map<labelKey, metric>, sum: Map<labelKey, metric>, count: Map<labelKey, metric> }
  const nonHistogram = new Map(); // name -> { type, instances: Map<labelKey, metric> }

  const getLabelKey = (labels) =>
    JSON.stringify(Object.entries(labels || {}).sort(([a], [b]) => a.localeCompare(b)));

  const histogramSuffixMatch = (name) => {
    const match = /^(.*)_(bucket|sum|count)$/.exec(String(name));
    if (!match) return null;
    return { base: match[1], part: match[2] };
  };

  for (const metric of metrics) {
    const { name, type, labels } = metric;
    const hist = histogramSuffixMatch(name);

    if (hist) {
      if (!histogramFamilies.has(hist.base)) {
        histogramFamilies.set(hist.base, {
          buckets: new Map(),
          sum: new Map(),
          count: new Map(),
        });
      }
      const fam = histogramFamilies.get(hist.base);
      const labelKey = getLabelKey(labels || {});
      if (hist.part === 'bucket') fam.buckets.set(labelKey, metric);
      if (hist.part === 'sum') fam.sum.set(labelKey, metric);
      if (hist.part === 'count') fam.count.set(labelKey, metric);
      continue;
    }

    if (!nonHistogram.has(name)) {
      nonHistogram.set(name, {
        type: type === 'counter' || type === 'gauge' ? type : 'gauge',
        instances: new Map(),
      });
    }
    const labelKey = getLabelKey(labels || {});
    nonHistogram.get(name).instances.set(labelKey, metric);
  }

  // Render histograms first.
  for (const [base, fam] of histogramFamilies.entries()) {
    output.push(`# TYPE ${base} histogram`);

    // Render buckets (including +Inf), then sum, then count.
    for (const metric of fam.buckets.values()) output.push(formatMetricLine(metric));
    for (const metric of fam.sum.values()) output.push(formatMetricLine(metric));
    for (const metric of fam.count.values()) output.push(formatMetricLine(metric));
  }

  // Render non-histogram metrics.
  for (const [name, { type, instances }] of nonHistogram.entries()) {
    output.push(`# TYPE ${name} ${type}`);
    for (const metric of instances.values()) {
      output.push(formatMetricLine(metric));
    }
  }

  return output.join('\n');
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
 * Prometheus scrape endpoint (text exposition format).
 */
app.get('/metrics', (req, res) => {
  try {
    const metricsToExpose = [];

    // Counters
    for (const [seriesKey, value] of counterTotalsBySeriesKey.entries()) {
      const [name, labelsKey] = String(seriesKey).split(/:(.+)/); // split on first ':'
      if (!name || !labelsKey) {
        continue;
      }
      let labels = {};
      try {
        const parsed = JSON.parse(labelsKey);
        labels = Array.isArray(parsed) ? Object.fromEntries(parsed) : {};
      } catch {
        labels = {};
      }
      metricsToExpose.push({
        name,
        type: 'counter',
        value,
        labels,
        timestamp: Date.now(),
      });
    }

    const body = `${formatPrometheusMetrics(metricsToExpose)}\n`;
    res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
    return res.status(200).send(body);
  } catch (error) {
    console.error('Error rendering /metrics:', error);
    return res.status(500).send('# error generating metrics\n');
  }
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

    // Expand histogram observations (and web vitals gauges) into histogram counters.
    // We do NOT keep the original observation gauges, since we don't want "latest gauge-like" behavior.
    const expandedMetrics = [];
    for (const metric of metricsWithDefaultLabels) {
      // Native histograms sent by apps (treated as observations)
      if (metric.type === 'histogram') {
        expandedMetrics.push(
          ...observationToHistogramCounters({
            name: metric.name,
            value: metric.value,
            labels: metric.labels || {},
          }),
        );
        continue;
      }

      // Web vitals are currently sent as gauges from clients; treat them as observations too.
      if (
        metric.type === 'gauge' &&
        typeof metric.name === 'string' &&
        metric.name.startsWith('web_vitals_')
      ) {
        expandedMetrics.push(
          ...observationToHistogramCounters({
            name: metric.name,
            value: metric.value,
            labels: metric.labels || {},
          }),
        );
        continue;
      }

      // Keep everything else as-is.
      expandedMetrics.push(metric);
    }

    // Convert counter deltas -> cumulative totals per series (per metric name + labels)
    const processedMetrics = expandedMetrics.map((metric) => {
      if (metric.type !== 'counter') {
        return metric;
      }
      const labels = metric.labels || {};
      const seriesKey = createSeriesKey(metric.name, labels);
      const previousTotal = counterTotalsBySeriesKey.get(seriesKey) || 0;
      const delta = Number(metric.value);
      const nextTotal = Number.isFinite(delta) ? previousTotal + delta : previousTotal;
      counterTotalsBySeriesKey.set(seriesKey, nextTotal);
      return { ...metric, value: nextTotal };
    });
    scheduleCounterStateSave();

    console.log(
      `[${new Date().toISOString()}] Processed ${metrics.length} metrics (${processedMetrics.length} expanded) for ${site}`,
    );

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
    console.log(`Health: http://localhost:${PORT}/health`);
    console.log(`Metrics: http://localhost:${PORT}/metrics`);
    console.log(`===========================================`);
  });
}

export default app;
