import { CheckCircle2, Circle, LockKeyhole } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProgressBar from "../components/common/ProgressBar";
import { LEARNING_PATHS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { analytics } from "../lib/analytics";

export default function PathPage() {
  const { pathId } = useParams();
  const path = LEARNING_PATHS.find(p=>p.id===pathId);
  const { user } = useAuth();
  const { lessons } = useApp();
  const navigate = useNavigate();

  if (!path) return <AppShell><div className="empty">Ruta no encontrada.</div></AppShell>;

  const completed = new Set(lessons.filter(l=>l.status==="completed").map(l=>l.lesson_id));
  const openLesson = async (lesson, index) => {
    const available = index===0 || completed.has(path.lessons[index-1]?.id) || completed.has(lesson.id);
    if (!available) return;
    await analytics.once("route_viewed", { user, objectType:"path", objectId:path.id });
    navigate(`/lesson/${lesson.id}`);
  };

  return (
    <AppShell>
      <span className="eyebrow">Ruta de aprendizaje</span>
      <h1 className="page-title">{path.title}</h1>
      <p className="page-subtitle">{path.description}</p>
      <ProgressBar value={(completed.size ? path.lessons.filter(l=>completed.has(l.id)).length/path.lessons.length:0)*100}/>
      <div className="list" style={{marginTop:18}}>
        {path.lessons.map((lesson,index)=>{
          const done=completed.has(lesson.id);
          const available=index===0 || completed.has(path.lessons[index-1]?.id) || done;
          return (
            <button key={lesson.id} className="list-card" style={{textAlign:"left",width:"100%",opacity:available?1:.58}} onClick={()=>openLesson(lesson,index)}>
              <div className="list-icon">{done?<CheckCircle2/>:available?<Circle/>:<LockKeyhole/>}</div>
              <div style={{flex:1}}><h3>{lesson.title}</h3><p>{lesson.description}</p><div className="meta"><span>{lesson.estimatedMinutes} min</span><span>{done?"Completada":available?"Disponible":"Completa la anterior"}</span></div></div>
            </button>
          );
        })}
      </div>
      <Link to="/learn" className="btn btn-secondary btn-block" style={{marginTop:16}}>Volver a rutas</Link>
    </AppShell>
  );
}
