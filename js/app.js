import {
  clearPartnerAuth,
  generateFourDigitCode,
  getCreatorCode,
  getPartnerAuth,
  saveEncodedConfig,
  setCreatorCode,
  setPartnerAuth
} from "./auth.js";
import {
  buildConfigFromForm,
  encodeConfig,
  generateEncodedShareLink,
  generateSavedIdShareLink,
  saveConfigToBackend
} from "./config-generator.js";
import { getConfigIdFromUrl, loadGameData } from "./config-loader.js";
import { GameFlowController } from "./game-flow.js";

function byId(id) {
  return document.getElementById(id);
}

function applyPageTransition() {
  document.body.classList.add("fade-enter");
  requestAnimationFrame(() => {
    document.body.classList.add("fade-enter-active");
  });
}

function spawnFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = ["\u2764", "\uD83D\uDC95", "\uD83D\uDC97", "\uD83D\uDC96"][Math.floor(Math.random() * 4)];
  heart.style.left = `${Math.random() * 100}vw`;
  heart.style.animationDuration = `${7 + Math.random() * 6}s`;
  heart.style.fontSize = `${12 + Math.random() * 14}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}

function initFloatingHearts() {
  setInterval(spawnFloatingHeart, 2400);
}

function spawnFloatingEmoji() {
  const emoji = document.createElement("div");
  emoji.className = "floating-emoji";
  const emojiList = [
    "\uD83D\uDC96", "\u2728", "\uD83E\uDD70", "\uD83D\uDC3B", "\uD83D\uDC9E",
    "\uD83E\uDEF6", "\uD83E\uDEC2", "\uD83D\uDE0D", "\uD83D\uDE18", "\uD83D\uDE3B",
    "\uD83E\uDD17", "\uD83D\uDC96", "\uD83D\uDC97", "\uD83E\uDEF0\uD83C\uDFFD", "\uD83C\uDF39"
  ];
  emoji.innerText = emojiList[Math.floor(Math.random() * emojiList.length)];
  emoji.style.left = `${Math.random() * 90}%`;
  document.body.appendChild(emoji);
  setTimeout(() => emoji.remove(), 6000);
}

function initFloatingEmojis() {
  setInterval(spawnFloatingEmoji, 2500);
}

function spawnSparkle(x, y) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  sparkle.textContent = "\u2726";
  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 900);
}

function initSparkleTrail() {
  let last = 0;
  window.addEventListener("pointermove", (event) => {
    const now = Date.now();
    if (now - last < 40) return;
    last = now;
    spawnSparkle(event.clientX, event.clientY);
  });
}

function sparkleBurst(x, y, count = 8) {
  for (let i = 0; i < count; i += 1) {
    setTimeout(() => {
      const offsetX = x + (Math.random() - 0.5) * 36;
      const offsetY = y + (Math.random() - 0.5) * 24;
      spawnSparkle(offsetX, offsetY);
    }, i * 20);
  }
}

function addRippleEffect(button, event) {
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 620);
}

function initButtonEffects() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button, .btn, .primary-btn");
    if (!button) return;
    if (event.clientX && event.clientY) {
      addRippleEffect(button, event);
      sparkleBurst(event.clientX, event.clientY, 7);
    }
  });
}

function launchConfetti(anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  for (let i = 0; i < 24; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.left = `${rect.left + rect.width / 2}px`;
    piece.style.top = `${rect.top + rect.height / 2}px`;
    piece.style.setProperty("--dx", `${(Math.random() - 0.5) * 260}px`);
    piece.style.setProperty("--dy", `${-40 - Math.random() * 180}px`);
    piece.style.background = ["#ff4d6d", "#ff8fa3", "#ffd166", "#f28482"][Math.floor(Math.random() * 4)];
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 1200);
  }
}

async function bootCreatorPage() {
  const authCard = byId("creatorAuthCard");
  const formCard = byId("creatorFormCard");
  const authMessage = byId("creatorAuthMessage");
  const codeInput = byId("creatorCodeInput");
  const useCodeBtn = byId("useCreatorCodeBtn");
  const generateBtn = byId("generateCreatorCodeBtn");
  const form = byId("creatorForm");
  const output = byId("creatorOutput");
  const partnerCodeOut = byId("partnerCodeOut");
  const shareLinkOut = byId("shareLinkOut");
  const saveModeOut = byId("saveModeOut");
  const generateHuntBtn = byId("generateHuntBtn");

  const savedCode = getCreatorCode();
  if (savedCode) {
    codeInput.value = savedCode;
  }

  function unlockForm(code) {
    setCreatorCode(code);
    authMessage.textContent = `Creator code active: ${code}`;
    authCard.classList.add("hidden");
    formCard.classList.remove("hidden");
  }

  useCodeBtn.addEventListener("click", () => {
    const code = codeInput.value.trim();
    if (!/^\d{4}$/.test(code)) {
      authMessage.textContent = "Creator code must be exactly 4 digits.";
      return;
    }
    unlockForm(code);
  });

  generateBtn.addEventListener("click", () => {
    const code = generateFourDigitCode();
    codeInput.value = code;
    unlockForm(code);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    generateHuntBtn.disabled = true;

    try {
      const config = buildConfigFromForm(form);
      const encoded = encodeConfig(config);
      saveEncodedConfig(encoded);

      const expiryHours = Number(new FormData(form).get("expiryOption") || 0);
      let shareLink = generateEncodedShareLink(encoded);
      let saveModeLabel = "Link-only mode (encoded URL).";

      if (expiryHours > 0) {
        try {
          const saved = await saveConfigToBackend(config, expiryHours);
          if (saved?.id) {
            shareLink = generateSavedIdShareLink(saved.id);
            const expiresAt = saved.expiresAt ? new Date(saved.expiresAt).toLocaleString() : "unknown";
            saveModeLabel = `Temporary backend save active for ${expiryHours}h (expires: ${expiresAt}).`;
          }
        } catch {
          saveModeLabel = `Backend save failed, using encoded link fallback.`;
        }
      }

      partnerCodeOut.textContent = config.auth.partnerCode;
      shareLinkOut.value = shareLink;
      saveModeOut.textContent = saveModeLabel;
      output.classList.remove("hidden");
      launchConfetti(generateHuntBtn);
    } finally {
      generateHuntBtn.disabled = false;
    }
  });
}

async function bootPartnerPage() {
  const form = byId("partnerLoginForm");
  const codeInput = byId("partnerCodeInput");
  const messageEl = byId("partnerLoginMessage");

  const loaded = await loadGameData();
  if (!loaded?.config) {
    messageEl.textContent = "Missing or invalid link data. Ask the creator for a valid link.";
    form.querySelector("button[type='submit']").disabled = true;
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const entered = codeInput.value.trim();
    const expected = String(loaded.config?.auth?.partnerCode || "");

    if (entered !== expected) {
      messageEl.textContent = "Incorrect code. Try again.";
      return;
    }

    setPartnerAuth(entered, loaded.accessKey);
    const next = new URL("play.html", window.location.origin);
    if (loaded.sourceType === "saved-id" && loaded.id) {
      next.searchParams.set("id", loaded.id);
    } else {
      next.searchParams.set("data", loaded.encoded);
    }
    window.location.href = next.toString();
  });
}

async function bootPlayPage() {
  const loaded = await loadGameData();
  if (!loaded?.config) {
    clearPartnerAuth();
    window.location.href = "partner.html";
    return;
  }

  const auth = getPartnerAuth();
  const expectedCode = String(loaded.config?.auth?.partnerCode || "");
  if (loaded.sourceType === "session-game-data") {
    const flow = new GameFlowController({
      mountEl: byId("gameMount"),
      progressEl: byId("progressLabel"),
      titleEl: byId("huntTitle")
    });
    flow.init();
    return;
  }

  if (!auth || auth.partnerCode !== expectedCode || auth.accessKey !== loaded.accessKey) {
    const login = new URL("partner.html", window.location.origin);
    const id = getConfigIdFromUrl();
    if (id) {
      login.searchParams.set("id", id);
    } else {
      login.searchParams.set("data", loaded.encoded);
    }
    window.location.href = login.toString();
    return;
  }

  const flow = new GameFlowController({
    mountEl: byId("gameMount"),
    progressEl: byId("progressLabel"),
    titleEl: byId("huntTitle")
  });

  flow.init();
}

async function init() {
  applyPageTransition();
  initFloatingHearts();
  initFloatingEmojis();
  initSparkleTrail();
  initButtonEffects();

  const page = document.body.dataset.page;
  if (page === "creator") await bootCreatorPage();
  if (page === "partner") await bootPartnerPage();
  if (page === "play") await bootPlayPage();
}

init();
