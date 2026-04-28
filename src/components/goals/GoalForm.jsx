import { useState } from "react";

import { goalService } from "../../services";
import { addDays, parseMoneyInput, todayISO } from "../../utils";
import AppIcon from "../../utils/iconMap";
import Button from "../common/Button";
import Card from "../common/Card";

const goalTypes = [
    { type: "saving_amount", title: "Ahorrar dinero", description: "Monto objetivo y avances manuales.", icon: "Wallet" },
    { type: "habit_streak", title: "Crear un habito", description: "Hitos diarios para construir constancia.", icon: "ListChecks" },
    { type: "expense_limit", title: "Controlar un gasto", description: "Limite maximo por categoria.", icon: "ShieldAlert" },
    { type: "lesson_completion", title: "Completar lecciones", description: "Aprendizaje semanal medible.", icon: "BookOpenCheck" },
];

export default function GoalForm({ user, onSaved, onCancel }) {
    const [type, setType] = useState("saving_amount");
    const [form, setForm] = useState({
        title: "",
        description: "",
        targetAmount: "",
        currentAmount: "0",
        expenseLimit: "",
        category: "",
        targetLessons: "3",
        startDate: todayISO(),
        endDate: addDays(todayISO(), 6),
        priority: "medium",
    });

    const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const submit = (event) => {
        event.preventDefault();
        const title = form.title || goalTypes.find((item) => item.type === type)?.title;
        const goal = goalService.createGoal({
            userId: user.id,
            title,
            description: form.description,
            type,
            priority: form.priority,
            startDate: form.startDate,
            endDate: form.endDate,
            targetAmount: parseMoneyInput(form.targetAmount),
            currentAmount: parseMoneyInput(form.currentAmount),
            expenseLimit: parseMoneyInput(form.expenseLimit),
            currentExpense: 0,
            category: form.category,
            targetLessons: Number(form.targetLessons || 0),
            completedLessons: 0,
            targetStreakDays: 0,
            currentStreakDays: 0,
        });
        onSaved(goal);
    };

    return (
        <Card>
            <h2 className="text-xl font-black">Crear meta personalizada</h2>
            <p className="mt-1 text-sm text-slate-600">Elige un tipo de meta y completa solo los campos necesarios.</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
                {goalTypes.map((item) => (
                    <button key={item.type} onClick={() => setType(item.type)} className={`rounded-2xl border p-3 text-left transition ${type === item.type ? "border-brand-blue bg-brand-sky" : "border-blue-100 bg-white"}`}>
                        <AppIcon name={item.icon} className="mb-2 h-5 w-5 text-brand-blue" />
                        <p className="text-sm font-black">{item.title}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </button>
                ))}
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
                <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Nombre de la meta" />
                <textarea className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Descripcion opcional" rows={2} />
                {type === "saving_amount" && (
                    <div className="grid grid-cols-2 gap-2">
                        <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.targetAmount} onChange={(event) => update("targetAmount", event.target.value)} placeholder="Monto objetivo" />
                        <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.currentAmount} onChange={(event) => update("currentAmount", event.target.value)} placeholder="Monto inicial" />
                    </div>
                )}
                {type === "expense_limit" && (
                    <div className="grid grid-cols-2 gap-2">
                        <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.category} onChange={(event) => update("category", event.target.value)} placeholder="Categoria" />
                        <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.expenseLimit} onChange={(event) => update("expenseLimit", event.target.value)} placeholder="Limite" />
                    </div>
                )}
                {type === "lesson_completion" && <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none" value={form.targetLessons} onChange={(event) => update("targetLessons", event.target.value)} placeholder="Numero de lecciones" />}
                <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs font-black text-slate-500">Inicio<input type="date" className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-3 outline-none" value={form.startDate} onChange={(event) => update("startDate", event.target.value)} /></label>
                    <label className="text-xs font-black text-slate-500">Final<input type="date" className="mt-1 w-full rounded-2xl border border-blue-100 bg-blue-50 px-3 py-3 outline-none" value={form.endDate} onChange={(event) => update("endDate", event.target.value)} /></label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
                    <Button type="submit">Guardar meta</Button>
                </div>
            </form>
        </Card>
    );
}
