export class YearSelectorGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    const years = (this.config.years || []).filter(Boolean).slice(0, 3);
    let selectedYear = null;

    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 2: Best Year Selector</h2>
        <p>Pick the special year selected by your creator.</p>
        <div class="year-slider" id="yearSlider">
          ${years
            .map(
              (year) => `
            <div class="year-option" data-value="${year}">${year}</div>
          `
            )
            .join("")}
        </div>
        <button id="submitYear" class="btn btn-primary" type="button">Submit</button>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const options = Array.from(mountEl.querySelectorAll(".year-option"));
    const submitBtn = mountEl.querySelector("#submitYear");
    const feedback = mountEl.querySelector("#feedback");

    options.forEach((opt) => {
      opt.addEventListener("click", () => {
        options.forEach((item) => item.classList.remove("active"));
        opt.classList.add("active");
        selectedYear = opt.dataset.value;
      });
    });

    submitBtn.addEventListener("click", () => {
      if (!selectedYear) {
        feedback.textContent = "Choose one year first.";
        return;
      }

      if (selectedYear === this.config.correctYear) {
        feedback.textContent = "Correct year selected.";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Try again 💖";
    });
  }
}
