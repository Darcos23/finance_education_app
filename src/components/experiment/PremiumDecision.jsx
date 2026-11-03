import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DeclineReasons from "./DeclineReasons";
import { PREMIUM_CONFIG } from "../../data";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { analytics, actorFor } from "../../lib/analytics";
import { appService } from "../../services/appService";

const price = `$${PREMIUM_CONFIG.monthlyPrice.toLocaleString("es-CO")}`;

// Contenedor de decisión (data-guide="premium-decision") compartido por la oferta y la muestra Premium.
// stage: 'offer' | 'after_demo' (premium_declined) · entry: 'offer' | 'demo' (premium_selected).
export default function PremiumDecision({ stage, entry, acceptLabel }) {
  const { user } = useAuth();
  const { refresh, flags, premiumDemoDone, premiumDecisionMade, exitSurveyDone } = useApp();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState("");
  const confirmed = flags.has("checkout_confirmed");

  // Misma lógica de choosePremium de PremiumPage: premium_selected (once) → intento de checkout → checkout.
  const choosePremium = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await analytics.once("premium_selected", {
        user,
        properties: { price: PREMIUM_CONFIG.monthlyPrice, currency: PREMIUM_CONFIG.currency, entry },
      });
      const attempt = await appService.startCheckout(user, actorFor(user));
      await refresh();
      navigate(`/checkout/${attempt.id}`);
    } catch (e) {
      setError(e?.message || "No se pudo abrir el checkout. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  const decline = async (reason) => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      await analytics.once("premium_declined", {
        user, properties: { reason, stage, demo_done: stage === "after_demo" ? true : premiumDemoDone },
      });
      await refresh();
      navigate("/fin");
    } catch (e) {
      setError(e?.message || "No se pudo registrar tu respuesta. Inténtalo de nuevo.");
    } finally {
      setBusy(false);
    }
  };

  if (premiumDecisionMade) return (
    <div className="card card-pad" data-guide="premium-decision" style={{ marginTop: 16 }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <CheckCircle2 color="#1ba86b" /><h2 style={{ margin: 0, fontSize: "1.15rem" }}>Ya registramos tu decisión</h2>
      </div>
      <p className="page-subtitle" style={{ margin: "8px 0 0" }}>Gracias. {exitSurveyDone ? "También recibimos tu encuesta final." : "Solo falta una encuesta corta."}</p>
      {!exitSurveyDone && <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={() => navigate("/fin")}>Ir a la encuesta final</button>}
      {!confirmed && <button type="button" className="btn btn-ghost btn-block" style={{ marginTop: 10 }} disabled={busy} onClick={choosePremium}>
        {busy ? "Preparando checkout…" : `¿Cambiaste de opinión? Quiero Premium por ${price}`}
      </button>}
      {error && <div className="error-box" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );

  if (declining) return (
    <div data-guide="premium-decision">
      <DeclineReasons busy={busy} onConfirm={decline} onCancel={() => setDeclining(false)} />
      {error && <div className="error-box" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );

  return (
    <div data-guide="premium-decision" style={{ marginTop: 16 }}>
      <button type="button" className="btn btn-yellow btn-block" onClick={choosePremium} disabled={busy}>
        {busy ? "Preparando checkout…" : (acceptLabel || `Quiero Premium por ${price}`)}
      </button>
      <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 10 }} disabled={busy} onClick={() => setDeclining(true)}>Ahora no</button>
      {error && <div className="error-box" style={{ marginTop: 10 }}>{error}</div>}
    </div>
  );
}
