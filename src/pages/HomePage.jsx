import { useNavigate } from "react-router-dom";

import GoalCard from "../components/goals/GoalCard";
import LearningPathCard from "../components/lessons/LearningPathCard";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import FinancialTrafficLight from "../components/common/FinancialTrafficLight";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import BottomNav from "../components/layout/BottomNav";
import { useAppContext } from "../context/AppContext";
import { goalService, lessonService } from "../services";
import AppIcon from "../utils/iconMap";

export default function HomePage() {
    const navigate = useNavigate();
    const { user, version } = useAppContext();
    const goals = goalService.getGoalsByUser(user.id);
    const activeGoals = goals.filter((goal) => goal.status === "active");
    const progress = lessonService.getUserLessonProgress(user.id);
    const recommendedPath = lessonService.getRecommendedPaths(user)[0];
    const completedThisWeek = progress.completedLessonIds.length;

    return (
        <MobileShell topBar={<TopBar title="Inicio" subtitle="Tu resumen financiero" />} bottomNav={<BottomNav />}>
            <section className="space-y-4" key={version}>
                <div>
                    <h2 className="text-2xl font-black text-brand-black">Hola, {user.name}</h2>
                    <p className="text-sm font-medium text-slate-600">Hoy puedes dar un paso pequeno con tu dinero.</p>
                </div>

                <Card highlighted>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-black uppercase tracking-wide text-yellow-900/70">Meta semanal</p>
                            <h3 className="mt-1 text-xl font-black text-brand-black">Completa {user.weeklyLearningGoal} lecciones</h3>
                            <p className="mt-1 text-sm font-bold text-brand-black/70">Progreso: {Math.min(completedThisWeek, user.weeklyLearningGoal)} de {user.weeklyLearningGoal}</p>
                        </div>
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/70 text-brand-blue">
                            <AppIcon name="Trophy" className="h-8 w-8" />
                        </div>
                    </div>
                    <Button onClick={() => navigate("/learn")} className="mt-4 w-full">Continuar aprendiendo</Button>
                </Card>

                <FinancialTrafficLight goals={goals} />

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">Tus metas activas</h3>
                    <button onClick={() => navigate("/goals")} className="text-sm font-black text-brand-blue">Ver todas</button>
                </div>
                {activeGoals.length ? activeGoals.slice(0, 2).map((goal) => <GoalCard key={goal.id} goal={goal} />) : <EmptyState icon="Target" title="Aun no tienes metas" description="Crea una meta pequena para activar tu seguimiento." actionLabel="Crear meta" onAction={() => navigate("/goals")} />}

                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black">Ruta recomendada</h3>
                </div>
                {recommendedPath && <LearningPathCard path={recommendedPath} progress={progress} />}
            </section>
        </MobileShell>
    );
}
