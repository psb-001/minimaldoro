<script>
  import { ICONS } from '../icons.js'

  let { event = {}, pinned = false, ondeleted = () => {}, oncelebrated = () => {}, onpin = () => {}, onedit = () => {} } = $props()

  let now = $state(Date.now())

  $effect(() => {
    const interval = setInterval(() => {
      now = Date.now()
    }, 60000)
    return () => clearInterval(interval)
  })

  let eventDate = $derived(new Date(event.date + 'T00:00:00'))
  let diffMs = $derived(eventDate.getTime() - now)
  let daysLeft = $derived(Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  let isUrgent = $derived(daysLeft >= 0 && daysLeft <= 3 && !event.celebrated)
  let isPassed = $derived(daysLeft < 0 && !event.celebrated)
  let showMenu = $state(false)
  let menuRef = $state(null)

  function handleContextMenu(e) {
    e.stopPropagation()
    showMenu = !showMenu
  }

  function handleClickOutside(e) {
    if (showMenu && menuRef && !menuRef.contains(e.target)) {
      showMenu = false
    }
  }

  $effect(() => {
    if (showMenu) {
      document.addEventListener('click', handleClickOutside, true)
      return () => document.removeEventListener('click', handleClickOutside, true)
    }
  })
</script>

<div
  class="card"
  class:urgent={isUrgent}
  class:celebrated={event.celebrated}
  class:passed={isPassed}
  style="{isUrgent ? 'border-color: #ffd6c2;' : ''} {showMenu ? 'z-index: 50;' : ''}"
>
  <div class="card-header">
    <div class="card-title-group">
      <div class="card-indicator" style="background: {event.color || '#ffb83e'}"></div>
      <div class="card-label" title={event.title}>{event.title}</div>
    </div>

    <div class="card-actions" bind:this={menuRef}>
      <button class="card-action-btn" class:pin-active={pinned} aria-label={pinned ? 'Unpin from desktop' : 'Pin to desktop'} title={pinned ? 'Unpin from desktop' : 'Pin to desktop'} onclick={() => onpin()}>
        {@html pinned ? ICONS.pinFilled : ICONS.pin}
      </button>
      <button class="card-action-btn" aria-label="Event options" onclick={handleContextMenu}>
        {@html ICONS.dots}
      </button>
      {#if showMenu}
        <div class="menu-dropdown">
          <button class="menu-item" onclick={() => { onedit(); showMenu = false }}>
            {@html ICONS.edit} Edit
          </button>
          <button class="menu-item" onclick={() => { oncelebrated(); showMenu = false }}>
            {@html ICONS.check} Mark celebrated
          </button>
          <button class="menu-item menu-danger" onclick={() => { ondeleted(); showMenu = false }}>
            {@html ICONS.trash} Delete
          </button>
        </div>
      {/if}
    </div>
  </div>

  {#if event.celebrated}
    <div class="card-celebrated">
      <div class="check-circle">
        {@html ICONS.check}
      </div>
      <div class="celebrated-text">Celebrated</div>
      <div class="celebrated-date">{event.date}</div>
    </div>
    <div class="card-date passed-date">Passed</div>
  {:else if isPassed}
    <div class="card-num muted">—</div>
    <div class="card-unit">passed</div>
    <div class="card-date passed-date">{event.date}</div>
  {:else}
    <div class="card-num" class:urgent-text={isUrgent}>
      {daysLeft}
    </div>
    <div class="card-unit" class:urgent-text={isUrgent}>
      {daysLeft === 1 ? 'day remaining' : 'days remaining'}
    </div>
    <div class="card-date" class:urgent-text={isUrgent}>
      {event.date}
    </div>
  {/if}
</div>

<style>
  .card {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 16px;
    padding: 20px 18px 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0;
    position: relative;
    cursor: default;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.15s;
    -webkit-app-region: no-drag;
    box-shadow: 0 4px 14px rgba(0,0,0,0.03);
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0,0,0,0.08);
    border-color: rgba(0,0,0,0.1);
  }

  .card.celebrated {
    background: #fafafa;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 8px;
  }

  .card-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: calc(100% - 32px);
  }

  .card-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .card-actions {
    position: relative;
    z-index: 10;
    display: flex;
    gap: 2px;
  }

  .card-action-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid rgba(0,0,0,0.06);
    background: rgba(255,255,255,0.7);
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    backdrop-filter: blur(8px);
  }

  .card-action-btn:first-child {
    color: #6b7280;
  }

  .card-action-btn:first-child.pin-active {
    color: #fa520f;
  }

  .card-action-btn:first-child:hover {
    background: rgba(255,255,255,0.95);
    color: #fa520f;
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .card-action-btn:last-child {
    opacity: 0.5;
  }

  .card:hover .card-action-btn:last-child {
    opacity: 1;
  }

  .card-action-btn:last-child:hover {
    opacity: 1;
    background: rgba(255,255,255,0.95);
    color: #1a1d21;
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }

  .menu-dropdown {
    position: absolute;
    top: 34px;
    right: 0;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.14);
    padding: 6px;
    z-index: 100;
    min-width: 150px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', sans-serif;
    color: #333d47;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s;
    white-space: nowrap;
    text-align: left;
  }

  .menu-item:hover {
    background: #f5f5f5;
  }

  .menu-danger {
    color: #cc3a05;
  }

  .menu-danger:hover {
    background: #fee2e2;
  }

  .card-label {
    font-size: 11px;
    font-weight: 600;
    color: #6b7280;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card.celebrated .card-label {
    color: #9ca3af;
  }

  .card-num {
    font-family: 'Playfair Display', serif;
    font-size: 58px;
    font-weight: 400;
    color: #1f1f1f;
    line-height: 1;
    letter-spacing: -2px;
    margin-bottom: 6px;
  }

  .card-num.urgent-text {
    color: #fa520f;
  }

  .card-num.muted {
    font-size: 32px;
    color: #c7c7c7;
    letter-spacing: -0.5px;
  }

  .card-unit {
    font-size: 12px;
    color: #8a96a3;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .card-unit.urgent-text {
    color: #fa520f;
  }

  .card-date {
    font-size: 11px;
    color: #a0aab5;
    font-weight: 500;
    width: 100%;
    text-align: left;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(0,0,0,0.04);
  }

  .card-date.urgent-text {
    color: #fa520f;
    border-top-color: #ffeee6;
  }

  .passed-date {
    color: #e0e0e0 !important;
  }

  .card-celebrated {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 0;
  }

  .check-circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff8e0;
    border: 1px solid #e6d5a8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .celebrated-text {
    font-size: 12px;
    font-weight: 500;
    color: #cc3a05;
  }

  .celebrated-date {
    font-size: 11px;
    color: #c7c7c7;
  }
</style>
