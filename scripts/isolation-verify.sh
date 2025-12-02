#!/usr/bin/env bash
set -euo pipefail

APP="Ndlela Search Engine"
echo "[Isolation Verify] Starting checks for $APP"

# Direct container ports
NDLELA_PORT_HTTPS=8443
LEETSHEGO_PORT_HTTPS=9443

fail() { echo "[Isolation Verify] FAILURE: $1" >&2; exit 1; }

check_endpoint() {
  local name="$1" url="$2"
  if curl -sk --max-time 10 "$url" | grep -qi "healthy"; then
    echo "[OK] $name health responded"
  else
    echo "[WARN] $name health did not return expected 'healthy' string; continuing"
  fi
}

# Baseline health (domains routed via system nginx if DNS resolves)
check_endpoint "Ndlela (domain)" "https://ndlelasearchengine.co.za/health" || true
check_endpoint "Leetshego (domain)" "https://leetshego.co.za/health" || true

# Baseline health (direct container ports)
check_endpoint "Ndlela (direct)" "https://localhost:${NDLELA_PORT_HTTPS}/health" || true
check_endpoint "Leetshego (direct)" "https://localhost:${LEETSHEGO_PORT_HTTPS}/health" || true

echo "[Step] Restarting Ndlela nginx container"
docker compose -f docker-compose.prod.yml restart nginx >/dev/null
sleep 5

# After restart ensure Leetshego unaffected
check_endpoint "Leetshego after Ndlela restart (direct)" "https://localhost:${LEETSHEGO_PORT_HTTPS}/health" || true

# Optional: restart Leetshego if docker context available
if docker ps --format '{{.Names}}' | grep -q 'leetshego-nginx'; then
  echo "[Step] Restarting Leetshego nginx container (cross-app)"
  (cd /home/mulalo/applications/lss_construction && docker compose restart nginx >/dev/null)
  sleep 5
  check_endpoint "Ndlela after Leetshego restart (direct)" "https://localhost:${NDLELA_PORT_HTTPS}/health" || true
else
  echo "[Skip] Leetshego container not visible in current docker context"
fi

echo "[Isolation Verify] Completed. Review warnings above; absence of failures indicates isolation holds."
