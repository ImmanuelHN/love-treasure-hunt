import { APP_STORAGE_KEYS } from "./auth.js";
import { getGameClass, getGameCountForMap, getMapCount } from "./game-registry.js";

export class GameFlowController {
  constructor({ mountEl, progressEl, titleEl }) {
    this.mountEl = mountEl;
    this.progressEl = progressEl;
    this.titleEl = titleEl;
    this.currentMap = 1;
    this.currentGame = 1;
    this.data = window.GAME_DATA;
  }

  init() {
    this.titleEl.textContent = this.data?.meta?.title || "Love Treasure Hunt";
    this.restoreProgress();
    this.renderCurrentGame();
  }

  getProgressKey() {
    const partnerCode = this.data?.auth?.partnerCode || "anon";
    return `${APP_STORAGE_KEYS.progress}_${partnerCode}`;
  }

  saveProgress() {
    const payload = { map: this.currentMap, game: this.currentGame };
    sessionStorage.setItem(this.getProgressKey(), JSON.stringify(payload));
  }

  restoreProgress() {
    const raw = sessionStorage.getItem(this.getProgressKey());
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      this.currentMap = parsed.map || 1;
      this.currentGame = parsed.game || 1;
    } catch {
      this.currentMap = 1;
      this.currentGame = 1;
    }
  }

  markGameComplete() {
    const mapGameCount = getGameCountForMap(this.currentMap);
    if (this.currentGame < mapGameCount) {
      this.currentGame += 1;
      this.saveProgress();
      this.renderCurrentGame();
      return;
    }

    if (this.currentMap < getMapCount()) {
      this.currentMap += 1;
      this.currentGame = 1;
      this.saveProgress();
      this.renderCurrentGame();
      return;
    }

    this.showFinishedState();
  }

  showFinishedState() {
    this.progressEl.textContent = "Treasure hunt complete.";
    this.mountEl.innerHTML = `
      <div class="stack center fade-enter-active">
        <h2>Completed</h2>
        <p class="muted">You reached the end of your love treasure hunt.</p>
      </div>
    `;
  }

  getGameConfig(mapNum, gameNum) {
    return this.data?.maps?.[`map${mapNum}`]?.[`game${gameNum}`] || {};
  }

  renderCurrentGame() {
    this.mountEl.classList.remove("fade-enter-active");
    this.mountEl.classList.add("fade-enter");
    this.mountEl.innerHTML = "";
    this.progressEl.textContent = `Map ${this.currentMap} • Game ${this.currentGame}`;

    const GameClass = getGameClass(this.currentMap, this.currentGame);
    if (!GameClass) {
      this.mountEl.innerHTML = `<p class="error">Game module missing for Map ${this.currentMap}, Game ${this.currentGame}.</p>`;
      return;
    }

    const config = this.getGameConfig(this.currentMap, this.currentGame);
    const game = new GameClass({
      config,
      mapNum: this.currentMap,
      gameNum: this.currentGame,
      onComplete: () => this.markGameComplete()
    });

    requestAnimationFrame(() => {
      this.mountEl.classList.add("fade-enter-active");
    });

    game.render(this.mountEl);
  }
}