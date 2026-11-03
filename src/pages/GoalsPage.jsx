import { Plus, Target } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProgressBar from "../components/common/ProgressBar";
import { GOAL_TEMPLATES } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";
import { expenseInPeriod } from "../lib/goalPeriods";

const pct = (current,target) => target > 0 ? Math.min(100,(Number(current||0)/Number(target))*100) : 0;

export default function GoalsPage() {
  const { user } = useAuth();
  const { goals, goalEntries, refresh } = useApp();
  const [showTemplates,setShowTemplates]=useState(false);
  const [busy,setBusy]=useState(null);

  const addTemplate=async(template)=>{
    setBusy(template.id);
    try {
      if(goals.some(g=>g.template_id===template.id&&g.status==='active'))return;
      await appService.createGoalFromTemplate(user, template);
      await refresh(); setShowTemplates(false);
    } finally { setBusy(null); }
  };

  return (
    <AppShell>
      <span className="eyebrow"><Target size={14}/> Tus objetivos</span>
      <h1 className="page-title">Metas</h1>
      <p className="page-subtitle">Convierte una intención en algo concreto y registra pequeños avances.</p>
      <button className="btn btn-primary btn-block" onClick={()=>setShowTemplates(v=>!v)}><Plus size={18}/> Crear meta</button>

      {showTemplates && (
        <div className="card card-pad" style={{marginTop:14}}>
          <h2 style={{margin:"0 0 10px",fontSize:"1.15rem"}}>Empieza con una sugerencia</h2>
          <div className="list">
            {GOAL_TEMPLATES.filter(t=>t.type!=="lesson_completion").map(t=><button key={t.id} className="list-card" onClick={()=>addTemplate(t)} disabled={busy===t.id} style={{width:"100%",textAlign:"left"}}><div className="list-icon"><Target/></div><div><h3>{t.title}</h3><p>{t.description}</p></div></button>)}
          </div>
          <Link className="btn btn-secondary btn-block" style={{marginTop:12}} to="/goals/new">Crear meta personalizada</Link>
        </div>
      )}

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
