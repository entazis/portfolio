import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeMetrics } from './services/metricsService';

// Initialize metrics tracking
initializeMetrics({
  enabled: import.meta.env.VITE_METRICS_ENABLED !== 'false',
  apiUrl: import.meta.env.VITE_METRICS_API_URL || 'https://entazis.dev/api/track',
  siteName: import.meta.env.VITE_SITE_NAME || 'entazis.dev',
  sampleRate: Number(import.meta.env.VITE_METRICS_SAMPLE_RATE) || 1.0,
  batchSize: Number(import.meta.env.VITE_METRICS_BATCH_SIZE) || 10,
  batchInterval: Number(import.meta.env.VITE_METRICS_BATCH_INTERVAL) || 5000,
  debug: import.meta.env.VITE_METRICS_DEBUG === 'true' || import.meta.env.DEV,
});

createRoot(document.getElementById("root")!).render(<App />);
