import { generateFourDigitCode, getCreatorCode } from "./auth.js";

function splitLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseIndexes(value) {
  return value
    .split(",")
    .map((n) => Number(n.trim()))
    .filter((n) => Number.isInteger(n) && n >= 0);
}

function toBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)));
}

export function buildConfigFromForm(form) {
  const fd = new FormData(form);
  const creatorCode = getCreatorCode() || generateFourDigitCode();
  const partnerCode = generateFourDigitCode();

  return {
    meta: {
      title: String(fd.get("metaTitle") || "Our Love Treasure Hunt")
    },
    auth: {
      creatorCode,
      partnerCode
    },
    contact: {
      phone: String(fd.get("partnerPhone") || "").trim()
    },
    maps: {
      map1: {
        game1: {
          type: "quiz-choice",
          question: String(fd.get("m1g1Question") || ""),
          options: [fd.get("m1g1A"), fd.get("m1g1B"), fd.get("m1g1C")].map((x) => String(x || "")),
          correctIndex: Number(fd.get("m1g1Correct"))
        },
        game2: {
          type: "memory-question",
          promptText: String(fd.get("m1g2Prompt") || ""),
          expectedAnswer: String(fd.get("m1g2Answer") || "")
        }
      },
      map2: {
        game1: {
          type: "combination-lock",
          clueText: String(fd.get("m2g1Clue") || ""),
          correctCode: String(fd.get("m2g1Code") || "")
        },
        game2: {
          type: "timeline-slider",
          pastLabel: String(fd.get("m2g2Past") || ""),
          presentLabel: String(fd.get("m2g2Present") || ""),
          futureLabel: String(fd.get("m2g2Future") || ""),
          correctPosition: Number(fd.get("m2g2Position"))
        }
      },
      map3: {
        game1: {
          type: "future-choice",
          options: splitLines(String(fd.get("m3g1Options") || "")),
          correctIndexes: parseIndexes(String(fd.get("m3g1Correct") || ""))
        },
        game2: {
          type: "love-letter",
          letterLines: splitLines(String(fd.get("m3g2Lines") || ""))
        }
      },
      map4: {
        game1: {
          type: "multi-memory-quiz",
          question: String(fd.get("m4g1Question") || ""),
          options: splitLines(String(fd.get("m4g1Options") || "")),
          correctIndex: Number(fd.get("m4g1Correct"))
        }
      },
      map5: {
        game1: {
          type: "progressive-letter",
          lines: splitLines(String(fd.get("m5g1Lines") || ""))
        },
        game2: {
          type: "final-cinematic",
          confessionText: String(fd.get("m5g2Confession") || ""),
          finalMessage: String(fd.get("m5g2Message") || "")
        }
      }
    },
    final: {
      confession: String(fd.get("m5g2Confession") || ""),
      finalMessage: String(fd.get("m5g2Message") || "")
    }
  };
}

export function encodeConfig(config) {
  return toBase64Unicode(JSON.stringify(config));
}

export async function saveConfigToBackend(configData, expiryHours) {
  const response = await fetch("/api/saveConfig", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ configData, expiryHours })
  });

  if (!response.ok) {
    throw new Error(`saveConfig failed with ${response.status}`);
  }

  return response.json();
}

export function generateEncodedShareLink(encodedData) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/partner.html?data=${encodeURIComponent(encodedData)}`;
}

export function generateSavedIdShareLink(id) {
  const baseUrl = window.location.origin;
  return `${baseUrl}/partner.html?id=${encodeURIComponent(id)}`;
}
