import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Lightbulb, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { ADAPTIVE_PRACTICE, GOAL_TEMPLATES, LEARNING_PATHS, LESSON_ANSWER_KEYS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";
import { analytics } from "../lib/analytics";

const allLessons = LEARNING_PATHS.flatMap(path => path.lessons.map(lesson => ({...lesson, path})));

export default function LessonPage() {
  const { lessonId } = useParams();
  const item = allLessons.find(l=>l.id===lessonId);
  const { user } = useAuth();
  const { refresh, goals } = useApp();
  const navigate = useNavigate();
  const [stepIndex,setStepIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [answered,setAnswered]=useState(false);
  const [errors,setErrors]=useState([]);
  const [correctCount,setCorrectCount]=useState(0);
  const [adaptive,setAdaptive]=useState(null);
  const [adaptiveSelected,setAdaptiveSelected]=useState(null);
  const [adaptiveDone,setAdaptiveDone]=useState(false);
  const [busy,setBusy]=useState(false);

  if (!item) return <AppShell><div className="empty">Lección no encontrada.</div></AppShell>;
  const { path } = item;
  const step = item.steps[stepIndex];
  const progress=((stepIndex+1)/item.steps.length)*100;

  const saveStarted = async () => {
    await appService.upsertLessonProgress(user,{lessonId:item.id,pathId:path.id,status:"started",currentStep:stepIndex,errorTags:errors});
    await analytics.once("lesson_started",{user,objectType:"lesson",objectId:item.id});
    await analytics.once("route_viewed",{user,objectType:"path",objectId:path.id});
  };

  useEffect(()=>{ saveStarted(); },[item.id]);

  const selectOption = (id) => {
    if (answered && step.type==="question") return;
    setSelected(id);
  };

  const evaluateQuestion = async () => {
    const key=LESSON_ANSWER_KEYS[step.id];
    const isCorrect=selected===key;
    setAnswered(true);
    if (isCorrect) setCorrectCount(c=>c+1);
    else {
      const nextErrors=[...new Set([...errors,step.id])];
      setErrors(nextErrors);
      const practice=ADAPTIVE_PRACTICE[item.id];
      if (practice) {
        setAdaptive(practice);
        await analytics.once("adaptive_practice_shown",{user,objectType:"lesson",objectId:item.id,properties:{trigger_step:step.id}});
      }
    }
    await analytics.once("lesson_question_answered",{user,objectType:"lesson_step",objectId:step.id,properties:{correct:isCorrect}});
  };

  const createActionGoalIfNeeded = async () => {
    if (step.type!=="action" || !selected) return;
    const template=GOAL_TEMPLATES.find(t=>t.id===selected);
    if (!template || goals.some(g=>g.template_id===template.id && g.status==="active")) return;
    await appService.createGoalFromTemplate(user, template);
  };

  const finish = async () => {
    setBusy(true);
    try {
      await createActionGoalIfNeeded();
      await appService.upsertLessonProgress(user,{
        lessonId:item.id,pathId:path.id,status:"completed",currentStep:item.steps.length-1,
        score:correctCount,errorTags:errors
      });
      await analytics.once("lesson_completed",{user,objectType:"lesson",objectId:item.id,properties:{errors_count:errors.length,adaptive_used:Boolean(adaptive)}});
      await refresh();
      navigate(`/path/${path.id}`,{replace:true});
    } finally { setBusy(false); }
  };

  const next = async () => {
    if (step.type==="question" && !answered) return evaluateQuestion();
    if (step.type==="action") await createActionGoalIfNeeded();
    if (stepIndex===item.steps.length-1) return finish();
    setStepIndex(i=>i+1); setSelected(null); setAnswered(false); setAdaptive(null); setAdaptiveSelected(null); setAdaptiveDone(false);
    await appService.upsertLessonProgress(user,{lessonId:item.id,pathId:path.id,status:"started",currentStep:stepIndex+1,errorTags:errors});
  };

  const completeAdaptive = async () => {
    if (!adaptiveSelected) return;
    setAdaptiveDone(true);
    await analytics.once("adaptive_practice_completed",{user,objectType:"lesson",objectId:item.id,properties:{correct:adaptiveSelected===adaptive.correctOptionId}});
  };

  const requiresSelection=["question","action"].includes(step.type);
  const wrongAnswer = step.type === "question" && answered && selected !== LESSON_ANSWER_KEYS[step.id];
  const nextDisabled = busy
    || (requiresSelection && !selected)
    || (wrongAnswer && adaptive && !adaptiveDone);

  return (
    <AppShell>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <button className="icon-btn" onClick={()=>navigate(`/path/${path.id}`)}><ArrowLeft size={20}/></button>
        <div style={{flex:1}}><div className="form-note">{item.title}</div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div></div>
        <strong style={{fontSize:".78rem",color:"#0068fb"}}>{stepIndex+1}/{item.steps.length}</strong>
      </div>

      <div className="card card-pad">
        <span className="eyebrow">{step.type==="question"?"Práctica":step.type==="action"?"Llévalo a la acción":"Aprendizaje"}</span>
        <h1 style={{fontSize:"1.65rem",lineHeight:1.08,margin:"14px 0 8px"}}>{step.title}</h1>
        <p className="page-subtitle" style={{marginBottom:8}}>{step.body}</p>

        {step.options?.map(opt=>{
          const correct=answered && step.type==="question" && opt.id===LESSON_ANSWER_KEYS[step.id];
          const wrong=answered && selected===opt.id && opt.id!==LESSON_ANSWER_KEYS[step.id];
          return <button key={opt.id} className={`question-option ${selected===opt.id?"selected":""} ${correct?"correct":""} ${wrong?"wrong":""}`} onClick={()=>selectOption(opt.id)}>{opt.label}</button>;
        })}

        {answered && step.type==="question" && (
          selected===LESSON_ANSWER_KEYS[step.id]
            ? <div className="success-box" style={{marginTop:12}}><CheckCircle2 size={16} style={{verticalAlign:"middle"}}/> Bien. Continúa al siguiente paso.</div>
            : <div className="warning-box" style={{marginTop:12}}><Lightbulb size={16} style={{verticalAlign:"middle"}}/> Esta respuesta muestra un tema que podemos reforzar antes de continuar.</div>
        )}
      </div>

      {adaptive && answered && selected!==LESSON_ANSWER_KEYS[step.id] && (
        <div className="card card-pad" style={{marginTop:14,borderColor:"#ffe39a"}}>
          <span className="eyebrow" style={{background:"#fff5cd",color:"#7a5900"}}><RotateCcw size={14}/> Refuerzo personalizado</span>
          <h2 style={{margin:"12px 0 6px",fontSize:"1.2rem"}}>{adaptive.title}</h2>
          <p className="page-subtitle">{adaptive.prompt}</p>
          {adaptive.options.map(opt=>(
            <button key={opt.id} className={`question-option ${adaptiveSelected===opt.id?"selected":""}`} onClick={()=>!adaptiveDone&&setAdaptiveSelected(opt.id)}>{opt.label}</button>
          ))}
          {!adaptiveDone
            ? <button className="btn btn-yellow btn-block" style={{marginTop:12}} disabled={!adaptiveSelected} onClick={completeAdaptive}>Comprobar refuerzo</button>
            : <div className={adaptiveSelected===adaptive.correctOptionId?"success-box":"warning-box"} style={{marginTop:12}}>{adaptive.insight}</div>
          }
        </div>
      )}

      <button className="btn btn-primary btn-block" style={{marginTop:16}} disabled={nextDisabled} onClick={next}>
        {stepIndex===item.steps.length-1 ? (busy?"Guardando…":"Completar lección") : (step.type==="question"&&!answered?"Comprobar":"Continuar")} <ArrowRight size={18}/>
      </button>
    </AppShell>
  );
}
