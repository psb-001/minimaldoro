<script>
  import { ICONS } from '../icons.js'
  import { minimizeWindow, closeWindow } from '../ipc.js'

  let { onadd = () => {} } = $props()
</script>

<div class="topbar">
  <button class="btn-add" onclick={onadd}>
    {@html ICONS.plus}
    New event
  </button>

  <div class="topbar-actions">
    <button class="btn-icon" aria-label="Minimize" onclick={() => minimizeWindow()}>
      {@html ICONS.minus}
    </button>
    <button class="btn-icon btn-close" aria-label="Close" onclick={() => closeWindow()}>
      {@html ICONS.x}
    </button>
  </div>
</div>

<style>
  .topbar {
    padding: 18px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0,0,0,0.04);
    -webkit-app-region: drag;
    background: rgba(250,250,252,0.8);
    backdrop-filter: blur(12px);
    z-index: 100;
  }

  .topbar-actions {
    display: flex;
    gap: 4px;
    -webkit-app-region: no-drag;
  }

  .btn-icon {
    width: 30px;
    height: 30px;
    border-radius: 9px;
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

  .btn-icon:hover {
    background: rgba(255,255,255,0.95);
    color: #1a1d21;
    border-color: rgba(0,0,0,0.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }

  .btn-close:hover {
    background: #fee2e2;
    color: #cc3a05;
    border-color: #fecaca;
    box-shadow: 0 2px 8px rgba(204,58,5,0.12);
  }

  .btn-add {
    background: linear-gradient(135deg, #fa520f 0%, #ff7b00 100%);
    box-shadow: 0 4px 12px rgba(250,82,15,0.25);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Inter', -apple-system, sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    letter-spacing: -0.1px;
    -webkit-app-region: no-drag;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
  }

  .btn-add:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(250,82,15,0.35);
  }
</style>
