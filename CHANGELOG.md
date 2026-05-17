# Changelog

## [1.4.0](https://github.com/nic2045/vscode-dotfiles-check/compare/v1.3.0...v1.4.0) (2026-05-17)


### Features

* auto-commit and push new projects to dotfiles ([331db14](https://github.com/nic2045/vscode-dotfiles-check/commit/331db14742e01b508371d1290d1d09bcf44bbf11))
* auto-sync new projects to dotfiles repo ([307420c](https://github.com/nic2045/vscode-dotfiles-check/commit/307420c1dbaffb444c987b5e070d1f14e3c9a5c6))
* polish manifest, allowedOwners setting, CI validation ([0260658](https://github.com/nic2045/vscode-dotfiles-check/commit/02606587dbcbf203a584d8a2aa72897995b2dad4))
* polish manifest, expose allowedOwners as setting, add CI ([2a604a4](https://github.com/nic2045/vscode-dotfiles-check/commit/2a604a49f85313d877217db11994cbff61eb8fc2))
* restore extension manifest and add release-please ([4be58b8](https://github.com/nic2045/vscode-dotfiles-check/commit/4be58b8e932b1a69a3f18c15a00378ce9d154bd6))
* silent auto-fix and keep dotfiles refs out of cloned repos ([e379233](https://github.com/nic2045/vscode-dotfiles-check/commit/e379233ae615396fe296484b40fc8b739517de99))
* silent auto-fix and keep dotfiles refs out of cloned repos ([5dab6f2](https://github.com/nic2045/vscode-dotfiles-check/commit/5dab6f289b8f8fc15b5248ec3f5639952f113ee0))

## [1.3.0] - 2026-05-17

### Added
- `ALLOWED_GIT_OWNERS` gate: dotfiles check only runs on git repos whose
  `remote.origin.url` belongs to an allowed owner (`nic2045`) and only at the
  repo root. Arbitrary folders and third-party repos are silently ignored.
- `release-please` workflow for automated versioning and changelog.

### Changed
- README rewritten to describe the extension instead of the dotfiles repo.

## [1.2.2] - 2026-05-15

### Fixed
- After successful Fix, offer "Reload Window" so Claude Code reads the new
  CLAUDE.md immediately.

## [1.2.1] - 2026-05-15

### Fixed
- Notification text now clearly names the project and explains the expected
  symlink target.
- Fix action no longer opens a terminal — uses Node.js `fs` directly, so verify
  re-runs immediately after.

## [1.2.0] - 2026-05-15

### Added
- Check on startup whether the current project has a valid `CLAUDE.md` symlink
  pointing to `dotfiles/claude/projects/<project>.md`.
- Warning notification with "Fix" action: creates the symlink and target file
  in dotfiles if missing.
- Status bar shows `CLAUDE.md missing` when the check fails.

## [1.1.0]

### Changed
- Replaced `simple-git` dependency with native `git` via `execFile`.

## [1.0.0]

### Added
- Initial release: dotfiles existence check and periodic sync.
