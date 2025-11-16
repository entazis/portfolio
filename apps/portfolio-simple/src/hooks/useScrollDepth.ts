/**
 * Hook for tracking scroll depth on the page
 * Tracks when users reach specific scroll milestones (25%, 50%, 75%, 100%)
 */

import { getMetricsService } from '@/services/metricsService';
import { useEffect, useRef } from 'react';

interface UseScrollDepthOptions {
  milestones?: number[]; // Scroll depth milestones to track (0-100)
  throttleMs?: number; // Throttle scroll events (ms)
}

const DEFAULT_MILESTONES = [25, 50, 75, 100];
const DEFAULT_THROTTLE = 500;

/**
 * Custom hook to track scroll depth milestones
 * @param options - Configuration options
 */
export const useScrollDepth = (options: UseScrollDepthOptions = {}): void => {
  const { milestones = DEFAULT_MILESTONES, throttleMs = DEFAULT_THROTTLE } = options;

  const trackedMilestones = useRef<Set<number>>(new Set());
  const maxScrollDepth = useRef<number>(0);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);
  const isThrottled = useRef<boolean>(false);

  useEffect(() => {
    const metricsService = getMetricsService();

    /**
     * Calculate current scroll depth percentage
     */
    const calculateScrollDepth = (): number => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight <= 0) return 100;

      const scrollPercentage = (scrollTop / scrollableHeight) * 100;
      return Math.min(Math.round(scrollPercentage), 100);
    };

    /**
     * Handle scroll events with throttling
     */
    const handleScroll = (): void => {
      if (isThrottled.current) return;

      isThrottled.current = true;

      const currentDepth = calculateScrollDepth();

      // Update max scroll depth
      if (currentDepth > maxScrollDepth.current) {
        maxScrollDepth.current = currentDepth;
      }

      // Check if we've reached any new milestones
      milestones.forEach((milestone) => {
        if (currentDepth >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone);
          metricsService.trackScrollDepth(milestone);
        }
      });

      // Reset throttle
      throttleTimer.current = setTimeout(() => {
        isThrottled.current = false;
      }, throttleMs);
    };

    // Initial check on mount
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);

      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }

      // Track final max scroll depth on unmount if not already tracked
      const finalDepth = maxScrollDepth.current;
      const tracked = trackedMilestones.current;
      if (finalDepth > 0 && !tracked.has(finalDepth)) {
        metricsService.trackScrollDepth(finalDepth);
      }
    };
  }, [milestones, throttleMs]);
};

export default useScrollDepth;
