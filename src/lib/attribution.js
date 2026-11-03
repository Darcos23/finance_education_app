const KEY='finpath_first_touch_v1';
export function getFirstTouch(){
  try {
    let saved=JSON.parse(localStorage.getItem(KEY)||'null');
    if(saved)return saved;
    const query=new URLSearchParams(window.location.search);
    const keys=['utm_source','utm_medium','utm_campaign','ref'];
    const found=Object.fromEntries(keys.map(k=>[k,(query.get(k)||'').slice(0,120)]).filter(([,v])=>Boolean(v)));
    saved={...found,first_touch_at:new Date().toISOString()};
    localStorage.setItem(KEY,JSON.stringify(saved));return saved;
  } catch {return {};}
}
