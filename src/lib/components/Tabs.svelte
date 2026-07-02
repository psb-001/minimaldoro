<script>
  let { currentTab = 'all', ontab = () => {} } = $props()

  const tabs = [
    { id: 'all', label: 'All events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'celebrated', label: 'Celebrated' },
  ]
</script>

<div class="tabs">
  {#each tabs as tab}
    <button
      class="tab"
      class:active={currentTab === tab.id}
      onclick={() => ontab(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    gap: 16px;
    padding: 0 28px;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    -webkit-app-region: no-drag;
    background: rgba(250,250,252,0.8);
    backdrop-filter: blur(12px);
  }

  .tab {
    padding: 16px 4px;
    font-size: 13.5px;
    font-weight: 500;
    color: #a0aab5;
    cursor: pointer;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    background: transparent;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: color 0.2s, border-color 0.2s;
  }

  .tab.active {
    color: #fa520f;
    border-bottom-color: #fa520f;
    font-weight: 600;
  }

  .tab:hover:not(.active) {
    color: #1a1d21;
  }
</style>
