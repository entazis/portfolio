# 🔍 Grafana Dashboard Troubleshooting Guide

## Quick Diagnosis

Run this on your server:

```bash
cd /var/www/portfolio/apps/monitoring
./debug-grafana.sh
```

This will check:
1. ✅ Metrics in Pushgateway
2. ✅ Prometheus scraping status
3. ✅ Prometheus query results
4. ✅ Label matching issues

## Most Likely Issues

### Issue 1: Label Mismatch ⚠️

The dashboard queries use:
```promql
web_page_visits_total{site="entazis.dev"}
```

But your metrics might have different labels. Check what labels your metrics actually have:

```bash
curl -s http://localhost:9091/metrics | grep "web_page_visits_total" -A 1
```

**Expected output:**
```
# TYPE web_page_visits_total counter
web_page_visits_total{instance="",job="web_metrics",page="/",site="entazis.dev"} 1
```

If the label format is different, we need to update the dashboard queries.

### Issue 2: Prometheus Not Scraping Yet ⏰

Prometheus scrapes Pushgateway every **30 seconds**. If you just sent metrics, wait 30-60 seconds.

Check if Prometheus has scraped:
```bash
curl -s "http://localhost:9090/api/v1/query?query=web_page_visits_total" | python3 -m json.tool
```

**Good output** (has results):
```json
{
    "status": "success",
    "data": {
        "result": [
            {
                "metric": {"site": "entazis.dev", ...},
                "value": [timestamp, "1"]
            }
        ]
    }
}
```

**Bad output** (no results):
```json
{
    "status": "success",
    "data": {
        "result": []
    }
}
```

### Issue 3: Metrics Expired 💀

Counter metrics in Pushgateway don't expire, but if Pushgateway was restarted without persistence, metrics are lost.

**Fix**: Visit your website again to generate fresh metrics:
1. Open: https://entazis.dev
2. Scroll down to trigger section views
3. Wait 30 seconds
4. Check Grafana again

### Issue 4: Grafana Not Connected to Prometheus 🔌

Check Grafana datasource:
```bash
# In Grafana UI, go to:
# Connections → Data sources → Prometheus → Test
```

Should show: ✅ "Data source is working"

## Manual Verification Steps

### Step 1: Generate Fresh Metrics
```bash
# Visit your site
curl https://entazis.dev > /dev/null

# Or use the metrics API directly
curl -X POST https://entazis.dev/api/track \
  -H "Content-Type: application/json" \
  -d '{
    "site": "entazis.dev",
    "metrics": [{
      "name": "web_page_visits_total",
      "type": "counter",
      "value": 1,
      "labels": {"site": "entazis.dev", "page": "/"}
    }]
  }'
```

### Step 2: Verify in Pushgateway
```bash
curl -s http://localhost:9091/metrics | grep web_page_visits_total
```

Should show:
```
# TYPE web_page_visits_total counter
web_page_visits_total{...} 1
```

### Step 3: Wait 30 Seconds
Prometheus scrapes every 30 seconds.

### Step 4: Query Prometheus
```bash
curl "http://localhost:9090/api/v1/query?query=web_page_visits_total"
```

### Step 5: Check Grafana
Refresh the dashboard: https://grafana.entazis.dev/d/website-visitors

## If Still Not Working

### Option A: Check Prometheus Config

```bash
cd /var/www/portfolio/apps/monitoring
cat prometheus/prometheus.yml
```

Should have:
```yaml
scrape_configs:
  - job_name: 'pushgateway'
    honor_labels: true
    static_configs:
      - targets: ['pushgateway:9091']
```

### Option B: Check Prometheus Logs

```bash
docker compose logs prometheus --tail=50 | grep -i error
```

### Option C: Manually Test Dashboard Query

In Grafana, go to **Explore** and run:
```promql
web_page_visits_total
```

If this returns results but dashboard shows 0, the dashboard queries need fixing.

### Option D: Check Container Connectivity

```bash
# All containers should be in same network
docker compose ps

# Test connectivity from Grafana to Prometheus
docker compose exec grafana wget -qO- http://prometheus:9090/api/v1/targets
```

---

## Quick Fix Commands

If nothing works, try this nuclear option:

```bash
cd /var/www/portfolio/apps/monitoring

# Clear everything and start fresh
docker compose down -v
docker compose up -d

# Wait 30 seconds
sleep 30

# Visit your site to generate metrics
curl https://entazis.dev

# Wait another 30 seconds for Prometheus to scrape
sleep 30

# Check Grafana
```

⚠️ **Warning**: `docker compose down -v` will delete all Prometheus and Grafana data!

---

**Run the debug script first and share the output!** That will tell us exactly what's wrong.

