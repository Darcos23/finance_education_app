import { ArrowRight, BookOpen, Calculator, Flame, Target } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import MinimumJourneyCard from "../components/experiment/MinimumJourneyCard";
import ProgressBar from "../components/common/ProgressBar";
import { LEARNING_PATHS } from "../data";
import { useEffect } from "react";
import SkillCheckCard from "../components/experiment/SkillCheckCard";
import BenefitCheckinCard from "../components/experiment/BenefitCheckinCard";
import { bogotaDay } from "../lib/streak";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function HomePage() {
  const { user, profile } = useAuth();
  const { triage, completedLessons, goals, experimentState, loadingData, hydrated, dataError,
    lessons,streak,skillChecks,benefitCheckins,sessionCount } = useApp();
  const location=useLocation();
  useEffect(()=>{
    if(location.state?.scrollToPremium){
      const id=requestAnimationFrame(()=>{
        const card=document.getElementById('premium-card');
        card?.scrollIntoView({behavior:'smooth',block:'center'});
        card?.setAttribute('data-notification-highlight','true');
        if(card){card.style.outline='3px solid #fdbf04';card.style.outlineOffset='4px';}
        setTimeout(()=>{if(card){card.style.outline='';card.style.outlineOffset='';card.removeAttribute('data-notification-highlight');}},2000);
      });
      return ()=>cancelAnimationFrame(id);
    }
  },[location.state]);
  if (dataError) return <AppShell><div className="error-box">No se pudo cargar FinPath: {dataError}. Revisa la conexión y la migración v5.</div></AppShell>;
  if (hydrated && !loadingData && !triage) return <Navigate to="/triage" replace />;

  const name = profile?.full_name || user?.user_metadata?.full_name || "Hola";
  const firstName = name.split(" ")[0];
  const recommended = LEARNING_PATHS.find(p => triage?.recommended_path_ids?.includes(p.id)) || LEARNING_PATHS[0];
  const activeGoals = goals.filter(g => g.status === "active");
  const nextLesson = recommended?.lessons?.find(l => !completedLessons.some(c => c.lesson_id === l.id)) || recommended?.lessons?.[0];
  const errorCounts={};
  lessons.forEach(l=>(l.error_tags||[]).forEach(tag=>{errorCounts[tag]=(errorCounts[tag]||0)+1;}));
  const topSkill=Object.entries(errorCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const focused=topSkill&&LEARNING_PATHS.flatMap(p=>p.lessons).find(l=>l.skillTags?.includes(topSkill)&&
    !completedLessons.some(c=>c.lesson_id===l.id));
  const nextRecommendedLesson=focused||nextLesson;
  const start=experimentState?.registered_at||experimentState?.first_seen_at;
  const today=bogotaDay();
  const daysSince=Math.max(0,Math.floor((Date.parse(`${today}T12:00:00Z`)-Date.parse(`${start?bogotaDay(start):today}T12:00:00Z`))/86400000));
  const checkinPeriod=Math.floor(daysSince/7);
  const showCheckin=(daysSince>=3||sessionCount>=2)&&!benefitCheckins.some(c=>c.period_index===checkinPeriod);
  const showPre=Boolean(triage)&&!skillChecks.some(c=>c.kind==='pre');
  const showPost=completedLessons.length>=2&&!showPre&&!skillChecks.some(c=>c.kind==='post');

  return (
    <AppShell>
      <section className="hero-card">
        <span className="hero-chip">Tu siguiente paso</span>
        <h1 style={{margin:"12px 0 6px",fontSize:"1.9rem"}}>Hola, {firstName}.</h1>
        <p style={{margin:"0 0 18px"}}>{nextRecommendedLesson ? `Continúa con “${nextRecommendedLesson.title}”.` : "Explora una ruta y conviértela en una acción concreta."}</p>
        <Link className="btn btn-yellow" to={nextRecommendedLesson ? `/lesson/${nextRecommendedLesson.id}` : "/learn"}>
          {nextRecommendedLesson ? "Continuar aprendiendo" : "Explorar rutas"} <ArrowRight size={18}/>
        </Link>
      </section>

      <div className="section-head"><h2>Tu progreso</h2><Link to="/profile">Ver detalle</Link></div>
      <div className="metric-grid">
        <div className="metric"><BookOpen size={19} color="#0068fb" style={{margin:"0 auto 5px"}}/><strong>{completedLessons.length}</strong><span>lecciones</span></div>
        <div className="metric"><Target size={19} color="#1ba86b" style={{margin:"0 auto 5px"}}/><strong>{activeGoals.length}</strong><span>metas activas</span></div>
        <div className="metric"><Flame size={19} color="#f2a100" style={{margin:"0 auto 5px"}}/><strong>{streak.current}</strong><span>{streak.hasToday?"racha · hoy cuenta":"racha · hoy pendiente"}</span></div>
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

      {showPre&&<SkillCheckCard kind="pre"/>}
      {showPost&&<SkillCheckCard kind="post"/>}
      {showCheckin&&<BenefitCheckinCard periodIndex={checkinPeriod}/>}
      <div style={{marginTop:18}}><MinimumJourneyCard state={experimentState} source={location.state?.scrollToPremium?"notification":"home_card"}/></div>
    </AppShell>
  );
}
