import { bogotaDay } from './streak';
export function deriveNotifications({experimentState,streak,lessons=[],goals=[]}={}) {
  const out=[];
  if(experimentState?.minimum_journey_completed_at && !experimentState?.premium_selected_at)
    out.push({id:'premium_available',type:'premium',title:'Ya puedes conocer FinPath Premium',description:'Completaste el recorrido inicial.',to:'/app',target:'premium-card'});
  if(streak?.current>0 && !streak?.hasToday)
    out.push({id:`streak_${streak.today}`,type:'streak',title:'Tu racha está en riesgo',description:'Completa una lección, un avance de meta o un simulador hoy.',to:'/app'});
  const pending=lessons.find(l=>l.status==='started');
  if(pending)out.push({id:`lesson_${pending.lesson_id}`,type:'lesson',title:'Continúa tu lección',description:'Puedes retomar donde estabas.',to:`/lesson/${pending.lesson_id}`});
  const today=bogotaDay(); const utc=(s)=>Date.parse(`${s}T12:00:00Z`);
  goals.forEach(g=>{
    if(g.status==='completed')out.push({id:`goal_done_${g.id}`,type:'goal_completed',title:'¡Meta lograda!',description:g.title,to:`/goals/${g.id}`});
    if(g.status==='active' && g.target_date){
      const days=Math.round((utc(g.target_date)-utc(today))/86400000);
      if(days>=0 && days<=3)out.push({id:`goal_due_${g.id}_${g.target_date}`,type:'goal_due',title:'Tu meta vence pronto',description:g.title,to:`/goals/${g.id}`});
    }
  });
  return out;
}
