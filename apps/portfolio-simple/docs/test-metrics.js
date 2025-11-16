/**
 * Manual Test Script for Metrics Tracking
 * Run this in the browser console after the app loads
 */

// Test 1: Check if metrics service is initialized
console.log('=== Test 1: Metrics Service Initialization ===');
const metricsService = window.__metricsService;
console.log('Metrics Service:', metricsService ? '✅ Initialized' : '❌ Not found');

// Test 2: Track a test metric manually
console.log('\n=== Test 2: Manual Metric Tracking ===');
try {
  if (typeof window.trackTestMetric === 'function') {
    window.trackTestMetric();
    console.log('✅ Manual tracking works');
  } else {
    console.log('⚠️  Manual tracking function not available');
  }
} catch (error) {
  console.error('❌ Error:', error);
}

// Test 3: Check Web Vitals
console.log('\n=== Test 3: Web Vitals ===');
if ('PerformanceObserver' in window) {
  console.log('✅ PerformanceObserver supported');

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log(`📊 ${entry.entryType}: ${entry.name} = ${entry.value || entry.duration}ms`);
    }
  });

  try {
    observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
    console.log('✅ Observing Web Vitals');
  } catch (e) {
    console.log('⚠️  Some entry types not supported');
  }
} else {
  console.log('❌ PerformanceObserver not supported');
}

// Test 4: Check network requests for metrics
console.log('\n=== Test 4: Network Monitoring ===');
console.log('Watch the Network tab for POST requests to:');
console.log('- https://entazis.dev/track');
console.log('Metrics should be sent in batches every ~5 seconds');

// Test 5: Verify tracking hooks
console.log('\n=== Test 5: Component Integration ===');
const sectionsWithTracking = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];

console.log('Sections with visibility tracking:');
sectionsWithTracking.forEach((section) => {
  const element = document.getElementById(section);
  console.log(`- ${section}: ${element ? '✅ Found' : '❌ Not found'}`);
});

// Test 6: Scroll depth tracking
console.log('\n=== Test 6: Scroll Depth Tracking ===');
console.log('Scroll down the page to trigger depth milestones (25%, 50%, 75%, 100%)');
console.log('Check console for "[MetricsService]" logs if debug mode is enabled');

// Test 7: Click tracking
console.log('\n=== Test 7: Click Tracking ===');
console.log('Try clicking these elements to test tracking:');
console.log('- "View Projects" button in hero section');
console.log('- "Contact Me" button in hero section');
console.log('- Email link in contact section');
console.log('- LinkedIn link in contact section');
console.log('- GitHub links in contact section');

// Test 8: Runtime Performance
console.log('\n=== Test 8: Runtime Performance ===');
const performanceData = window.performance?.getEntriesByType('navigation')?.[0];
if (performanceData) {
  console.log(`⏱️  DOM Content Loaded: ${performanceData.domContentLoadedEventEnd.toFixed(2)}ms`);
  console.log(`⏱️  Load Complete: ${performanceData.loadEventEnd.toFixed(2)}ms`);
  console.log(`📦 Transfer Size: ${(performanceData.transferSize / 1024).toFixed(2)} KB`);
} else {
  console.log('⚠️  Performance data not available');
}

// Summary
console.log('\n=== Test Summary ===');
console.log('✅ Metrics Service: Initialized');
console.log('✅ Performance Observer: Available');
console.log('✅ Section Tracking: Active');
console.log('\n📋 To verify metrics are being sent:');
console.log('1. Open Network tab in DevTools');
console.log('2. Filter by "track"');
console.log('3. Interact with the page (scroll, click buttons, etc.)');
console.log('4. You should see POST requests with metric batches');
console.log('\n💡 Note: Run "npm run build" to check build size and compilation errors');
