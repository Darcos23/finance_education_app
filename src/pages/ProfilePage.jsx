import { BookOpen, LogOut, ShieldCheck, Target, TrendingUp, UserRound } from "lucide-react";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { LEARNING_PATHS } from "../data";

export default function ProfilePage(){
  const { user,profile,signOut }=useAuth();
  const { triage,completedLessons,goals,experimentState }=useApp();
  const name=profile?.full_name||user?.user_metadata?.full_name||"Usuario FinPath";
  const completedIds = new Set(completedLessons.map((item) => item.lesson_id));
  const xp = LEARNING_PATHS.flatMap((path) => path.lessons)
    .filter((lesson) => completedIds.has(lesson.id))
    .reduce((sum, lesson) => sum + Number(lesson.xpReward || 0), 0);
  const activeGoals = goals.filter((goal) => goal.status === "active");
  const goalSignals = activeGoals.map((goal) => {
    if (goal.type === "expense_limit") {
      const usage = Number(goal.target_amount || 0) > 0 ? Number(goal.current_amount || 0) / Number(goal.target_amount) : 0;
      return usage >= .8 ? "risk" : "good";
    }
    const target = ["saving_amount"].includes(goal.type) ? Number(goal.target_amount || 0) : Number(goal.target_value || 0);
    const current = ["saving_amount"].includes(goal.type) ? Number(goal.current_amount || 0) : Number(goal.current_value || 0);
    return target > 0 && current / target >= .5 ? "good" : "neutral";
  });
  const riskCount = goalSignals.filter((signal) => signal === "risk").length;
  const goodCount = goalSignals.filter((signal) => signal === "good").length;
  const financialStatus = !activeGoals.length
    ? { label: "En proceso", message: "Crea una meta para activar tu seguimiento." }
    : riskCount > activeGoals.length / 2
      ? { label: "Necesitas atención", message: "Varias metas requieren un ajuste o revisión." }
      : goodCount >= activeGoals.length / 2
        ? { label: "Buen camino", message: "La mayoría de tus metas muestra avance saludable." }
        : { label: "Vas en proceso", message: "Tienes metas activas; registra avances para obtener una señal más clara." };
  return <AppShell>
    <span className="eyebrow"><UserRound size={14}/> Tu cuenta</span>
    <h1 className="page-title">{name}</h1>
    <p className="page-subtitle">{user?.email}</p>
    <div className="metric-grid">
      <div className="metric"><BookOpen size={18} color="#0068fb" style={{margin:"0 auto 4px"}}/><strong>{completedLessons.length}</strong><span>lecciones</span></div>
      <div className="metric"><Target size={18} color="#1ba86b" style={{margin:"0 auto 4px"}}/><strong>{goals.length}</strong><span>metas</span></div>
      <div className="metric"><strong style={{fontSize:"1rem"}}>{triage?.level==="beginner"?"Inicial":triage?.level==="intermediate"?"Intermedio":"Avanzado"}</strong><span>nivel</span></div>
    </div>

    <div className="card card-pad" style={{marginTop:16}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div className="list-icon"><TrendingUp/></div>
        <div><div className="form-note">Salud de tus metas</div><strong style={{fontSize:"1.15rem",color:"#003ea2"}}>{financialStatus.label}</strong></div>
        <span className="tag tag-yellow" style={{marginLeft:"auto"}}>{xp} XP</span>
      </div>
      <p className="page-subtitle" style={{margin:"12px 0 0"}}>{financialStatus.message}</p>
    </div>

    <div className="card card-pad" style={{marginTop:16}}>
      <div style={{display:"flex",gap:10,alignItems:"center"}}><ShieldCheck color="#0068fb"/><h2 style={{margin:0,fontSize:"1.1rem"}}>Qué medimos durante la prueba</h2></div>
      <p className="page-subtitle" style={{margin:"10px 0 0"}}>Registramos hitos de uso asociados a tu cuenta: diagnóstico, rutas, lecciones, metas, simuladores y avance en el funnel Premium. Los campos del checkout simulado no se almacenan.</p>
    </div>

    <div className="card card-pad">
      <h2 style={{margin:"0 0 10px",fontSize:"1.1rem"}}>Recorrido mínimo</h2>
      <div className="checklist">
        <div className={`check-row ${experimentState?.triage_completed_at?"done":""}`}>Diagnóstico completado</div>
        <div className={`check-row ${experimentState?.route_viewed_at?"done":""}`}>Ruta explorada</div>
        <div className={`check-row ${experimentState?.central_feature_used_at?"done":""}`}>Funcionalidad central utilizada</div>
      </div>
    </div>

    <button className="btn btn-danger btn-block" style={{marginTop:16}} onClick={signOut}><LogOut size={18}/> Cerrar sesión</button>
  </AppShell>
}
