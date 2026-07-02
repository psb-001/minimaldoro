# Widget & UI Overhaul — Specification

> **Date:** 2026-06-14
> **Status:** Draft
> **Source:** User interview (4 rounds of questioning)

---

## 1. Problem Statement

The Countdown desktop app has two main areas of concern:

### 1.1 Widget Visual/Layout Problems
- The desktop widget (transparent overlay window) has visual/layout issues
- The widget is "boring" — all grey/white, no use of the event's assigned color
- The layout feels cramped and lacks visual personality
- Multiple visual aspects need improvement (size, color, hierarchy, readability)

### 1.2 App UI / Navigation Confusion
- The overall app shell structure is confusing
- Too many sections compete for attention
- The footer (reminder selector + rainbow gradient bar) is unnecessary and should be removed entirely
- The topbar can be simplified further (remove wordmark, keep minimal controls + create button)
- Tabs (All / Upcoming / Celebrated) should stay between topbar and grid

---

## 2. Scope of Changes

### 2.1 Widget Overhaul

**Current state:**
- Fixed 180×100px window
- All-grey glass-morphism design (white/grey tones only)
- Shows: countdown number, "days"/"day" label, event title (uppercase), event date
- No use of event color
- Right-click context menu with only "Unpin widget"

**Desired state:**
- **Use event color** — The widget should incorporate the event's assigned color (`event.color`) into the design. Options:
  - Colored accent strip / border
  - Colored background tint
  - Colored countdown number
  - Color-matched backdrop glow/shadow
- **Better layout** — Rethink the widget's visual hierarchy:
  - Countdown number should be the hero element
  - Better spacing and proportions
  - Clean typography hierarchy
- **Multiple visual issues** — General polish pass:
  - Consider if 180×100 is the right size, or if it should be slightly larger
  - Glass effect should look clean on different desktop backgrounds
  - The widget should feel premium and glanceable

### 2.2 App Shell Redesign

**Current layout:**
```
 ┌─────────────────────────────────────┐
 │ Topbar: Wordmark | [−] [×] | +New   │
 ├─────────────────────────────────────┤
 │ Tabs: All | Upcoming | Celebrated    │
 ├─────────────────────────────────────┤
 │                                     │
 │ Event Grid (3 columns)              │
 │                                     │
 ├─────────────────────────────────────┤
 │ Footer: Reminder bar + rainbow      │
 └─────────────────────────────────────┘
```

**Desired layout:**
```
 ┌─────────────────────────────────────┐
 │ Topbar: [−] [×]        [+ New]     │
 ├─────────────────────────────────────┤
 │ Tabs: All | Upcoming | Celebrated    │
 ├─────────────────────────────────────┤
 │                                     │
 │ Event Grid (3 columns)              │
 │                                     │
 └─────────────────────────────────────┘
```

**Specific changes:**
1. **Topbar simplification** — Remove the "Countdown" wordmark and orange dot. Keep:
   - Left side: minimize [−] and close [×] buttons (grouped together)
   - Right side: "New event" button (orange gradient)
2. **Footer removal** — Remove the entire FooterBar component:
   - Remove reminder selector
   - Remove bell icon + "Remind me before the event" text
   - Remove the rainbow gradient bar at the bottom
   - App shell ends cleanly after the event grid
3. **Tabs stay** — All / Upcoming / Celebrated tabs remain in their current position
4. **Reminder in modal** — The reminder field in the New/Edit Event modal should be simplified:
   - Remove the reminder selector from the modal entirely (simplify)
   - All events use a consistent default reminder

---

## 3. Implementation Plan

### Phase 1: App Shell Cleanup
1. Remove FooterBar import and usage from `App.svelte`
2. Simplify Topbar: remove wordmark and wordmark-dot, keep only minimize/close + new event button
3. Remove the reminder selector from NewEventModal (simplify)
4. Adjust grid layout to fill the available vertical space without footer
5. Build and verify

### Phase 2: Widget Redesign
1. Redesign WidgetView to incorporate event color (background tint, accent strip, or border)
2. Improve widget layout/spacing/hierarchy
3. Consider slightly larger widget size if needed
4. Polish glass effect and shadows
5. Build and verify

### Phase 3: Polish & Edge Cases
1. Test widget on different desktop backgrounds (light, dark, busy)
2. Ensure no-reminder mode works (notifications use default)
3. Verify responsive edge cases (single event, many events)
4. Final visual QA

---

## 4. Non-Goals (Out of Scope)

- No changes to the event CRUD logic or database schema
- No changes to the notification scheduler in electron/main.js
- No changes to widget positioning or multi-monitor handling
- No changes to the event card grid layout or card design
- No changes to Electron window management or IPC

---

## 5. Design Principles

- **Minimalism** — Less UI chrome, more focus on events
- **Color as identity** — Events have colors; the widget should reflect that
- **Glanceable** — Widget should be readable at a quick glance from across the room
- **Consistent glass aesthetic** — Maintain the frosted-glass, transparent design language

---

## 6. Open Questions / Future Considerations

- Should the widget be resizable or offer size presets?
- Should the main window show a countdown for the next upcoming event in the topbar?
- Should there be a way to re-enable the footer/reminder for users who want it?
