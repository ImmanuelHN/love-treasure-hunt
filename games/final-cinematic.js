function typewriter(target, text, speed = 32) {
  let i = 0;
  target.textContent = "";

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      target.textContent += text.charAt(i);
      i += 1;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

export class FinalCinematicGame {
  constructor({ config, onComplete }) {
    this.config = config;
    this.onComplete = onComplete;
  }

  async render(mountEl) {
    const autoPingText = "Hey my love \uD83D\uDC96 I just completed our journey... will you say YES? \uD83E\uDD7A\uD83D\uDC8D";
    mountEl.innerHTML = `
      <section class="final-screen centered stack center">
        <h1>Our Journey Ends Here \uD83D\uDC9E</h1>
        <p id="confessionText" class="typewriter confession-text final-confession typed-confession"></p>
        <p id="finalMessage" class="final-message hidden"></p>
        <p id="autoPingText" class="muted hidden"></p>
        <button id="pingBtn" class="btn btn-primary primary-btn hidden" type="button">Send this message to me \uD83D\uDCE9</button>
        <button id="finishBtn" class="btn btn-primary primary-btn hidden" type="button">Send My Answer \uD83D\uDC8C</button>
      </section>
    `;

    const confessionEl = mountEl.querySelector("#confessionText");
    const messageEl = mountEl.querySelector("#finalMessage");
    const autoPingEl = mountEl.querySelector("#autoPingText");
    const pingBtn = mountEl.querySelector("#pingBtn");
    const finishBtn = mountEl.querySelector("#finishBtn");

    const confession = this.config.confessionText || window.GAME_DATA?.final?.confession || "";
    const finalMessage = this.config.finalMessage || window.GAME_DATA?.final?.finalMessage || "";
    const phone = String(window.GAME_DATA?.contact?.phone || "").trim();

    await typewriter(confessionEl, confession);
    messageEl.textContent = finalMessage;
    messageEl.classList.remove("hidden");
    messageEl.classList.add("fade-in");

    autoPingEl.classList.remove("hidden");
    await typewriter(autoPingEl, autoPingText, 26);
    autoPingEl.classList.add("fade-in");

    if (phone) {
      pingBtn.classList.remove("hidden");
      pingBtn.addEventListener("click", () => {
        const phoneNumber = phone.replace(/[^\d]/g, "");
        const message = encodeURIComponent(autoPingText);
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }

    finishBtn.classList.remove("hidden");

    finishBtn.addEventListener("click", () => this.onComplete());
  }
}
