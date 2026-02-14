export function encodeConfig(config) {
  try {
    const json = JSON.stringify(config);
    return btoa(unescape(encodeURIComponent(json)));
  } catch (e) {
    console.error("Encode failed:", e);
    return null;
  }
}

export function decodeConfigFromURL() {
  const params = new URLSearchParams(window.location.search);
  const data = params.get("data");
  if (!data) return { error: "MISSING_DATA" };

  try {
    const json = decodeURIComponent(escape(atob(data)));
    const config = JSON.parse(json);
    return { config };
  } catch (e) {
    console.error("Decode failed:", e);
    return { error: "DECODE_FAILED" };
  }
}
