import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useApp } from "./AppContext";
import { analytics } from "../lib/analytics";

// Modo guía (recorrido de primer uso). Solo interfaz: la preferencia vive en localStorage por usuario.
// Los pasos se CALCULAN con datos reales; nunca se guarda un índice.
const GuideContext = createContext(null);

export const GUIDE_TOTAL = 6;
const prefKey = (userId) => `finpath_guide_v1_${userId}`;
const welcomeKey = (userId) => `finpath_guide_welcome_v1_${userId}`;
const readStorage = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const writeStorage = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Solo UI */ } };

// true si pathname es base o una ruta hija de base (/goals → /goals/new, /goals/ideas…).
export const isUnder = (pathname, base) => pathname === base || pathname.startsWith(`${base}/`);
const HIDDEN_ROUTES = ["/triage", "/checkout", "/fin"];

export function buildGuideSteps({ completedLessons = [], goals = [], simulatorRuns = [],
  premiumDemoDone = false, premiumDecisionMade = false, exitSurveyDone = false } = {}) {
  return [
    { id: "lesson", done: completedLessons.length >= 1, to: "/app", target: "start-lesson",
      title: "Practica con tu primera lección",
      text: "Es la lección que tu diagnóstico eligió para ti. Si te equivocas, FinPath te da un caso extra para reforzar." },
    { id: "goal", done: goals.length >= 1, to: "/goals", target: "create-goal",
      title: "Crea una meta tuya",
      text: "Algo real: ahorrar para algo, ponerle límite a un gasto o abonar una deuda." },
    { id: "simulator", done: simulatorRuns.length >= 1, to: "/simulators", target: "sim-micro_expenses",
      title: "Mide un gasto que repites",
      text: "Usa el simulador de gastos hormiga con un gasto real tuyo." },
    // Se cumple con la muestra o con una decisión: quien decidió sin usar la muestra no queda atascado aquí.
    { id: "premium", done: premiumDemoDone || premiumDecisionMade, to: "/premium", target: "premium-demo",
      title: "Conoce Premium y prueba una muestra",
      text: "Puedes generar gratis, una vez, tu radiografía financiera." },
    { id: "decide", done: premiumDecisionMade, to: "/premium", target: "premium-decision",
      title: "Decide si Premium te interesa",
      text: "Puedes aceptar o decir que no. Las dos respuestas nos ayudan." },
    { id: "survey", done: exitSurveyDone, to: "/fin", target: null,
      title: "Cuéntanos qué te pareció",
      text: "Son 2 minutos. Al final verás tu pantalla de cierre." },
  ];
}

export function GuideProvider({ children }) {
  const { user } = useAuth();
  const { initialized, triage, completedLessons, goals, simulatorRuns,
    premiumDemoDone, premiumDecisionMade, exitSurveyDone } = useApp();
  const location = useLocation();
  const userId = user?.id || null;
  const [pref, setPref] = useState(null);
  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [loadedFor, setLoadedFor] = useState(null);

  useEffect(() => {
    if (!userId) { setPref(null); setWelcomeSeen(false); setLoadedFor(null); return; }
    const saved = readStorage(prefKey(userId));
    setPref(saved === "on" || saved === "off" ? saved : null);
    setWelcomeSeen(readStorage(welcomeKey(userId)) === "seen");
    setLoadedFor(userId);
  }, [userId]);

  const steps = useMemo(() => buildGuideSteps({ completedLessons, goals, simulatorRuns,
    premiumDemoDone, premiumDecisionMade, exitSurveyDone }),
  [completedLessons.length, goals.length, simulatorRuns.length, premiumDemoDone, premiumDecisionMade, exitSurveyDone]);
  const currentIndex = steps.findIndex((step) => !step.done);
  const current = currentIndex >= 0 ? { ...steps[currentIndex], number: currentIndex + 1 } : null;

  const pathname = location.pathname;
  const ready = Boolean(userId && loadedFor === userId && initialized && triage);
  // Sin preferencia guardada la guía se considera activada (primer uso).
  const enabled = pref !== "off";
  const active = ready && !exitSurveyDone && enabled && Boolean(current);
  const showWelcome = ready && !exitSurveyDone && pref === null && !welcomeSeen && pathname === "/app";
  const barVisible = active && !showWelcome && !HIDDEN_ROUTES.some((route) => isUnder(pathname, route));

  const startGuide = useCallback(async () => {
    if (!userId) return;
    writeStorage(prefKey(userId), "on"); writeStorage(welcomeKey(userId), "seen");
    setPref("on"); setWelcomeSeen(true);
    await analytics.once("guide_started", { user });
  }, [userId]);

  const disableGuide = useCallback(async (at, stepId = null) => {
    if (!userId) return;
    writeStorage(prefKey(userId), "off"); writeStorage(welcomeKey(userId), "seen");
    setPref("off"); setWelcomeSeen(true);
    await analytics.event("guide_disabled", { user, properties: stepId ? { at, step: stepId } : { at } });
  }, [userId]);

  const enableGuide = useCallback(async () => {
    if (!userId) return;
    writeStorage(prefKey(userId), "on"); writeStorage(welcomeKey(userId), "seen");
    setPref("on"); setWelcomeSeen(true);
    await analytics.event("guide_reenabled", { user });
  }, [userId]);

  // Se llama al enviar la encuesta final (paso 6). Solo cuenta si la guía no estaba desactivada,
  // así la consulta 29 distingue "siguió la guía" de "llegó por su cuenta".
  const completeGuide = useCallback(async () => {
    if (!userId || pref === "off") return;
    await analytics.once("guide_completed", { user });
  }, [userId, pref]);

  const value = useMemo(() => ({
    steps, current, total: GUIDE_TOTAL, pref, enabled, active, showWelcome, barVisible,
    startGuide, disableGuide, enableGuide, completeGuide,
  }), [steps, current?.id, pref, enabled, active, showWelcome, barVisible,
    startGuide, disableGuide, enableGuide, completeGuide]);

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export const useGuide = () => useContext(GuideContext);
