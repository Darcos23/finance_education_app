import { useState } from 'react';
import { SKILL_CHECKS } from '../../data';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { appService } from '../../services/appService';
export default function SkillCheckCard({ kind }) {
  const {user}=useAuth(); const {completedLessons,refresh}=useApp();
  const [answers,setAnswers]=useState({}),[busy,setBusy]=useState(false),[error,setError]=useState('');
  const questions=SKILL_CHECKS[kind]||[];
  const submit=async()=>{
    setBusy(true);setError('');
    try {
      const score=questions.reduce((s,q)=>s+(answers[q.id]===q.correctOptionId?1:0),0);
      await appService.saveSkillCheck(user,{kind,score,answers,lessonsCompleted:completedLessons.length});
      await refresh();
    }catch(e){setError(e.message||'No se pudo guardar la evaluación.');}finally{setBusy(false);}
  };
  return <div className="card card-pad" style={{marginTop:16}}>
    <span className="eyebrow">Evaluación {kind==='pre'?'inicial':'final'}</span>
    <h2>Comprueba lo que sabes con tres casos</h2>
    <p className="page-subtitle">No afecta tu nivel ni tus rutas. Responde con la alternativa más adecuada.</p>
    {questions.map((q,i)=><div key={q.id} style={{marginBottom:18}}><strong>{i+1}. {q.body}</strong>
      {q.options.map(o=><button key={o.id} className={`question-option ${answers[q.id]===o.id?'selected':''}`}
        onClick={()=>setAnswers(a=>({...a,[q.id]:o.id}))}>{o.label}</button>)}
    </div>)}
    {error&&<p className="error-box">{error}</p>}
    <button className="btn btn-primary btn-block" disabled={busy||questions.some(q=>!answers[q.id])} onClick={submit}>
      {busy?'Guardando…':'Guardar evaluación'}</button>
  </div>;
}
