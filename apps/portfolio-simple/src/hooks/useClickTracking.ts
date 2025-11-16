/**
 * Hook for tracking click events on buttons and links
 * Provides simple callbacks to track user interactions
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { trackClick, trackExternalLink } = useClickTracking();
 *
 *   // For inline handlers (simple cases)
 *   return (
 *     <button onClick={() => trackClick('Button Label')}>
 *       Click me
 *     </button>
 *   );
 *
 *   // For memoized handlers (when passing to child components)
 *   const handleClick = useCallback(() => {
 *     trackClick('Button Label', 'section-id');
 *   }, [trackClick]);
 *
 *   return <ChildComponent onClick={handleClick} />;
 * };
 * ```
 */

import { getMetricsService } from '@/services/metricsService';
import { useCallback } from 'react';

interface UseClickTrackingReturn {
  trackClick: (label: string, target?: string) => void;
  trackExternalLink: (url: string, label?: string) => void;
}

/**
 * Custom hook to track click events
 *
 * Returns memoized tracking functions that can be called directly in event handlers.
 * For optimal performance when passing handlers to child components, wrap the calls
 * in useCallback at the component level.
 */
export const useClickTracking = (): UseClickTrackingReturn => {
  const metricsService = getMetricsService();

  /**
   * Track a button or element click
   * @param label - Descriptive label for the click (e.g., "View Projects")
   * @param target - Optional target identifier (e.g., section ID)
   *
   * @example
   * ```tsx
   * <button onClick={() => trackClick('View Projects', 'projects')}>
   *   View Projects
   * </button>
   * ```
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
   *
   * @example
   * ```tsx
   * <a
   *   href="https://github.com/user"
   *   onClick={() => trackExternalLink('https://github.com/user', 'GitHub')}
   * >
   *   GitHub Profile
   * </a>
   * ```
   */
  const trackExternalLink = useCallback(
    (url: string, label?: string) => {
      metricsService.trackExternalLink(url, label);
    },
    [metricsService],
  );

  return {
    trackClick,
    trackExternalLink,
  };
};

export default useClickTracking;
