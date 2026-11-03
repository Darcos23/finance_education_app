import { supabase } from "./supabase";
import { getBrowserSessionId, getDeviceId } from "./device";
import { getFirstTouch } from "./attribution";

export const EXPERIMENT_ID = import.meta.env.VITE_EXPERIMENT_ID || "afei-2026-2-b2c-v1";

const safeText = (value) => String(value ?? "").slice(0, 160);

export function actorFor(user) {
  return user?.id ? `user:${user.id}` : `device:${getDeviceId()}`;
}

export async function ensureExperimentSession(user = null) {
  const sessionId = getBrowserSessionId();
  const deviceId = getDeviceId();
  const now = new Date().toISOString();
  const payload = {
    id: sessionId,
    experiment_id: EXPERIMENT_ID,
    device_id: deviceId,
    user_id: user?.id || null,
    started_at: now,
    last_seen_at: now,
  };

  // Inserta una sola vez para conservar started_at. Si ya existe, solo actualiza actividad/usuario.
  await supabase.from("experiment_sessions").upsert(payload, {
    onConflict: "id",
    ignoreDuplicates: true,
  });
  await supabase
    .from("experiment_sessions")
    .update({ last_seen_at: now, user_id: user?.id || null })
    .eq("id", sessionId);
  return sessionId;
}

export async function touchSession(user = null) {
  const sessionId = getBrowserSessionId();
  await supabase
    .from("experiment_sessions")
    .update({ last_seen_at: new Date().toISOString(), user_id: user?.id || null })
    .eq("id", sessionId);
}

export async function trackEvent(eventName, {
  user = null,
  objectType = null,
  objectId = null,
  properties = {},
  once = false,
  scope = "actor",
} = {}) {
  const deviceId = getDeviceId();
  const sessionId = await ensureExperimentSession(user);
  const actorKey = actorFor(user);
  const dedupeSubject = scope === "device" ? `device:${deviceId}` : actorKey;
  const objectPart = objectId ? `:${safeText(objectId)}` : "";
  const dedupeKey = once
    ? `${EXPERIMENT_ID}:${dedupeSubject}:${safeText(eventName)}${objectPart}`
    : null;

  const payload = {
    experiment_id: EXPERIMENT_ID,
    actor_key: actorKey,
    user_id: user?.id || null,
    device_id: deviceId,
    session_id: sessionId,
    event_name: safeText(eventName),
    object_type: objectType ? safeText(objectType) : null,
    object_id: objectId ? safeText(objectId) : null,
    properties,
    dedupe_key: dedupeKey,
  };

  const { error } = await supabase.from("analytics_events").insert(payload);
  if (error && error.code !== "23505") {
    console.warn("FinPath analytics:", eventName, error.message);
  }
}

export const analytics = {
  uniqueVisit: (user = null) => user
    ? trackEvent("unique_participant", { user, once: true, scope: "actor" })
    : trackEvent("unique_device_visit", { user:null, once:true, scope:"device", properties:getFirstTouch() }),
  sessionStarted: (user = null) => trackEvent("session_started", {
    user,
    objectId: getBrowserSessionId(),
    once: true,
  }),
  pageView: (route, user = null) => trackEvent("page_view", {
    user,
    objectType: "route",
    objectId: route,
    properties: { route },
  }),
  once: (eventName, args = {}) => trackEvent(eventName, { ...args, once: true }),
  event: trackEvent,
};
