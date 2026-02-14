const { store, cleanupExpired } = require("./_store");

module.exports = async function handler(req, res) {
  cleanupExpired();

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const id = String(req.query?.id || "").trim();
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  const item = store.get(id);
  if (!item) {
    res.status(404).json({ error: "Config not found or expired" });
    return;
  }

  if (item.expiresAt <= Date.now()) {
    store.delete(id);
    res.status(404).json({ error: "Config expired" });
    return;
  }

  res.status(200).json(item.configData);
};
