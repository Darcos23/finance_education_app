import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { appService } from "../services/appService";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  const [triage, setTriage] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [goals, setGoals] = useState([]);
  const [experimentState, setExperimentState] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const refresh = async () => {
    if (!user) {
      setTriage(null); setLessons([]); setGoals([]); setExperimentState(null);
      return;
    }
    setLoadingData(true);
    try {
      const [t, l, g, e] = await Promise.all([
        appService.getTriage(user.id),
        appService.getLessonProgress(user.id),
        appService.getGoals(user.id),
        appService.getExperimentState(user.id),
      ]);
      setTriage(t); setLessons(l); setGoals(g); setExperimentState(e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => { refresh(); }, [user?.id]);

  const completedLessons = lessons.filter((item) => item.status === "completed");
  const value = useMemo(() => ({
    triage, lessons, goals, experimentState, loadingData,
    completedLessons, refresh,
  }), [triage, lessons, goals, experimentState, loadingData]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
