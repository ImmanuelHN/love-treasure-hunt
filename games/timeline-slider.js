export class TimelineSliderGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 2: Timeline Slider</h2>
        <p>Slide to the exact point your creator chose.</p>
        <div class="timeline-labels">
          <span>${this.config.pastLabel}</span>
          <span>${this.config.presentLabel}</span>
          <span>${this.config.futureLabel}</span>
        </div>
        <form id="timelineForm" class="stack">
          <input id="timelineInput" name="position" type="range" min="0" max="100" value="50" />
          <p class="muted">Current: <span id="timelineValue">50</span></p>
          <button class="btn btn-primary" type="submit">Confirm Position</button>
        </form>
        <p id="feedback" class="muted"></p>
      </section>
    `;

    const form = mountEl.querySelector("#timelineForm");
    const input = mountEl.querySelector("#timelineInput");
    const output = mountEl.querySelector("#timelineValue");
    const feedback = mountEl.querySelector("#feedback");

    input.addEventListener("input", () => {
      output.textContent = input.value;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = Number(new FormData(form).get("position"));
      const expected = Number(this.config.correctPosition);
      if (value === expected) {
        feedback.textContent = "Exactly right.";
        setTimeout(() => this.onComplete(), 600);
        return;
      }
      feedback.textContent = "Not exact. Try again.";
    });
  }
}