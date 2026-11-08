#!/usr/bin/env bash
set -euo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
if ! command -v python3 >/dev/null 2>&1; then
  echo 'Necesitas Python 3. En Linux Mint: sudo apt install python3' >&2
  exit 1
fi
exec python3 launch.py
