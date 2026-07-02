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
    display: inline-flex;
    gap: 8px;
    padding: 12px 28px 16px;
    -webkit-app-region: no-drag;
    background: rgba(250,250,252,0.8);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }

  .tab {
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 9px;
    background: rgba(255,255,255,0.6);
    backdrop-filter: blur(8px);
    font-family: 'Inter', -apple-system, sans-serif;
    transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  }

  .tab.active {
    background: #fa520f;
    color: #fff;
    border-color: #fa520f;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(250,82,15,0.25);
  }

  .tab:hover:not(.active) {
    background: rgba(255,255,255,0.95);
    color: #1a1d21;
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  }
</style>
