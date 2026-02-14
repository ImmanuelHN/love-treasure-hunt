export const APP_STORAGE_KEYS = {
  creatorCode: "lth_creator_code",
  encodedConfig: "lth_encoded_config",
  partnerAuth: "lth_partner_auth",
  progress: "lth_progress"
};

export function generateFourDigitCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function setCreatorCode(code) {
  localStorage.setItem(APP_STORAGE_KEYS.creatorCode, code);
}

export function getCreatorCode() {
  return localStorage.getItem(APP_STORAGE_KEYS.creatorCode) || "";
}

export function saveEncodedConfig(data) {
  sessionStorage.setItem(APP_STORAGE_KEYS.encodedConfig, data);
}

export function getSavedEncodedConfig() {
  return sessionStorage.getItem(APP_STORAGE_KEYS.encodedConfig) || "";
}

export function setPartnerAuth(partnerCode, accessKey) {
  const payload = { partnerCode, accessKey, ts: Date.now() };
  sessionStorage.setItem(APP_STORAGE_KEYS.partnerAuth, JSON.stringify(payload));
}

export function getPartnerAuth() {
  const raw = sessionStorage.getItem(APP_STORAGE_KEYS.partnerAuth);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearPartnerAuth() {
  sessionStorage.removeItem(APP_STORAGE_KEYS.partnerAuth);
}