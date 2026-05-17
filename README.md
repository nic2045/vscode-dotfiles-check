# vscode-dotfiles-check

[![CI](https://github.com/nic2045/vscode-dotfiles-check/actions/workflows/ci.yml/badge.svg)](https://github.com/nic2045/vscode-dotfiles-check/actions/workflows/ci.yml)
[![Release](https://github.com/nic2045/vscode-dotfiles-check/actions/workflows/release-please.yml/badge.svg)](https://github.com/nic2045/vscode-dotfiles-check/actions/workflows/release-please.yml)
[![Latest release](https://img.shields.io/github/v/release/nic2045/vscode-dotfiles-check?display_name=tag&sort=semver)](https://github.com/nic2045/vscode-dotfiles-check/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://www.conventionalcommits.org/)

## Why

Personal toolchain to keep Claude Code instructions (`CLAUDE.md`) consistent
across all of my own repositories without ever editing or copying them by hand.
A central `dotfiles` repo holds one Markdown file per project; the extension
makes sure every project's `CLAUDE.md` is a symlink into that store, that the
store is up to date on every machine, and that links never leak into clones of
public repos.

Built for one user (me). Not on the Marketplace, install from source.

## What it does

- **Auto-fix** on workspace open: silently creates the `CLAUDE.md` symlink
  pointing to `../dotfiles/claude/projects/<repo>.md`. If the target file
  doesn't exist yet, it is created from a template and committed + pushed to
  the dotfiles repo.
- **Repo gate**: only runs on git repositories owned by an allowed GitHub
  user/org (configurable, default `nic2045`), only at the repo root, and only
  if the repo has at least one commit. External / scratch / empty repos are
  silently ignored.
- **Leak protection**: adds `CLAUDE.md` to the project's `.gitignore` and
  untracks it if it was previously committed, so clones never carry a broken
  symlink into someone else's `../dotfiles/`.
- **Periodic sync**: `git fetch` + `git pull` on the dotfiles repo every 6
  hours (stashes local changes first). Push retries once on race conditions.
- **Status bar** for current state, **output channel** "Dotfiles Check" for
  detailed logs.

## Installation

```bash
git clone git@github.com:nic2045/vscode-dotfiles-check.git ~/Coding/vscode-dotfiles-check
bash ~/Coding/vscode-dotfiles-check/install.sh
```

`install.sh` symlinks the repo into `~/.vscode/extensions/nico.dotfiles-check-<version>/`.
Restart VS Code afterwards. Requires the companion
[dotfiles](https://github.com/nic2045/dotfiles) repo to be cloned next to your
projects (`~/Coding/dotfiles` or `~/Documents/Coding/dotfiles`).

## Commands

| Command | ID |
| --- | --- |
| Verify Dotfiles Setup | `dotfiles-check.verify` |
| Dotfiles: Sync Now | `dotfiles-check.sync` |

## Settings

| Setting | Default | Purpose |
| --- | --- | --- |
| `dotfiles-check.allowedOwners` | `["nic2045"]` | Git remote owners whose repos the extension acts on. Add work orgs here. |

## Releases

Managed by [release-please](https://github.com/googleapis/release-please).
Use [Conventional Commits](https://www.conventionalcommits.org/) on `main`
(`feat:`, `fix:`, `feat!:` ...) and a release PR will be opened that bumps
`package.json` and updates `CHANGELOG.md`. Merging the release PR creates the
`vX.Y.Z` tag and GitHub release.

## License

MIT
