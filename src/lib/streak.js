// Fechas de la actividad en America/Bogota, no en UTC.
const zone = 'America/Bogota';
export const bogotaDay = (date = new Date()) => new Intl.DateTimeFormat('en-CA', {
  timeZone: zone, year:'numeric',month:'2-digit',day:'2-digit'
}).format(new Date(date));
const previousDay = (day) => new Date(Date.parse(`${day}T12:00:00Z`) - 86400000).toISOString().slice(0,10);

export function calculateStreak({ lessons = [], goalEntries = [], simulatorRuns = [], activeDays = [] } = {}, now = new Date()) {
  const days = new Set([
    ...lessons.map(x=>x.completed_at), ...goalEntries.map(x=>x.created_at),
    ...simulatorRuns.map(x=>x.completed_at), ...activeDays
  ].filter(Boolean).map(x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x)) ? x : bogotaDay(x)));
  const today = bogotaDay(now), yesterday=previousDay(today), sorted=[...days].sort().reverse();
  let longest=0, currentRun=0, last=null;
  for(const day of sorted){
    if (!last || day===previousDay(last)) currentRun+=1;
    else {longest=Math.max(longest,currentRun); currentRun=1;}
    last=day;
  }
  longest=Math.max(longest,currentRun);
  const hasToday=days.has(today);
  let current=0, expected=hasToday?today:yesterday;
  while(days.has(expected)){current++;expected=previousDay(expected);}
  return {current, longest, hasToday, days:[...days].sort().reverse(), today};
}
