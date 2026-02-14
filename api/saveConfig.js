const crypto = require("crypto");
const { store, cleanupExpired } = require("./_store");

module.exports = async function handler(req, res) {
  cleanupExpired();

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { configData, expiryHours } = req.body || {};

    if (!configData || typeof configData !== "object") {
      res.status(400).json({ error: "configData must be an object" });
      return;
    }

    const hours = Number(expiryHours);
    if (!Number.isFinite(hours) || hours <= 0) {
      res.status(400).json({ error: "expiryHours must be greater than 0" });
      return;
    }

    const id = crypto.randomBytes(6).toString("hex");
    const expiresAt = Date.now() + hours * 60 * 60 * 1000;

    store.set(id, {
      configData,
      expiresAt
    });

    res.status(200).json({
      id,
      expiresAt
    });
  } catch {
    res.status(500).json({ error: "Failed to save config" });
  }
};