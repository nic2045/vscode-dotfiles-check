# vscode-dotfiles-check

Keep your dotfiles synced automatically. Background sync every 6 hours.

## Features

- **Auto-sync**: Every 6 hours, fetch and pull dotfiles from GitHub
- **Status bar**: Shows sync status (up-to-date, behind, error)
- **Manual sync**: Click status bar or run "Dotfiles: Sync Now"
- **Conflict handling**: Auto-stash local changes before pull
- **Logging**: View output in VSCode's "Dotfiles Check" channel
- **Notifications**: Toast messages on sync success/failure

## Installation

### From source (development)

```bash
git clone git@github.com:nic2045/vscode-dotfiles-check.git ~/Coding/vscode-dotfiles-check
bash ~/Coding/vscode-dotfiles-check/install.sh
```

### From VSCode Marketplace (when published)

```
VSCode Extensions → Search "Dotfiles Check" → Install
```

### Manual linking

```bash
mkdir -p ~/.vscode/extensions
VERSION=$(grep '"version"' ~/Coding/vscode-dotfiles-check/package.json | sed 's/.*"\([^"]*\)".*/\1/')
ln -sf ~/Coding/vscode-dotfiles-check ~/.vscode/extensions/nico.dotfiles-check-$VERSION
```

## Usage

1. Open VSCode
2. Extension activates automatically on startup
3. Status bar shows sync status (left side)
4. Click status bar to sync manually anytime
5. Check "Dotfiles Check" output channel for logs

## Configuration

Currently hardcoded to sync `~/Coding/dotfiles`. To use with different path:

Edit `extension.js` line ~20:
```javascript
const dotfilesPath = path.join(process.env.HOME, 'Coding', 'dotfiles');
```

Change to your path.

## How it works

- VSCode startup → extension activates
- Background task: every 6 hours
  1. Fetch origin/main
  2. Check if local is behind
  3. Auto-stash local changes
  4. Pull if behind
  5. Update status bar + log
- User can click status bar or run command to sync immediately

## Contributing

Make changes to `extension.js` and test locally. Increment version in `package.json` before release.

## License

MIT
