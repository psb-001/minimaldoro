<script>
  import { COLORS, REMINDERS } from '../stores/events.js'
  import { ICONS } from '../icons.js'

  let { onclose = () => {}, onsave = () => {}, event = null } = $props()

  let isEditing = $derived(event !== null)
  let title = $state('')
  let date = $state('')
  let color = $state('#ffb83e')
  let reminder = $state('2 hours before')
  let error = $state('')
  let today = new Date().toISOString().split('T')[0]
  let dateInput = $state(null)

  $effect(() => {
    error = ''
    title = event?.title ?? ''
    date = event?.date ?? ''
    color = event?.color ?? '#ffb83e'
    reminder = event?.reminder ?? REMINDERS[1]
    if (dateInput) {
      dateInput.min = isEditing ? '' : today
    }
  })

  function handleSubmit(e) {
    e.preventDefault()
    error = ''
    if (!title.trim()) {
      error = 'Event name is required'
      return
    }
    if (!date) {
      error = 'Date is required'
      return
    }
    onsave({
      title: title.trim(),
      date,
      color,
      reminder,
    })
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) {
      onclose()
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      onclose()
    }
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" role="dialog" aria-modal="true" tabindex="-1" onclick={handleBackdrop} onkeydown={handleKeydown}>
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title">{isEditing ? 'Edit event' : 'New event'}</div>
      <button class="modal-close" aria-label="Close modal" onclick={onclose}>
        {@html ICONS.x}
      </button>
    </div>

    <form onsubmit={handleSubmit}>
      <div class="modal-body">
        <div class="field">
          <label class="field-label" for="event-title">Event name</label>
          <input
            id="event-title"
            type="text"
            class="field-input"
            placeholder="e.g. PSB's birthday"
            bind:value={title}
          />
        </div>

        <div class="field">
          <label class="field-label" for="event-date">Date</label>
          <input
            id="event-date"
            type="date"
            class="field-input"
            bind:this={dateInput}
            bind:value={date}
          />
        </div>

        <div class="field">
          <label class="field-label" for="event-reminder">Reminder</label>
          <select id="event-reminder" class="field-input" bind:value={reminder}>
            {#each REMINDERS as rem}
              <option value={rem}>{rem}</option>
            {/each}
          </select>
        </div>

        <div class="field" role="radiogroup" aria-label="Color">
          <div class="color-picker">
            {#each COLORS as c}
              <button
                type="button"
                role="radio"
                aria-checked={color === c}
                aria-label={`Color ${c}`}
                class="color-swatch"
                class:selected={color === c}
                style="background: {c}"
                onclick={() => (color = c)}
              ></button>
            {/each}
          </div>
        </div>

        {#if error}
          <div class="error">{error}</div>
        {/if}
      </div>

      <div class="modal-footer">
        <button type="button" class="btn-cancel" onclick={onclose}>
          Cancel
        </button>
        <button type="submit" class="btn-save">
          {isEditing ? 'Save changes' : 'Create event'}
        </button>
      </div>
    </form>
  </div>
</div>

<style>
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

  .modal {
    background: #fff;
    border-radius: 18px;
    width: 340px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0,0,0,0.04);
    overflow: hidden;
    animation: modal-enter 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.95) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }

  .modal-title {
    font-size: 16px;
    font-weight: 600;
    color: #1a1d21;
    letter-spacing: -0.2px;
  }

  .modal-close {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: #a0aab5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, color 0.2s;
  }

  .modal-close:hover {
    background: rgba(0,0,0,0.04);
    color: #1a1d21;
  }

  .modal-body {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label {
    font-size: 12.5px;
    font-weight: 600;
    color: #8a96a3;
  }

  .field-input {
    font-family: 'Inter', -apple-system, sans-serif;
    font-size: 14px;
    color: #333d47;
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid rgba(0,0,0,0.08);
    background: #fff;
    outline: none;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .field-input:focus {
    border-color: #fa520f;
    box-shadow: 0 0 0 3px rgba(250,82,15,0.15);
  }

  .color-picker {
    display: flex;
    gap: 10px;
  }

  .color-swatch {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid transparent;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  }

  .color-swatch:hover {
    transform: scale(1.1);
  }

  .color-swatch.selected {
    border-color: #1a1d21;
    transform: scale(1.1);
  }

  .error {
    font-size: 12.5px;
    color: #cc3a05;
    font-weight: 500;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid rgba(0,0,0,0.04);
    background: rgba(250,250,252,0.5);
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
  }

  .btn-cancel:hover {
    background: rgba(0,0,0,0.02);
    color: #1a1d21;
  }

  .btn-save {
    padding: 8px 20px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #fa520f 0%, #ff7b00 100%);
    box-shadow: 0 4px 12px rgba(250,82,15,0.25);
    color: #fff;
    font-size: 13.5px;
    font-family: 'Inter', -apple-system, sans-serif;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
  }

  .btn-save:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(250,82,15,0.35);
  }
</style>
