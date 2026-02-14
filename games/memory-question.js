export class MemoryQuestionGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 1: Memory Question</h2>
        <p>${this.config.promptText}</p>
        <form id="memoryForm" class="stack">
          <label class="field">
            <span>Your Answer</span>
            <input name="answer" required />
          </label>
          <button class="btn btn-primary" type="submit">Check</button>
        </form>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const form = mountEl.querySelector("#memoryForm");
    const feedback = mountEl.querySelector("#feedback");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const userAnswer = String(new FormData(form).get("answer") || "").trim().toLowerCase();
      const expected = String(this.config.expectedAnswer || "").trim().toLowerCase();

      if (userAnswer === expected) {
        feedback.textContent = "Perfect memory. Moving ahead...";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Close, but not the expected answer.";
    });
  }
}