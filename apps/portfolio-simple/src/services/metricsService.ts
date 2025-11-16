/**
 * Centralized metrics service for collecting and submitting application metrics
 * Implements batching, rate limiting, retry logic, and graceful degradation
 */

import type {
  Metric,
  MetricBatch,
  MetricsApiResponse,
  MetricsConfig,
  WebVitalMetric,
} from '@/types/metrics';

/**
 * Default configuration for metrics service
 */
const DEFAULT_CONFIG: MetricsConfig = {
  enabled: true,
  apiUrl: 'https://entazis.dev/track',
  siteName: 'entazis.dev',
  sampleRate: 1.0,
  batchSize: 10,
  batchInterval: 5000,
  debug: false,
};

/**
 * Metrics service class for managing application metrics
 */
class MetricsService {
  private config: MetricsConfig;
  private metricQueue: Metric[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private failedAttempts = 0;
  private readonly maxRetries = 3;

  constructor(config: Partial<MetricsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.loadConfigFromEnv();
  }

  /**
   * Load configuration from environment variables
   */
  private loadConfigFromEnv(): void {
    if (typeof window === 'undefined') return;

    const envConfig: Partial<MetricsConfig> = {
      enabled: import.meta.env.VITE_METRICS_ENABLED !== 'false',
      apiUrl: import.meta.env.VITE_METRICS_API_URL || this.config.apiUrl,
      siteName: import.meta.env.VITE_SITE_NAME || this.config.siteName,
      sampleRate: parseFloat(import.meta.env.VITE_METRICS_SAMPLE_RATE || '1.0'),
      batchSize: parseInt(import.meta.env.VITE_METRICS_BATCH_SIZE || '10', 10),
      batchInterval: parseInt(import.meta.env.VITE_METRICS_BATCH_INTERVAL || '5000', 10),
      debug: import.meta.env.VITE_METRICS_DEBUG === 'true',
    };

    this.config = { ...this.config, ...envConfig };
  }

  /**
   * Initialize the metrics service
   */
  public initialize(): void {
    if (this.isInitialized) {
      this.log('Metrics service already initialized');
      return;
    }

    if (!this.config.enabled) {
      this.log('Metrics tracking is disabled');
      return;
    }

    this.isInitialized = true;
    this.startBatchTimer();
    this.setupUnloadHandler();
    this.log('Metrics service initialized', this.config);
  }

  /**
   * Check if the service is ready to track metrics
   */
  private isReady(): boolean {
    if (!this.config.enabled) {
      this.log('Metrics disabled, skipping');
      return false;
    }

    if (!this.isInitialized) {
      this.log('Metrics not initialized, skipping');
      return false;
    }

    // Sample rate check
    if (Math.random() > this.config.sampleRate) {
      this.log('Metric skipped due to sample rate');
      return false;
    }

    return true;
  }

  /**
   * Track a generic metric
   */
  public trackMetric(metric: Metric): void {
    if (!this.isReady()) return;

    this.metricQueue.push({
      ...metric,
      timestamp: Date.now(),
    });

    this.log('Metric queued', metric);

    if (this.metricQueue.length >= this.config.batchSize) {
      this.flushMetrics();
    }
  }

  /**
   * Track a Web Vital metric
   */
  public trackWebVital(vital: WebVitalMetric): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: `web_vitals_${vital.name.toLowerCase()}`,
      type: 'histogram',
      value: vital.value,
      labels: {
        site: this.config.siteName,
        page: window.location.pathname,
        rating: vital.rating,
        navigation_type: vital.navigationType,
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track a page visit
   */
  public trackPageVisit(page: string): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_page_visits_total',
      type: 'counter',
      value: 1,
      labels: {
        site: this.config.siteName,
        page,
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track a section view
   */
  public trackSectionView(section: string): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_section_views_total',
      type: 'counter',
      value: 1,
      labels: {
        site: this.config.siteName,
        section,
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track time spent in a section
   */
  public trackSectionTime(section: string, duration: number): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_section_time_spent_seconds',
      type: 'histogram',
      value: duration / 1000, // convert to seconds
      labels: {
        site: this.config.siteName,
        section,
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track a button click
   */
  public trackClick(label: string, target?: string): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_button_clicks_total',
      type: 'counter',
      value: 1,
      labels: {
        site: this.config.siteName,
        button_label: label,
        ...(target && { target }),
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track an external link click
   */
  public trackExternalLink(url: string, label?: string): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_external_link_clicks_total',
      type: 'counter',
      value: 1,
      labels: {
        site: this.config.siteName,
        url,
        ...(label && { label }),
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Track scroll depth
   */
  public trackScrollDepth(depth: number): void {
    if (!this.isReady()) return;

    const metric: Metric = {
      name: 'web_scroll_depth_percent',
      type: 'histogram',
      value: depth,
      labels: {
        site: this.config.siteName,
        page: window.location.pathname,
      },
      timestamp: Date.now(),
    };

    this.trackMetric(metric);
  }

  /**
   * Start the batch submission timer
   */
  private startBatchTimer(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }

    this.batchTimer = setInterval(() => {
      if (this.metricQueue.length > 0) {
        this.flushMetrics();
      }
    }, this.config.batchInterval);
  }

  /**
   * Flush all queued metrics to the API
   */
  public async flushMetrics(): Promise<void> {
    if (this.metricQueue.length === 0) return;

    const metricsToSend = [...this.metricQueue];
    this.metricQueue = [];

    const batch: MetricBatch = {
      site: this.config.siteName,
      metrics: metricsToSend,
      timestamp: Date.now(),
    };

    this.log('Flushing metrics batch', batch);

    try {
      await this.submitBatch(batch);
      this.failedAttempts = 0;
    } catch (error) {
      this.handleSubmissionError(error, metricsToSend);
    }
  }

  /**
   * Submit a batch of metrics to the API
   */
  private async submitBatch(batch: MetricBatch): Promise<void> {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batch),
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: MetricsApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Unknown API error');
    }

    this.log('Metrics submitted successfully', result);
  }

  /**
   * Handle metric submission errors with retry logic
   */
  private handleSubmissionError(error: unknown, metrics: Metric[]): void {
    this.failedAttempts++;

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    this.log('Metrics submission failed', errorMessage);

    if (this.failedAttempts < this.maxRetries) {
      // Re-queue metrics for retry
      this.metricQueue.unshift(...metrics);
      this.log(`Retrying... (attempt ${this.failedAttempts}/${this.maxRetries})`);
    } else {
      this.log('Max retries reached, dropping metrics', metrics);
      this.failedAttempts = 0;
    }
  }

  /**
   * Setup handler to flush metrics before page unload
   */
  private setupUnloadHandler(): void {
    if (typeof window === 'undefined') return;

    const handleUnload = () => {
      if (this.metricQueue.length > 0) {
        // Use sendBeacon for reliable delivery during page unload
        const batch: MetricBatch = {
          site: this.config.siteName,
          metrics: this.metricQueue,
          timestamp: Date.now(),
        };

        const blob = new Blob([JSON.stringify(batch)], {
          type: 'application/json',
        });

        navigator.sendBeacon(this.config.apiUrl, blob);
        this.log('Metrics sent via sendBeacon on unload');
      }
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }

  /**
   * Debug logging helper
   */
  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(`[MetricsService] ${message}`, data || '');
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }

    this.flushMetrics();
    this.isInitialized = false;
    this.log('Metrics service destroyed');
  }
}

// Singleton instance
let metricsServiceInstance: MetricsService | null = null;

/**
 * Get or create the metrics service singleton instance
 */
export const getMetricsService = (config?: Partial<MetricsConfig>): MetricsService => {
  if (!metricsServiceInstance) {
    metricsServiceInstance = new MetricsService(config);
  }
  return metricsServiceInstance;
};

/**
 * Initialize metrics tracking
 */
export const initializeMetrics = (config?: Partial<MetricsConfig>): void => {
  const service = getMetricsService(config);
  service.initialize();
};

export default MetricsService;
