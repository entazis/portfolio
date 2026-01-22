## Pushgateway lifecycle management

### Why this matters
- **Pushgateway keeps metrics until deleted**. This is convenient for push-based workflows but can accumulate stale series.
- This stack pushes under a grouping key so you can delete a specific group safely without wiping everything.

### Grouping keys used by `metrics-api`

`metrics-api` pushes to:

- `job="web_metrics"`
- `env="<ENVIRONMENT>"`
- `instance="<INSTANCE_ID>"`

Push URL shape:

- `POST /metrics/job/web_metrics/env/<env>/instance/<instance>`

### Default labels added by `metrics-api`

Every ingested metric is enriched with:
- `env`: `ENVIRONMENT` (default: `prod`)
- `instance`: `INSTANCE_ID` (default: container hostname)
- `site`: injected from request body if missing in metric labels

### Cleanup (delete a single env/instance group)

Use the provided script:

```bash
cd /var/www/portfolio/apps/monitoring
./scripts/cleanup-pushgateway.sh --job web_metrics --env prod --instance metrics-api-1
```

### Cleanup (delete ALL series for a job)

This is destructive. Prefer deleting a single env/instance group.

```bash
cd /var/www/portfolio/apps/monitoring
./scripts/cleanup-pushgateway.sh --job web_metrics --all
```

