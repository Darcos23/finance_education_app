import { ArrowLeft, Lightbulb, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { GOAL_TEMPLATES } from "../data";
import { useApp } from "../context/AppContext";

// Las plantillas son IDEAS: abren el formulario pre-llenado para que la persona ajuste el monto a su realidad.
const GROUPS = [
  ["saving_amount", "Ahorro"],
  ["expense_limit", "Límite de gasto"],
  ["debt_payoff", "Deuda"],
  ["habit_streak", "Hábito"],
];

export default function GoalIdeasPage() {
  const { goals } = useApp();
  const navigate = useNavigate();
  const ideas = GOAL_TEMPLATES.filter((t) => t.type !== "lesson_completion");

  return (
    <AppShell>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button className="icon-btn" aria-label="Volver a metas" onClick={() => navigate("/goals")}><ArrowLeft size={20} /></button>
        <span className="eyebrow"><Lightbulb size={14} /> Ideas de metas</span>
      </div>
      <h1 className="page-title">Metas sugeridas</h1>
      <p className="page-subtitle">Elige una idea y ajústala a tu realidad antes de crearla. Nada se crea hasta que confirmes.</p>

      {GROUPS.map(([type, label]) => {
        const items = ideas.filter((t) => t.type === type);
        if (!items.length) return null;
        return (
          <section key={type}>
            <div className="section-head"><h2>{label}</h2></div>
            <div className="list">
              {items.map((t) => {
                const existing = goals.find((g) => g.template_id === t.id && g.status === "active");
                return existing ? (
                  <div key={t.id} className="list-card">
                    <div className="list-icon"><Target /></div>
                    <div style={{ flex: 1 }}>
                      <h3>{t.title}</h3><p>{t.description}</p>
                      <Link className="btn btn-secondary" style={{ marginTop: 10, minHeight: 40 }} to={`/goals/${existing.id}`}>Ya la tienes · Ver meta</Link>
                    </div>
                  </div>
                ) : (
                  <button key={t.id} type="button" className="list-card" style={{ width: "100%", textAlign: "left" }}
                    onClick={() => navigate(`/goals/new?template=${t.id}&from=ideas`)}>
                    <div className="list-icon"><Target /></div>
                    <div><h3>{t.title}</h3><p>{t.description}</p></div>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
      <Link className="btn btn-primary btn-block" style={{ marginTop: 18 }} to="/goals/new">Crear una meta desde cero</Link>
    </AppShell>
  );
}
