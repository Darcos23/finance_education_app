import { ArrowRight, BookOpen, Calculator, Flame, Target } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import MinimumJourneyCard from "../components/experiment/MinimumJourneyCard";
import ProgressBar from "../components/common/ProgressBar";
import { LEARNING_PATHS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function HomePage() {
  const { user, profile } = useAuth();
  const { triage, completedLessons, goals, experimentState, loadingData } = useApp();
  if (!loadingData && !triage) return <Navigate to="/triage" replace />;

  const name = profile?.full_name || user?.user_metadata?.full_name || "Hola";
  const firstName = name.split(" ")[0];
  const recommended = LEARNING_PATHS.find(p => triage?.recommended_path_ids?.includes(p.id)) || LEARNING_PATHS[0];
  const activeGoals = goals.filter(g => g.status === "active");
  const nextLesson = recommended?.lessons?.find(l => !completedLessons.some(c => c.lesson_id === l.id)) || recommended?.lessons?.[0];
  const completionDays = [...new Set(completedLessons
    .map((item) => item.completed_at?.slice(0, 10))
    .filter(Boolean))]
    .sort((a, b) => b.localeCompare(a));
  let streak = 0;
  if (completionDays.length) {
    const cursor = new Date();
    const today = cursor.toISOString().slice(0, 10);
    const yesterday = new Date(cursor.getTime() - 86400000).toISOString().slice(0, 10);
    if ([today, yesterday].includes(completionDays[0])) {
      let expected = new Date(`${completionDays[0]}T12:00:00`);
      for (const day of completionDays) {
        if (day !== expected.toISOString().slice(0, 10)) break;
        streak += 1;
        expected = new Date(expected.getTime() - 86400000);
      }
    }
  }

  return (
    <AppShell>
      <section className="hero-card">
        <span className="hero-chip">Tu siguiente paso</span>
        <h1 style={{margin:"12px 0 6px",fontSize:"1.9rem"}}>Hola, {firstName}.</h1>
        <p style={{margin:"0 0 18px"}}>{nextLesson ? `Continúa con “${nextLesson.title}”.` : "Explora una ruta y conviértela en una acción concreta."}</p>
        <Link className="btn btn-yellow" to={nextLesson ? `/lesson/${nextLesson.id}` : "/learn"}>
          {nextLesson ? "Continuar aprendiendo" : "Explorar rutas"} <ArrowRight size={18}/>
        </Link>
      </section>

      <div className="section-head"><h2>Tu progreso</h2><Link to="/profile">Ver detalle</Link></div>
      <div className="metric-grid">
        <div className="metric"><BookOpen size={19} color="#0068fb" style={{margin:"0 auto 5px"}}/><strong>{completedLessons.length}</strong><span>lecciones</span></div>
        <div className="metric"><Target size={19} color="#1ba86b" style={{margin:"0 auto 5px"}}/><strong>{activeGoals.length}</strong><span>metas activas</span></div>
        <div className="metric"><Flame size={19} color="#f2a100" style={{margin:"0 auto 5px"}}/><strong>{streak}</strong><span>racha</span></div>
      </div>

      <div className="section-head"><h2>Ruta recomendada</h2><Link to="/learn">Ver todas</Link></div>
      {recommended && (
        <div className="card card-pad">
          <span className="tag">Para ti</span>
          <h3 style={{fontSize:"1.25rem",margin:"10px 0 5px"}}>{recommended.title}</h3>
          <p className="page-subtitle" style={{marginBottom:12}}>{recommended.description}</p>
          <ProgressBar value={(completedLessons.filter(l=>l.path_id===recommended.id).length / Math.max(recommended.lessons.length,1))*100}/>
          <div style={{marginTop:13,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span className="form-note">{completedLessons.filter(l=>l.path_id===recommended.id).length} de {recommended.lessons.length} lecciones</span>
            <Link className="btn btn-secondary" to={`/path/${recommended.id}`}>Abrir ruta</Link>
          </div>
        </div>
      )}

      <div className="section-head"><h2>Practica sin riesgo</h2><Link to="/simulators">Ver simuladores</Link></div>
      <Link to="/simulators" className="soft-card" style={{display:"flex",alignItems:"center",gap:14}}>
        <div className="list-icon"><Calculator/></div>
        <div><strong>Prueba decisiones antes de la vida real</strong><div className="form-note">Ahorro, gastos, deuda y presupuesto con simuladores guiados.</div></div>
      </Link>

      <div style={{marginTop:18}}>
        <MinimumJourneyCard state={experimentState}/>
      </div>
    </AppShell>
  );
}
