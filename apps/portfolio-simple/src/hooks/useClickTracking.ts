/**
 * Hook for tracking click events on buttons and links
 * Provides a simple callback to track user interactions
 */

import { getMetricsService } from '@/services/metricsService';
import { useCallback } from 'react';

interface UseClickTrackingReturn {
  trackClick: (label: string, target?: string) => void;
  trackExternalLink: (url: string, label?: string) => void;
  handleClickEvent: (label: string, target?: string) => () => void;
  handleExternalLinkClick: (url: string, label?: string) => () => void;
}

/**
 * Custom hook to track click events
 * Provides helper functions for tracking button and link clicks
 */
export const useClickTracking = (): UseClickTrackingReturn => {
  const metricsService = getMetricsService();

  /**
   * Track a button or element click
   * @param label - Descriptive label for the click (e.g., "View Projects")
   * @param target - Optional target identifier (e.g., section ID)
   */
  const trackClick = useCallback(
    (label: string, target?: string) => {
      metricsService.trackClick(label, target);
    },
    [metricsService],
  );

  /**
   * Track an external link click
   * @param url - The external URL being clicked
   * @param label - Optional descriptive label for the link
   */
  const trackExternalLink = useCallback(
    (url: string, label?: string) => {
      metricsService.trackExternalLink(url, label);
    },
    [metricsService],
  );

  /**
   * Returns a click handler function for use in onClick props
   * @param label - Descriptive label for the click
   * @param target - Optional target identifier
   * @returns Click handler function
   */
  const handleClickEvent = useCallback(
    (label: string, target?: string) => {
      return () => {
        trackClick(label, target);
      };
    },
    [trackClick],
  );

  /**
   * Returns a click handler function for external links
   * @param url - The external URL being clicked
   * @param label - Optional descriptive label
   * @returns Click handler function
   */
  const handleExternalLinkClick = useCallback(
    (url: string, label?: string) => {
      return () => {
        trackExternalLink(url, label);
      };
    },
    [trackExternalLink],
  );

  return {
    trackClick,
    trackExternalLink,
    handleClickEvent,
    handleExternalLinkClick,
  };
};

export default useClickTracking;
