# 📊 Grafana Dashboard Fix

## Problem
The Grafana dashboard was showing 0 visits because:
1. No dashboard JSON file was being loaded
2. Dashboard mount path was incorrect in docker-compose.yml

## Solution Implemented
✅ Created `website-visitors.json` dashboard with 5 panels:
- Total Visits (Last 24h)
- Visits Over Time (graph)
- Visits Per Page (table)
- Section Views (pie chart)
- Web Vitals Performance (graph)

✅ Fixed docker-compose.yml dashboard mount path

## Deploy to Production

Run these commands on your server:

```bash
cd /var/www/portfolio
git pull

cd apps/monitoring

# Restart Grafana to load the new dashboard
docker compose restart grafana

# Wait for Grafana to start
sleep 5
```

## Access Dashboard

1. Visit: **https://grafana.entazis.dev**
2. Login with your credentials
3. Go to: **Dashboards** → **Website Visitors**

You should now see:
- ✅ Total visits counter
- ✅ Visits over time graph
- ✅ Page breakdown table
- ✅ Section views pie chart
- ✅ Web Vitals performance metrics

## Dashboard Features

### Auto-refresh
- Dashboard refreshes every **30 seconds** automatically
- You can change this in the dashboard settings (top right)

### Time Range
- Default: Last 6 hours
- You can adjust to: Last 15 minutes, 1 hour, 24 hours, 7 days, etc.

### Panels

1. **Total Visits** - Shows total page visits for entazis.dev
2. **Visits Over Time** - Line graph showing traffic patterns
3. **Visits Per Page** - Table showing which pages get the most traffic
4. **Section Views** - Pie chart showing which sections users scroll to (hero, about, skills, etc.)
5. **Web Vitals** - Performance metrics (LCP, FCP, TTFB) to track page speed

---

**Status**: Ready to deploy ✅  
**Downtime**: ~5 seconds (Grafana restart only)

