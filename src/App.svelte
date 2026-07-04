<script>
  import Topbar from './lib/components/Topbar.svelte'
  import Tabs from './lib/components/Tabs.svelte'
  import EventCard from './lib/components/EventCard.svelte'
  import NewEventModal from './lib/components/NewEventModal.svelte'
  import WidgetView from './lib/components/WidgetView.svelte'
  import FirstRunModal from './lib/components/FirstRunModal.svelte'
  import AboutModal from './lib/components/AboutModal.svelte'
  import { getEvents, addEvent, updateEvent, deleteEvent, celebrate, openWidget, closeWidget, getSetting, setSetting, listWidgets } from './lib/ipc.js'
  import { ICONS } from './lib/icons.js'
  import { fly } from 'svelte/transition'

  let urlParams = new URLSearchParams(window.location.search)
  let isWidgetView = urlParams.has('widget')
  let widgetEventId = isWidgetView ? Number(urlParams.get('widget')) : null
  let widgetEventIdSafe = isWidgetView && widgetEventId && !Number.isNaN(widgetEventId) ? widgetEventId : null

  let events = $state([])
  let pinnedEventIds = $state(new Set())
  let currentTab = $state('all')
  let showModal = $state(false)
  let editingEvent = $state(null)
  let confirmDeleteId = $state(null)
  let toastMessage = $state('')
  let toastTimer = $state(null)
  let showAbout = $state(false)
  let aboutTab = $state('about')
  let firstRunComplete = $state(false)

  async function loadEvents() {
    try {
      events = await getEvents()
    } catch (e) {
      showToast('Failed to load events')
      events = []
    }
  }

  async function loadPinned() {
    try {
      const widgets = await listWidgets()
      pinnedEventIds = new Set(widgets.map(Number).filter(id => !Number.isNaN(id)))
    } catch {
      pinnedEventIds = new Set()
    }
  }

  async function handleAdd(data) {
    try {
      await addEvent(data)
      await loadEvents()
    } catch (e) {
      showToast('Failed to create event')
    }
  }

  async function handleEdit(data) {
    if (!editingEvent) return
    try {
      await updateEvent(editingEvent.id, data)
      editingEvent = null
      await loadEvents()
    } catch (e) {
      showToast('Failed to update event')
    }
  }

  async function handleDelete(id) {
    try {
      await deleteEvent(id)
      confirmDeleteId = null
      await loadEvents()
    } catch (e) {
      showToast('Failed to delete event')
    }
  }

  async function handleCelebrate(id) {
    try {
      await celebrate(id)
      await loadEvents()
    } catch (e) {
      showToast('Failed to mark event as celebrated')
    }
  }

  async function checkFirstRun() {
    try {
      const termsAccepted = await getSetting('termsAccepted')
      const privacyAccepted = await getSetting('privacyAccepted')
      firstRunComplete = termsAccepted === 'true' && privacyAccepted === 'true'
    } catch {
      firstRunComplete = false
    }
  }

  async function completeFirstRun() {
    try {
      await setSetting('termsAccepted', 'true')
      await setSetting('privacyAccepted', 'true')
      firstRunComplete = true
    } catch (e) {
      showToast('Failed to save acceptance')
    }
  }

  $effect(() => {
    checkFirstRun()
    loadEvents()
    loadPinned()
    const unsubscribe = window.api?.onEventsUpdated(() => {
      loadEvents()
      loadPinned()
    })
    return () => {
      if (unsubscribe) unsubscribe()
    }
  })

  function showToast(msg) {
    toastMessage = msg
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => { toastMessage = '' }, 4000)
  }

  function openAbout(tab = 'about') {
    aboutTab = tab
    showAbout = true
  }

  function handleConfirmKeydown(e) {
    if (e.key === 'Escape') {
      confirmDeleteId = null
    }
  }

  let filtered = $derived.by(() => {
    if (currentTab === 'upcoming') {
      return events.filter((e) => {
        if (e.celebrated) return false
        const [y, m, d] = e.date.split('-').map(Number)
        const eDate = new Date(y, m - 1, d)
        const nowStart = new Date()
        nowStart.setHours(0, 0, 0, 0)
        const daysLeft = Math.ceil((eDate.getTime() - nowStart.getTime()) / (1000 * 60 * 60 * 24))
        return daysLeft >= 0
      })
    }
    if (currentTab === 'celebrated') {
      return events.filter((e) => e.celebrated)
    }
    return events
  })
</script>

{#if !firstRunComplete}
  <FirstRunModal onaccept={completeFirstRun} />
{/if}

{#if showAbout}
  <AboutModal tab={aboutTab} onclose={() => (showAbout = false)} />
{/if}

{#if isWidgetView}
   <WidgetView pinnedEventId={widgetEventIdSafe} />
{:else if firstRunComplete}
  <div class="shell">
    <Topbar
      onadd={() => (showModal = true)}
    />

    <Tabs {currentTab} ontab={(tab) => (currentTab = tab)} />

    <div class="body">
      <div class="grid">
        {#each filtered as event (event.id)}
          <div transition:fly={{ y: 20, duration: 300 }}>
            <EventCard
              event={event}
              pinned={pinnedEventIds.has(event.id)}
              ondeleted={() => (confirmDeleteId = event.id)}
              oncelebrated={() => handleCelebrate(event.id)}
              onpin={() => {
                if (pinnedEventIds.has(event.id)) {
                  closeWidget(event.id).finally(() => loadPinned())
                } else {
                  openWidget(event.id).finally(() => loadPinned())
                }
              }}
              onedit={() => {
                editingEvent = event
                showModal = true
              }}
            />
          </div>
        {:else}
          <div class="empty-state">
            {@html ICONS.calendarOff}
            <div class="empty-text">No events here yet</div>
          </div>
        {/each}
      </div>
    </div>

    <div class="shell-footer">
      <button class="footer-link" onclick={() => openAbout('about')}>About</button>
      <span class="footer-sep">·</span>
      <button class="footer-link" onclick={() => openAbout('privacy')}>Privacy Policy</button>
      <span class="footer-sep">·</span>
      <button class="footer-link" onclick={() => openAbout('terms')}>Terms & Conditions</button>
    </div>
  </div>
{/if}

{#if showModal}
  <NewEventModal
    event={editingEvent}
    onclose={() => {
      showModal = false
      editingEvent = null
    }}
    onsave={(data) => {
      if (editingEvent) {
        handleEdit(data)
      } else {
        handleAdd(data)
      }
      showModal = false
    }}
  />
{/if}

{#if confirmDeleteId}
   <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
   <div class="backdrop" role="dialog" aria-modal="true" tabindex="-1" onclick={() => (confirmDeleteId = null)} onkeydown={handleConfirmKeydown}>
    <div class="confirm-dialog" role="dialog" onclick={(e) => e.stopPropagation()}>
      <div class="confirm-title">Delete event?</div>
      <div class="confirm-text">This cannot be undone.</div>
      <div class="confirm-actions">
        <button class="btn-cancel" onclick={() => (confirmDeleteId = null)}>Cancel</button>
        <button class="btn-danger" onclick={() => handleDelete(confirmDeleteId)}>Delete</button>
      </div>
    </div>
  </div>
{/if}

{#if toastMessage}
  <div class="toast">{toastMessage}</div>
{/if}

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background: transparent;
  }

  .shell {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #fafafc;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.06) 1px, transparent 1px);
    background-size: 20px 20px;
    border-radius: 16px;
    border: 1px solid rgba(0,0,0,0.04);
    box-shadow: 0 16px 48px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1);
    overflow: hidden;
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .body {
    padding: 24px 28px 0;
    -webkit-app-region: no-drag;
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    padding-bottom: 24px;
    flex: 1;
    align-items: start;
    align-content: start;
  }

  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    height: 100%;
    min-height: 350px;
  }

  .empty-text {
    font-size: 14px;
    color: #a0aab5;
    font-weight: 500;
  }

  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(250, 250, 252, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    -webkit-app-region: no-drag;
  }

  .confirm-dialog {
    background: #fff;
    border-radius: 18px;
    width: 280px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0,0,0,0.04);
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .confirm-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1d21;
  }

  .confirm-text {
    font-size: 13px;
    color: #8a96a3;
  }

  .confirm-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }

  .btn-cancel {
    padding: 8px 18px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.08);
    background: #fff;
    font-size: 13.5px;
    font-weight: 500;
    font-family: 'Inter', -apple-system, sans-serif;
    color: #8a96a3;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    -webkit-app-region: no-drag;
  }

  .btn-cancel:hover {
    background: rgba(0,0,0,0.02);
    color: #1a1d21;
  }

  .btn-danger {
    padding: 8px 20px;
    border-radius: 10px;
    border: none;
    background: #cc3a05;
    color: #fff;
    font-size: 13.5px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    -webkit-app-region: no-drag;
  }

  .btn-danger:hover {
    background: #a82e04;
  }

  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #333d47;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    font-family: 'Inter', -apple-system, sans-serif;
    padding: 10px 20px;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 200;
    animation: toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    -webkit-app-region: no-drag;
    pointer-events: none;
  }

  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  @keyframes toast-in {
    from { opacity: 0; transform: translateX(-50%) translateY(10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  .shell-footer {
    padding: 10px 28px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    -webkit-app-region: no-drag;
    border-top: 1px solid rgba(0,0,0,0.04);
  }

  .footer-link {
    background: transparent;
    border: none;
    padding: 0;
    font-size: 11px;
    font-weight: 500;
    color: #a0aab5;
    cursor: pointer;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: #fa520f;
  }

  .footer-sep {
    font-size: 11px;
    color: #d1d5db;
    user-select: none;
  }
</style>
