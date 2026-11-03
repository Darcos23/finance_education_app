import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { appService } from "../services/appService";
import { calculateStreak } from "../lib/streak";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [triage, setTriage] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [goals, setGoals] = useState([]);
  const [experimentState, setExperimentState] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const [dataError,setDataError] = useState(null);
  const [goalEntries,setGoalEntries] = useState([]);
  const [simulatorRuns,setSimulatorRuns] = useState([]);
  const [activeDays,setActiveDays] = useState([]);
  const [skillChecks,setSkillChecks] = useState([]);
  const [benefitCheckins,setBenefitCheckins] = useState([]);
  const [sessionCount,setSessionCount] = useState(0);
  // initialized: true tras la PRIMERA carga del usuario actual (éxito o error). Las recargas no lo tocan.
  const [initialized,setInitialized] = useState(false);
  const [flags,setFlags] = useState(() => new Set());
  // Evita que una carga anterior (u otro usuario) escriba datos o marque initialized para el usuario actual.
  const currentUserId = useRef(user?.id || null);
  currentUserId.current = user?.id || null;
  const loadSeq = useRef(0);

  const refresh = async () => {
    if (!user) {
      setTriage(null); setLessons([]); setGoals([]); setExperimentState(null);
      setGoalEntries([]);setSimulatorRuns([]);setActiveDays([]);setSkillChecks([]);setBenefitCheckins([]);
      setSessionCount(0);setDataError(null);setHydrated(false);setLoadingData(false);setFlags(new Set());return;
    }
    const loadingFor = user.id;
    const seq = ++loadSeq.current;
    // Solo la carga más reciente del usuario actual escribe estado (evita respuestas viejas que pisan datos nuevos).
    const isCurrent = () => currentUserId.current === loadingFor && loadSeq.current === seq;
    setLoadingData(true);setHydrated(false);setDataError(null);
    try {
      const [t, l, g, e, ge, sr, ad, sc, bc, sessions, fl] = await Promise.all([
        appService.getTriage(user.id),
        appService.getLessonProgress(user.id),
        appService.getGoals(user.id),
        appService.getExperimentState(user.id),
        appService.getGoalEntries(user.id),appService.getSimulatorRuns(user.id),
        appService.getActiveDays(user.id),appService.getSkillChecks(user.id),appService.getBenefitCheckins(user.id),
        appService.getSessionCount(user.id),
        appService.getExperimentFlags(user.id)
      ]);
      if (!isCurrent()) return;
      setFlags(new Set(fl));
      setTriage(t); setLessons(l); setGoals(g); setExperimentState(e);
      setGoalEntries(ge);setSimulatorRuns(sr);setActiveDays(ad);setSkillChecks(sc);setBenefitCheckins(bc);setSessionCount(sessions);
    } catch(error) {
      if (!isCurrent()) return;
      setDataError(error.message || 'No fue posible cargar los datos.');
      console.warn('FinPath: datos incompletos',error);
    } finally {
      if (isCurrent()) {setLoadingData(false);setHydrated(true);setInitialized(true);}
    }
  };

  useEffect(() => { setInitialized(false); refresh(); }, [user?.id]);

  const completedLessons = lessons.filter((item) => item.status === "completed");
  const streak = calculateStreak({lessons:completedLessons,goalEntries,simulatorRuns,activeDays});
  const exitSurveyDone = flags.has('exit_survey_submitted');
  const premiumDemoDone = flags.has('premium_demo_completed');
  const premiumDecisionMade = flags.has('premium_declined') || flags.has('checkout_declined') || flags.has('checkout_confirmed');
  const value = useMemo(() => ({
    triage, lessons, goals, experimentState, loadingData, hydrated, dataError,
    completedLessons, goalEntries, simulatorRuns,activeDays,streak,skillChecks,benefitCheckins,sessionCount,refresh,
    initialized, flags, exitSurveyDone, premiumDemoDone, premiumDecisionMade,
  }), [triage, lessons, goals, experimentState, loadingData, hydrated, dataError,goalEntries,simulatorRuns,activeDays,skillChecks,benefitCheckins,sessionCount,
    initialized, flags, exitSurveyDone, premiumDemoDone, premiumDecisionMade]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
