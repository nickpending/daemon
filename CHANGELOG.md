# Changelog

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) + [SemVer](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

## [2.0.0] - 2026-01-10

Build-time parser for single source of truth - dashboard and MCP server now derive from the same `daemon.md` file.

### Added
- `[upstream]` Build-time parser (`scripts/parse-daemon.ts`) generates TypeScript from `daemon.md`
- `[upstream]` Type definitions (`src/types/daemon.types.ts`) for parsed data
- `[upstream]` Architecture documentation (`docs/ARCHITECTURE.md`) with data flow diagrams
- `[upstream]` README links to architecture docs

### Changed
- `[upstream]` Dashboard imports from generated data instead of hardcoded values
- `[upstream]` Hero component imports location from generated data
- `[local]` Astro config uses env var for allowed hosts (removes internal hostnames from repo)

### Removed
- `[upstream]` Hardcoded data in `DaemonDashboard.tsx` and `Hero.tsx`

## [1.2.0] - 2026-01-09

TELOS page customization and dev environment setup.

### Changed
- `[local]` /telos page content replaced with 0xsalt's TELOS framework
- `[local]` Dev server binds to 0.0.0.0 with allowedHosts for tailscale access
- `[local]` Backlog/changelog items tagged `[local]` vs `[upstream]`

## [1.1.0] - 2026-01-09

Identity customization and deployment configuration.

### Added
- Branching strategy documented in CLAUDE.md
- Roadmap: "daemon.md as single source of truth" for upstream contribution

### Changed
- Identity content replaced in daemon.md, DaemonDashboard.tsx, Hero.tsx, cms/telos.md
- Deployment configured for Cloudflare Pages (daemon.saltedkeys.io)
- API docs updated with placeholder URLs
- Branding updated to "The Context You Keep"

## [1.0.1] - 2026-01-09

Fork setup and documentation.

### Added
- Architecture decision records (ADR-001)
- Project standards in CLAUDE.md
- Backlog tracking (docs/BACKLOG.md)
- Roadmap placeholder (docs/ROADMAP.md)

### Changed
- Git remote points to 0xsalt/daemon fork
- Upstream tracked as separate remote

## [1.0.0] - 2026-01-09

Initial fork from [danielmiessler/Daemon](https://github.com/danielmiessler/Daemon).

Upstream had no releases; 1.0.0 establishes baseline. Includes Astro site, daemon.md identity format, dashboard, TELOS page, API docs, and Cloudflare Pages config.

See `docs/BACKLOG.md` for work items.

[Unreleased]: https://github.com/0xsalt/daemon/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/0xsalt/daemon/compare/v1.2.0...v2.0.0
[1.2.0]: https://github.com/0xsalt/daemon/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/0xsalt/daemon/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/0xsalt/daemon/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/0xsalt/daemon/releases/tag/v1.0.0
