function renderChoices({ title, question, options, onSubmit }) {
  return `
    <section class="stack">
      <h2>${title}</h2>
      <p>${question}</p>
      <form id="choiceForm" class="stack">
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
}

export class QuizChoiceGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    mountEl.innerHTML = renderChoices({
      title: "Map 1: Quiz Choice",
      question: this.config.question,
      options: this.config.options || [],
      onSubmit: this.onComplete
    });

    const form = mountEl.querySelector("#choiceForm");
    const feedback = mountEl.querySelector("#feedback");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const selected = Number(new FormData(form).get("choice"));
      if (selected === Number(this.config.correctIndex)) {
        feedback.textContent = "Correct. Unlocking next game...";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Not quite. Try once more.";
    });
  }
}