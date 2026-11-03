import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";

export default function GoalFormPage() {
  const { user }=useAuth(); const { refresh }=useApp(); const navigate=useNavigate();
  const [type,setType]=useState('saving_amount');
  const [form,setForm]=useState({title:'',description:'',targetAmount:'',targetDate:'',category:'',period:'week',days:'7'});
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const submit=async(e)=>{
    e.preventDefault();setBusy(true);setError('');
    try {
      const amount=Number(form.targetAmount);
      if(type!=='habit_streak' && (!Number.isFinite(amount)||amount<=0))throw new Error('El monto objetivo debe ser mayor a cero.');
      const labels={food:'Comida fuera',transport:'Transporte',entertainment:'Entretenimiento',shopping:'Compras',other:'Otros'};
      const goal=await appService.createGoal(user,{
        title:form.title || (type==='expense_limit'?`Límite: ${labels[form.category]}`:''),
        description:type==='expense_limit'?`Categoría: ${labels[form.category]}. ${form.description}`:form.description,
        type,targetAmount:type==='habit_streak'?0:amount,targetDate:form.targetDate||null,
        targetValue:type==='habit_streak'?Number(form.days):0,
        unit:type==='expense_limit'?`COP gastados/${form.period==='month'?'mes':'semana'}`:
          type==='habit_streak'?'días':type==='debt_payoff'?'COP abonados':'COP ahorrados'
      });
      await refresh();navigate(`/goals/${goal.id}`,{replace:true});
    }catch(e){setError(e.message||'No se pudo crear la meta.');}
    finally{setBusy(false);}
  };
  const field=(key,value)=>setForm(f=>({...f,[key]:value}));
  return <AppShell>
    <span className="eyebrow">Meta personalizada</span>
    <h1 className="page-title">Define algo alcanzable</h1>
    <p className="page-subtitle">Escoge el tipo de objetivo y registra solo los datos necesarios.</p>
    <form className="card card-pad" onSubmit={submit}>
      <div className="field"><label className="input-label">Tipo de meta</label><select className="input" value={type} onChange={e=>setType(e.target.value)}>
        <option value="saving_amount">Ahorro para algo</option><option value="expense_limit">Límite de gasto</option>
        <option value="debt_payoff">Pagar una deuda</option><option value="habit_streak">Construir un hábito</option>
      </select></div>
      {type==='saving_amount'&&<button type="button" className="btn btn-secondary" style={{marginBottom:14}} onClick={()=>setForm(f=>({...f,title:'Fondo de emergencia',description:'Reserva disponible para imprevistos',targetAmount:'120000'}))}>Sugerir fondo de emergencia</button>}
      {type==='expense_limit'&&<div className="field"><label className="input-label">Categoría de gasto</label><select className="input" required value={form.category} onChange={e=>field('category',e.target.value)}>
        <option value="">Selecciona una</option><option value="food">Comida fuera</option><option value="transport">Transporte</option><option value="entertainment">Entretenimiento</option><option value="shopping">Compras</option><option value="other">Otro</option>
      </select></div>}
      <div className="field"><label className="input-label">{type==='habit_streak'?'¿Qué hábito quieres construir?':type==='debt_payoff'?'Nombre de la deuda':type==='expense_limit'?'Nombre de la meta (opcional)':'¿Para qué ahorrarás?'}</label>
        <input className="input" required={type!=='expense_limit'} maxLength={80} value={form.title} onChange={e=>field('title',e.target.value)} placeholder={type==='habit_streak'?'Registrar gastos cada día':type==='debt_payoff'?'Pagar crédito de estudios':'Ej. Fondo de emergencia'}/></div>
      {type==='habit_streak'?<div className="field"><label className="input-label">Número de días</label><input className="input" type="number" min="1" max="365" required value={form.days} onChange={e=>field('days',e.target.value)}/></div>:
        <div className="field"><label className="input-label">{type==='debt_payoff'?'Saldo actual de la deuda (COP)':type==='expense_limit'?'Monto límite del periodo (COP)':'Monto objetivo (COP)'}</label>
        <input className="input" type="number" min="1" required value={form.targetAmount} onChange={e=>field('targetAmount',e.target.value)}/></div>}
      {type==='expense_limit'&&<div className="field"><label className="input-label">Periodo del límite</label><select className="input" value={form.period} onChange={e=>field('period',e.target.value)}><option value="week">Semana (lunes a domingo)</option><option value="month">Mes calendario</option></select></div>}
      {type==='saving_amount'&&<div className="field"><label className="input-label">Fecha objetivo (opcional)</label><input className="input" type="date" value={form.targetDate} onChange={e=>field('targetDate',e.target.value)}/></div>}
      {type!=='expense_limit'&&<div className="field"><label className="input-label">Nota opcional</label><input className="input" maxLength={160} value={form.description} onChange={e=>field('description',e.target.value)} placeholder="¿Por qué te importa esta meta?"/></div>}
      {error&&<div className="error-box">{error}</div>}
      <button className="btn btn-primary btn-block" disabled={busy}>{busy?'Creando…':'Crear meta'}</button>
    </form>
  </AppShell>;
}
