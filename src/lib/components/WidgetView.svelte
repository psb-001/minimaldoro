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
    <div class="accent"></div>
    <div class="glow"></div>
    <div class="content">
      {#if daysLeft < 0}
        <div class="count-num passed">—</div>
        <div class="event-name">{nextEvent.title}</div>
      {:else}
        <div class="count-num">{daysLeft}</div>
        <div class="event-name">{nextEvent.title}</div>
      {/if}
    </div>
    <div class="resize-handle"></div>
  {:else}
    <div class="empty-state">
      <div class="empty-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      </div>
      <div class="empty-text">No events yet</div>
    </div>
    <div class="resize-handle"></div>
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
    top: 8px;
    right: 8px;
    z-index: 10;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(8px);
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    -webkit-app-region: no-drag;
  }

  .close-btn:hover {
    background: #cc3a05;
    color: #fff;
    border-color: #cc3a05;
  }

  .widget {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 16px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    box-sizing: border-box;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
    -webkit-app-region: drag;
    position: relative;
    color: #1a1d21;
    overflow: hidden;
    transition: box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .widget:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.1);
  }

  .accent {
    position: absolute;
    left: 0;
    top: 16px;
    bottom: 16px;
    width: 3px;
    background: var(--event-color);
    border-radius: 0 3px 3px 0;
    z-index: 3;
  }

  .glow {
    position: absolute;
    left: 12px;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    height: 60px;
    background: var(--event-color);
    opacity: 0.06;
    border-radius: 50%;
    filter: blur(16px);
    pointer-events: none;
    z-index: 0;
  }

  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 20px 16px 16px 20px;
    position: relative;
    z-index: 2;
    gap: 6px;
    min-height: 0;
  }

  .count-num {
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 48px;
    font-weight: 600;
    color: var(--event-color);
    letter-spacing: -2.5px;
    line-height: 1;
  }

  .count-num.passed {
    color: #c7c7c7;
  }

  .event-name {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }

  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 16px;
  }

  .empty-icon {
    color: var(--event-color);
    opacity: 0.35;
    margin-bottom: 2px;
  }

  .empty-text {
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
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
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 12px;
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
    border-radius: 8px;
    transition: background 0.15s;
    white-space: nowrap;
    text-align: left;
  }

  .ctx-item:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  .ctx-danger {
    color: #cc3a05;
  }

  .ctx-danger:hover {
    background: #fee2e2;
  }
</style>
