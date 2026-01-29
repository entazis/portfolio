# Nginx Configuration Requirements

## Overview

After removing public ports from docker-compose.yml, all services must be accessed through nginx reverse proxy. This document outlines the required nginx configuration.

## Required Server Blocks

### 1. Prometheus (Already Configured)

**Domain:** `prometheus.entazis.dev`

**Configuration should include:**
- HTTPS/TLS with Let's Encrypt certificates
- HTTP Basic Authentication
- Reverse proxy to `http://localhost:9090`

**Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name prometheus.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/prometheus.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prometheus.entazis.dev/privkey.pem;

    auth_basic "Prometheus - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/prometheus.htpasswd;

    location / {
        proxy_pass http://localhost:9090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Grafana (Needs Verification/Configuration)

**Domain:** `grafana.entazis.dev`

**Configuration should include:**
- HTTPS/TLS with Let's Encrypt certificates
- HTTP Basic Authentication (use `manage-grafana-auth.sh` to create users)
- Reverse proxy to `http://localhost:3000`
- WebSocket support for Grafana live features

**Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name grafana.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/grafana.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grafana.entazis.dev/privkey.pem;

    auth_basic "Grafana - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/grafana.htpasswd;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. Metrics API (Already Configured)

**Domain:** `entazis.dev` (or your main domain)

**Location:** `/api/track`

**Configuration should include:**
- Reverse proxy to `http://localhost:8080/track`
- CORS headers (if needed)
- No authentication required (public endpoint for metrics collection)

**Example:**
```nginx
server {
    listen 443 ssl http2;
    server_name entazis.dev;

    # ... SSL configuration ...

    location /api/track {
        proxy_pass http://localhost:8080/track;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type";
    }
}
```

### 5. NGINX `stub_status` (Required for nginx-exporter)

The monitoring stack includes an `nginx-exporter` container which scrapes an NGINX `stub_status` endpoint at:

- `http://host.docker.internal/nginx_status` (from inside Docker)

To enable it on the host nginx, add a local-only endpoint (avoid exposing it publicly):

```nginx
server {
    # ... your existing server config ...

    location = /nginx_status {
        stub_status;

        # Lock this down: only allow local + docker bridge
        allow 127.0.0.1;
        allow 172.17.0.1; # common docker0 gateway (adjust if different)
        deny all;
    }
}
```

After enabling, reload nginx and verify locally:

```bash
curl http://127.0.0.1/nginx_status
```

### 4. Pushgateway (NOT Required)

**Important:** Pushgateway should NOT have a public nginx entry. It's internal-only and accessed only by:
- Prometheus (via Docker network: `pushgateway:9091`)
- Metrics-API (via Docker network: `pushgateway:9091`)

## Setup Instructions

### 1. Create Grafana Authentication

```bash
cd /var/www/portfolio/apps/monitoring
./manage-grafana-auth.sh add admin
```

### 2. Verify Nginx Configuration

```bash
# Test nginx configuration
sudo nginx -t

# If valid, reload nginx
sudo systemctl reload nginx
```

### 3. Verify Services Are Running

```bash
cd /var/www/portfolio/apps/monitoring
docker-compose ps
```

All services should show as "Up".

### 4. Test Access

**Prometheus:**
```bash
curl -u username:password https://prometheus.entazis.dev/api/v1/status/config
```

**Grafana:**
```bash
curl -u username:password https://grafana.entazis.dev/api/health
```

**Metrics API:**
```bash
curl -X POST https://entazis.dev/api/track \
  -H "Content-Type: application/json" \
  -d '{"site":"test","metrics":[]}'
```

**Verify Direct Ports Are Blocked:**
```bash
# These should fail (connection refused)
curl http://localhost:9090  # Prometheus
curl http://localhost:9091  # Pushgateway
curl http://localhost:3000  # Grafana

# This should work (metrics-api still exposed)
curl http://localhost:8080/health
```

## Troubleshooting

### Services Not Accessible via Nginx

1. **Check services are running:**
   ```bash
   docker-compose ps
   ```

2. **Check nginx can reach localhost:**
   ```bash
   curl http://localhost:9090  # Should work from host (before removing ports)
   ```

3. **Check nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

### Authentication Not Working

1. **Verify password file exists:**
   ```bash
   ls -la /etc/nginx/auth/grafana.htpasswd
   ```

2. **Check file permissions:**
   ```bash
   sudo chmod 644 /etc/nginx/auth/grafana.htpasswd
   ```

3. **Test authentication:**
   ```bash
   curl -u username:password https://grafana.entazis.dev/api/health
   ```

### Metrics Not Posting

1. **Verify metrics-api is accessible:**
   ```bash
   curl http://localhost:8080/health
   ```

2. **Check nginx proxy configuration for `/api/track`**

3. **Verify portfolio-simple is posting to correct URL:**
   - Should be: `https://entazis.dev/api/track`
   - Not: `http://localhost:8080/track`

## Notes

- **Metrics-API Port 8080:** This port is exposed and is the target for nginx proxying. The nginx proxy forwards `/api/track` requests to it.

- **Internal Communication:** All services communicate internally via Docker network:
  - Prometheus → Pushgateway: `pushgateway:9091`
  - Prometheus → Grafana datasource: `prometheus:9090`
  - Metrics-API → Pushgateway: `pushgateway:9091`

- **Security:** Removing direct port exposure significantly improves security by:
  - Forcing all access through nginx (with authentication)
  - Preventing direct access to services
  - Centralizing security controls in nginx
