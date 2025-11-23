#!/bin/bash
# Grafana Dashboard Debug Script
# Run this on your server to diagnose why metrics aren't showing

echo "=== GRAFANA DASHBOARD DEBUGGING ==="
echo ""

echo "Step 1: Check if metrics exist in Pushgateway"
echo "--------------------------------------------"
curl -s http://localhost:9091/metrics | grep -E "web_page_visits_total|web_section_views_total" | head -5
echo ""

echo "Step 2: Check if Prometheus is scraping Pushgateway"
echo "--------------------------------------------"
curl -s "http://localhost:9090/api/v1/targets" | python3 -c "import sys, json; data=json.load(sys.stdin); targets=[t for t in data['data']['activeTargets'] if 'pushgateway' in t['labels'].get('job','')]; print('Pushgateway target:', targets[0]['health'] if targets else 'NOT FOUND')"
echo ""

echo "Step 3: Query Prometheus for web_page_visits_total"
echo "--------------------------------------------"
curl -s "http://localhost:9090/api/v1/query?query=web_page_visits_total" | python3 -c "import sys, json; data=json.load(sys.stdin); print('Status:', data['status']); results=data.get('data',{}).get('result',[]); print('Results found:', len(results)); [print(f\"  {r['metric']}: {r['value'][1]}\") for r in results[:5]]"
echo ""

echo "Step 4: Query Prometheus with site label filter"
echo "--------------------------------------------"
curl -s "http://localhost:9090/api/v1/query?query=web_page_visits_total{site=\"entazis.dev\"}" | python3 -c "import sys, json; data=json.load(sys.stdin); results=data.get('data',{}).get('result',[]); print('Results found:', len(results)); [print(f\"  {r['metric']}: {r['value'][1]}\") for r in results[:5]]"
echo ""

echo "Step 5: Check what labels the metrics actually have"
echo "--------------------------------------------"
curl -s http://localhost:9091/metrics | grep -A 1 "web_page_visits_total" | head -10
echo ""

echo "Step 6: Query without label filter"
echo "--------------------------------------------"
curl -s "http://localhost:9090/api/v1/query?query=web_page_visits_total" | python3 -c "import sys, json; data=json.load(sys.stdin); results=data.get('data',{}).get('result',[]); print('Total results:', len(results)); [print(f\"  Labels: {r['metric']}\") for r in results[:3]]"
echo ""

echo "Step 7: Check Grafana datasource"
echo "--------------------------------------------"
curl -s -u admin:admin http://localhost:3000/api/datasources | python3 -c "import sys, json; data=json.load(sys.stdin); [print(f\"Datasource: {ds['name']}, Type: {ds['type']}, URL: {ds['url']}\") for ds in data]" 2>/dev/null || echo "Could not check datasources (may need correct credentials)"
echo ""

echo "=== SUGGESTED FIXES ==="
echo ""
echo "If Step 1 shows metrics but Step 3 doesn't:"
echo "  -> Prometheus isn't scraping Pushgateway correctly"
echo "  -> Check: docker compose logs prometheus --tail=20"
echo ""
echo "If Step 3 shows metrics but with different labels:"
echo "  -> Dashboard queries need to match actual labels"
echo "  -> Run this to see actual labels: curl -s http://localhost:9091/metrics | grep web_page"
echo ""
echo "If Step 3 shows 'Results found: 0':"
echo "  -> Metrics expired or Prometheus hasn't scraped yet"
echo "  -> Wait 30 seconds and try again"

