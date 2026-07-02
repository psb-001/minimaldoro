<script>
  import { ICONS } from '../icons.js'
  import { closeWidget, getEvents } from '../ipc.js'

  let { pinnedEventId = null } = $props()

  let events = $state([])
  let now = $state(Date.now())

  $effect(() => {
    async function refresh() {
      now = Date.now()
      try {
        events = await getEvents()
      } catch {}
    }
    refresh()
    const interval = setInterval(refresh, 60000)
    const unsubscribe = window.api?.onEventsUpdated(() => refresh())
    return () => {
      clearInterval(interval)
      if (unsubscribe) unsubscribe()
    }
  })

  let upcoming = $derived(
    events
      .filter((e) => {
        if (e.celebrated) return false
        const [y, m, d] = e.date.split('-').map(Number)
        const eDate = new Date(y, m - 1, d)
        const nowStart = new Date()
        nowStart.setHours(0, 0, 0, 0)
        const daysLeft = Math.ceil((eDate.getTime() - nowStart.getTime()) / (1000 * 60 * 60 * 24))
        return daysLeft >= 0
      })
      .sort((a, b) => {
        const [ay, am, ad] = a.date.split('-').map(Number)
        const [by, bm, bd] = b.date.split('-').map(Number)
        return new Date(ay, am - 1, ad) - new Date(by, bm - 1, bd)
      })
  )

  let nextEvent = $derived(
    (pinnedEventId !== null && !Number.isNaN(pinnedEventId))
      ? events.find((e) => e.id === pinnedEventId) || upcoming[0] 
      : upcoming[0]
  )
  let daysLeft = $derived(
    nextEvent
      ? (() => {
          const [y, m, d] = nextEvent.date.split('-').map(Number)
          const eDate = new Date(y, m - 1, d)
          const nowStart = new Date()
          nowStart.setHours(0, 0, 0, 0)
          return Math.ceil((eDate.getTime() - nowStart.getTime()) / (1000 * 60 * 60 * 24))
        })()
      : null
  )
  let eventColor = $derived(nextEvent?.color || '#ffb83e')

  let showMenu = $state(false)

  function handleRightClick(e) {
    e.preventDefault()
    showMenu = true
  }
</script>

<svelte:window oncontextmenu={handleRightClick} />

<div
  class="widget"
  class:empty={!nextEvent}
  style="--event-color: {eventColor}"
  role="region"
  aria-label="Countdown widget"
>
  {#if pinnedEventId}
    <button
      class="close-btn"
      aria-label="Remove widget"
      onclick={() => closeWidget(pinnedEventId)}
    >
      {@html ICONS.x}
    </button>
  {/if}
  {#if nextEvent}
    <div class="color-bar"></div>
    <div class="tint"></div>
    <div class="resize-handle"></div>
    <div class="content">
      {#if daysLeft < 0}
        <div class="count-row">
          <span class="count-num">—</span>
        </div>
        <div class="count-sub">passed</div>
      {:else}
        <div class="count-row">
          <span class="count-num">{daysLeft}</span>
          <span class="count-unit">{daysLeft === 1 ? 'day' : 'days'}</span>
        </div>
        <div class="count-sub">remaining</div>
      {/if}
      <div class="divider"></div>
      <div class="event-name">{nextEvent.title}</div>
      <div class="event-date">{new Date(nextEvent.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
    </div>
  {:else}
    <div class="tint empty-tint"></div>
    <div class="resize-handle"></div>
    <div class="content empty-content">
      <div class="empty-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="empty-text">No events yet</div>
      <div class="empty-hint">Create one to get started</div>
    </div>
  {/if}
</div>

{#if showMenu}
  <div class="ctx-backdrop" role="presentation" onclick={() => (showMenu = false)}></div>
  <div class="ctx-menu">
    <button class="ctx-item ctx-danger" onclick={() => { closeWidget(pinnedEventId); showMenu = false }}>
      {@html ICONS.x} Unpin widget
    </button>
  </div>
{/if}

<style>
  .close-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 10;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: none;
    background: rgba(0, 0, 0, 0.06);
    color: #8a96a3;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    opacity: 0.7;
    transition: background 0.15s, color 0.15s;
    -webkit-app-region: no-drag;
  }

  .close-btn:hover {
    background: #cc3a05;
    color: #fff;
    opacity: 1;
  }

  .widget {
    width: 100%;
    height: 100%;
    background: #fafafc;
    border-radius: 18px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-sizing: border-box;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    -webkit-app-region: drag;
    position: relative;
    color: #1a1d21;
    overflow: hidden;
  }

  .tint {
    position: absolute;
    inset: 0;
    border-radius: 18px;
    background: var(--event-color);
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
  }

  .empty-tint {
    background: var(--event-color);
    opacity: 0.04;
  }

  .color-bar {
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    height: 3px;
    background: var(--event-color);
    border-radius: 0 0 4px 4px;
    z-index: 3;
    opacity: 0.9;
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
    z-index: 10;
    -webkit-app-region: no-drag;
  }

  .resize-handle::after {
    content: '';
    position: absolute;
    bottom: 3px;
    right: 3px;
    width: 8px;
    height: 8px;
    border-right: 2px solid rgba(0, 0, 0, 0.15);
    border-bottom: 2px solid rgba(0, 0, 0, 0.15);
    border-radius: 0 0 2px 0;
  }

  .widget:hover .resize-handle::after {
    border-color: rgba(0, 0, 0, 0.3);
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 18px 16px 16px;
    position: relative;
    z-index: 2;
    gap: 0;
  }

  /* ---- Event state ---- */

  .count-row {
    display: flex;
    align-items: baseline;
    gap: 6px;
    line-height: 1;
  }

  .count-num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 48px;
    font-weight: 600;
    color: var(--event-color);
    letter-spacing: -2.5px;
    line-height: 1;
  }

  .count-unit {
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    letter-spacing: 0.3px;
  }

  .count-sub {
    font-size: 10px;
    font-weight: 600;
    color: #9ca3af;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 3px;
    margin-bottom: 10px;
  }

  .divider {
    width: 28px;
    height: 1.5px;
    background: rgba(0, 0, 0, 0.08);
    margin-bottom: 9px;
    border-radius: 1px;
  }

  .event-name {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.2px;
  }

  .event-date {
    font-size: 10px;
    color: #9ca3af;
    margin-top: 3px;
    font-weight: 500;
  }

  /* ---- Empty state ---- */

  .empty-content {
    gap: 4px;
  }

  .empty-icon {
    color: var(--event-color);
    margin-bottom: 4px;
    opacity: 0.45;
  }

  .empty-text {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    letter-spacing: 0.1px;
  }

  .empty-hint {
    font-size: 9.5px;
    color: #a0aab5;
    font-weight: 400;
  }

  /* ---- Context menu ---- */

  .ctx-backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    -webkit-app-region: no-drag;
  }

  .ctx-menu {
    position: fixed;
    bottom: 8px;
    right: 8px;
    background: #fafafc;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 14px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    padding: 6px;
    z-index: 60;
    min-width: 150px;
    -webkit-app-region: no-drag;
  }

  .ctx-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 9px 14px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #374151;
    cursor: pointer;
    border-radius: 9px;
    transition: background 0.15s;
    white-space: nowrap;
    text-align: left;
  }

  .ctx-item:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .ctx-danger {
    color: #cc3a05;
  }

  .ctx-danger:hover {
    background: #fee2e2;
  }
</style>
