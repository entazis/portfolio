# Fix: 502 Bad Gateway Error

## Problem

After removing public ports, accessing `prometheus.entazis.dev` or `grafana.entazis.dev` results in a 502 Bad Gateway error.

## Root Cause

Nginx is running on the host machine and trying to connect to `http://localhost:9090` (Prometheus) and `http://localhost:3000` (Grafana). When we removed the port mappings completely, nginx could no longer reach these services because they weren't exposed on the host.

## Solution

Bind ports to `127.0.0.1` (localhost) instead of removing them completely. This allows:
- ✅ Nginx on localhost to access the services
- ❌ External IPs cannot access services directly (security maintained)
- ✅ Services are still protected by nginx authentication

## Configuration

**File:** `docker-compose.yml`

```yaml
prometheus:
  ports:
    - "127.0.0.1:9090:9090"  # localhost only, not 0.0.0.0

grafana:
  ports:
    - "127.0.0.1:3000:3000"  # localhost only, not 0.0.0.0
```

## Port Binding Explanation

### `127.0.0.1:9090:9090` vs `9090:9090`

- **`9090:9090`** (or `0.0.0.0:9090:9090`): Binds to all network interfaces
  - Accessible from localhost ✅
  - Accessible from external IPs ❌ (security risk)
  
- **`127.0.0.1:9090:9090`**: Binds to localhost only
  - Accessible from localhost ✅ (nginx can reach it)
  - Accessible from external IPs ❌ (secure)

## Apply the Fix

1. **Update docker-compose.yml** (already done)

2. **Restart services:**
   ```bash
   cd /var/www/portfolio/apps/monitoring
   docker-compose down
   docker-compose up -d
   ```

3. **Verify services are accessible:**
   ```bash
   # From localhost (should work)
   curl http://localhost:9090/api/v1/status/config
   curl http://localhost:3000/api/health
   
   # Via nginx (should work with auth)
   curl -u username:password https://prometheus.entazis.dev/api/v1/status/config
   curl -u username:password https://grafana.entazis.dev/api/health
   ```

## Security Verification

The `127.0.0.1` binding maintains security:

1. **External access blocked:**
   ```bash
   # From another machine or using server's external IP
   curl http://<server-external-ip>:9090  # Should fail (connection refused)
   curl http://<server-external-ip>:3000  # Should fail (connection refused)
   ```

2. **Only nginx can access:**
   - Services are only accessible from localhost
   - Nginx running on localhost can proxy requests
   - All external access must go through nginx (with authentication)

3. **No direct service access:**
   - Users cannot bypass nginx authentication
   - Services are not exposed to the internet

## Why Not Remove Ports Completely?

If we remove ports completely:
- ❌ Nginx on host cannot reach services
- ❌ 502 Bad Gateway errors occur
- ✅ Services would need to be in same Docker network as nginx (requires nginx in Docker)

Binding to `127.0.0.1` is the best compromise:
- ✅ Nginx can access services
- ✅ External access is blocked
- ✅ Security is maintained
- ✅ No need to run nginx in Docker
