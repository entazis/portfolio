/**
 * Metric types and interfaces for tracking application metrics
 */

/**
 * Supported metric types following Prometheus conventions
 */
export type MetricType = 'counter' | 'histogram' | 'gauge';

/**
 * Base metric payload structure
 */
export interface BaseMetric {
  name: string;
  type: MetricType;
  value: number;
  labels: Record<string, string>;
  timestamp: number;
}

/**
 * Counter metric - monotonically increasing value
 */
export interface CounterMetric extends BaseMetric {
  type: 'counter';
}

/**
 * Histogram metric - for tracking distributions (e.g., request durations)
 */
export interface HistogramMetric extends BaseMetric {
  type: 'histogram';
}

/**
 * Gauge metric - arbitrary value that can go up or down
 */
export interface GaugeMetric extends BaseMetric {
  type: 'gauge';
}

/**
 * Union type for all metric types
 */
export type Metric = CounterMetric | HistogramMetric | GaugeMetric;

/**
 * Web Vitals metric names
 */
export type WebVitalName = 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB';

/**
 * Web Vitals rating categories
 */
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Web Vitals metric structure from web-vitals library
 */
export interface WebVitalMetric {
  name: WebVitalName;
  value: number;
  rating: WebVitalRating;
  delta: number;
  id: string;
  navigationType: string;
}

/**
 * User interaction event types
 */
export type InteractionType = 'click' | 'scroll' | 'visibility' | 'navigation';

/**
 * Click event tracking payload
 */
export interface ClickEvent {
  type: 'click';
  label: string;
  target: string;
  href?: string;
  timestamp: number;
}

/**
 * Scroll depth tracking payload
 */
export interface ScrollEvent {
  type: 'scroll';
  depth: number; // percentage (0-100)
  maxDepth: number; // max depth reached in session
  timestamp: number;
}

/**
 * Section visibility tracking payload
 */
export interface VisibilityEvent {
  type: 'visibility';
  section: string;
  isVisible: boolean;
  duration?: number; // time spent in ms (when leaving viewport)
  timestamp: number;
}

/**
 * Navigation tracking payload
 */
export interface NavigationEvent {
  type: 'navigation';
  from: string;
  to: string;
  timestamp: number;
}

/**
 * Union type for all interaction events
 */
export type InteractionEvent = ClickEvent | ScrollEvent | VisibilityEvent | NavigationEvent;

/**
 * Batch metric submission payload
 */
export interface MetricBatch {
  site: string;
  metrics: Metric[];
  timestamp: number;
}

/**
 * Metrics service configuration
 */
export interface MetricsConfig {
  enabled: boolean;
  apiUrl: string;
  siteName: string;
  sampleRate: number; // 0-1, percentage of events to track
  batchSize: number; // max metrics per batch
  batchInterval: number; // ms between batch submissions
  debug: boolean;
}

/**
 * Metrics API response
 */
export interface MetricsApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}
