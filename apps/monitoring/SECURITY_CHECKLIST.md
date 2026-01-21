# Security Checklist

Use this checklist to verify all security measures are properly implemented and maintained.

## Initial Setup

- [ ] `.env` file is in `.gitignore`
- [ ] `.env` is not tracked in git
- [ ] `.env.example` exists with placeholder values
- [ ] Strong passwords for all services (minimum 12 characters)
- [ ] Passwords stored in `.env` file (not hardcoded)

## Authentication

- [ ] Grafana basic auth configured via nginx
- [ ] Prometheus basic auth configured via nginx
- [ ] Password files exist:
  - [ ] `/etc/nginx/auth/grafana.htpasswd`
  - [ ] `/etc/nginx/auth/prometheus.htpasswd`
- [ ] Authentication scripts are executable:
  - [ ] `manage-grafana-auth.sh`
  - [ ] `manage-prometheus-auth.sh`

## Rate Limiting

- [ ] Rate limiting zones defined in nginx configuration
- [ ] Rate limiting applied to Grafana server block
- [ ] Rate limiting applied to Prometheus server block
- [ ] Rate limiting tested (should return 429 after limit exceeded)

## Grafana Security Settings

- [ ] `GF_AUTH_ANONYMOUS_ENABLED=false` in docker-compose.yml
- [ ] `GF_USERS_ALLOW_SIGN_UP=false` in docker-compose.yml
- [ ] `GF_SECURITY_DISABLE_GRAVATAR=true` in docker-compose.yml
- [ ] Admin credentials configured via environment variables

## Network Security

- [ ] HTTPS/TLS enabled for all public endpoints
- [ ] Let's Encrypt certificates configured and valid
- [ ] Services bound to localhost only (127.0.0.1)
- [ ] No direct port exposure (except metrics-api:8080 for POST requests)
- [ ] Pushgateway is internal-only (no nginx entry)

## Access Control

- [ ] Only necessary users have access
- [ ] Unused accounts removed
- [ ] Access logs monitored regularly
- [ ] Failed authentication attempts reviewed

## Maintenance

- [ ] Regular password rotation (every 90 days)
- [ ] Software kept updated:
  - [ ] Prometheus image
  - [ ] Grafana image
  - [ ] Pushgateway image
  - [ ] Nginx
  - [ ] Docker
- [ ] Security advisories monitored
- [ ] Backup strategy implemented (see plan 04-backup-strategy.md)

## Testing

- [ ] Authentication works for both Grafana and Prometheus
- [ ] Rate limiting prevents brute force attacks
- [ ] Anonymous access is blocked
- [ ] Direct port access is blocked (except metrics-api)
- [ ] HTTPS redirects work correctly
- [ ] WebSocket support works for Grafana

## Documentation

- [ ] `SECURITY.md` is up to date
- [ ] `NGINX_CONFIGURATION.md` is up to date
- [ ] Password generation script documented
- [ ] Authentication management scripts documented

## Incident Response

- [ ] Access logs location known: `/var/log/nginx/`
- [ ] Procedure for revoking access documented
- [ ] Procedure for rotating credentials documented
- [ ] Emergency contact information available

## Notes

- Review this checklist monthly
- Update passwords quarterly
- Review access logs weekly for suspicious activity
- Keep security documentation synchronized with implementation
