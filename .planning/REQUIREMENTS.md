# Requirements

## Requirements (v1)

### CORE — Core Event Management

| ID | Requirement | Priority |
|---|---|---|
| CORE-1 | Users can create an event with a title, date, color, and reminder preference | P0 |
| CORE-2 | Users can view all events in a grid layout sorted by date | P0 |
| CORE-3 | Users can delete an event via a context menu | P0 |
| CORE-4 | Users can mark an event as "celebrated" | P0 |
| CORE-5 | Events show remaining days countdown, updated every minute | P0 |

### UI — User Interface & Navigation

| ID | Requirement | Priority |
|---|---|---|
| UI-1 | Topbar with app wordmark, minimize/close buttons, and "New event" button | P0 |
| UI-2 | Tab filter: All events / Upcoming / Celebrated | P0 |
| UI-3 | Empty state shown when no events match current filter | P0 |
| UI-4 | "Add event" card with dashed border at end of grid | P0 |
| UI-5 | Slide-in modal for creating new events with validation | P0 |
| UI-6 | Color swatch picker with 6 predefined colors | P0 |

### NOTIF — Notifications & Reminders

| ID | Requirement | Priority |
|---|---|---|
| NOTIF-1 | Desktop notification fires before event based on reminder setting | P0 |
| NOTIF-2 | Reminder options: 2h, 3h, 6h, 1 day before | P0 |
| NOTIF-3 | Per-event reminder configuration | P0 |

### WIDGET — Desktop Widgets

| ID | Requirement | Priority |
|---|---|---|
| WIDGET-1 | Users can pin an event as a transparent desktop widget | P0 |
| WIDGET-2 | Widget shows event name and countdown (days) | P0 |
| WIDGET-3 | Widget position is persisted across app restarts | P0 |
| WIDGET-4 | Widgets can be dismissed via right-click context menu | P0 |

### DB — Data Persistence

| ID | Requirement | Priority |
|---|---|---|
| DB-1 | Events stored in SQLite with WAL mode | P0 |
| DB-2 | Widget positions stored in separate table | P0 |
| DB-3 | Data persists across app restarts | P0 |

## Out of Scope

| Feature | Reasoning |
|---|---|
| Cloud sync / user accounts | Desktop-only, single-user app |
| Recurring events | Not in scope; single-date events only |
| Time-of-day support | Date-only precision |
| Mobile/web versions | Electron desktop only |
| Widget customization | No font/color/size controls planned |
| Multi-language | English only |

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| CORE-1 through CORE-5 | Phase 1 | Pending |
| UI-1 through UI-6 | Phase 1 | Pending |
| NOTIF-1 through NOTIF-3 | Phase 2 | Pending |
| WIDGET-1 through WIDGET-4 | Phase 3 | Pending |
| DB-1 through DB-3 | Phase 1 | Pending |
