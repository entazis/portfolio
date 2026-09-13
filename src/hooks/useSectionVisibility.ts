/**
 * Hook for tracking section visibility using Intersection Observer
 * Tracks when sections enter/exit viewport and measures time spent
 */

import { getMetricsService } from '@/services/metricsService';
import { useEffect, useRef } from 'react';

interface UseSectionVisibilityOptions {
  threshold?: number; // Percentage of element visible (0-1)
  rootMargin?: string; // Margin around root element
  trackTimeSpent?: boolean; // Track time spent in section
}

const DEFAULT_OPTIONS: UseSectionVisibilityOptions = {
  threshold: 0.5, // 50% visible
  rootMargin: '0px',
  trackTimeSpent: true,
};

/**
 * Custom hook to track section visibility
 * @param sectionName - Unique identifier for the section
 * @param options - Configuration options for Intersection Observer
 */
export const useSectionVisibility = (
  sectionName: string,
  options: UseSectionVisibilityOptions = {},
): React.RefObject<HTMLElement> => {
  const sectionRef = useRef<HTMLElement>(null);
  const entryTimeRef = useRef<number | null>(null);
  const hasTrackedView = useRef(false);

  const config = { ...DEFAULT_OPTIONS, ...options };

  useEffect(() => {
    const metricsService = getMetricsService();
    const element = sectionRef.current;

    if (!element) return;

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Section entered viewport
          if (!hasTrackedView.current) {
            metricsService.trackSectionView(sectionName);
            hasTrackedView.current = true;
          }

          if (config.trackTimeSpent) {
            entryTimeRef.current = Date.now();
          }
        } else {
          // Section left viewport
          if (config.trackTimeSpent && entryTimeRef.current) {
            const timeSpent = Date.now() - entryTimeRef.current;

            // Only track if user spent at least 1 second
            if (timeSpent >= 1000) {
              metricsService.trackSectionTime(sectionName, timeSpent);
            }

            entryTimeRef.current = null;
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: config.threshold,
      rootMargin: config.rootMargin,
    });

    observer.observe(element);

    // Cleanup on unmount
    return () => {
      if (element) {
        observer.unobserve(element);
      }

      // Track final time spent if section is still visible
      if (config.trackTimeSpent && entryTimeRef.current) {
        const timeSpent = Date.now() - entryTimeRef.current;
        if (timeSpent >= 1000) {
          metricsService.trackSectionTime(sectionName, timeSpent);
        }
      }
    };
  }, [sectionName, config.threshold, config.rootMargin, config.trackTimeSpent]);

  return sectionRef;
};

export default useSectionVisibility;
