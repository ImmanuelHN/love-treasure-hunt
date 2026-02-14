export class MultiMemoryQuizGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    const options = this.config.options || [];
    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 4: Multi Memory Quiz</h2>
        <p>${this.config.question}</p>
        <form id="multiForm" class="stack">
          ${options
            .map(
              (option, idx) => `
                <label class="option-row">
                  <input type="radio" name="choice" value="${idx}" required />
                  <span>${option}</span>
                </label>
              `
            )
            .join("")}
          <button class="btn btn-primary" type="submit">Submit</button>
        </form>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const form = mountEl.querySelector("#multiForm");
    const feedback = mountEl.querySelector("#feedback");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = Number(new FormData(form).get("choice"));
      if (selected === Number(this.config.correctIndex)) {
        feedback.textContent = "Correct.";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Try again.";
    });
  }
}