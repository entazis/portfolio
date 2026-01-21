# Prometheus Security Guide

## Overview

This document describes the security measures implemented to protect the Prometheus monitoring instance from unauthorized access.

## Current Security Measures

### 1. HTTP Basic Authentication

Prometheus is protected by HTTP Basic Authentication via nginx. All requests to `https://prometheus.entazis.dev` require valid credentials.

**Implementation:**
- Password file: `/etc/nginx/auth/prometheus.htpasswd`
- Managed via: `manage-prometheus-auth.sh` script

### 2. HTTPS/TLS Encryption

All traffic is encrypted using TLS/SSL certificates managed by Let's Encrypt (Certbot).

### 3. Network Isolation

Prometheus runs in a Docker network (`monitor`) and is only accessible via:
- Localhost (for nginx reverse proxy)
- Docker network (for other monitoring services)

## Managing Authentication

### Adding a User

```bash
cd /var/www/portfolio/apps/monitoring
./manage-prometheus-auth.sh add <username>
```

You will be prompted to enter and confirm a password.

### Removing a User

```bash
./manage-prometheus-auth.sh remove <username>
```

### Listing Users

```bash
./manage-prometheus-auth.sh list
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
2. Accessing Prometheus only through a VPN
3. Binding Prometheus to localhost only in docker-compose.yml

### Option 3: OAuth2/OIDC Proxy

For enterprise-grade authentication, consider using:
- [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/)
- [Authelia](https://www.authelia.com/)
- [Authentik](https://goauthentik.io/)

### Option 4: Rate Limiting

Add rate limiting to prevent brute force attacks:

```nginx
limit_req_zone $binary_remote_addr zone=prometheus_limit:10m rate=10r/m;

location / {
    limit_req zone=prometheus_limit burst=5 nodelay;
    
    auth_basic "Prometheus - Restricted Access";
    auth_basic_user_file /etc/nginx/auth/prometheus.htpasswd;
    
    proxy_pass http://localhost:9090;
    # ... rest of proxy settings
}
```

### Option 5: Disable External Access

If you don't need external access at all:

1. **Remove the nginx server block** for prometheus.entazis.dev
2. **Access via SSH tunnel:**
   ```bash
   ssh -L 9090:localhost:9090 user@your-server
   ```
   Then access `http://localhost:9090` locally

3. **Or use a VPN** to access the server network

## Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of uppercase, lowercase, numbers, and symbols
   - Use a password manager

2. **Regular Password Rotation**
   - Rotate passwords every 90 days
   - Remove unused accounts promptly

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

2. **Check Prometheus is running:**
   ```bash
   docker ps | grep prometheus
   ```

3. **Test local access:**
   ```bash
   curl -u username:password http://localhost:9090
   ```

## References

- [Nginx HTTP Basic Authentication](https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)
- [Prometheus Security Best Practices](https://prometheus.io/docs/operating/security/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
