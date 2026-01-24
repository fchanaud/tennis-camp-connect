#!/usr/bin/env bash
# Installs Stripe CLI into ./bin for local webhook forwarding.
# Run from project root:  npm run stripe:install   or   ./scripts/install-stripe-cli.sh

set -e

VERSION="1.34.0"
ARCH=$(uname -m)
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

case "$ARCH" in
  arm64|aarch64)
    SUFFIX="mac-os_arm64"
    ;;
  x86_64)
    SUFFIX="mac-os_x86_64"
    ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

TAR="stripe_${VERSION}_${SUFFIX}.tar.gz"
URL="https://github.com/stripe/stripe-cli/releases/download/v${VERSION}/${TAR}"

mkdir -p "$ROOT/bin"
echo "Downloading Stripe CLI v${VERSION} (${SUFFIX})..."
curl -sL "$URL" -o "$ROOT/bin/$TAR"
echo "Extracting..."
tar -xzf "$ROOT/bin/$TAR" -C "$ROOT/bin"
rm -f "$ROOT/bin/$TAR"
chmod +x "$ROOT/bin/stripe"
echo "Done. Stripe CLI installed at $ROOT/bin/stripe"
echo ""
echo "Next:"
echo "  1. npm run stripe:login     # one-time login"
echo "  2. npm run stripe:listen    # forward webhooks to localhost:3000"
