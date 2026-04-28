import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ProgressBar from "../components/common/ProgressBar";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import { useAppContext } from "../context/AppContext";
import { goalService } from "../services";
import { formatCurrencyCOP, getDaysRemaining, getGoalVisualStatus, parseMoneyInput } from "../utils";

export default function GoalDetailPage() {
    const navigate = useNavigate();
    const { goalId } = useParams();
    const { refresh, version } = useAppContext();
    const goal = goalService.getGoalById(goalId);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");

    if (!goal) {
        return (
            <MobileShell topBar={<TopBar title="Detalle de meta" />}>
                <Button variant="ghost" onClick={() => navigate("/goals")}>Volver</Button>
                <p className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-black text-red-700">No se encontro la meta.</p>
            </MobileShell>
        );
    }

    const visual = getGoalVisualStatus(goal);

    const contribution = (event) => {
        event.preventDefault();
        const value = parseMoneyInput(amount);
        if (!value) return;
        goalService.addContribution(goal.id, { type: goal.type === "expense_limit" ? "expense_record" : "money", amount: value, note });
        setAmount("");
        setNote("");
        refresh();
    };

    const toggleMilestone = (id) => {
        goalService.completeMilestone(goal.id, id);
        refresh();
    };

    const removeGoal = () => {
        goalService.deleteGoal(goal.id);
        refresh();
        navigate("/goals");
    };

    return (
        <MobileShell topBar={<TopBar title="Detalle de meta" />}>
            <div key={version}>
                <Button variant="ghost" onClick={() => navigate("/goals")}>Volver a metas</Button>
                <Card className="mt-4">
                    <div className="text-center">
                        <Badge label={visual.label} variant={visual.variant} />
                        <h2 className="mt-3 text-2xl font-black">{goal.title}</h2>
                        <p className="mt-2 text-sm text-slate-600">{goal.description}</p>
                    </div>
                    <ProgressBar value={goal.progressPercentage} color={visual.color} label={goal.type === "expense_limit" ? "Uso del limite" : "Progreso"} className="mt-5" />
                    <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                        <div className="rounded-3xl bg-blue-50 p-3"><p className="text-xs font-black text-slate-500">Fecha limite</p><p className="font-black">{goal.endDate}</p></div>
                        <div className="rounded-3xl bg-blue-50 p-3"><p className="text-xs font-black text-slate-500">Dias restantes</p><p className="font-black">{getDaysRemaining(goal.endDate)}</p></div>
                    </div>

                    {goal.type === "saving_amount" && (
                        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-3xl bg-green-50 p-3"><p className="text-xs font-black text-slate-500">Ahorrado</p><p className="font-black text-green-700">{formatCurrencyCOP(goal.currentAmount)}</p></div>
                            <div className="rounded-3xl bg-yellow-50 p-3"><p className="text-xs font-black text-slate-500">Objetivo</p><p className="font-black text-yellow-800">{formatCurrencyCOP(goal.targetAmount)}</p></div>
                        </div>
                    )}

                    {goal.type === "expense_limit" && (
                        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-3xl bg-red-50 p-3"><p className="text-xs font-black text-slate-500">Gastado</p><p className="font-black text-red-700">{formatCurrencyCOP(goal.currentExpense)}</p></div>
                            <div className="rounded-3xl bg-green-50 p-3"><p className="text-xs font-black text-slate-500">Disponible</p><p className="font-black text-green-700">{formatCurrencyCOP(Math.max((goal.expenseLimit || 0) - (goal.currentExpense || 0), 0))}</p></div>
                        </div>
                    )}

                    {goal.type === "lesson_completion" && (
                        <div className="mt-4 rounded-3xl bg-blue-50 p-4 text-center">
                            <p className="text-sm font-bold text-slate-600">{goal.completedLessons || 0} de {goal.targetLessons || 0} lecciones completadas</p>
                            <Button onClick={() => navigate("/learn")} className="mt-3">Ir a aprender</Button>
                        </div>
                    )}

                    {["saving_amount", "expense_limit"].includes(goal.type) && (
                        <form onSubmit={contribution} className="mt-4 rounded-3xl bg-blue-50 p-4">
                            <h3 className="font-black">{goal.type === "expense_limit" ? "Registrar gasto" : "Registrar avance de ahorro"}</h3>
                            <input className="mt-3 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 outline-none" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Ej: 10000" />
                            <input className="mt-2 w-full rounded-2xl border border-blue-100 bg-white px-4 py-3 outline-none" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Nota opcional" />
                            <Button type="submit" className="mt-3 w-full">Registrar</Button>
                        </form>
                    )}

                    {goal.milestones?.length > 0 && (
                        <div className="mt-4 rounded-3xl bg-blue-50 p-4">
                            <h3 className="font-black">Hitos diarios</h3>
                            <div className="mt-3 space-y-2">
                                {goal.milestones.map((milestone) => (
                                    <div key={milestone.id} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm">
                                        <div><p className="font-black">{milestone.title}</p><p className="text-xs text-slate-500">{milestone.dueDate}</p></div>
                                        <Button size="sm" variant={milestone.isCompleted ? "success" : "secondary"} onClick={() => toggleMilestone(milestone.id)}>{milestone.isCompleted ? "Cumplido" : "Marcar"}</Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                        <h3 className="font-black">Historial de avances</h3>
                        {!goal.contributions?.length && <p className="mt-2 text-sm text-slate-500">Aun no hay avances registrados.</p>}
                        {(goal.contributions || []).map((item) => (
                            <div key={item.id} className="mt-2 rounded-2xl bg-white p-3 text-sm shadow-sm">
                                <p className="font-black">{item.type === "expense_record" ? "Gasto" : "Avance"}: {item.amount ? formatCurrencyCOP(item.amount) : "Registro"}</p>
                                {item.note && <p className="text-slate-500">{item.note}</p>}
                                <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString("es-CO")}</p>
                            </div>
                        ))}
                    </div>
                </Card>
                <Button variant="danger" className="mt-4 w-full" onClick={removeGoal}>Eliminar meta</Button>
            </div>
        </MobileShell>
    );
}
