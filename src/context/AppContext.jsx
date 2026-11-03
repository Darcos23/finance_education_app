import { createContext, useContext, useEffect, useMemo, useState } from "react";
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

  const refresh = async () => {
    if (!user) {
      setTriage(null); setLessons([]); setGoals([]); setExperimentState(null);
      setGoalEntries([]);setSimulatorRuns([]);setActiveDays([]);setSkillChecks([]);setBenefitCheckins([]);
      setSessionCount(0);setDataError(null);setHydrated(false);setLoadingData(false);return;
    }
    setLoadingData(true);setHydrated(false);setDataError(null);
    try {
      const [t, l, g, e, ge, sr, ad, sc, bc, sessions] = await Promise.all([
        appService.getTriage(user.id),
        appService.getLessonProgress(user.id),
        appService.getGoals(user.id),
        appService.getExperimentState(user.id),
        appService.getGoalEntries(user.id),appService.getSimulatorRuns(user.id),
        appService.getActiveDays(user.id),appService.getSkillChecks(user.id),appService.getBenefitCheckins(user.id),
        appService.getSessionCount(user.id)
      ]);
      setTriage(t); setLessons(l); setGoals(g); setExperimentState(e);
      setGoalEntries(ge);setSimulatorRuns(sr);setActiveDays(ad);setSkillChecks(sc);setBenefitCheckins(bc);setSessionCount(sessions);
    } catch(error) {
      setDataError(error.message || 'No fue posible cargar los datos.');
      console.warn('FinPath: datos incompletos',error);
    } finally {
      setLoadingData(false);setHydrated(true);
    }
  };

  useEffect(() => { refresh(); }, [user?.id]);

  const completedLessons = lessons.filter((item) => item.status === "completed");
  const streak = calculateStreak({lessons:completedLessons,goalEntries,simulatorRuns,activeDays});
  const value = useMemo(() => ({
    triage, lessons, goals, experimentState, loadingData, hydrated, dataError,
    completedLessons, goalEntries, simulatorRuns,activeDays,streak,skillChecks,benefitCheckins,sessionCount,refresh,
  }), [triage, lessons, goals, experimentState, loadingData, hydrated, dataError,goalEntries,simulatorRuns,activeDays,skillChecks,benefitCheckins,sessionCount]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
