# Changelog

## [1.2.5] - 2026-05-17

### Changed
- Limit dotfiles check to git repositories owned by `nic2045` and only at the
  repo root. Arbitrary folders and third-party repos are silently ignored.

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
