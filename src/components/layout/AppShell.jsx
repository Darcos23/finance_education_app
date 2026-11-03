import { useState } from "react";
import { Bell, BookOpen, Calculator, Home, Target, UserRound, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Brand from "../common/Brand";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { deriveNotifications } from "../../lib/notifications";
import { analytics } from "../../lib/analytics";

const nav = [
  ["/app", "Inicio", Home],
  ["/learn", "Aprender", BookOpen],
  ["/simulators", "Simular", Calculator],
  ["/goals", "Metas", Target],
  ["/profile", "Perfil", UserRound],
];

export default function AppShell({ children }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const {user}=useAuth();
  const {experimentState,streak,lessons,goals}=useApp();
  const navigate=useNavigate();
  const notifications=deriveNotifications({experimentState,streak,lessons,goals});
  const readKey=`finpath_notifications_read_${user?.id||'anon'}`;
  const [version,setVersion]=useState(0);
  let read=[];
  try{read=JSON.parse(localStorage.getItem(readKey)||'[]');}catch{read=[];}
  const unread=notifications.filter(n=>!read.includes(n.id)).length;
  const clickNotification=async(n)=>{
    try{localStorage.setItem(readKey,JSON.stringify([...new Set([...read,n.id])].slice(-150)));}catch{/* Solo UI */}
    setVersion(v=>v+1);setNotificationsOpen(false);
    await analytics.event('notification_clicked',{user,objectType:'notification',objectId:n.id,properties:{type:n.type}});
    navigate(n.to,n.target?{state:{scrollToPremium:true}}:undefined);
  };
  return (
    <div className="app-frame">
      <main className="phone-app">
        <header className="topbar">
          <Brand />
          <button className="icon-btn" style={{position:'relative'}} aria-label={`Notificaciones (${unread} sin leer)`} onClick={() => setNotificationsOpen((value) => !value)}>
            <Bell size={20} />{unread>0&&<span style={{position:'absolute',right:0,top:0,background:'#003ea2',color:'white',borderRadius:12,fontSize:10,padding:'2px 5px'}}>{unread}</span>}
          </button>
        </header>

        {notificationsOpen && (
          <div style={{ position:"fixed", zIndex:45, top:72, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 36px)", maxWidth:484 }}>
            <div className="card card-pad" style={{ boxShadow:"0 18px 50px rgba(0,62,162,.2)",maxHeight:'55vh',overflowY:'auto' }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <strong>Notificaciones</strong>
                <button className="icon-btn" style={{width:34,height:34}} onClick={() => setNotificationsOpen(false)} aria-label="Cerrar"><X size={17}/></button>
              </div>
              {notifications.length===0?<p className="page-subtitle">No tienes notificaciones nuevas.</p>:
                notifications.map(n=><button key={n.id} className="question-option" style={{opacity:read.includes(n.id)?0.65:1}} onClick={()=>clickNotification(n)}>
                  <strong>{n.title}</strong><div className="form-note">{n.description}</div>
                </button>)}
            </div>
          </div>
        )}

        <div className="app-content">{children}</div>
        <nav className="bottom-nav" aria-label="Navegación principal">
          {nav.map(([to, label, Icon]) => (
            <NavLink key={to} to={to} end={to === "/app"} className={({isActive}) => `nav-item ${isActive ? "active" : ""}`}>
              <Icon size={21} strokeWidth={2.2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
}
