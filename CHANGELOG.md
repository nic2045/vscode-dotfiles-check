# Changelog

## [1.6.2](https://github.com/nic2045/vscode-dotfiles-check/compare/v1.6.1...v1.6.2) (2026-05-17)


### Bug Fixes

* trigger CI on all pushes and fix automerge workflow syntax ([90d8f65](https://github.com/nic2045/vscode-dotfiles-check/commit/90d8f65c57a099cadd3d9b487efa8bf00129ee80))

## [1.6.1](https://github.com/nic2045/vscode-dotfiles-check/compare/v1.6.0...v1.6.1) (2026-05-17)


### Bug Fixes

* log extension version on activation for easier debugging ([deb4189](https://github.com/nic2045/vscode-dotfiles-check/commit/deb4189a1275a083380adf2475a90254957c216f))
* log extension version on activation for easier debugging ([6462617](https://github.com/nic2045/vscode-dotfiles-check/commit/6462617e67d9b8500dc077b14ea9f66da79f111a))

## [1.6.0](https://github.com/nic2045/vscode-dotfiles-check/compare/v1.5.0...v1.6.0) (2026-05-17)


### Features

* align with template-1 conventions and add icon ([0430529](https://github.com/nic2045/vscode-dotfiles-check/commit/0430529c399065de3b83280d987c35d76f72fa71))
* align with template-1 conventions, add icon ([b7432ce](https://github.com/nic2045/vscode-dotfiles-check/commit/b7432ce8534fed7a3f3d6610118b3ea30879def3))
* self-update extension from git on activation ([08f63c9](https://github.com/nic2045/vscode-dotfiles-check/commit/08f63c9e21740a76506d0e973f341adb6decb216))

## [1.5.0](https://github.com/nic2045/vscode-dotfiles-check/compare/v1.4.0...v1.5.0) (2026-05-17)


### Features

* auto-commit and push new projects to dotfiles ([4167c3d](https://github.com/nic2045/vscode-dotfiles-check/commit/4167c3dbb915690d2d6094aacec03fbbb7c31371))
* auto-sync new projects to dotfiles repo ([174a806](https://github.com/nic2045/vscode-dotfiles-check/commit/174a80669e75f00bf7d66c74661349f32e5c1514))
* polish manifest, allowedOwners setting, CI validation ([c6ee55f](https://github.com/nic2045/vscode-dotfiles-check/commit/c6ee55f705588b2b729cf7b855c68081ece19840))
* polish manifest, expose allowedOwners as setting, add CI ([39fdbc3](https://github.com/nic2045/vscode-dotfiles-check/commit/39fdbc3d0a9e9b598c1499c32f589a6806e05a51))
* restore extension manifest and add release-please ([ca44392](https://github.com/nic2045/vscode-dotfiles-check/commit/ca44392f8f75e3d06ea5e535c030e5ff0da004dd))
* silent auto-fix and keep dotfiles refs out of cloned repos ([0477dfa](https://github.com/nic2045/vscode-dotfiles-check/commit/0477dfaf888f1f04f8748ab0998f074060fbf3b2))
* silent auto-fix and keep dotfiles refs out of cloned repos ([909e7ce](https://github.com/nic2045/vscode-dotfiles-check/commit/909e7ce10a323961b10b7f7b18afb90caf8d022a))

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
