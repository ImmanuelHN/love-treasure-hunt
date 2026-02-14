const store = globalThis.__LTH_CONFIG_STORE__ || new Map();
globalThis.__LTH_CONFIG_STORE__ = store;

function cleanupExpired() {
  const now = Date.now();
  for (const [id, item] of store.entries()) {
    if (item.expiresAt <= now) {
      store.delete(id);
    }
  }
}

module.exports = {
  store,
  cleanupExpired
};