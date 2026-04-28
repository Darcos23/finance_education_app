export const generateId = (prefix = "id") => `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const toISODate = (date) => new Date(date).toISOString().slice(0, 10);

export const addDays = (date, days) => {
    const parsed = new Date(date);
    parsed.setDate(parsed.getDate() + Number(days));
    return toISODate(parsed);
};

export const daysBetweenInclusive = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return Math.max(diff + 1, 1);
};

export const getDaysRemaining = (endDate) => {
    const today = new Date(todayISO());
    const end = new Date(endDate);
    return Math.max(Math.ceil((end - today) / (1000 * 60 * 60 * 24)), 0);
};

export const generateDailyMilestones = (startDate, endDate, goalId) => {
    const days = daysBetweenInclusive(startDate, endDate);
    return Array.from({ length: days }, (_, index) => ({
        id: generateId("milestone"),
        goalId,
        title: `Dia ${index + 1}`,
        description: "Marca este dia si cumpliste tu habito financiero.",
        dueDate: addDays(startDate, index),
        isCompleted: false,
        completedAt: null,
        order: index + 1,
    }));
};

export const clampPercentage = (value) => Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));

export const calculatePercentage = (current, target) => {
    if (!target || Number(target) <= 0) return 0;
    return clampPercentage((Number(current || 0) / Number(target)) * 100);
};

export const parseMoneyInput = (value) => Number(String(value || "").replace(/[^0-9]/g, "") || 0);

export const formatCurrencyCOP = (amount = 0) => `$ ${Number(amount || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export const getGoalVisualStatus = (goal) => {
    if (!goal) return { label: "Sin datos", variant: "info", color: "#1e67b8", message: "Crea una meta para comenzar." };
    if (goal.status === "completed") return { label: "Completada", variant: "success", color: "#32b984", message: "Meta lograda." };

    if (goal.type === "expense_limit") {
        const usage = clampPercentage(goal.progressPercentage || 0);
        if (usage >= 100) return { label: "Limite superado", variant: "danger", color: "#fe5d4b", message: "Ya alcanzaste o superaste el limite." };
        if (usage >= 80) return { label: "Riesgo alto", variant: "danger", color: "#fe5d4b", message: "Estas cerca del limite." };
        if (usage >= 51) return { label: "Atencion", variant: "warning", color: "#ffcc2a", message: "Aun puedes ajustar tus gastos." };
        return { label: "Buen control", variant: "success", color: "#32b984", message: "Vas bien dentro del limite." };
    }

    const progress = clampPercentage(goal.progressPercentage || 0);
    if (progress >= 80) return { label: "Casi lograda", variant: "success", color: "#32b984", message: "Estas muy cerca de cumplirla." };
    if (progress >= 40) return { label: "En progreso", variant: "warning", color: "#ffcc2a", message: "Vas avanzando." };
    return { label: "Bajo avance", variant: "danger", color: "#fe5d4b", message: "Hay oportunidad de registrar un avance hoy." };
};

export const getTrafficLightStatus = (goals = []) => {
    const activeGoals = goals.filter((goal) => goal.status === "active");
    if (!activeGoals.length) return { status: "yellow", label: "En proceso", message: "Crea una meta pequena para activar tu seguimiento financiero." };
    const dangerCount = activeGoals.filter((goal) => getGoalVisualStatus(goal).variant === "danger").length;
    const successCount = activeGoals.filter((goal) => getGoalVisualStatus(goal).variant === "success").length;
    if (dangerCount / activeGoals.length > 0.5) return { status: "red", label: "Necesitas atencion", message: "Varias metas requieren un avance o ajuste." };
    if (successCount / activeGoals.length >= 0.5) return { status: "green", label: "Buen camino", message: "La mayoria de tus metas muestran buen avance." };
    return { status: "yellow", label: "Vas en proceso", message: "Tienes metas activas, pero aun puedes registrar mas avances." };
};
