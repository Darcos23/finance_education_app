import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { appService } from '../../services/appService';
export default function BenefitCheckinCard({ periodIndex }){
  const {user}=useAuth(),{refresh}=useApp();
  const [helped,setHelped]=useState(null),[amount,setAmount]=useState(''),[description,setDescription]=useState(''),
    [ellis,setEllis]=useState(''),[dismissed,setDismissed]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
  if(dismissed)return null;
  const submit=async()=>{
    setBusy(true);setError('');try{
      await appService.saveBenefitCheckin(user,{periodIndex,helped,amount,description,ellis});
      await refresh();
    }catch(e){setError(e.message||'No se pudo guardar.');}finally{setBusy(false);}
  };
  return <section className="card card-pad" style={{marginTop:16}}>
    <div style={{display:'flex',justifyContent:'space-between',gap:8}}><h2 style={{margin:0}}>¿FinPath te aportó algo?</h2><button className="btn btn-ghost" onClick={()=>setDismissed(true)}>Ahora no</button></div>
    <p className="page-subtitle">En estos días, ¿te ayudó a ahorrar, evitar un gasto o pagar algo?</p>
    <div style={{display:'flex',gap:8}}>{[[true,'Sí'],[false,'No']].map(([v,t])=><button key={t} className={`btn ${helped===v?'btn-primary':'btn-secondary'}`} onClick={()=>setHelped(v)}>{t}</button>)}</div>
    {helped===true&&<><div className="field" style={{marginTop:10}}><label className="input-label">Monto aproximado en COP (opcional, autodeclarado)</label><input className="input" type="number" min="0" value={amount} onChange={e=>setAmount(e.target.value)}/></div>
    <div className="field"><label className="input-label">¿Qué hiciste diferente? (opcional)</label><input className="input" maxLength={280} value={description} onChange={e=>setDescription(e.target.value)}/></div></>}
    <label className="input-label" style={{marginTop:12}}>¿Qué tan decepcionado estarías si FinPath dejara de existir?</label>
    {[["very","Muy decepcionado"],["somewhat","Algo decepcionado"],["not","Nada decepcionado"]].map(([id,label])=><button key={id} className={`question-option ${ellis===id?'selected':''}`} onClick={()=>setEllis(id)}>{label}</button>)}
    {error&&<div className="error-box">{error}</div>}
    <button className="btn btn-primary btn-block" style={{marginTop:12}} disabled={busy||helped===null||!ellis} onClick={submit}>{busy?'Guardando…':'Enviar respuesta'}</button>
    <p className="form-note">El monto que informes es autodeclarado, no verificado con bancos ni movimientos reales.</p>
  </section>;
}
