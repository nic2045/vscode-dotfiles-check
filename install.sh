#!/bin/bash
# Install vscode-dotfiles-check extension locally

set -e

EXTENSION_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION=$(grep '"version"' "$EXTENSION_DIR/package.json" | head -1 | sed 's/.*"\([^"]*\)".*/\1/')

if [ -z "$VERSION" ]; then
  echo "Could not read version from package.json"
  exit 1
fi

VSCODE_EXTENSIONS_DIR=~/.vscode/extensions
mkdir -p "$VSCODE_EXTENSIONS_DIR"

LINK_TARGET="$VSCODE_EXTENSIONS_DIR/nico.dotfiles-check-$VERSION"

if [ -e "$LINK_TARGET" ]; then
  echo "$LINK_TARGET already exists"
  read -p "Overwrite? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipped"
    exit 0
  fi
  rm -rf "$LINK_TARGET"
fi

ln -sf "$EXTENSION_DIR" "$LINK_TARGET" && echo "Extension installed (v$VERSION)" || echo "Failed to create symlink"
echo ""
echo "Restart VSCode to activate the extension."
