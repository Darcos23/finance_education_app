import { useNavigate } from "react-router-dom";

import { formatCurrencyCOP, getGoalVisualStatus } from "../../utils";
import AppIcon from "../../utils/iconMap";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

const goalTypeIcon = {
    saving_amount: "Wallet",
    habit_streak: "ListChecks",
    expense_limit: "ShieldAlert",
    lesson_completion: "BookOpenCheck",
};

export default function GoalCard({ goal }) {
    const navigate = useNavigate();
    const visual = getGoalVisualStatus(goal);
    const mainValue = goal.type === "saving_amount" ? `${formatCurrencyCOP(goal.currentAmount)} / ${formatCurrencyCOP(goal.targetAmount)}` : goal.type === "expense_limit" ? `${formatCurrencyCOP(goal.currentExpense)} de ${formatCurrencyCOP(goal.expenseLimit)}` : goal.type === "lesson_completion" ? `${goal.completedLessons || 0} de ${goal.targetLessons || 0} lecciones` : `${goal.currentStreakDays || 0} de ${goal.milestones?.length || goal.targetStreakDays || 0} dias`;

    return (
        <Card className="transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-sky text-brand-blue">
                        <AppIcon name={goalTypeIcon[goal.type] || "Target"} className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-black text-brand-black">{goal.title}</h3>
                        <p className="mt-1 text-xs font-semibold text-slate-500">{mainValue}</p>
                    </div>
                </div>
                <Badge label={visual.label} variant={visual.variant} />
            </div>
            <ProgressBar value={goal.progressPercentage} color={visual.color} className="mt-4" />
            <Button onClick={() => navigate(`/goals/${goal.id}`)} variant="secondary" className="mt-4 w-full">Ver detalle</Button>
        </Card>
    );
}
