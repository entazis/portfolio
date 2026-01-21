# Rate Limiting Quick Reference

## Step 1: View Your Current Configurations

Run this script to see your current nginx configurations:

```bash
cd /var/www/portfolio/apps/monitoring
bash view-nginx-configs.sh
```

This will show you:
- All available configuration files
- The Grafana configuration
- The default configuration (where Prometheus might be)
- Any Prometheus-specific configurations

## Step 2: Copy These Code Snippets

### Snippet 1: Rate Limiting Zones (Copy Once)

Add this **at the very top** of your Grafana config file (before any `server` blocks):

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=grafana_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=prometheus_limit:10m rate=10r/m;
```

**Where to paste:** At the top of `/etc/nginx/sites-available/grafana.conf` (before the first `server {` line)

### Snippet 2: Grafana Rate Limiting (Copy This)

Add this **inside the Grafana `server` block**, right after the `server_name` line:

```nginx
    # Rate limiting
    limit_req zone=grafana_limit burst=5 nodelay;
```

**Where to paste:** Inside the `server { ... }` block for Grafana, after the `server_name grafana.entazis.dev;` line

**Example of where it should go:**

```nginx
server {
    listen 443 ssl http2;
    server_name grafana.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/grafana.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grafana.entazis.dev/privkey.pem;

    # Rate limiting                    <-- PASTE SNIPPET 2 HERE
    limit_req zone=grafana_limit burst=5 nodelay;

    # Basic authentication
    auth_basic "Grafana - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/grafana.htpasswd;

    location / {
        proxy_pass http://localhost:3000;
        # ... rest of config
    }
}
```

### Snippet 3: Prometheus Rate Limiting (Copy This)

Add this **inside the Prometheus `server` block**, right after the `server_name` line:

```nginx
    # Rate limiting
    limit_req zone=prometheus_limit burst=5 nodelay;
```

**Where to paste:** Inside the `server { ... }` block for Prometheus, after the `server_name prometheus.entazis.dev;` line

**Example of where it should go:**

```nginx
server {
    listen 443 ssl http2;
    server_name prometheus.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/prometheus.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prometheus.entazis.dev/privkey.pem;

    # Rate limiting                    <-- PASTE SNIPPET 3 HERE
    limit_req zone=prometheus_limit burst=5 nodelay;

    # Basic authentication
    auth_basic "Prometheus - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/prometheus.htpasswd;

    location / {
        proxy_pass http://localhost:9090;
        # ... rest of config
    }
}
```

## Step 3: Complete Example

Here's what your Grafana config should look like after adding rate limiting:

```nginx
# Rate limiting zones
limit_req_zone $binary_remote_addr zone=grafana_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=prometheus_limit:10m rate=10r/m;

server {
    listen 443 ssl http2;
    server_name grafana.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/grafana.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grafana.entazis.dev/privkey.pem;

    # Rate limiting
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

## Step 4: Test and Apply

After making changes:

```bash
# Test the configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Important Notes

1. **Zones only need to be defined once** - If you add them to Grafana config, you can reuse them in Prometheus config (they're shared)

2. **If Prometheus is in a different file**, you have two options:
   - Option A: Copy the zone definitions to that file too (at the top)
   - Option B: Add zones once in the main `/etc/nginx/nginx.conf` in the `http` context

3. **The `limit_req` directive must be inside the `server` block**, not in the `location` block

## Quick Checklist

- [ ] Viewed current nginx configs with `view-nginx-configs.sh`
- [ ] Added rate limiting zones at top of Grafana config
- [ ] Added `limit_req` directive to Grafana server block
- [ ] Added `limit_req` directive to Prometheus server block (if separate file, add zones there too)
- [ ] Tested with `sudo nginx -t`
- [ ] Reloaded nginx with `sudo systemctl reload nginx`
- [ ] Tested rate limiting works (should see 429 after 10+ requests)
