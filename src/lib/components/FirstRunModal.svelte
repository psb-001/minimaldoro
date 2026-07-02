<script>
  import { ICONS } from '../icons.js'

  let { onclose = () => {}, onaccept = () => {} } = $props()

  let termsAccepted = $state(false)
  let privacyAccepted = $state(false)
  let error = $state('')

  function handleAccept() {
    if (!termsAccepted || !privacyAccepted) {
      error = 'Please accept both the Terms & Conditions and the Privacy Policy to continue.'
      return
    }
    onaccept()
  }
</script>

<div class="backdrop" role="dialog" aria-modal="true" aria-labelledby="firstrun-title">
  <div class="modal">
    <div class="modal-header">
      <div class="modal-title" id="firstrun-title">Welcome to Minimaldoro</div>
    </div>

    <div class="modal-body">
      <p class="intro">Before you get started, please review and accept our policies.</p>

      <div class="policy">
        <h3>Terms & Conditions</h3>
        <p>By using Minimaldoro, you agree to use this software responsibly and in accordance with applicable laws. Minimaldoro is provided "as is" without warranty of any kind. The authors are not liable for any data loss or damages arising from use of this application.</p>
      </div>

      <div class="policy">
        <h3>Privacy Policy</h3>
        <p>All your event data is stored locally on your device using SQLite. We do not collect, transmit, or share any personal information with third parties. Your data never leaves your computer.</p>
      </div>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      <div class="checks">
        <label class="check">
          <input type="checkbox" bind:checked={termsAccepted} />
          <span>I accept the <strong>Terms & Conditions</strong></span>
        </label>
        <label class="check">
          <input type="checkbox" bind:checked={privacyAccepted} />
          <span>I accept the <strong>Privacy Policy</strong></span>
        </label>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn-primary" onclick={handleAccept} disabled={!termsAccepted || !privacyAccepted}>
        Get Started
      </button>
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
    width: 460px;
    max-width: 100%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(0,0,0,0.06);
    overflow: hidden;
    animation: modal-enter 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes modal-enter {
    from { opacity: 0; transform: scale(0.94) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }

  .modal-header {
    padding: 24px 28px 20px;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #1a1d21;
    letter-spacing: -0.3px;
  }

  .modal-body {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .intro {
    font-size: 13.5px;
    color: #6b7280;
    line-height: 1.5;
    margin: 0;
  }

  .policy {
    background: #f9fafb;
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(0,0,0,0.04);
  }

  .policy h3 {
    font-size: 13px;
    font-weight: 700;
    color: #1a1d21;
    margin: 0 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  .policy p {
    font-size: 12.5px;
    color: #4b5563;
    line-height: 1.6;
    margin: 0;
  }

  .checks {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .check {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #374151;
    cursor: pointer;
    font-weight: 500;
    user-select: none;
  }

  .check input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #fa520f;
    cursor: pointer;
    flex-shrink: 0;
  }

  .error {
    font-size: 12.5px;
    color: #cc3a05;
    font-weight: 500;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 10px 12px;
  }

  .modal-footer {
    padding: 16px 28px 24px;
    display: flex;
    justify-content: flex-end;
  }

  .btn-primary {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #fa520f 0%, #ff7b00 100%);
    box-shadow: 0 4px 12px rgba(250,82,15,0.25);
    color: #fff;
    font-size: 13.5px;
    font-weight: 600;
    font-family: 'Inter', -apple-system, sans-serif;
    cursor: pointer;
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s;
  }

  .btn-primary:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(250,82,15,0.35);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
