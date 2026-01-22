# Prometheus Security Guide

## Overview

This document describes the security measures implemented to protect the Prometheus monitoring instance from unauthorized access.

## Current Security Measures

### 1. HTTP Basic Authentication

Both Prometheus and Grafana are protected by HTTP Basic Authentication via nginx. All requests require valid credentials.

**Prometheus:**
- Password file: `/etc/nginx/auth/prometheus.htpasswd`
- Managed via: `manage-prometheus-auth.sh` script
- Access: `https://prometheus.entazis.dev`

**Grafana:**
- Password file: `/etc/nginx/auth/grafana.htpasswd`
- Managed via: `manage-grafana-auth.sh` script
- Access: `https://grafana.entazis.dev`

### 2. HTTPS/TLS Encryption

All traffic is encrypted using TLS/SSL certificates managed by Let's Encrypt (Certbot).

### 3. Network Isolation

All monitoring services run in a Docker network (`monitor`) and are only accessible via:
- **Prometheus**: Only accessible through nginx reverse proxy at `https://prometheus.entazis.dev` (no direct port exposure)
- **Grafana**: Only accessible through nginx reverse proxy at `https://grafana.entazis.dev` (no direct port exposure)
- **Pushgateway**: Only accessible within Docker network (internal only, no public access)
- **Metrics-API**: Exposes port 8080 for external POST requests from websites (required for metrics collection)
- Docker network (for internal service-to-service communication)

## Managing Authentication

### Prometheus Authentication

**Adding a User:**
```bash
cd /var/www/portfolio/apps/monitoring
./manage-prometheus-auth.sh add <username>
```

**Removing a User:**
```bash
./manage-prometheus-auth.sh remove <username>
```

**Listing Users:**
```bash
./manage-prometheus-auth.sh list
```

### Grafana Authentication

**Adding a User:**
```bash
cd /var/www/portfolio/apps/monitoring
./manage-grafana-auth.sh add <username>
```

**Removing a User:**
```bash
./manage-grafana-auth.sh remove <username>
```

**Listing Users:**
```bash
./manage-grafana-auth.sh list
```

### After Making Changes

After adding or removing users, reload nginx:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Initial Setup

If this is the first time setting up authentication:

1. **Create the first user:**
   ```bash
   cd /var/www/portfolio/apps/monitoring
   ./manage-prometheus-auth.sh add admin
   ```

2. **Test nginx configuration:**
   ```bash
   sudo nginx -t
   ```

3. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

4. **Test access:**
   - Visit `https://prometheus.entazis.dev`
   - You should be prompted for username and password
   - Enter the credentials you just created

## Additional Security Recommendations

### Option 1: IP Whitelisting (Recommended for Single Admin)

If you have a static IP address, you can restrict access to specific IPs:

```nginx
location / {
    # Allow only specific IPs
    allow 1.2.3.4;  # Replace with your IP
    allow 5.6.7.8;  # Add additional IPs as needed
    deny all;
    
    # Keep authentication as additional layer
    auth_basic "Prometheus - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/prometheus.htpasswd;
    
    proxy_pass http://localhost:9090;
    # ... rest of proxy settings
}
```

### Option 2: VPN Access Only

For maximum security, consider:
1. Removing the public nginx configuration
2. Accessing Prometheus/Grafana only through a VPN
3. Services are already bound to localhost only (no direct port exposure in docker-compose.yml)

### Option 3: OAuth2/OIDC Proxy

For enterprise-grade authentication, consider using:
- [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
- [Authelia](https://www.authelia.com/)
- [Authentik](https://goauthentik.io/)

### Option 4: Rate Limiting

Rate limiting is configured to prevent brute force attacks. The configuration limits requests to 10 requests per minute per IP address, with a burst allowance of 5 requests.

**Configuration:**

Rate limiting zones are defined in the nginx configuration:

```nginx
# Rate limiting zones (add to http context or at top of config)
limit_req_zone $binary_remote_addr zone=grafana_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=prometheus_limit:10m rate=10r/m;
```

**Grafana server block:**
```nginx
server {
    listen 443 ssl http2;
    server_name grafana.entazis.dev;
    
    # Rate limiting
    limit_req zone=grafana_limit burst=5 nodelay;
    
    # Basic authentication
    auth_basic "Grafana - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/grafana.htpasswd;
    
    location / {
        proxy_pass http://localhost:3000;
        # ... rest of proxy settings
    }
}
```

**Prometheus server block:**
```nginx
server {
    listen 443 ssl http2;
    server_name prometheus.entazis.dev;
    
    # Rate limiting
    limit_req zone=prometheus_limit burst=5 nodelay;
    
    # Basic authentication
    auth_basic "Prometheus - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/prometheus.htpasswd;
    
    location / {
        proxy_pass http://localhost:9090;
        # ... rest of proxy settings
    }
}
```

**Testing Rate Limiting:**

To verify rate limiting is working:

```bash
# Make multiple rapid requests
for i in {1..20}; do
  curl -u username:password https://prometheus.entazis.dev/api/v1/status/config
done
# Should see 429 Too Many Requests after limit is exceeded
```

**Adjusting Rate Limits:**

If you need to adjust the rate limits, modify the zone definitions:
- `rate=10r/m` - 10 requests per minute (adjust as needed)
- `burst=5` - Allow 5 additional requests before enforcing delay
- `nodelay` - Don't delay requests within burst limit

### Option 5: Disable External Access

If you don't need external access at all:

1. **Remove the nginx server block** for prometheus.entazis.dev
2. **Access via SSH tunnel:**
   ```bash
   ssh -L 9090:localhost:9090 user@your-server
   ```
   Then access `http://localhost:9090` locally

3. **Or use a VPN** to access the server network

## Environment File Security

### .env File Management

All sensitive credentials are stored in a `.env` file that is **not** tracked in version control.

**Security Measures:**
- `.env` is listed in `.gitignore` (via `.env*` pattern)
- `.env` file is never committed to git
- `.env.example` template exists with placeholder values
- Real credentials are only stored in the `.env` file on the server

**Creating .env File:**

1. Copy the example template:
   ```bash
   cd /var/www/portfolio/apps/monitoring
   cp .env.example .env
   ```

2. Edit `.env` and replace `CHANGE_ME` placeholders with strong passwords:
   ```bash
   nano .env
   ```

3. Verify `.env` is gitignored:
   ```bash
   git check-ignore .env
   # Should output: .env
   
   git ls-files .env
   # Should output nothing
   ```

**If .env is accidentally tracked:**

If `.env` was previously committed to git, remove it from version control (but keep the file):

```bash
git rm --cached .env
git commit -m "Remove .env from version control"
```

**Important:** After removing from git, rotate all credentials that were exposed.

## Password Management

### Password Requirements

All passwords must meet the following requirements:
- **Minimum 12 characters** (recommended: 20+)
- Mix of uppercase and lowercase letters
- Include numbers
- Include special characters
- Avoid dictionary words
- Use unique passwords for each service

### Generating Strong Passwords

Use the provided password generator script:

```bash
cd /var/www/portfolio/apps/monitoring
./scripts/generate-password.sh 20
```

This generates a 20-character random password. You can specify a different length:

```bash
./scripts/generate-password.sh 24  # Generate 24-character password
```

**Alternative methods:**

```bash
# Using openssl
openssl rand -base64 32 | tr -d "=+/" | cut -c1-20

# Using /dev/urandom
tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c 20
```

### Password Storage

- Store passwords in `.env` file (not in code)
- Use environment variables in `docker-compose.yml`
- Never commit passwords to version control
- Use a password manager for personal password storage

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters (use `scripts/generate-password.sh`)
   - Mix of uppercase, lowercase, numbers, and symbols
   - Use a password manager for personal storage

2. **Regular Password Rotation**
   - Rotate passwords every 90 days
   - Remove unused accounts promptly
   - Update `.env` file when rotating credentials

3. **Monitor Access Logs**
   ```bash
   tail -f /var/log/nginx/prometheus_access.log
   ```

4. **Keep Software Updated**
   - Regularly update Prometheus, nginx, and Docker images
   - Monitor security advisories

5. **Limit User Access**
   - Only create accounts for users who need access
   - Remove accounts when access is no longer needed

6. **Enable Audit Logging**
   - Monitor failed authentication attempts
   - Set up alerts for suspicious activity

7. **Disable Anonymous Access**
   - Grafana anonymous access is disabled via `GF_AUTH_ANONYMOUS_ENABLED=false`
   - User sign-up is disabled via `GF_USERS_ALLOW_SIGN_UP=false`
   - All access requires authentication through nginx basic auth

8. **Security Checklist**
   - Review [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) regularly
   - Verify all security measures are implemented
   - Update checklist as new measures are added

## Troubleshooting

### Authentication Not Working

1. **Check password file exists:**
   ```bash
   ls -la /etc/nginx/auth/prometheus.htpasswd
   ```

2. **Check file permissions:**
   ```bash
   sudo chmod 644 /etc/nginx/auth/prometheus.htpasswd
   ```

3. **Check nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/prometheus_error.log
   ```

4. **Test nginx configuration:**
   ```bash
   sudo nginx -t
   ```

### Can't Access After Setup

1. **Verify nginx is running:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Check services are running:**
   ```bash
   docker ps | grep -E "prometheus|grafana|pushgateway|metrics-api"
   ```

3. **Test nginx proxy access:**
   ```bash
   curl -u username:password https://prometheus.entazis.dev/api/v1/status/config
   curl -u username:password https://grafana.entazis.dev/api/health
   ```

4. **Verify direct port access is blocked:**
   ```bash
   # These should fail (connection refused)
   curl http://localhost:9090  # Prometheus
   curl http://localhost:9091  # Pushgateway
   curl http://localhost:3000  # Grafana
   ```

## Grafana Anonymous Access Configuration

Anonymous access to Grafana is disabled to ensure all users must authenticate. This is configured in `docker-compose.yml`:

```yaml
grafana:
  environment:
    - GF_AUTH_ANONYMOUS_ENABLED=false
    - GF_USERS_ALLOW_SIGN_UP=false
```

**Verification:**

1. Check docker-compose.yml contains the settings
2. Restart Grafana service:
   ```bash
   cd /var/www/portfolio/apps/monitoring
   docker-compose up -d grafana
   ```

3. Verify anonymous access is blocked:
   - Try accessing Grafana without credentials
   - Should be blocked by nginx basic auth before reaching Grafana

## Security Audit Checklist

For a comprehensive security review, see [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md). The checklist includes:

- Environment file security
- Authentication configuration
- Rate limiting verification
- Grafana security settings
- Network security
- Access control
- Maintenance tasks
- Testing procedures

Review the checklist monthly and update it as new security measures are implemented.

## References

- [Nginx HTTP Basic Authentication](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [Nginx Rate Limiting](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html)
- [Prometheus Security Best Practices](https://prometheus.io/docs/operating/security/)
- [Grafana Security](https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
