# Plan: Remove Public Ports for Security

## Overview
Remove direct public port exposure for Prometheus, Pushgateway, and Grafana services. These services should only be accessible through nginx reverse proxy to enforce authentication and network isolation.

## Current State
- Prometheus exposes port `9090:9090` directly to host
- Pushgateway exposes port `9091:9091` directly to host
- Grafana exposes port `3000:3000` directly to host
- Metrics-API exposes port `8080:8080` (may need to keep for external access)

## Target State
- Prometheus: Only accessible via nginx reverse proxy (localhost:9090)
- Pushgateway: Only accessible within Docker network
- Grafana: Only accessible via nginx reverse proxy (localhost:3000)
- Metrics-API: Keep port if needed for external POST requests, or remove if only accessed via nginx

## Implementation Steps

### 1. Update docker-compose.yml

**File:** `docker-compose.yml`

**Changes:**
- Remove `ports:` section from `prometheus` service
- Remove `ports:` section from `pushgateway` service
- Remove `ports:` section from `grafana` service
- Optionally remove `ports:` from `metrics-api` if it will be proxied through nginx
- Services will still be accessible via Docker network `monitor` for internal communication

**Example changes:**
```yaml
prometheus:
  # Remove: ports: - "9090:9090"
  # Keep: networks: - monitor

pushgateway:
  # Remove: ports: - "9091:9091"
  # Keep: networks: - monitor

grafana:
  # Remove: ports: - "3000:3000"
  # Keep: networks: - monitor
```

### 2. Verify Nginx Configuration

**Action:** Ensure nginx server blocks exist for:
- `prometheus.entazis.dev` → `http://localhost:9090` (already configured per SECURITY.md)
- `grafana.entazis.dev` → `http://localhost:3000` (verify exists)

**Note:** Pushgateway should NOT have a public nginx entry - it's internal only.

### 3. Add Grafana Authentication (if not already present)

**Action:** Create or verify nginx basic auth for Grafana similar to Prometheus:
- Create password file: `/etc/nginx/auth/grafana.htpasswd`
- Add auth_basic directives to Grafana nginx server block
- Optionally create `manage-grafana-auth.sh` script (similar to `manage-prometheus-auth.sh`)

### 4. Test Access

**Verification steps:**
1. Restart services: `docker-compose down && docker-compose up -d`
2. Verify services are NOT accessible directly:
   - `curl http://localhost:9090` should fail (connection refused or timeout)
   - `curl http://localhost:9091` should fail
   - `curl http://localhost:3000` should fail
3. Verify services ARE accessible via nginx:
   - `curl -u user:pass https://prometheus.entazis.dev` should work
   - `curl -u user:pass https://grafana.entazis.dev` should work
4. Verify internal Docker network communication:
   - Prometheus can still scrape pushgateway:9091 (internal)
   - Grafana can still query prometheus:9090 (internal)

### 5. Update Documentation

**File:** `SECURITY.md`

**Updates:**
- Document that services are no longer directly exposed
- Update network isolation section
- Add note about accessing services only through nginx

## Rollback Plan
If issues occur:
1. Re-add `ports:` sections to docker-compose.yml
2. Restart services: `docker-compose restart`
3. Services will be accessible directly again

## Files to Modify
- `docker-compose.yml` - Remove port mappings
- `SECURITY.md` - Update documentation
- Nginx configuration (if Grafana auth needs to be added)

## Dependencies
- Nginx must be running and configured as reverse proxy
- Basic auth must be configured for Prometheus (already done)
- Basic auth should be configured for Grafana (may need to add)

## Testing Checklist
- [ ] Services restart successfully without port mappings
- [ ] Direct port access fails (security test)
- [ ] Nginx proxy access works with authentication
- [ ] Internal Docker network communication works
- [ ] Prometheus can scrape Pushgateway
- [ ] Grafana can query Prometheus
- [ ] Documentation updated
