# Changelog

All notable changes to Minimaldoro will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2026-07-04

### Fixed
- CI/CD: replaced unavailable `andelf/delete-release-asset` action with `gh` CLI script
- CI/CD: added `--publish never` to electron-builder to fix `GH_TOKEN` missing error on tag builds
- CI/CD: simplified workflow — removed Chocolatey install, added build verification step

## [1.0.1] - 2026-07-04

### Fixed
- CI/CD: fixed `buildResources` path, split Vite/Electron build steps, added build output verification

## [1.0.0] - 2026-07-04

### Fixed
- App not reopening after close — window now properly shows when relaunched from desktop or Start Menu

### Changed
- Updated app icon to new logo.ico across all platforms and build configs
- Bumped version to 1.0.0 for stable release

## [0.1.0] - 2026-07-02

### Added
- Initial public release
- Event creation, editing, and deletion with custom colors and reminders
- Desktop widgets — pin events to desktop as resizable, always-on-top windows
- System tray icon with quick actions (Open, Auto-start toggle, Quit)
- Native Windows notifications for upcoming events
- Auto-start on login (enabled by default)
- Widget persistence across reboots
- Context menu for widgets (right-click to unpin)
- First-run consent flow with Terms & Conditions and Privacy Policy
- About modal with version info, privacy policy, and terms tabs
- Footer links for quick access to About, Privacy, and Terms
- Dynamic app version display from package.json
- Auto-updater configured for GitHub Releases
- GitHub Actions CI/CD pipeline for Windows installer builds

### Changed
- Widget redesigned with left accent bar, clean white background, and event-color countdown
- Event cards styled with card-like buttons, borders, and hover states
- Tabs restyled as pill buttons with active fill state
- Topbar buttons given frosted-glass card treatment
- App shell given subtle dot-grid background texture
- Pin button on cards shows solid filled icon when event is pinned

### Fixed
- Widget stretching and oversized countdown typography
- Invisible card action buttons — now always visible with proper hover states
- About modal prop declaration for Svelte 5 runes mode compatibility
- Auto-updater feed URL configuration for GitHub Releases

### Known Limitations
- Windows-only (macOS/Linux not yet supported)
- No code signing — Windows SmartScreen may show warnings on first install
- No theme support (dark/light mode)
- No export/import for events
- No celebration animations
