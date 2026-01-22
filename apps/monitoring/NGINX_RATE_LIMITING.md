# Nginx Rate Limiting Configuration

This document provides the exact configuration snippets needed to add rate limiting to Grafana and Prometheus nginx configurations.

## Rate Limiting Zones

Add these zone definitions to your nginx configuration. They can be added to:
- The main `nginx.conf` file in the `http` context, OR
- At the top of each site configuration file (before the `server` blocks)

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=grafana_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=prometheus_limit:10m rate=10r/m;
```

## Grafana Configuration

**File:** `/etc/nginx/sites-available/grafana.conf`

Add the rate limiting directive inside the `server` block, before the `location /` block:

```nginx
server {
    listen 443 ssl http2;
    server_name grafana.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/grafana.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grafana.entazis.dev/privkey.pem;

    # Rate limiting - ADD THIS LINE
    limit_req zone=grafana_limit burst=5 nodelay;

    # Basic authentication
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

## Prometheus Configuration

**File:** Locate your Prometheus nginx configuration file (may be in `/etc/nginx/sites-available/default` or a separate file)

Add the rate limiting directive inside the `server` block for Prometheus:

```nginx
server {
    listen 443 ssl http2;
    server_name prometheus.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/prometheus.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prometheus.entazis.dev/privkey.pem;

    # Rate limiting - ADD THIS LINE
    limit_req zone=prometheus_limit burst=5 nodelay;

    # Basic authentication
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

## Applying Changes

1. **Add rate limiting zones:**
   - If adding to main nginx.conf, edit `/etc/nginx/nginx.conf` in the `http` context
   - If adding to site configs, add at the top of each file (before `server` blocks)

2. **Add limit_req directives:**
   - Add to Grafana server block
   - Add to Prometheus server block

3. **Test configuration:**
   ```bash
   sudo nginx -t
   ```

4. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

## Testing Rate Limiting

After applying the changes, test that rate limiting works:

```bash
# Make multiple rapid requests
for i in {1..20}; do
  curl -u username:password https://prometheus.entazis.dev/api/v1/status/config
  echo "Request $i"
done

# Should see 429 Too Many Requests after limit is exceeded
```

## Configuration Parameters

- `zone=grafana_limit:10m` - Memory zone name and size (10MB)
- `rate=10r/m` - Rate limit: 10 requests per minute
- `burst=5` - Allow 5 additional requests before enforcing delay
- `nodelay` - Don't delay requests within burst limit

Adjust these values based on your usage patterns and security requirements.
