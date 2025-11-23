#!/bin/bash
# Deployment Script for Metrics Tracking
# Run this on your LOCAL machine (not the server)

echo "=== Metrics Tracking - Deployment Script ==="
echo ""
echo "This script will help you deploy the updated portfolio with metrics tracking."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Verify local build${NC}"
if [ -f "apps/portfolio-simple/dist/index.html" ]; then
    echo -e "${GREEN}✓ Build files found${NC}"
    ls -lh apps/portfolio-simple/dist/assets/ | grep index
else
    echo -e "${YELLOW}⚠ Build not found. Building now...${NC}"
    cd apps/portfolio-simple
    VITE_METRICS_ENABLED=true \
    VITE_METRICS_API_URL=https://entazis.dev/api/track \
    VITE_METRICS_DEBUG=true \
    npm run build
    cd ../..
fi

echo ""
echo -e "${BLUE}Step 2: Copy to server${NC}"
echo "Choose deployment method:"
echo "  1) rsync (recommended)"
echo "  2) Git pull on server"
echo ""
read -p "Enter choice [1-2]: " choice

if [ "$choice" == "1" ]; then
    read -p "Enter server user@host (e.g., user@entazis.dev): " server
    echo -e "${YELLOW}Running rsync...${NC}"
    rsync -avz --delete \
        apps/portfolio-simple/dist/ \
        "$server:/var/www/portfolio/apps/portfolio-simple/dist/"
    echo -e "${GREEN}✓ Files copied${NC}"
elif [ "$choice" == "2" ]; then
    echo ""
    echo -e "${YELLOW}Run these commands on your server:${NC}"
    echo ""
    echo "cd /var/www/portfolio"
    echo "git pull"
    echo "cd apps/portfolio-simple"
    echo "npm run build"
    echo ""
    echo -e "${BLUE}Press Enter when done...${NC}"
    read
fi

echo ""
echo -e "${BLUE}Step 3: Verify deployment${NC}"
echo ""
echo "1. Open browser: https://entazis.dev"
echo "2. Open DevTools Console (F12)"
echo "3. Look for [Metrics] logs"
echo ""
echo -e "${GREEN}Expected output:${NC}"
echo "  [Metrics] Service initialized"
echo "  [Metrics] Config: {enabled: true, ...}"
echo "  [Metrics] Tracking page visit: /"
echo "  [Metrics] Flushing metrics..."
echo ""
echo "4. Check Network tab for POST to /api/track (should be 200 OK)"
echo ""
echo -e "${BLUE}Step 4: Check Pushgateway (on server)${NC}"
echo ""
echo -e "${YELLOW}SSH to server and run:${NC}"
echo "  curl http://localhost:9091/metrics | grep web_page_visits_total"
echo ""
echo -e "${GREEN}Expected: Should show counter with value > 0${NC}"
echo ""
echo -e "${BLUE}Step 5: Check Grafana${NC}"
echo ""
echo "Visit: https://grafana.entazis.dev"
echo "Dashboard: Website Visitors"
echo "Time range: Last 15 minutes"
echo ""
echo -e "${GREEN}Expected: Should show visit counts increasing${NC}"
echo ""
echo "=== Deployment Complete! ==="
echo ""
echo "📝 For detailed troubleshooting, see: METRICS_IMPLEMENTATION_COMPLETE.md"

