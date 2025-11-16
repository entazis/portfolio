/**
 * Hook for tracking Web Vitals metrics
 * Integrates with the official web-vitals library to track Core Web Vitals
 */

import { getMetricsService } from '@/services/metricsService';
import type { WebVitalMetric } from '@/types/metrics';
import { useEffect } from 'react';
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

/**
 * Custom hook to track Web Vitals metrics
 * Automatically sends metrics to the metrics service
 */
export const useWebVitals = (): void => {
  useEffect(() => {
    const metricsService = getMetricsService();

    // Track Cumulative Layout Shift (CLS)
    // Measures visual stability
    onCLS((metric) => {
      const webVital: WebVitalMetric = {
        name: 'CLS',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      metricsService.trackWebVital(webVital);
    });

    // Track First Contentful Paint (FCP)
    // Measures when the first content is rendered
    onFCP((metric) => {
      const webVital: WebVitalMetric = {
        name: 'FCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      metricsService.trackWebVital(webVital);
    });

    // Track Interaction to Next Paint (INP)
    // Measures responsiveness to user interactions
    onINP((metric) => {
      const webVital: WebVitalMetric = {
        name: 'INP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      metricsService.trackWebVital(webVital);
    });

    // Track Largest Contentful Paint (LCP)
    // Measures loading performance
    onLCP((metric) => {
      const webVital: WebVitalMetric = {
        name: 'LCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      metricsService.trackWebVital(webVital);
    });

    // Track Time to First Byte (TTFB)
    // Measures server response time
    onTTFB((metric) => {
      const webVital: WebVitalMetric = {
        name: 'TTFB',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      metricsService.trackWebVital(webVital);
    });
  }, []);
};

export default useWebVitals;
