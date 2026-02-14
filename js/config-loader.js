import { getSavedEncodedConfig, saveEncodedConfig } from "./auth.js";

function fromBase64Unicode(base64) {
  return decodeURIComponent(escape(atob(base64)));
}

function toBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function getEncodedDataFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("data") || "";
}

export function getConfigIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id") || "";
}

export function decodeConfig(encodedData) {
  try {
    return JSON.parse(fromBase64Unicode(encodedData));
  } catch {
    return null;
  }
}

export async function loadConfigFromId(id) {
  const response = await fetch(`/api/loadConfig?id=${encodeURIComponent(id)}`);
  if (!response.ok) return null;

  const payload = await response.json();
  if (!payload?.configData) return null;
  return payload.configData;
}

export async function loadGameData() {
  const rawSessionData = sessionStorage.getItem("GAME_DATA");
  if (rawSessionData) {
    try {
      const parsed = JSON.parse(rawSessionData);
      window.GAME_DATA = parsed;
      return {
        config: parsed,
        encoded: "",
        sourceType: "session-game-data",
        accessKey: "session-game-data"
      };
    } catch {
      sessionStorage.removeItem("GAME_DATA");
    }
  }

  const urlData = getEncodedDataFromUrl();
  if (urlData) {
    const parsed = decodeConfig(urlData);
    if (!parsed) return null;
    saveEncodedConfig(urlData);
    window.GAME_DATA = parsed;
    return {
      config: parsed,
      encoded: urlData,
      sourceType: "encoded",
      accessKey: `data:${urlData}`
    };
  }

  const id = getConfigIdFromUrl();
  if (id) {
    const config = await loadConfigFromId(id);
    if (!config) return null;
    const encoded = toBase64Unicode(JSON.stringify(config));
    saveEncodedConfig(encoded);
    window.GAME_DATA = config;
    return {
      config,
      encoded,
      sourceType: "saved-id",
      id,
      accessKey: `id:${id}`
    };
  }

  const saved = getSavedEncodedConfig();
  if (!saved) return null;
  const parsed = decodeConfig(saved);
  if (!parsed) return null;

  window.GAME_DATA = parsed;
  return {
    config: parsed,
    encoded: saved,
    sourceType: "session",
    accessKey: `data:${saved}`
  };
}
