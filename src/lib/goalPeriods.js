import { bogotaDay } from './streak';
export const periodType = (goal) => goal?.unit === 'COP gastados/mes' ? 'month' : 'week';
export function periodStart(goal, today = bogotaDay()) {
  if (periodType(goal)==='month') return `${today.slice(0,7)}-01`;
  const d=new Date(`${today}T12:00:00Z`);
  const offset=(d.getUTCDay()+6)%7;
  return new Date(d.getTime()-offset*86400000).toISOString().slice(0,10);
}
export function expenseInPeriod(goal, entries=[], today=bogotaDay()) {
  const since=periodStart(goal,today);
  return entries.filter(e=>e.goal_id===goal.id && e.entry_type==='expense' && bogotaDay(e.created_at)>=since && bogotaDay(e.created_at)<=today)
    .reduce((sum,e)=>sum+Number(e.amount||0),0);
}
