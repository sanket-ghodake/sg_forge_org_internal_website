#!/usr/bin/env bash
# ==============================================================================
# SG Forge - 24/7 Production Systemd Service Installer (Linux / Ubuntu)
# Configures SG Forge to automatically start at boot and recover across reboots.
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SERVICE_NAME="sg-forge.service"
TARGET_PATH="/etc/systemd/system/$SERVICE_NAME"

echo "🚀 Installing SG Forge 24/7 Host Service..."

if [ "$EUID" -ne 0 ]; then
  echo "⚠️  This installer requires root privileges. Re-running with sudo..."
  exec sudo bash "$0" "$@"
fi

# 1. Generate customized service unit with actual repo path
sed "s|WorkingDirectory=.*|WorkingDirectory=$REPO_ROOT|" "$SCRIPT_DIR/$SERVICE_NAME" > "$TARGET_PATH"
chmod 644 "$TARGET_PATH"

# 2. Reload systemd daemon
systemctl daemon-reload

# 3. Enable service on boot
systemctl enable "$SERVICE_NAME"

echo "✅ $SERVICE_NAME successfully registered and enabled on system boot."
echo "💡 Commands:"
echo "   Start now : sudo systemctl start $SERVICE_NAME"
echo "   Status    : sudo systemctl status $SERVICE_NAME"
echo "   Stop      : sudo systemctl stop $SERVICE_NAME"
