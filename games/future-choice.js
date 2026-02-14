function normalizeIndexes(indexes) {
  return [...new Set((indexes || []).map((n) => Number(n)).filter((n) => Number.isInteger(n) && n >= 0))].sort((a, b) => a - b);
}

export class FutureChoiceGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    const options = this.config.options || [];
    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 3: Future Promise Selection</h2>
        <p>Select all promises that were intended.</p>
        <form id="futureForm" class="stack">
          ${options
            .map(
              (option, idx) => `
                <label class="option-row">
                  <input type="checkbox" name="opt" value="${idx}" />
                  <span>${option}</span>
                </label>
              `
            )
            .join("")}
          <button class="btn btn-primary" type="submit">Lock Choices</button>
        </form>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const form = mountEl.querySelector("#futureForm");
    const feedback = mountEl.querySelector("#feedback");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = normalizeIndexes(
        Array.from(form.querySelectorAll("input[name='opt']:checked")).map((el) => Number(el.value))
      );
      const expected = normalizeIndexes(this.config.correctIndexes);
      const pass = selected.length === expected.length && selected.every((value, idx) => value === expected[idx]);

      if (pass) {
        feedback.textContent = "Promises matched.";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "This set does not match yet.";
    });
  }
}