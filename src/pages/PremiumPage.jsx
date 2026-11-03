import { useEffect, useState } from "react";
import { CheckCircle2, Crown, LockKeyhole } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { PREMIUM_CONFIG } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { analytics, actorFor } from "../lib/analytics";
import { appService } from "../services/appService";

export default function PremiumPage() {
  const { user } = useAuth();
  const { experimentState, refresh } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const unlocked = Boolean(experimentState?.minimum_journey_completed_at);

  useEffect(() => {
    if (unlocked && user) analytics.once("premium_offer_viewed", { user, properties: {source:location.state?.source||"direct"} });
  }, [unlocked, user?.id]);

  const choosePremium = async () => {
    if (busy) return;
    setBusy(true);
    await analytics.once("premium_selected", {
      user,
      properties: { price: PREMIUM_CONFIG.monthlyPrice, currency: PREMIUM_CONFIG.currency },
    });
    try {
      const attempt = await appService.startCheckout(user, actorFor(user));
      await refresh();
      navigate(`/checkout/${attempt.id}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <span className="eyebrow"><Crown size={14}/> FinPath Premium</span>
      <h1 className="page-title">Más práctica. Más personalización.</h1>
      {!unlocked ? (
        <div className="card card-pad">
          <div className="list-icon"><LockKeyhole/></div>
          <h2>Primero prueba FinPath Free</h2>
          <p className="page-subtitle">La oferta Premium se habilita cuando completas el diagnóstico, exploras una ruta y utilizas al menos una funcionalidad central.</p>
          <div className="warning-box">Esto evita mostrar una oferta de pago antes de que el usuario haya experimentado el valor básico del producto.</div>
        </div>
      ) : (
        <>
          <div className="hero-card">
            <span className="hero-chip">Hipótesis comercial en prueba</span>
            <h2 style={{fontSize:"2rem",margin:"12px 0 4px"}}>${PREMIUM_CONFIG.monthlyPrice.toLocaleString("es-CO")} COP</h2>
            <p style={{marginTop:0}}>{PREMIUM_CONFIG.periodLabel} · {PREMIUM_CONFIG.renewalLabel}</p>
          </div>

          <div className="card card-pad">
            <h2 style={{margin:"0 0 12px"}}>Qué cambia con Premium</h2>
            <div className="checklist">
              {PREMIUM_CONFIG.premiumFeatures.map(item=><div className="check-row done" key={item}><CheckCircle2 size={18}/>{item}</div>)}
            </div>
          </div>

          <button className="btn btn-yellow btn-block" style={{marginTop:16}} onClick={choosePremium} disabled={busy}>
            {busy ? "Preparando checkout…" : "Quiero probar Premium por $9.000"}
          </button>
          {/* <p className="form-note" style={{textAlign:"center",marginTop:10}}>
            Esta versión académica usa un checkout simulado y no realiza cobros.
          </p> */}
        </>
      )}
    </AppShell>
  );
}
