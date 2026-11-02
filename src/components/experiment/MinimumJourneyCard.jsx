import { CheckCircle2, Circle, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export default function MinimumJourneyCard({ state }) {
  const checks = [
    ["Diagnóstico completado", Boolean(state?.triage_completed_at)],
    ["Ruta recomendada explorada", Boolean(state?.route_viewed_at)],
    ["Funcionalidad central utilizada", Boolean(state?.central_feature_used_at)],
  ];
  const unlocked = Boolean(state?.minimum_journey_completed_at);

  return (
    <div className="card card-pad">
      <span className="eyebrow"><Crown size={15}/> Experiencia Premium</span>
      <h2 style={{margin:"12px 0 8px"}}>{unlocked ? "Ya puedes conocer Premium" : "Primero prueba lo esencial"}</h2>
      {/* <p className="page-subtitle" style={{marginBottom:14}}>
        {unlocked
          ? "Ya recorriste la experiencia mínima. Ahora puedes evaluar si el nivel Premium te aporta valor adicional."
          : "Queremos que conozcas FinPath antes de mostrarte una oferta de pago."}
      </p> */}
      <div className="checklist">
        {checks.map(([label, done]) => (
          <div className={`check-row ${done ? "done" : ""}`} key={label}>
            {done ? <CheckCircle2 size={18}/> : <Circle size={18}/>} {label}
          </div>
        ))}
      </div>
      {unlocked && <Link className="btn btn-yellow btn-block" style={{marginTop:16}} to="/premium">Conocer Premium</Link>}
    </div>
  );
}
