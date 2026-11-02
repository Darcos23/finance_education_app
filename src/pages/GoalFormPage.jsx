import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";

export default function GoalFormPage() {
  const { user }=useAuth(); const { refresh }=useApp(); const navigate=useNavigate();
  const [form,setForm]=useState({title:"",description:"",targetAmount:"",targetDate:""});
  const [busy,setBusy]=useState(false);
  const submit=async(e)=>{
    e.preventDefault();setBusy(true);
    try {
      const goal=await appService.createGoal(user,{...form,type:"saving_amount"});
      await refresh(); navigate(`/goals/${goal.id}`,{replace:true});
    } finally {setBusy(false);}
  };
  return <AppShell>
    <span className="eyebrow">Meta personalizada</span>
    <h1 className="page-title">Define algo alcanzable</h1>
    <p className="page-subtitle">Monto, plazo y una razón clara son suficientes para empezar.</p>
    <form className="card card-pad" onSubmit={submit}>
      <div className="field"><label className="input-label">¿Qué quieres lograr?</label><input className="input" required maxLength={80} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Ej. Ahorrar para un curso"/></div>
      <div className="field"><label className="input-label">¿Por qué es importante?</label><textarea className="input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Una frase corta"/></div>
      <div className="field"><label className="input-label">Monto objetivo</label><input className="input" type="number" min="0" required value={form.targetAmount} onChange={e=>setForm({...form,targetAmount:e.target.value})}/></div>
      <div className="field"><label className="input-label">Fecha objetivo (opcional)</label><input className="input" type="date" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})}/></div>
      <button className="btn btn-primary btn-block" disabled={busy}>{busy?"Creando…":"Crear meta"}</button>
    </form>
  </AppShell>
}
