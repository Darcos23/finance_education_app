import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { TRIAGE_QUESTIONS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";

export default function TriagePage() {
  const { user } = useAuth();
  const { triage, refresh } = useApp();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  if (triage?.completed_at) return <Navigate to="/app" replace />;

  const q = TRIAGE_QUESTIONS[index];
  const selected = answers[q.id];
  const next = async () => {
    if (!selected) return;
    if (index < TRIAGE_QUESTIONS.length - 1) return setIndex(index + 1);
    setBusy(true); setError("");
    try {
      await appService.saveTriage(user, answers);
      await refresh();
      navigate("/app", { replace:true });
    } catch (e) {
      setError(e?.message || "No se pudo guardar tu diagnóstico. Revisa tu conexión e inténtalo de nuevo.");
    } finally { setBusy(false); }
  };

  return (
    <AppShell hideNav>
      <span className="eyebrow">Diagnóstico inicial</span>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:10}}>
        <h1 className="page-title" style={{fontSize:"1.8rem"}}>{q.question}</h1>
        <strong style={{color:"#0068fb"}}>{index+1}/{TRIAGE_QUESTIONS.length}</strong>
      </div>
      <p className="page-subtitle">{q.description}</p>
      <div className="progress-track" style={{marginBottom:18}}><div className="progress-fill" style={{width:`${((index+1)/TRIAGE_QUESTIONS.length)*100}%`}}/></div>
      <div className="card card-pad">
        {q.options.map(opt=>(
          <button key={opt.id} type="button" className={`question-option ${selected===opt.id ? "selected":""}`} onClick={()=>setAnswers({...answers,[q.id]:opt.id})}>{opt.label}</button>
        ))}
      </div>
      {error && <div className="error-box" style={{marginTop:12}}>{error}</div>}
      <div style={{display:"grid",gridTemplateColumns:index ? "1fr 2fr":"1fr",gap:10,marginTop:16}}>
        {index>0 && <button className="btn btn-secondary" onClick={()=>setIndex(index-1)}><ArrowLeft size={18}/> Atrás</button>}
        <button className="btn btn-primary" disabled={!selected || busy} onClick={next}>{index===TRIAGE_QUESTIONS.length-1 ? (busy?"Guardando…":"Ver mi ruta") : "Continuar"} <ArrowRight size={18}/></button>
      </div>
    </AppShell>
  );
}
