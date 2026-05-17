# vscode-dotfiles-check

VS Code extension that keeps a CLAUDE.md symlink in sync with your dotfiles repo
and periodically pulls dotfiles updates.

The check only runs for git repositories whose `remote.origin.url` belongs to an
allowed owner (currently `nic2045`) and only when the workspace is the repo
root. Other folders are silently ignored.

## Features

- **CLAUDE.md check** on workspace open: verifies that `CLAUDE.md` is a symlink
  to `../dotfiles/claude/projects/<repo>.md`. Offers a one-click "Fix".
- **Auto-sync** of `../dotfiles` every 6 hours (`git fetch` + `git pull`, stashes
  local changes first).
- **Status bar** with current state; click to re-verify.
- **Output channel** "Dotfiles Check" for logs.

## Installation

```bash
git clone git@github.com:nic2045/vscode-dotfiles-check.git ~/Coding/vscode-dotfiles-check
bash ~/Coding/vscode-dotfiles-check/install.sh
```

`install.sh` symlinks the repo into `~/.vscode/extensions/nico.dotfiles-check-<version>/`.
Restart VS Code afterwards.

## Commands

| Command | ID |
| --- | --- |
| Verify Dotfiles Setup | `dotfiles-check.verify` |
| Dotfiles: Sync Now | `dotfiles-check.sync` |

## Configuration

The dotfiles path is derived as `<parent-of-workspace>/dotfiles`. The allowed
git owners are hardcoded as `ALLOWED_GIT_OWNERS` at the top of `extension.js`.

## Releases

Releases are managed automatically by
[release-please](https://github.com/googleapis/release-please). Use
[Conventional Commits](https://www.conventionalcommits.org/) on `main`
(`feat:`, `fix:`, `feat!:` etc.) and a release PR will be opened that bumps
`package.json` and updates `CHANGELOG.md`. Merging the release PR creates the
`vX.Y.Z` tag and GitHub release.

## License

MIT
