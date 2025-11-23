#!/bin/bash
# Simple one-liner checks for Grafana debugging

echo "=== QUICK CHECKS ==="
echo ""

echo "1. Metrics in Pushgateway?"
curl -s http://localhost:9091/metrics | grep -c "web_page_visits_total"
echo ""

echo "2. Prometheus has metrics?"
curl -s "http://localhost:9090/api/v1/query?query=web_page_visits_total" | grep -o '"result":\[[^]]*\]' | grep -q "\[" && echo "YES - Found results" || echo "NO - Empty results"
echo ""

echo "3. What are the actual metric labels?"
curl -s http://localhost:9091/metrics | grep "web_page_visits_total{" | head -3
echo ""

echo "4. Prometheus targets UP?"
curl -s http://localhost:9090/api/v1/targets | python3 -c "import sys, json; targets=json.load(sys.stdin)['data']['activeTargets']; print([f\"{t['labels']['job']}: {t['health']}\" for t in targets])"
echo ""

echo "=== RECOMMENDED ACTION ==="
echo ""
echo "If #1 shows a number > 0 but #2 says NO:"
echo "  -> Prometheus hasn't scraped yet. Wait 30 seconds and try again."
echo ""
echo "If #1 shows 0:"
echo "  -> No metrics in Pushgateway. Visit https://entazis.dev to generate some."
echo ""
echo "If #3 shows metrics with 'site=\"entazis.dev\"':"
echo "  -> Dashboard should work. Try refreshing Grafana."
echo ""
echo "If #3 shows metrics WITHOUT 'site=' label:"
echo "  -> Dashboard queries need to be updated to match actual labels."

