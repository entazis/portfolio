# Plan: Add Healthchecks + Alerts

## Overview
Add Docker healthchecks for all services and implement Prometheus alerting rules to monitor service health and data collection.

## Current State
- No healthchecks in docker-compose.yml
- No Prometheus alerting rules
- No alerting configuration
- Manual monitoring only

## Target State
- Healthchecks for all services (prometheus, pushgateway, grafana, metrics-api)
- Prometheus alerting rules for:
  - Service down alerts
  - No metrics received in last 30 minutes
  - Pushgateway scrape failures
  - High error rates
- Alertmanager configuration (optional, for notification routing)

## Implementation Steps

### 1. Add Docker Healthchecks

**File:** `docker-compose.yml`

**Changes:**

**A. Prometheus healthcheck:**
```yaml
prometheus:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9090/-/healthy"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
```

**B. Pushgateway healthcheck:**
```yaml
pushgateway:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9091/-/healthy"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
```

**C. Grafana healthcheck:**
```yaml
grafana:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 30s
```

**D. Metrics-API healthcheck:**
```yaml
metrics-api:
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8080/health"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 10s
```

**Note:** If containers don't have `wget`, use `curl` or install `wget` in Dockerfile.

**Alternative using curl:**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

### 2. Update Metrics-API Dockerfile (if needed)

**File:** `metrics-api/Dockerfile`

**Verify health endpoint exists:**
- Health endpoint already exists at `/health` (verified in server.js)
- No changes needed unless using wget

**If wget needed:**
```dockerfile
# Add to Dockerfile
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*
```

### 3. Create Prometheus Alerting Rules

**File:** `prometheus/alerts.yml`

**Content:**
```yaml
groups:
  - name: monitoring_stack
    interval: 30s
    rules:
      # Alert if Prometheus is down
      - alert: PrometheusDown
        expr: up{job="prometheus"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Prometheus is down"
          description: "Prometheus instance {{ $labels.instance }} has been down for more than 1 minute."

      # Alert if Pushgateway scrape fails
      - alert: PushgatewayScrapeDown
        expr: up{job="pushgateway"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Pushgateway scrape is down"
          description: "Prometheus cannot scrape Pushgateway at {{ $labels.instance }} for more than 2 minutes."

      # Alert if no web metrics received
      - alert: NoWebMetricsReceived
        expr: |
          increase(web_page_visits_total[30m]) == 0
          and
          on() vector(1)
        for: 30m
        labels:
          severity: warning
        annotations:
          summary: "No web metrics received in last 30 minutes"
          description: "No web_page_visits_total metrics have been received in the last 30 minutes. Check metrics-api and Pushgateway."

      # Alert if metrics-api health check fails
      - alert: MetricsAPIDown
        expr: up{job="metrics-api"} == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Metrics API is down"
          description: "Metrics API at {{ $labels.instance }} has been down for more than 2 minutes."

      # Alert if Grafana is down (if monitored)
      - alert: GrafanaDown
        expr: up{job="grafana"} == 0
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Grafana is down"
          description: "Grafana instance {{ $labels.instance }} has been down for more than 2 minutes."

      # Alert on high error rate (if error metrics exist)
      - alert: HighErrorRate
        expr: |
          rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value }} errors/second for {{ $labels.job }}."

  - name: pushgateway_metrics
    interval: 30s
    rules:
      # Alert if Pushgateway has stale metrics
      - alert: PushgatewayStaleMetrics
        expr: |
          time() - push_time_seconds{job="web_metrics"} > 3600
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Pushgateway has stale metrics"
          description: "Metrics for job {{ $labels.job }} haven't been updated in over 1 hour."
```

### 4. Update Prometheus Configuration

**File:** `prometheus/prometheus.yml`

**Add alerting rules:**
```yaml
global:
  scrape_interval: 30s
  evaluation_interval: 30s

# Alerting configuration
alerting:
  alertmanagers:
    - static_configs:
        - targets: []
          # Uncomment and configure if using Alertmanager:
          # - alertmanager:9093

# Load alerting rules
rule_files:
  - "alerts.yml"

scrape_configs:
  - job_name: 'pushgateway'
    honor_labels: true
    static_configs:
      - targets: ['pushgateway:9091']

  # Optional: Scrape Prometheus itself
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Optional: Scrape metrics-api health endpoint
  - job_name: 'metrics-api'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['metrics-api:8080']
    # If metrics-api doesn't expose /metrics, use health endpoint
    # and create custom exporter or remove this job
```

### 5. Optional: Add Alertmanager

**File:** `docker-compose.yml`

**Add Alertmanager service (optional):**
```yaml
alertmanager:
  image: prom/alertmanager:v0.27.0
  restart: unless-stopped
  ports:
    - "9093:9093"
  volumes:
    - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
    - alertmanager_data:/alertmanager
  command:
    - '--config.file=/etc/alertmanager/alertmanager.yml'
    - '--storage.path=/alertmanager'
  networks:
    - monitor
  healthcheck:
    test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:9093/-/healthy"]
    interval: 30s
    timeout: 10s
    retries: 3
```

**File:** `alertmanager/alertmanager.yml`
```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default-receiver'

receivers:
  - name: 'default-receiver'
    # Add notification channels here
    # webhook_configs:
    #   - url: 'http://your-webhook-url'
    # email_configs:
    #   - to: 'admin@example.com'
    #     from: 'alerts@example.com'
    #     smarthost: 'smtp.example.com:587'
```

**Update prometheus.yml:**
```yaml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

### 6. Create Health Check Verification Script

**File:** `scripts/check-health.sh`

**Content:**
```bash
#!/bin/bash
# Check health of all monitoring services

set -e

echo "Checking monitoring stack health..."
echo ""

services=("prometheus" "pushgateway" "grafana" "metrics-api")

for service in "${services[@]}"; do
    container=$(docker ps --filter "name=monitoring.*${service}" --format "{{.Names}}" | head -1)
    
    if [ -z "$container" ]; then
        echo "❌ ${service}: Container not found"
        continue
    fi
    
    health=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no-healthcheck")
    
    if [ "$health" = "healthy" ]; then
        echo "✅ ${service}: Healthy"
    elif [ "$health" = "unhealthy" ]; then
        echo "❌ ${service}: Unhealthy"
    elif [ "$health" = "starting" ]; then
        echo "⏳ ${service}: Starting"
    else
        status=$(docker inspect --format='{{.State.Status}}' "$container")
        echo "⚠️  ${service}: ${status} (no healthcheck)"
    fi
done

echo ""
echo "Checking Prometheus alerts..."
docker exec $(docker ps --filter "name=monitoring.*prometheus" --format "{{.Names}}" | head -1) \
    wget -q -O - http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | select(.state=="firing") | {alertname: .labels.alertname, severity: .labels.severity}' || echo "Could not fetch alerts"
```

**Make executable:**
```bash
chmod +x scripts/check-health.sh
```

### 7. Update Documentation

**File:** `README.md` or create `ALERTING.md`

**Content:**
- Healthcheck configuration
- Alerting rules explanation
- How to view alerts
- How to configure notifications (if Alertmanager used)
- Troubleshooting guide

## Testing

### 1. Test Healthchecks
```bash
# Start services
docker-compose up -d

# Wait for healthchecks
sleep 60

# Check health status
docker ps --format "table {{.Names}}\t{{.Status}}"

# Check specific service
docker inspect --format='{{.State.Health.Status}}' monitoring-prometheus-1
```

### 2. Test Alert Rules
```bash
# View alert rules in Prometheus
curl http://localhost:9090/api/v1/rules

# View firing alerts
curl http://localhost:9090/api/v1/alerts | jq '.data.alerts[] | select(.state=="firing")'

# Or via Prometheus UI
# Navigate to: http://localhost:9090/alerts
```

### 3. Trigger Test Alert
- Stop metrics-api: `docker-compose stop metrics-api`
- Wait for alert to fire (30 minutes for NoWebMetricsReceived)
- Verify alert appears in Prometheus
- Restart service: `docker-compose start metrics-api`

### 4. Test Health Check Script
```bash
./scripts/check-health.sh
```

## Files to Create/Modify
- `docker-compose.yml` - Add healthchecks to all services
- `prometheus/alerts.yml` - Create alerting rules
- `prometheus/prometheus.yml` - Add rule_files and alerting config
- `scripts/check-health.sh` - Health check verification script
- `alertmanager/alertmanager.yml` - Alertmanager config (optional)
- `ALERTING.md` or `README.md` - Documentation

## Dependencies
- Docker healthcheck support
- wget or curl in containers (for healthchecks)
- Prometheus alerting support (built-in)
- Optional: Alertmanager for notifications

## Rollback Plan
- Remove healthchecks from docker-compose.yml
- Remove alerts.yml and rule_files from prometheus.yml
- Services continue working without healthchecks/alerts

## Considerations
- **Healthcheck Intervals:** Balance between responsiveness and resource usage
- **Alert Thresholds:** Adjust based on your requirements
- **Notification Channels:** Configure Alertmanager if you want email/Slack/etc.
- **False Positives:** Tune alert rules to reduce false positives
- **Alert Fatigue:** Don't create too many alerts

## Testing Checklist
- [ ] Healthchecks added to all services
- [ ] Healthchecks pass after service startup
- [ ] Alert rules file created
- [ ] Prometheus loads alert rules
- [ ] Alerts appear in Prometheus UI
- [ ] Test alerts fire correctly
- [ ] Health check script works
- [ ] Alertmanager configured (if used)
- [ ] Documentation complete
