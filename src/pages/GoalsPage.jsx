import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import GoalCard from "../components/goals/GoalCard";
import GoalTemplateCard from "../components/goals/GoalTemplateCard";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import BottomNav from "../components/layout/BottomNav";
import { useAppContext } from "../context/AppContext";
import { GOAL_TEMPLATES } from "../data";
import { goalService } from "../services";

export default function GoalsPage() {
    const navigate = useNavigate();
    const { user, refresh, version } = useAppContext();
    const goals = goalService.getGoalsByUser(user.id);
    const activeGoals = goals.filter((goal) => goal.status === "active");
    const recommended = GOAL_TEMPLATES.filter((template) => template.suggestedLevel === user.financialLevel || template.tags.some((tag) => user.interests?.includes(tag))).slice(0, 4);

    const useTemplate = (templateId) => {
        const goal = goalService.createGoalFromTemplate(templateId, user.id);
        refresh();
        navigate(`/goals/${goal.id}`);
    };

    return (
        <MobileShell topBar={<TopBar title="Metas" subtitle="Acciones pequenas" />} bottomNav={<BottomNav />}>
            <div className="space-y-4" key={version}>
                <div>
                    <h2 className="text-2xl font-black text-brand-black">Tus metas financieras</h2>
                    <p className="text-sm text-slate-600">Convierte lo que aprendes en seguimiento real.</p>
                </div>
                <Button onClick={() => navigate("/goals/new")} className="w-full">Crear meta personalizada</Button>

                <section className="space-y-3">
                    <h3 className="text-lg font-black">Metas sugeridas para ti</h3>
                    {recommended.map((template) => <GoalTemplateCard key={template.id} template={template} onUse={useTemplate} />)}
                </section>

                <section className="space-y-3">
                    <h3 className="text-lg font-black">Metas activas</h3>
                    {activeGoals.length ? activeGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />) : <EmptyState icon="Target" title="Sin metas activas" description="Usa una plantilla o crea una meta personalizada." />}
                </section>
            </div>
        </MobileShell>
    );
}
