import { useEffect, useRef, useState } from "react";
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
  const { refresh, goals, lessons } = useApp();
  const navigate = useNavigate();
  const [stepIndex,setStepIndex]=useState(0);
  const [selected,setSelected]=useState(null);
  const [classifications,setClassifications]=useState({});
  const [answered,setAnswered]=useState(false);
  const [errors,setErrors]=useState([]);
  const [correctCount,setCorrectCount]=useState(0);
  const [adaptive,setAdaptive]=useState(null);
  const [adaptiveSelected,setAdaptiveSelected]=useState(null);
  const [adaptiveDone,setAdaptiveDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [actionChoice,setActionChoice]=useState(null);
  const [message,setMessage]=useState("");
  const actionLock=useRef(false);

  // Hooks van ANTES del return condicional. No degrada una lección finalizada.
  useEffect(()=>{
    if (!item || !user) return;
    const existing=lessons.find(l=>l.lesson_id===item.id);
    if(existing?.status==='started' && existing.current_step>0)
      setStepIndex(Math.min(existing.current_step,item.steps.length-1));
    appService.upsertLessonProgress(user,{lessonId:item.id,pathId:item.path.id,status:"started",currentStep:existing?.current_step||0})
      .catch(console.warn);
    analytics.once("lesson_started",{user,objectType:"lesson",objectId:item.id});
    analytics.once("route_viewed",{user,objectType:"path",objectId:item.path.id});
  },[item?.id,user?.id]);

  if (!item) return <AppShell><div className="empty">Lección no encontrada.</div></AppShell>;
  const { path } = item;
  const step = item.steps[stepIndex];
  const progress=((stepIndex+1)/item.steps.length)*100;
  const correctId=step?.correctOptionId||LESSON_ANSWER_KEYS[step?.id];
  const wrongAnswer=answered && ((step.type==='question' && selected!==correctId) ||
    (step.type==='classify' && step.items.some(i=>classifications[i.id]!==i.correctCategoryId)));

  const onWrong=async()=>{
    const skill=step.skillTag||step.id;
    setErrors(current=>[...new Set([...current,skill])]);
    const practice=ADAPTIVE_PRACTICE[item.id];
    if(practice){
      setAdaptive(practice);
      await analytics.once('adaptive_practice_shown',{user,objectType:'lesson',objectId:item.id,properties:{trigger_step:step.id,skill_tag:skill}});
    }
  };
  const evaluateQuestion=async()=>{
    if(!selected)return;
    const correct=selected===correctId;
    setAnswered(true);if(correct)setCorrectCount(c=>c+1);else await onWrong();
    await analytics.once('lesson_question_answered',{user,objectType:'lesson_step',objectId:step.id,properties:{correct,skill_tag:step.skillTag}});
  };
  const evaluateClassify=async()=>{
    if(step.items.some(i=>!classifications[i.id]))return;
    const correct=step.items.every(i=>classifications[i.id]===i.correctCategoryId);
    setAnswered(true);if(correct)setCorrectCount(c=>c+1);else await onWrong();
    await analytics.once('lesson_question_answered',{user,objectType:'lesson_step',objectId:step.id,properties:{correct,skill_tag:step.skillTag}});
  };
  // redirectTo (opcional): adónde ir DESPUÉS de guardar. El guardado, lesson_completed y refresh() no cambian.
  const finish=async(redirectTo)=>{
    setBusy(true);
    try{
      await appService.upsertLessonProgress(user,{lessonId:item.id,pathId:path.id,status:'completed',currentStep:item.steps.length-1,score:correctCount,errorTags:errors});
      await analytics.once('lesson_completed',{user,objectType:'lesson',objectId:item.id,properties:{errors_count:errors.length,adaptive_used:Boolean(adaptive)}});
      await refresh();navigate(typeof redirectTo==='string'&&redirectTo?redirectTo:`/path/${path.id}`,{replace:true});
    }catch(e){setMessage(e.message||'No se pudo guardar el progreso.');}
    finally{setBusy(false);}
  };
  const next=async()=>{
    if(step.type==='question' && !answered)return evaluateQuestion();
    if(step.type==='classify' && !answered)return evaluateClassify();
    if(wrongAnswer&&adaptive&&!adaptiveDone)return;
    if(stepIndex===item.steps.length-1)return finish();
    setStepIndex(i=>i+1);setSelected(null);setClassifications({});setAnswered(false);
    setAdaptive(null);setAdaptiveSelected(null);setAdaptiveDone(false);setActionChoice(null);setMessage('');
    await appService.upsertLessonProgress(user,{lessonId:item.id,pathId:path.id,status:'started',currentStep:stepIndex+1,errorTags:errors});
  };
  // Paso "action": la meta se ofrece como idea y NUNCA se crea dentro de la lección (no interrumpe el progreso).
  const isLastStep=stepIndex===item.steps.length-1;
  const completeAction=async()=>{
    if(busy||actionLock.current)return;
    actionLock.current=true;
    try{
      await analytics.once('lesson_goal_suggestion_skipped',{user,objectType:'lesson',objectId:item.id});
      await next();
    }finally{actionLock.current=false;}
  };
  const completeAndCreateGoal=async()=>{
    if(busy||actionLock.current||!actionChoice||!isLastStep)return;
    actionLock.current=true;
    try{
      await analytics.once('lesson_goal_suggestion_accepted',{user,objectType:'lesson',objectId:item.id,properties:{template_id:actionChoice}});
      await finish(`/goals/new?template=${encodeURIComponent(actionChoice)}&from=lesson`);
    }finally{actionLock.current=false;}
  };
  const completeAdaptive=async()=>{
    if(!adaptiveSelected)return;
    setAdaptiveDone(true);
    await analytics.once('adaptive_practice_completed',{user,objectType:'lesson',objectId:item.id,properties:{correct:adaptiveSelected===adaptive.correctOptionId}});
  };
  const disabled=busy || (step.type==='question'&&!answered&&!selected) ||
    (step.type==='classify'&&!answered&&step.items.some(i=>!classifications[i.id])) ||
    (wrongAnswer&&adaptive&&!adaptiveDone);

  return <AppShell>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
      <button className="icon-btn" onClick={()=>navigate(`/path/${path.id}`)}><ArrowLeft size={20}/></button>
      <div style={{flex:1}}><div className="form-note">{item.title}</div><div className="progress-track"><div className="progress-fill" style={{width:`${progress}%`}}/></div></div>
      <strong style={{fontSize:'.78rem',color:'#0068fb'}}>{stepIndex+1}/{item.steps.length}</strong>
    </div>
    <div className="card card-pad">
      <span className="eyebrow">{step.type==='question'||step.type==='classify'?'Práctica':step.type==='action'?'Llévalo a la acción':'Aprendizaje'}</span>
      <h1 style={{fontSize:'1.65rem',lineHeight:1.08,margin:'14px 0 8px'}}>{step.title}</h1>
      <p className="page-subtitle" style={{marginBottom:8}}>{step.body}</p>
      {step.type==='question' && step.options.map(opt=>{
        const correct=answered&&opt.id===correctId;
        const wrong=answered&&selected===opt.id&&opt.id!==correctId;
        return <div key={opt.id}>
          <button className={`question-option ${selected===opt.id?'selected':''} ${correct?'correct':''} ${wrong?'wrong':''}`}
            disabled={answered} onClick={()=>setSelected(opt.id)}>{opt.label}</button>
          {answered&&(selected===opt.id||correct)&&<div className={correct?'success-box':'warning-box'} style={{marginTop:5}}>{opt.feedback}</div>}
        </div>;
      })}
      {step.type==='classify' && step.items.map(i=><div key={i.id} style={{padding:'10px 0',borderBottom:'1px solid #dceafe'}}>
        <strong>{i.label}</strong>
        <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:6}}>{step.categories.map(c=><button key={c.id}
          className={`btn ${classifications[i.id]===c.id?'btn-primary':'btn-secondary'}`} disabled={answered}
          onClick={()=>setClassifications(v=>({...v,[i.id]:c.id}))}>{c.label}</button>)}</div>
        {answered&&<p className={classifications[i.id]===i.correctCategoryId?'success-box':'warning-box'}>
          {classifications[i.id]===i.correctCategoryId?'Correcto. ':'La categoría correcta es '+step.categories.find(c=>c.id===i.correctCategoryId)?.label+'. '}{i.feedback}</p>}
      </div>)}
      {step.type==='action' && <>
        {step.options?.filter(opt=>GOAL_TEMPLATES.some(t=>t.id===opt.id)).map(opt=>{
          const existing=goals.some(g=>g.template_id===opt.id&&g.status==='active');
          return <button key={opt.id} type="button" className={`question-option ${actionChoice===opt.id?'selected':''}`}
            aria-pressed={actionChoice===opt.id} disabled={busy}
            onClick={()=>setActionChoice(c=>c===opt.id?null:opt.id)}>
            {opt.label}{existing&&<span className="tag tag-green" style={{marginLeft:8}}>Ya la tienes</span>}
          </button>;
        })}
        <p className="form-note" style={{marginTop:12}}>Opcional: puedes terminar sin crear una meta.</p>
      </>}
      {message&&<p className="info-box" style={{marginTop:12}}>{message}</p>}
      {answered && (step.type==='question'||step.type==='classify') &&
        <div className={wrongAnswer?'warning-box':'success-box'} style={{marginTop:12}}>
          {wrongAnswer?<Lightbulb size={16}/>:<CheckCircle2 size={16}/>} {wrongAnswer?'Revisa las explicaciones antes de continuar.':'¡Bien! Puedes avanzar.'}
        </div>}
    </div>
    {adaptive && answered && wrongAnswer && <div className="card card-pad" style={{marginTop:14,borderColor:'#ffe39a'}}>
      <span className="eyebrow" style={{background:'#fff5cd',color:'#7a5900'}}><RotateCcw size={14}/> Refuerzo personalizado</span>
      <h2 style={{margin:'12px 0 6px',fontSize:'1.2rem'}}>{adaptive.title}</h2><p className="page-subtitle">{adaptive.prompt}</p>
      {adaptive.options.map(opt=><div key={opt.id}><button className={`question-option ${adaptiveSelected===opt.id?'selected':''}`}
        disabled={adaptiveDone} onClick={()=>setAdaptiveSelected(opt.id)}>{opt.label}</button>
        {adaptiveDone&&(opt.id===adaptiveSelected||opt.id===adaptive.correctOptionId)&&<div className={opt.id===adaptive.correctOptionId?'success-box':'warning-box'}>{opt.feedback}</div>}</div>)}
      {!adaptiveDone?<button className="btn btn-yellow btn-block" style={{marginTop:12}} disabled={!adaptiveSelected} onClick={completeAdaptive}>Comprobar refuerzo</button>
        :<p className="info-box">{adaptive.insight}</p>}
    </div>}
    {step.type==='action' ? <>
      <button className="btn btn-primary btn-block" style={{marginTop:16}} disabled={busy} onClick={completeAction}>
        {isLastStep?(busy?'Guardando…':'Completar lección'):'Continuar'} <ArrowRight size={18}/>
      </button>
      {isLastStep&&actionChoice&&<button className="btn btn-secondary btn-block" style={{marginTop:10}} disabled={busy} onClick={completeAndCreateGoal}>
        Completar y crear esta meta
      </button>}
    </> :
    <button className="btn btn-primary btn-block" style={{marginTop:16}} disabled={disabled} onClick={next}>
      {step.type==='question'&&!answered||step.type==='classify'&&!answered?'Comprobar':
        stepIndex===item.steps.length-1?(busy?'Guardando…':'Completar lección'):'Continuar'} <ArrowRight size={18}/>
    </button>}
  </AppShell>;
}
