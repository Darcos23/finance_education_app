import { useState } from "react";
import { ArrowLeft, CheckCircle2, CircleDollarSign, Target } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProgressBar from "../components/common/ProgressBar";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";
import { expenseInPeriod,periodType } from "../lib/goalPeriods";

const money=(value)=>`$${Number(value||0).toLocaleString('es-CO',{maximumFractionDigits:0})}`;
export default function GoalDetailPage(){
  const {goalId}=useParams(),{user}=useAuth(),{goals,goalEntries,refresh}=useApp(),navigate=useNavigate();
  const [amount,setAmount]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const goal=goals.find(item=>item.id===goalId);
  if(!goal)return <AppShell><div className="empty">Meta no encontrada.</div></AppShell>;
  const amountGoal=['saving_amount','expense_limit','debt_payoff'].includes(goal.type);
  const target=Number(amountGoal?goal.target_amount:goal.target_value)||0;
  const current=goal.type==='expense_limit'?expenseInPeriod(goal,goalEntries):Number(amountGoal?goal.current_amount:goal.current_value)||0;
  const progress=target>0?Math.min(100,current/target*100):0;
  const pending=Math.max(0,target-current),danger=goal.type==='expense_limit'&&current>target;
  const presentation=goal.type==='saving_amount'?{title:'Registrar ahorro',help:'Añade cuánto avanzaste hacia tu meta.',action:'Guardar aporte',input:true}:
    goal.type==='debt_payoff'?{title:'Registrar abono',help:`Saldo pendiente: ${money(pending)}. No almacenes datos bancarios.`,action:'Guardar abono',input:true}:
    goal.type==='expense_limit'?{title:'Registrar gasto',help:`Este ${periodType(goal)==='month'?'mes':'semana'} has utilizado ${money(current)} de ${money(target)}.`,action:'Guardar gasto',input:true}:
    goal.type==='habit_streak'?{title:'Registrar día cumplido',help:'Marca el día cuando hayas realizado el hábito.',action:'Marcar hoy como cumplido',input:false}:
    {title:'Progreso automático',help:'Esta meta avanza cuando completas lecciones.',action:null,input:false};
  const run=async(fn)=>{setBusy(true);setError('');try{await fn();await refresh();setAmount('');}catch(e){setError(e.message||'No se pudo guardar.');}finally{setBusy(false);}};
  const add=e=>{e.preventDefault();run(()=>appService.addGoalProgress(user,goal,presentation.input?Number(amount):1));};
  const archive=()=>{if(window.confirm('¿Archivar esta meta? No se borrará su historial.'))run(()=>appService.archiveGoal(user,goal.id));};
  const entries=goalEntries.filter(e=>e.goal_id===goal.id);
  const undo=()=>{if(window.confirm('¿Deshacer el último registro de esta meta?'))run(()=>appService.undoLastGoalEntry(user,goal));};
  return <AppShell>
    <button className="icon-btn" onClick={()=>navigate('/goals')} aria-label="Volver a metas"><ArrowLeft/></button>
    <div className="card card-pad" style={{marginTop:12}}><div className="list-icon"><Target/></div>
      <h1 style={{fontSize:'1.8rem',margin:'12px 0 6px'}}>{goal.title}</h1><p className="page-subtitle">{goal.description}</p>
      {goal.status==='archived'&&<div className="info-box">Meta archivada; tu historial permanece disponible.</div>}
      {target>0&&<><ProgressBar value={progress} yellow={goal.type==='expense_limit'}/>
      <div className="form-note" style={{marginTop:8}}>{amountGoal?money(current):`${current} días`} / {amountGoal?money(target):`${target} días`} · {Math.round(progress)}%</div></>}
      {goal.type==='debt_payoff'&&<strong>Saldo pendiente: {money(pending)}</strong>}
      {danger&&<div className="warning-box" style={{marginTop:12}}>Superaste el límite del periodo. Revisa qué puedes ajustar.</div>}
    </div>
    {goal.status==='active'&&goal.type!=='lesson_completion'&&<form className="card card-pad" onSubmit={add}>
      <h2 style={{margin:'0 0 6px',fontSize:'1.15rem'}}>{presentation.title}</h2><p className="page-subtitle">{presentation.help}</p>
      {presentation.input&&<div className="field"><label className="input-label">Monto</label><input className="input" type="number" min="1" required value={amount} onChange={e=>setAmount(e.target.value)}/></div>}
      <button className="btn btn-primary btn-block" disabled={busy||(presentation.input&&Number(amount)<=0)}>{busy?'Guardando…':presentation.action}</button>
    </form>}
    {goal.type==='lesson_completion'&&goal.status==='active'&&<div className="card card-pad"><div style={{display:'flex',gap:10,alignItems:'center'}}><CircleDollarSign color="#0068fb"/><strong>Progreso automático</strong></div><p>{presentation.help}</p></div>}
    {goal.status==='completed'&&<div className="success-box" style={{marginTop:14}}><CheckCircle2 size={17}/> ¡Meta lograda!</div>}
    {error&&<div className="error-box">{error}</div>}
    {entries.length>0&&goal.status!=='archived'&&<button className="btn btn-secondary btn-block" style={{marginTop:12}} disabled={busy} onClick={undo}>Deshacer último registro</button>}
    {goal.status!=='archived'&&<button className="btn btn-ghost btn-block" style={{marginTop:10}} disabled={busy} onClick={archive}>Archivar meta</button>}
  </AppShell>;
}
