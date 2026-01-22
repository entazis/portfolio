# Plan: Security Hardening

## Overview
Enhance security by verifying credential management, adding Grafana authentication, implementing rate limiting, and ensuring all security best practices are followed.

## Current State
- Prometheus has nginx basic auth (configured)
- Grafana authentication status unknown (needs verification)
- Environment variables used for credentials (good)
- `.env` file status unknown (needs verification)
- No rate limiting configured
- Anonymous access status unknown

## Target State
- `.env` file confirmed in `.gitignore`
- Grafana has nginx basic auth (similar to Prometheus)
- Rate limiting configured for Prometheus and Grafana
- Anonymous access disabled in Grafana
- Strong password requirements documented
- All credentials managed via environment variables

## Implementation Steps

### 1. Verify .env File Security

**Action:** Check if `.env` is gitignored

**File:** `.gitignore` (create if doesn't exist in monitoring directory)

**Content:**
```
.env
.env.local
.env.*.local
*.htpasswd
```

**Verification:**
```bash
cd /var/www/portfolio/apps/monitoring
git check-ignore .env
# Should output: .env

# Verify .env is not tracked
git ls-files | grep .env
# Should output nothing
```

**If .env is tracked:**
```bash
# Remove from git (but keep file)
git rm --cached .env
git commit -m "Remove .env from version control"
```

### 2. Create/Update .env.example

**File:** `.env.example`

**Content:**
```bash
# Grafana Configuration
GF_SECURITY_ADMIN_USER=admin
GF_SECURITY_ADMIN_PASSWORD=CHANGE_ME
GF_USERS_ALLOW_SIGN_UP=false
GF_SECURITY_DISABLE_GRAVATAR=true

# Environment
ENVIRONMENT=prod
INSTANCE_ID=metrics-api-1

# Pushgateway URL (internal)
PUSHGATEWAY_URL=http://pushgateway:9091
```

**Purpose:** Template for other developers, without exposing real credentials

### 3. Add Grafana Authentication Script

**File:** `manage-grafana-auth.sh`

**Content:** (Similar to `manage-prometheus-auth.sh`)
```bash
#!/bin/bash
# Script to manage Grafana HTTP Basic Authentication

NGINX_AUTH_DIR="/etc/nginx/auth"
GRAFANA_PASSWD_FILE="${NGINX_AUTH_DIR}/grafana.htpasswd"

create_auth_dir() {
    if [ ! -d "$NGINX_AUTH_DIR" ]; then
        echo "Creating nginx auth directory: $NGINX_AUTH_DIR"
        sudo mkdir -p "$NGINX_AUTH_DIR"
        sudo chmod 755 "$NGINX_AUTH_DIR"
    fi
}

add_user() {
    local username=$1
    if [ -z "$username" ]; then
        echo "Usage: $0 add <username>"
        exit 1
    fi
    
    create_auth_dir
    
    if [ -f "$GRAFANA_PASSWD_FILE" ]; then
        echo "Adding/updating user: $username"
        sudo htpasswd "$GRAFANA_PASSWD_FILE" "$username"
    else
        echo "Creating new password file and adding user: $username"
        sudo htpasswd -c "$GRAFANA_PASSWD_FILE" "$username"
    fi
    
    sudo chmod 644 "$GRAFANA_PASSWD_FILE"
    echo "User $username added/updated successfully"
    echo "Note: You need to reload nginx for changes to take effect: sudo nginx -t && sudo systemctl reload nginx"
}

remove_user() {
    local username=$1
    if [ -z "$username" ]; then
        echo "Usage: $0 remove <username>"
        exit 1
    fi
    
    if [ ! -f "$GRAFANA_PASSWD_FILE" ]; then
        echo "Password file does not exist: $GRAFANA_PASSWD_FILE"
        exit 1
    fi
    
    echo "Removing user: $username"
    sudo htpasswd -D "$GRAFANA_PASSWD_FILE" "$username"
    echo "User $username removed successfully"
    echo "Note: You need to reload nginx for changes to take effect: sudo nginx -t && sudo systemctl reload nginx"
}

list_users() {
    if [ ! -f "$GRAFANA_PASSWD_FILE" ]; then
        echo "Password file does not exist: $GRAFANA_PASSWD_FILE"
        exit 1
    fi
    
    echo "Users in Grafana password file:"
    cut -d: -f1 "$GRAFANA_PASSWD_FILE"
}

usage() {
    echo "Grafana Authentication Manager"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  add <username>     Add or update a user"
    echo "  remove <username>  Remove a user"
    echo "  list               List all users"
}

case "$1" in
    add)
        add_user "$2"
        ;;
    remove)
        remove_user "$2"
        ;;
    list)
        list_users
        ;;
    *)
        usage
        exit 1
        ;;
esac
```

**Make executable:**
```bash
chmod +x manage-grafana-auth.sh
```

### 4. Update Nginx Configuration for Grafana

**Action:** Add or update nginx server block for Grafana

**File:** Nginx config (location depends on your setup, typically `/etc/nginx/sites-available/grafana.entazis.dev`)

**Content:**
```nginx
# Rate limiting zone
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

# Prometheus server block (update existing)
server {
    listen 443 ssl http2;
    server_name prometheus.entazis.dev;

    ssl_certificate /etc/letsencrypt/live/prometheus.entazis.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/prometheus.entazis.dev/privkey.pem;

    # Rate limiting
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

**Note:** Update existing Prometheus config if it doesn't have rate limiting.

### 5. Verify Grafana Security Settings

**File:** `docker-compose.yml`

**Verify environment variables:**
```yaml
grafana:
  environment:
    - GF_SECURITY_ADMIN_USER=${GF_SECURITY_ADMIN_USER}
    - GF_SECURITY_ADMIN_PASSWORD=${GF_SECURITY_ADMIN_PASSWORD}
    - GF_USERS_ALLOW_SIGN_UP=${GF_USERS_ALLOW_SIGN_UP:-false}  # Ensure false
    - GF_SECURITY_DISABLE_GRAVATAR=${GF_SECURITY_DISABLE_GRAVATAR:-true}
    - GF_AUTH_ANONYMOUS_ENABLED=false  # Add this
    - GF_SECURITY_DISABLE_INITIAL_ADMIN_CREATION=false  # Keep admin creation
```

### 6. Create Security Checklist Document

**File:** `SECURITY_CHECKLIST.md`

**Content:**
- [ ] `.env` file is in `.gitignore`
- [ ] `.env` is not tracked in git
- [ ] Strong passwords for all services (min 12 chars)
- [ ] Grafana basic auth configured
- [ ] Prometheus basic auth configured
- [ ] Rate limiting enabled
- [ ] Anonymous access disabled
- [ ] HTTPS/TLS enabled
- [ ] Regular password rotation (90 days)
- [ ] Access logs monitored
- [ ] Software kept updated

### 7. Update SECURITY.md

**File:** `SECURITY.md`

**Additions:**
- Grafana authentication section
- Rate limiting documentation
- `.env` file security
- Password requirements
- Regular security audit checklist

### 8. Create Password Generation Helper

**File:** `scripts/generate-password.sh`

**Content:**
```bash
#!/bin/bash
# Generate a strong random password

LENGTH=${1:-20}

openssl rand -base64 32 | tr -d "=+/" | cut -c1-${LENGTH}
```

**Usage:**
```bash
./scripts/generate-password.sh 20
```

## Testing

### 1. Verify .env Security
```bash
git check-ignore .env
git ls-files .env  # Should be empty
```

### 2. Test Grafana Authentication
```bash
# Create user
./manage-grafana-auth.sh add testuser

# Test access
curl -u testuser:password https://grafana.entazis.dev/api/health
```

### 3. Test Rate Limiting
```bash
# Make multiple rapid requests
for i in {1..20}; do
  curl -u user:pass https://prometheus.entazis.dev/api/v1/status/config
done
# Should see 429 Too Many Requests after limit
```

### 4. Verify Anonymous Access Disabled
- Try accessing Grafana without credentials
- Should be blocked by nginx auth

## Files to Create/Modify
- `.gitignore` - Add .env and sensitive files
- `.env.example` - Template without real credentials
- `manage-grafana-auth.sh` - Grafana auth management script
- `SECURITY_CHECKLIST.md` - Security checklist
- `scripts/generate-password.sh` - Password generator
- Nginx configuration - Add rate limiting and Grafana auth
- `docker-compose.yml` - Verify Grafana security env vars
- `SECURITY.md` - Update documentation

## Dependencies
- Nginx must be installed and configured
- htpasswd utility (apache2-utils package)
- openssl for password generation
- Git for .gitignore verification

## Rollback Plan
- Remove rate limiting from nginx config
- Remove Grafana auth (if causing issues)
- Revert environment variable changes
- Services will continue working (less secure)

## Considerations
- **Rate Limiting:** Adjust rates based on usage patterns
- **Password Strength:** Enforce minimum requirements
- **Credential Rotation:** Document rotation schedule
- **Access Logs:** Monitor for suspicious activity
- **IP Whitelisting:** Consider for single-admin scenarios

## Testing Checklist
- [ ] `.env` is gitignored and not tracked
- [ ] `.env.example` created
- [ ] Grafana auth script works
- [ ] Nginx Grafana config has auth and rate limiting
- [ ] Nginx Prometheus config has rate limiting
- [ ] Grafana anonymous access disabled
- [ ] Rate limiting works (429 responses)
- [ ] Password generator works
- [ ] Security checklist created
- [ ] SECURITY.md updated
