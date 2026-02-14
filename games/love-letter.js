export class LoveLetterGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  render(mountEl) {
    const lines = this.config.letterLines || [];
    let index = 0;

    mountEl.innerHTML = `
      <section class="stack">
        <h2>Map 3: Love Letter Reveal</h2>
        <p class="muted">Reveal the letter one line at a time.</p>
        <article class="letter" id="letterArea"></article>
        <div class="actions">
          <button class="btn btn-primary" id="nextLineBtn" type="button">Reveal Next Line</button>
        </div>
      </section>
    `;

    const letterArea = mountEl.querySelector("#letterArea");
    const nextBtn = mountEl.querySelector("#nextLineBtn");

    nextBtn.addEventListener("click", () => {
      if (index < lines.length) {
        const p = document.createElement("p");
        p.textContent = lines[index];
        p.className = "fade-in";
        letterArea.appendChild(p);
        index += 1;
      }

      if (index >= lines.length) {
        nextBtn.disabled = true;
        nextBtn.textContent = "Continue";
        setTimeout(() => this.onComplete(), 700);
      }
    });
  }
}