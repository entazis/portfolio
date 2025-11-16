import { useEffect } from "react";
import { useScrollDepth } from "./hooks/useScrollDepth";
import { useWebVitals } from "./hooks/useWebVitals";
import Index from "./pages/Index";
import { getMetricsService } from "./services/metricsService";

const App = () => {
  // Track Web Vitals
  useWebVitals();
  
  // Track scroll depth milestones
  useScrollDepth();

  // Track page visit on mount
  useEffect(() => {
    const metricsService = getMetricsService();
    metricsService.trackPageVisit(window.location.pathname);
  }, []);

  return <Index />;
};

export default App;
