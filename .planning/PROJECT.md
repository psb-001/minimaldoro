# Countdown

## What This Is

A desktop countdown widget application built with Electron and Svelte 5 that helps users track important events (birthdays, deadlines, holidays, etc.). Users create events with dates, colors, and reminder notifications, view them in a sleek glass-morphism UI, and pin desktop widgets that show the countdown in days.

## Core Value

Provide an elegant, always-visible countdown experience that keeps users informed of upcoming events at a glance — both in-app and via persistent desktop widgets.

## Requirements

### Validated

- **Event CRUD**: Users can create, view, edit, and delete events with title, date, color, and reminder settings
- **Countdown display**: Events show remaining days with Playfair Display typography
- **Tab filtering**: All / Upcoming / Celebrated tab views
- **Celebrate marking**: Events can be marked as celebrated, showing a checkmark badge
- **Desktop widgets**: Pinned transparent windows that float on the desktop showing the next event's countdown
- **Desktop notifications**: Scheduled reminders based on user-configured timing (2h/3h/6h/1d before)
- **Persistent storage**: SQLite via better-sqlite3, stored in Electron's userData directory
- **Custom color picker**: 6 color swatches per event with visual selection
- **Custom frameless window**: Transparent window with drag regions, minimize/close via custom titlebar

### Active

- No active development phase — project is in initial state awaiting first milestone

### Out of Scope

- **Mobile/Web versions**: Desktop-only Electron app; no React Native or PWA planned
- **User accounts / sync**: No cloud sync, authentication, or multi-device support
- **Repeating events**: Events are single-date only; no recurrence patterns
- **Time-of-day support**: Events are date-based only (no hour/minute precision)
- **Multi-language**: English-only UI
- **Widget customization**: No font/color/size configuration for widgets beyond current defaults

## Context

### Technical Environment

- **Runtime**: Electron 33 + Node.js via Electron's bundled runtime
- **Frontend**: Svelte 5 (with `$state`, `$derived`, `$effect` runes), Vite 6 bundler
- **Styling**: Tailwind CSS 3.4 + custom PostCSS, with glass-morphism aesthetics
- **Database**: better-sqlite3 (native module, compiled via electron-rebuild)
- **IPC**: Electron contextBridge + ipcRenderer/ipcMain for renderer-to-main communication
- **Fonts**: Playfair Display (serif display numbers), Inter (UI sans-serif) via Google Fonts
- **OS**: Cross-platform (Windows, macOS, Linux) via Electron

### Architecture

- **Main process** (`electron/main.js`): Window management, IPC handlers, notification scheduler, widget window management
- **Preload** (`electron/preload.js`): Context bridge exposing `window.api` methods
- **Renderer** (`src/`): Svelte app with components, stores, icons, and IPC wrapper module
- **Database** (`electron/db.js`): SQLite schema (events + widgets tables), CRUD operations, WAL mode

### Known Issues

- No dedicated test suite exists
- Widget window positions may desync on multi-monitor setups
- No error boundary handling for IPC failures in renderer
- Reminder scheduler uses polling (60s interval) rather than native OS scheduling

## Constraints

| Constraint | Rationale |
|---|---|
| **Electron + Svelte** | Existing stack; no migration budget |
| **better-sqlite3** | Already integrated; requires native rebuild per platform |
| **No cloud services** | Self-contained desktop app; no backend infrastructure |
| **Single-user** | Local-only; no auth or multi-user support |
| **Windows target** | Primary development platform; macOS/Linux secondary |

## Key Decisions

| Decision | Rationale | Status |
|---|---|---|
| **Svelte 5 runes** | Modern reactive primitives ($state, $derived, $effect) | Good |
| **better-sqlite3** | Synchronous API, fast, no ORM overhead | Good |
| **Transparent frameless window** | Native-feeling glass UI with custom chrome | Good |
| **Polling for notifications** | Simple implementation; acceptable for desktop app | Revisit |
| **CSS grid for cards** | 3-column responsive grid matches design mockups | Good |

## Last Updated

- **Date**: 2026-06-14
- **Trigger**: Initial project setup with GSD infrastructure
