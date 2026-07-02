<script>
  import { ICONS } from '../icons.js'

  let { onclose = () => {}, tab = 'about' } = $props()
  let activeTab = $state('about')

  $effect(() => {
    if (tab) activeTab = tab
  })

  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'privacy', label: 'Privacy Policy' },
    { id: 'terms', label: 'Terms & Conditions' },
  ]

  let appVersion = $state('0.1.0')

  $effect(() => {
    if (window.api?.getVersion) {
      window.api.getVersion().then(v => {
        if (v) appVersion = v
      }).catch(() => {})
    }
  })
</script>

<div class="backdrop" role="dialog" aria-modal="true" aria-labelledby="about-title">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="about-title">About Minimaldoro</div>
      <button class="modal-close" aria-label="Close" onclick={onclose}>
        {@html ICONS.x}
      </button>
    </div>

    <div class="tabs">
      {#each tabs as tab}
        <button
          class="tab"
          class:active={activeTab === tab.id}
          onclick={() => (activeTab = tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <div class="modal-body">
      {#if activeTab === 'about'}
        <div class="section">
          <div class="app-name">Minimaldoro</div>
          <div class="app-version">Version {appVersion}</div>
          <p class="desc">An elegant countdown timer and event tracker for your desktop. Track upcoming events, celebrate milestones, and stay on top of what matters — all from your menubar.</p>
          <div class="credits">
            <div class="credit-label">Developed by</div>
            <div class="credit-name">psb-001</div>
            <a class="credit-link" href="https://github.com/psb-001" target="_blank" rel="noopener noreferrer">github.com/psb-001</a>
            <a class="credit-link" href="https://github.com/psb-001/minimaldoro" target="_blank" rel="noopener noreferrer">github.com/psb-001/minimaldoro</a>
          </div>
        </div>
      {/if}

      {#if activeTab === 'privacy'}
        <div class="section">
          <h2>Privacy Policy</h2>
          <p><strong>Last updated:</strong> July 2026</p>
          <div class="content">
            <h3>Data Storage</h3>
            <p>All event data, including titles, dates, colors, reminders, and widget positions, is stored exclusively in a local SQLite database on your device (located in your system's user data directory).</p>

            <h3>Data Collection</h3>
            <p>We do <strong>not</strong> collect, transmit, or share any personal information or usage data with third parties. No telemetry, no analytics, no cloud sync.</p>

            <h3>Notifications</h3>
            <p>Event reminders use your operating system's native notification system. Minimaldoro does not intercept or log notification content.</p>

            <h3>Widget Windows</h3>
            <p>Desktop widget positions and sizes are stored locally. This data never leaves your machine.</p>

            <h3>Changes to This Policy</h3>
            <p>If this privacy policy changes in the future, you will be notified via an in-app dialog on next launch.</p>
          </div>
        </div>
      {/if}

      {#if activeTab === 'terms'}
        <div class="section">
          <h2>Terms & Conditions</h2>
          <p><strong>Last updated:</strong> July 2026</p>
          <div class="content">
            <h3>1. Acceptance of Terms</h3>
            <p>By downloading, installing, or using Minimaldoro, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use this application.</p>

            <h3>2. License</h3>
            <p>Minimaldoro is provided as free, open-source software under the MIT License. You are free to use, copy, modify, and distribute the software in accordance with the license terms.</p>

            <h3>3. Disclaimer of Warranty</h3>
            <p>This software is provided "as is", without warranty of any kind, express or implied. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of the software.</p>

            <h3>4. Data Responsibility</h3>
            <p>You are solely responsible for backing up your event data. While we strive to maintain data integrity, we are not liable for any data loss resulting from software bugs, hardware failure, or user error.</p>

            <h3>5. Changes to Terms</h3>
            <p>We reserve the right to update these terms at any time. Continued use of the application after changes constitutes acceptance of the revised terms.</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(250, 250, 252, 0.55);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 300;
    -webkit-app-region: no-drag;
    padding: 24px;
  }

  .modal {
    background: #fff;
    border-radius: 18px;
    width: 520px;
    max-width: 100%;
    max-height: 85vh;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0,0,0,0.06);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    animation: modal-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-header {
    padding: 20px 28px 16px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-title {
    font-size: 16px;
    font-weight: 700;
    color: #1a1d21;
    letter-spacing: -0.2px;
  }

  .modal-close {
    width: 28px;
    height: 28px;
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

  .tabs {
    display: flex;
    gap: 4px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    background: #fafbfc;
  }

  .tab {
    padding: 14px 12px;
    font-size: 13px;
    font-weight: 500;
    color: #8a96a3;
    cursor: pointer;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    background: transparent;
    font-family: 'Inter', -apple-system, sans-serif;
    transition: color 0.2s, border-color 0.2s;
    white-space: nowrap;
  }

  .tab.active {
    color: #fa520f;
    border-bottom-color: #fa520f;
    font-weight: 600;
  }

  .tab:hover:not(.active) {
    color: #1a1d21;
  }

  .modal-body {
    padding: 0;
    overflow-y: auto;
    flex: 1;
  }

  .section {
    padding: 24px 28px 28px;
  }

  .app-name {
    font-size: 22px;
    font-weight: 700;
    color: #1a1d21;
    letter-spacing: -0.4px;
  }

  .app-version {
    font-size: 12px;
    color: #8a96a3;
    font-weight: 500;
    margin-top: 2px;
    margin-bottom: 16px;
  }

  .desc {
    font-size: 13.5px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0 0 20px;
  }

  .credits {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 16px;
    border-top: 1px solid rgba(0,0,0,0.05);
  }

  .credit-label {
    font-size: 11px;
    font-weight: 600;
    color: #8a96a3;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .credit-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1d21;
  }

  .credit-link {
    font-size: 12px;
    font-weight: 500;
    color: #fa520f;
    text-decoration: none;
    margin-top: 2px;
    display: inline-block;
    transition: color 0.2s;
  }

  .credit-link:hover {
    color: #a82e04;
    text-decoration: underline;
  }

  .section h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1a1d21;
    margin: 0 0 4px;
  }

  .section > p {
    font-size: 12px;
    color: #8a96a3;
    margin: 0 0 16px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .content h3 {
    font-size: 12.5px;
    font-weight: 700;
    color: #1a1d21;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .content p {
    font-size: 12.5px;
    color: #4b5563;
    line-height: 1.65;
    margin: 0;
  }
</style>
