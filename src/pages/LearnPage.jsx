import { BookOpen, Clock3, Sparkles } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { LEARNING_PATHS } from "../data";
import { useApp } from "../context/AppContext";

export default function LearnPage() {
  const { triage, lessons, loadingData, hydrated, dataError } = useApp();
  if (dataError) return <AppShell><div className="error-box">No se pudo cargar FinPath: {dataError}. Revisa la conexión y la migración v5.</div></AppShell>;
  if (hydrated && !loadingData && !triage) return <Navigate to="/triage" replace />;

  const recommendedIds = new Set(triage?.recommended_path_ids || []);
  const ordered = [...LEARNING_PATHS].sort((a,b) => Number(recommendedIds.has(b.id)) - Number(recommendedIds.has(a.id)));

  return (
    <AppShell>
      <span className="eyebrow"><Sparkles size={14}/> Rutas personalizadas</span>
      <h1 className="page-title">Aprender</h1>
      <p className="page-subtitle">Contenido corto y práctico. Empieza por lo que FinPath detectó como más relevante para ti.</p>
      <div className="list">
        {ordered.map(path => {
          const complete = lessons.filter(l=>l.path_id===path.id && l.status==="completed").length;
          return (
            <Link key={path.id} className="list-card" to={`/path/${path.id}`}>
              <div className="list-icon"><BookOpen/></div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}>
                  <h3>{path.title}</h3>
                  {recommendedIds.has(path.id) && <span className="tag tag-yellow">Recomendada</span>}
                </div>
                <p>{path.description}</p>
                <div className="meta"><span><Clock3 size={13}/> {path.lessons.reduce((s,l)=>s+(l.estimatedMinutes||0),0)} min</span><span>{complete}/{path.lessons.length} lecciones</span></div>
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}
