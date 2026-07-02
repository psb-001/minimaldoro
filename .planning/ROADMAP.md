# Roadmap

## Overview

| Milestone | Status |
|---|---|
| ✅ v1.0 — Countdown App | Shipped |
| 🚧 v1.1 — Widget & UI Overhaul | In progress |

---

## ✅ v1.0 — Countdown Desktop App *(Shipped)*

<details>
<summary>Click to expand — 4 phases, 18 plans</summary>

### Phase 1: Core App Shell & Event Management ✅
**Goal**: Build the main application window with event CRUD, grid display, and tabs.

| Plan | Description | Status |
|---|---|---|
| 1.1 | Initialize project scaffolding (Vite + Svelte 5 + Electron + Tailwind) | Complete |
| 1.2 | Set up SQLite database with events/widgets schema | Complete |
| 1.3 | Build Electron main process (window management, IPC, preload) | Complete |
| 1.4 | Build app shell (Topbar, Tabs, FooterBar components) | Complete |
| 1.5 | Build EventCard with countdown display | Complete |
| 1.6 | Build NewEventModal with form validation | Complete |
| 1.7 | Build AddCard and grid layout with empty state | Complete |
| 1.8 | Wire IPC for CRUD operations and state management | Complete |

### Phase 2: Notifications & Reminders ✅
**Goal**: Implement desktop notification scheduling with configurable reminder timing.

| Plan | Description | Status |
|---|---|---|
| 2.1 | Build notification scheduler in main process | Complete |
| 2.2 | Wire reminder select in FooterBar | Complete |

### Phase 3: Desktop Widgets ✅
**Goal**: Create persistent transparency-overlay widget windows pinned to the desktop.

| Plan | Description | Status |
|---|---|---|
| 3.1 | Build widget window creation and management | Complete |
| 3.2 | Build WidgetView component | Complete |
| 3.3 | Implement widget position persistence | Complete |
| 3.4 | Wire widget context menu (unpin) | Complete |

### Phase 4: Polish & Quality 📋
**Goal**: Testing, error handling, edge cases, and visual polish.

| Plan | Description | Status |
|---|---|---|
| 4.1 | Add error boundary handling for IPC failures | Pending |
| 4.2 | Add unit tests for core logic | Pending |
| 4.3 | Multi-monitor widget position handling | Pending |
| 4.4 | Visual QA and accessibility pass | Pending |

</details>

---

## 🚧 v1.1 — Widget & UI Overhaul

### Milestone Goal
Clean up the app shell (remove footer, simplify topbar, remove reminder from modal) and redesign the desktop widget to incorporate event colors and improve layout.

### Phase 1: App Shell Cleanup ✅
**Goal**: Remove FooterBar, simplify Topbar, remove reminder from modal, fix updateEvent fallback.
**Requirements**: From widget-ui-overhaul-spec.md §2.2

| Plan | Description | Status |
|---|---|---|
| 1.1 | Remove FooterBar import, usage, and clean up `remindBefore` state | Complete |
| 1.2 | Simplify Topbar: remove wordmark + dot, keep controls + New event | Complete |
| 1.3 | Remove reminder field from NewEventModal | Complete |
| 1.4 | Add reminder fallback to `updateEvent` in db.js | Complete |
| 1.5 | Delete orphaned FooterBar.svelte | Complete |

### Phase 2: Widget Redesign 📋
**Goal**: Redesign WidgetView to incorporate event colors and improve visual hierarchy.
**Dependencies**: Phase 1
**Requirements**: From widget-ui-overhaul-spec.md §2.1

| Plan | Description | Status |
|---|---|---|
| 2.1 | Incorporate event color into widget design (accent strip, background tint, or colored number) | Pending |
| 2.2 | Improve widget layout/spacing/typography hierarchy | Pending |
| 2.3 | Polish glass effect, shadows, and overall visual quality | Pending |
| 2.4 | Build and verify across different desktop backgrounds | Pending |

### Phase 3: Polish & Edge Cases 📋
**Goal**: Final visual QA, edge case handling, and documentation updates.
**Dependencies**: Phase 2

| Plan | Description | Status |
|---|---|---|
| 3.1 | Test widget on light, dark, and busy desktop backgrounds | Pending |
| 3.2 | Verify no-reminder mode and default notification behavior | Pending |
| 3.3 | Final visual QA pass | Pending |

---

## Progress

| Phase | Status | Plans Done | Total Plans |
|---|---|---|---|
| **v1.0** | ✅ Shipped | 14/18 | 18 |
| **v1.1 — Phase 1: App Shell Cleanup** | ✅ Complete | 5/5 | 5 |
| **v1.1 — Phase 2: Widget Redesign** | 📋 Planned | 0/4 | 4 |
| **v1.1 — Phase 3: Polish & Edge Cases** | 📋 Planned | 0/3 | 3 |
| **Total (active milestone)** | | **5/12** | **12** |
