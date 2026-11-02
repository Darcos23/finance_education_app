import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleDollarSign, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProgressBar from "../components/common/ProgressBar";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";

const money = (value) => `$${Number(value || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 })}`;

export default function GoalDetailPage() {
  const { goalId } = useParams();
  const { user } = useAuth();
  const { goals, refresh } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  const goal = goals.find((item) => item.id === goalId);
  if (!goal) return <AppShell><div className="empty">Meta no encontrada.</div></AppShell>;

  const target = ["saving_amount", "expense_limit"].includes(goal.type)
    ? Number(goal.target_amount || 0)
    : Number(goal.target_value || 0);
  const current = ["saving_amount", "expense_limit"].includes(goal.type)
    ? Number(goal.current_amount || 0)
    : Number(goal.current_value || 0);
  const progress = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  const presentation = (() => {
    if (goal.type === "saving_amount") return {
      title: "Registrar ahorro",
      help: "Añade cuánto avanzaste hacia tu meta.",
      action: "Guardar aporte",
      input: true,
      currentLabel: money(current),
      targetLabel: money(target),
    };
    if (goal.type === "expense_limit") return {
      title: "Registrar gasto",
      help: "Añade un gasto para observar cuánto del límite ya utilizaste.",
      action: "Guardar gasto",
      input: true,
      currentLabel: `${money(current)} usados`,
      targetLabel: `Límite ${money(target)}`,
    };
    if (goal.type === "habit_streak") return {
      title: "Registrar día cumplido",
      help: "Marca un día cuando hayas realizado el hábito propuesto.",
      action: "Marcar hoy como cumplido",
      input: false,
      currentLabel: `${current} días`,
      targetLabel: `${target} días`,
    };
    return {
      title: "Progreso automático",
      help: "Esta meta avanza cuando completas lecciones dentro de FinPath.",
      action: null,
      input: false,
      currentLabel: `${current} lecciones`,
      targetLabel: `${target} lecciones`,
    };
  })();

  const add = async (event) => {
    event?.preventDefault?.();
    setBusy(true);
    try {
      await appService.addGoalProgress(user, goal, presentation.input ? amount : 1);
      setAmount("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const danger = goal.type === "expense_limit" && target > 0 && current > target;

  return (
    <AppShell>
      <button className="icon-btn" onClick={() => navigate("/goals")} aria-label="Volver a metas"><ArrowLeft /></button>

      <div className="card card-pad" style={{ marginTop: 12 }}>
        <div className="list-icon"><Target /></div>
        <h1 style={{ fontSize: "1.8rem", margin: "12px 0 6px" }}>{goal.title}</h1>
        <p className="page-subtitle">{goal.description}</p>
        {target > 0 && (
          <>
            <ProgressBar value={progress} yellow={goal.type === "expense_limit"} />
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8, fontWeight: 800, color: "#003ea2", fontSize: ".82rem" }}>
              <span>{presentation.currentLabel}</span>
              <span>{Math.round(progress)}%</span>
              <span>{presentation.targetLabel}</span>
            </div>
          </>
        )}
        {danger && <div className="warning-box" style={{ marginTop: 12 }}>Superaste el límite definido. Úsalo como señal para revisar qué gasto puedes ajustar.</div>}
      </div>

      {goal.status !== "completed" && goal.type !== "lesson_completion" && (
        <form className="card card-pad" onSubmit={add}>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.15rem" }}>{presentation.title}</h2>
          <p className="page-subtitle">{presentation.help}</p>
          {presentation.input && (
            <div className="field">
              <label className="input-label">Monto</label>
              <input className="input" type="number" min="1" required value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
          )}
          <button className="btn btn-primary btn-block" disabled={busy || (presentation.input && !amount)}>
            {busy ? "Guardando…" : presentation.action}
          </button>
        </form>
      )}

      {goal.type === "lesson_completion" && goal.status !== "completed" && (
        <div className="card card-pad">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><CircleDollarSign color="#0068fb" /><strong>{presentation.title}</strong></div>
          <p className="page-subtitle" style={{ margin: "10px 0 0" }}>{presentation.help}</p>
        </div>
      )}

      {goal.status === "completed" && (
        <div className="success-box" style={{ marginTop: 14 }}><CheckCircle2 size={17} style={{ verticalAlign: "middle" }} /> ¡Meta lograda! Este progreso quedó guardado en FinPath.</div>
      )}
    </AppShell>
  );
}
