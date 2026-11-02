const DEVICE_KEY = "finpath_device_id";
const SESSION_KEY = "finpath_experiment_session";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function getDeviceId() {
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
  }
  return id;
}

export function getBrowserSessionId() {
  const now = Date.now();
  const raw = sessionStorage.getItem(SESSION_KEY);
  let parsed = null;
  try { parsed = raw ? JSON.parse(raw) : null; } catch { parsed = null; }

  if (!parsed?.id || !parsed?.lastSeen || now - Number(parsed.lastSeen) > SESSION_TIMEOUT_MS) {
    parsed = { id: crypto.randomUUID(), lastSeen: now };
  } else {
    parsed.lastSeen = now;
  }

  sessionStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
  return parsed.id;
}

export function clearBrowserSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
