import { useState } from "react";
import { Bell, BookOpen, Calculator, Home, Target, UserRound, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import Brand from "../common/Brand";

const nav = [
  ["/app", "Inicio", Home],
  ["/learn", "Aprender", BookOpen],
  ["/simulators", "Simular", Calculator],
  ["/goals", "Metas", Target],
  ["/profile", "Perfil", UserRound],
];

export default function AppShell({ children }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  return (
    <div className="app-frame">
      <main className="phone-app">
        <header className="topbar">
          <Brand />
          <button className="icon-btn" aria-label="Notificaciones" onClick={() => setNotificationsOpen((value) => !value)}><Bell size={20} /></button>
        </header>

        {notificationsOpen && (
          <div style={{ position:"fixed", zIndex:45, top:72, left:"50%", transform:"translateX(-50%)", width:"calc(100% - 36px)", maxWidth:484 }}>
            <div className="card card-pad" style={{ boxShadow:"0 18px 50px rgba(0,62,162,.2)" }}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
                <strong>Notificaciones</strong>
                <button className="icon-btn" style={{width:34,height:34}} onClick={() => setNotificationsOpen(false)} aria-label="Cerrar"><X size={17}/></button>
              </div>
              <p className="page-subtitle" style={{margin:"10px 0 0"}}>No tienes notificaciones nuevas. Durante la prueba evitamos agregar recordatorios que puedan alterar tu comportamiento natural.</p>
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
