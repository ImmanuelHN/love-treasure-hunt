export class CombinationLockGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 2: Combination Lock</h2>
        <p>${this.config.clueText}</p>
        <form id="lockForm" class="stack">
          <label class="field">
            <span>Enter Lock Code</span>
            <input name="code" inputmode="numeric" pattern="[0-9]+" required />
          </label>
          <button class="btn btn-primary" type="submit">Unlock</button>
        </form>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const form = mountEl.querySelector("#lockForm");
    const feedback = mountEl.querySelector("#feedback");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = String(new FormData(form).get("code") || "").trim();
      if (value === String(this.config.correctCode || "")) {
        feedback.textContent = "Unlocked.";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Wrong code.";
    });
  }
}