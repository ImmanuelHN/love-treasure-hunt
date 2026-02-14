export class ProgressiveLetterGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    const lines = this.config.lines || [];
    let visibleCount = 0;

    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 5: Progressive Letter</h2>
        <article id="progressiveLetter" class="letter"></article>
        <button id="progressiveBtn" class="btn btn-primary" type="button">Reveal</button>
      </section>
    `;

    const letter = mountEl.querySelector("#progressiveLetter");
    const button = mountEl.querySelector("#progressiveBtn");

    button.addEventListener("click", () => {
      visibleCount += 1;
      letter.innerHTML = lines
        .slice(0, visibleCount)
        .map((line) => `<p class="fade-in">${line}</p>`)
        .join("");

      if (visibleCount >= lines.length) {
        button.disabled = true;
        button.textContent = "Continue";
        setTimeout(() => this.onComplete(), 700);
      }
    });
  }
}