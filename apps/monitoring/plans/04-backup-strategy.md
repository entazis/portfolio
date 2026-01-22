# Plan: Persist & Backup Strategy

## Overview
Implement a comprehensive backup strategy for Grafana data (dashboards, users, API keys) and document backup procedures for all monitoring stack components.

## Current State
- Docker volumes exist: `prometheus_data`, `grafana_data`, `metrics_api_data`
- No documented backup procedure
- No automated backup mechanism
- Prometheus retention: 15 days (acceptable for current use case)

## Target State
- Automated backups for Grafana data
- Documented backup/restore procedures
- Backup verification mechanism
- Optional: Backup retention policy
- Optional: Remote backup storage

## Implementation Steps

### 1. Create Backup Directory Structure

**Action:** Create backup directory
```bash
mkdir -p /var/backups/monitoring
mkdir -p /var/backups/monitoring/grafana
mkdir -p /var/backups/monitoring/prometheus
mkdir -p /var/backups/monitoring/metrics-api
```

**Permissions:**
```bash
sudo chown -R $USER:$USER /var/backups/monitoring
chmod 755 /var/backups/monitoring
```

### 2. Create Grafana Backup Script

**File:** `scripts/backup-grafana.sh`

**Content:**
```bash
#!/bin/bash
# Backup Grafana data volume

set -e

BACKUP_DIR="/var/backups/monitoring/grafana"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/grafana_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=30

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Get Grafana container name
GRAFANA_CONTAINER=$(docker ps --filter "name=monitoring.*grafana" --format "{{.Names}}" | head -1)

if [ -z "$GRAFANA_CONTAINER" ]; then
    echo "Error: Grafana container not found"
    exit 1
fi

# Create backup
echo "Creating Grafana backup..."
docker exec "$GRAFANA_CONTAINER" tar czf /tmp/grafana_backup.tar.gz -C /var/lib/grafana .
docker cp "$GRAFANA_CONTAINER:/tmp/grafana_backup.tar.gz" "$BACKUP_FILE"
docker exec "$GRAFANA_CONTAINER" rm /tmp/grafana_backup.tar.gz

# Verify backup
if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "Backup created successfully: $BACKUP_FILE"
    echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "Error: Backup file is missing or empty"
    exit 1
fi

# Clean up old backups (older than RETENTION_DAYS)
find "${BACKUP_DIR}" -name "grafana_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
echo "Cleaned up backups older than ${RETENTION_DAYS} days"

echo "Backup completed successfully"
```

**Make executable:**
```bash
chmod +x scripts/backup-grafana.sh
```

### 3. Create Grafana Restore Script

**File:** `scripts/restore-grafana.sh`

**Content:**
```bash
#!/bin/bash
# Restore Grafana data from backup

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 <backup_file.tar.gz>"
    echo "Example: $0 /var/backups/monitoring/grafana/grafana_backup_20240101_120000.tar.gz"
    exit 1
fi

BACKUP_FILE="$1"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Get Grafana container name
GRAFANA_CONTAINER=$(docker ps --filter "name=monitoring.*grafana" --format "{{.Names}}" | head -1)

if [ -z "$GRAFANA_CONTAINER" ]; then
    echo "Error: Grafana container not found"
    exit 1
fi

# Confirm restore
read -p "This will overwrite current Grafana data. Continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Stop Grafana (optional, but recommended)
echo "Stopping Grafana..."
docker-compose -f /var/www/portfolio/apps/monitoring/docker-compose.yml stop grafana

# Copy backup to container
echo "Copying backup to container..."
docker cp "$BACKUP_FILE" "$GRAFANA_CONTAINER:/tmp/grafana_restore.tar.gz"

# Extract backup
echo "Extracting backup..."
docker exec "$GRAFANA_CONTAINER" sh -c "cd /var/lib/grafana && rm -rf * && tar xzf /tmp/grafana_restore.tar.gz"
docker exec "$GRAFANA_CONTAINER" rm /tmp/grafana_restore.tar.gz

# Fix permissions
echo "Fixing permissions..."
docker exec "$GRAFANA_CONTAINER" chown -R grafana:grafana /var/lib/grafana

# Start Grafana
echo "Starting Grafana..."
docker-compose -f /var/www/portfolio/apps/monitoring/docker-compose.yml start grafana

echo "Restore completed. Grafana should be accessible shortly."
```

**Make executable:**
```bash
chmod +x scripts/restore-grafana.sh
```

### 4. Create Prometheus Backup Script (Optional)

**File:** `scripts/backup-prometheus.sh`

**Note:** Prometheus data is less critical (15-day retention), but useful for disaster recovery.

**Content:**
```bash
#!/bin/bash
# Backup Prometheus data volume (optional)

set -e

BACKUP_DIR="/var/backups/monitoring/prometheus"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/prometheus_backup_${TIMESTAMP}.tar.gz"
RETENTION_DAYS=7  # Shorter retention for Prometheus

mkdir -p "${BACKUP_DIR}"

# Get Prometheus container name
PROMETHEUS_CONTAINER=$(docker ps --filter "name=monitoring.*prometheus" --format "{{.Names}}" | head -1)

if [ -z "$PROMETHEUS_CONTAINER" ]; then
    echo "Error: Prometheus container not found"
    exit 1
fi

echo "Creating Prometheus backup..."
docker exec "$PROMETHEUS_CONTAINER" tar czf /tmp/prometheus_backup.tar.gz -C /prometheus .
docker cp "$PROMETHEUS_CONTAINER:/tmp/prometheus_backup.tar.gz" "$BACKUP_FILE"
docker exec "$PROMETHEUS_CONTAINER" rm /tmp/prometheus_backup.tar.gz

if [ -f "$BACKUP_FILE" ] && [ -s "$BACKUP_FILE" ]; then
    echo "Backup created: $BACKUP_FILE"
    find "${BACKUP_DIR}" -name "prometheus_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
else
    echo "Error: Backup failed"
    exit 1
fi
```

### 5. Create Combined Backup Script

**File:** `scripts/backup-all.sh`

**Content:**
```bash
#!/bin/bash
# Backup all monitoring components

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MONITORING_DIR="$(dirname "$SCRIPT_DIR")"

cd "$MONITORING_DIR"

echo "Starting full monitoring backup..."
./scripts/backup-grafana.sh
./scripts/backup-prometheus.sh  # Optional

echo "Full backup completed"
```

### 6. Set Up Automated Backups (Cron)

**Option A: Systemd Timer (Recommended for systemd systems)**

**File:** `/etc/systemd/system/monitoring-backup.timer`
```ini
[Unit]
Description=Run monitoring backup daily
Requires=monitoring-backup.service

[Timer]
OnCalendar=daily
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

**File:** `/etc/systemd/system/monitoring-backup.service`
```ini
[Unit]
Description=Monitoring Stack Backup
After=docker.service

[Service]
Type=oneshot
User=your-user
WorkingDirectory=/var/www/portfolio/apps/monitoring
ExecStart=/var/www/portfolio/apps/monitoring/scripts/backup-all.sh
```

**Enable:**
```bash
sudo systemctl enable monitoring-backup.timer
sudo systemctl start monitoring-backup.timer
```

**Option B: Cron Job**
```bash
# Add to crontab: crontab -e
0 2 * * * /var/www/portfolio/apps/monitoring/scripts/backup-all.sh >> /var/log/monitoring-backup.log 2>&1
```

### 7. Create Backup Documentation

**File:** `BACKUP.md`

**Content:**
- Backup procedures
- Restore procedures
- Backup schedule
- Backup location
- Retention policy
- Verification steps
- Troubleshooting

### 8. Optional: Remote Backup Storage

**Options:**
- S3-compatible storage (AWS S3, MinIO, etc.)
- rsync to remote server
- Cloud storage (Google Drive, Dropbox via rclone)

**Example S3 backup addition:**
```bash
# Add to backup-grafana.sh after local backup
aws s3 cp "$BACKUP_FILE" "s3://your-bucket/monitoring/grafana/"
```

## Testing

### 1. Test Backup
```bash
./scripts/backup-grafana.sh
ls -lh /var/backups/monitoring/grafana/
```

### 2. Test Restore (on test environment)
```bash
# Create test Grafana container
# Restore backup
./scripts/restore-grafana.sh /var/backups/monitoring/grafana/grafana_backup_*.tar.gz
# Verify data is restored
```

### 3. Verify Automated Backups
- Wait for scheduled backup
- Check backup directory
- Verify backup file exists and is recent

## Files to Create
- `scripts/backup-grafana.sh` - Grafana backup script
- `scripts/restore-grafana.sh` - Grafana restore script
- `scripts/backup-prometheus.sh` - Prometheus backup script (optional)
- `scripts/backup-all.sh` - Combined backup script
- `BACKUP.md` - Backup documentation
- Systemd timer/service files (if using systemd)

## Dependencies
- Docker must be running
- Sufficient disk space for backups
- Write permissions to backup directory
- Systemd or cron for automation

## Rollback Plan
- Remove cron jobs or systemd timers
- Delete backup scripts
- No impact on running services

## Considerations
- **Backup Frequency:** Daily is recommended for Grafana
- **Retention:** 30 days for Grafana, 7 days for Prometheus
- **Storage:** Monitor disk usage
- **Verification:** Regularly test restore procedure
- **Security:** Encrypt backups if containing sensitive data

## Testing Checklist
- [ ] Backup scripts created and executable
- [ ] Manual backup works
- [ ] Backup files are created correctly
- [ ] Restore script works (test environment)
- [ ] Automated backup scheduled (cron/systemd)
- [ ] Backup retention works (old backups deleted)
- [ ] Documentation complete
- [ ] Remote backup configured (if applicable)
