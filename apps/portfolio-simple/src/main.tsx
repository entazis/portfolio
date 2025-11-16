import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMetrics } from './services/metricsService';

// Initialize metrics tracking
initializeMetrics({
  enabled: true,
  apiUrl: 'https://entazis.dev/track',
  siteName: 'entazis.dev',
  sampleRate: 1.0,
  batchSize: 10,
  batchInterval: 5000,
  debug: import.meta.env.DEV, // Enable debug logging in development
});

createRoot(document.getElementById("root")!).render(<App />);
