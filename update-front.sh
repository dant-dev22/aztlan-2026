#!/bin/bash
# =============================================================
# Script de deploy para Aztlán 2026 (Next.js + PM2)
# Uso:  chmod +x update-front.sh && ./update-front.sh
# =============================================================

set -euo pipefail

# ---------- CONFIGURACIÓN (ajusta aquí si algo cambia) ----------
APP_NAME="react-ui-app"
PORT="3000"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"   # Auto-detecta: directorio donde vive este script
BRANCH="main"                                                # Cambia por "master" si usas master
HEALTHCHECK_URL="http://127.0.0.1:${PORT}/"
HEALTHCHECK_RETRIES=6
HEALTHCHECK_WAIT=5

# Colores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'

log()   { echo -e "${BLUE}[INFO]${NC}  $*"; }
ok()    { echo -e "${GREEN}[OK]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()   { echo -e "${RED}[ERROR]${NC} $*"; }

banner() {
  echo ""
  echo "====================================="
  echo "   Deploy Frontend Aztlán 2026"
  echo "====================================="
  echo " Proyecto : $PROJECT_DIR"
  echo " App PM2  : $APP_NAME"
  echo " Puerto   : $PORT"
  echo " Rama     : $BRANCH"
  echo "====================================="
  echo ""
}

# ---------- GUARDAR ESTADO ANTES DE EMPEZAR (para rollback) ----------
PREV_COMMIT=""
ROLLBACK_NEEDED=0

save_prev_state() {
  cd "$PROJECT_DIR"
  PREV_COMMIT=$(git rev-parse HEAD 2>/dev/null || echo "")
}

rollback() {
  err "Algo falló. Iniciando rollback..."
  if [ -n "$PREV_COMMIT" ] && [ "$ROLLBACK_NEEDED" -eq 1 ]; then
    warn "Revirtiendo a commit anterior: ${PREV_COMMIT:0:8}"
    cd "$PROJECT_DIR" || exit 1
    git reset --hard "$PREV_COMMIT" || true
    npm install || true
    npm run build || true
    if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
      pm2 restart "$APP_NAME" || true
    fi
    ok "Rollback completado. Revisa el estado manualmente."
  else
    warn "No hay commit previo guardado o el error fue antes del pull; sin rollback que hacer."
  fi
  exit 1
}

trap rollback ERR

# ---------- PASOS DEL DEPLOY ----------
banner

log "0. Comprobando herramientas necesarias..."
command -v git >/dev/null 2>&1 || { err "git no está instalado"; exit 1; }
command -v npm >/dev/null 2>&1 || { err "npm no está instalado"; exit 1; }
command -v pm2 >/dev/null 2>&1 || { err "pm2 no está instalado o no en PATH"; exit 1; }
ok "Todas las herramientas presentes."

log "1. Entrando a $PROJECT_DIR y guardando estado anterior..."
save_prev_state
ROLLBACK_NEEDED=1
log "Commit previo: ${PREV_COMMIT:0:8}"

log "2. Limpiando cambios locales (stash) y haciendo git pull ($BRANCH)..."
cd "$PROJECT_DIR"
git stash push -u -m "auto-stash pre-deploy $(date +%s)" >/dev/null 2>&1 || true
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"
ok "Código actualizado."

log "3. Instalando dependencias (npm ci = limpio, reproducible)..."
if [ -f "package-lock.json" ]; then
  npm ci
else
  warn "No hay package-lock.json; usando npm install"
  npm install
fi
ok "Dependencias instaladas."

log "4. Copiando .env.production a .env.local (si aplica)..."
if [ -f ".env.production" ] && [ ! -f ".env.local" ]; then
  cp .env.production .env.local
  ok ".env.production → .env.local"
fi

log "5. Build de Next.js (npm run build)..."
npm run build
ok "Build completado."

log "6. (Re)arrancando la app en PM2..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  log "Reiniciando app existente: $APP_NAME"
  pm2 restart "$APP_NAME"
else
  warn "App $APP_NAME no encontrada en PM2. Creando nueva..."
  pm2 start npm --name "$APP_NAME" -- start -- --port "$PORT"
fi
pm2 save
ok "App arrancada en PM2."

log "7. Healthcheck: esperando a que el servidor responda..."
attempt=1
while [ $attempt -le $HEALTHCHECK_RETRIES ]; do
  if curl -fsS --max-time 5 "$HEALTHCHECK_URL" >/dev/null 2>&1; then
    ok "Servidor respondiendo OK en ${HEALTHCHECK_URL} (intento ${attempt}/${HEALTHCHECK_RETRIES})"
    break
  fi
  warn "Intento ${attempt}/${HEALTHCHECK_RETRIES} falló. Esperando ${HEALTHCHECK_WAIT}s..."
  sleep "$HEALTHCHECK_WAIT"
  attempt=$((attempt + 1))
done

if [ $attempt -gt $HEALTHCHECK_RETRIES ]; then
  err "Healthcheck falló después de ${HEALTHCHECK_RETRIES} intentos."
  exit 1
fi

log "8. Estado de PM2..."
pm2 list | grep -E "(PM2|$APP_NAME|name|---)" || true
log "Respuesta HTTP local:"
curl -I --max-time 5 "$HEALTHCHECK_URL" 2>&1 | head -5 || true

echo ""
ok "✅ Deploy completado exitosamente."
echo ""
echo "Siguientes pasos (opcional):"
echo "  - Ver logs en vivo: pm2 logs $APP_NAME"
echo "  - Monitorear CPU/RAM: pm2 monit"
echo ""
