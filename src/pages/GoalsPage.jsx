import { Lightbulb, Plus, Target } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProgressBar from "../components/common/ProgressBar";
import { useApp } from "../context/AppContext";
import { expenseInPeriod } from "../lib/goalPeriods";

const pct = (current,target) => target > 0 ? Math.min(100,(Number(current||0)/Number(target))*100) : 0;

export default function GoalsPage() {
  const { goals, goalEntries } = useApp();

  return (
    <AppShell>
      <span className="eyebrow"><Target size={14}/> Tus objetivos</span>
      <h1 className="page-title">Metas</h1>
      <p className="page-subtitle">Convierte una intención en algo concreto y registra pequeños avances.</p>
      <Link className="btn btn-primary btn-block" data-guide="create-goal" to="/goals/new"><Plus size={18}/> Crear meta</Link>
      <Link className="btn btn-ghost btn-block" style={{marginTop:10}} to="/goals/ideas"><Lightbulb size={17}/> ¿Sin ideas? Ver metas sugeridas</Link>

      <div className="section-head"><h2>Metas activas</h2><span className="tag">{goals.filter(g=>g.status==="active").length}</span></div>
      {goals.filter(g=>g.status==='active').length===0 ? <div className="empty card">Todavía no tienes metas. Crea una pequeña para empezar.</div> :
        <div className="list">
          {goals.filter(g=>g.status==='active').map(g=>(
            <Link key={g.id} to={`/goals/${g.id}`} className="list-card">
              <div className="list-icon"><Target/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}><h3>{g.title}</h3><span className={`tag ${g.status==="completed"?"tag-green":""}`}>{g.status==="completed"?"Lograda":"En progreso"}</span></div>
                <p>{g.description}</p>
                {(() => {
                  const amountGoal = ["saving_amount", "expense_limit", "debt_payoff"].includes(g.type);
                  const target = amountGoal ? Number(g.target_amount || 0) : Number(g.target_value || 0);
                  const current = g.type==='expense_limit'?expenseInPeriod(g,goalEntries):amountGoal ? Number(g.current_amount || 0) : Number(g.current_value || 0);
                  if (!target) return null;
                  const label = amountGoal
                    ? `$${current.toLocaleString("es-CO")} / $${target.toLocaleString("es-CO")}`
                    : `${current} / ${target} ${g.unit || ""}`;
                  return <div style={{marginTop:10}}><ProgressBar value={pct(current,target)} yellow={g.type==="expense_limit"}/><div className="form-note" style={{marginTop:5}}>{label}{g.type==='debt_payoff'?` · Restan $${Math.max(0,target-current).toLocaleString('es-CO')}`:''}</div></div>;
                })()}
              </div>
            </Link>
          ))}
        </div>
      }
      {goals.some(g=>g.status!=="active")&&<div className="section-head"><h2>Historial</h2></div>}
      {goals.filter(g=>g.status!=="active").map(g=><Link key={g.id} className="list-card" to={`/goals/${g.id}`}><Target/><span>{g.title} · {g.status==='archived'?'Archivada':'Lograda'}</span></Link>)}
    </AppShell>
  );
}
