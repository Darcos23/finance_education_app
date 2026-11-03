import { useState } from "react";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useGuide } from "../context/GuideContext";
import { analytics } from "../lib/analytics";

const MAX_TEXT = 200;
const ELLIS = [["very", "Muy decepcionado"], ["somewhat", "Algo decepcionado"], ["not", "Nada decepcionado"]];
const PRICES = [
  ["price_too_cheap", "¿A qué precio te parecería tan barato que dudarías de su calidad?"],
  ["price_cheap", "¿A qué precio te parecería barato, una buena compra?"],
  ["price_expensive", "¿A qué precio te parecería caro, pero aún lo pensarías?"],
  ["price_too_expensive", "¿A qué precio sería demasiado caro para considerarlo?"],
];
const MOTIVATIONS = [
  ["radiografia", "La radiografía financiera"], ["practica", "La práctica con casos"],
  ["metas", "Las metas"], ["precio", "El precio"], ["otro", "Otro"],
];
const doneKey = (userId) => `finpath_exit_done_at_${userId}`;
// Acepta "12.000", "12 000" o "$12000"; devuelve null si no es un entero ≥ 0.
const parsePrice = (raw) => {
  const text = String(raw ?? "").trim().replace(/^\$/, "").replace(/[\s.]/g, "");
  if (!/^\d+$/.test(text)) return null;
  const n = Number(text);
  return Number.isSafeInteger(n) ? n : null;
};
const bogotaDateTime = (date) => new Intl.DateTimeFormat("es-CO", {
  timeZone: "America/Bogota", dateStyle: "long", timeStyle: "short",
}).format(date);

function Closing({ name, userId, completedAt }) {
  const navigate = useNavigate();
  const code = `FP-${String(userId || "").slice(0, 6).toUpperCase()}`;
  return (
    <AppShell>
      <div className="hero-card" style={{ textAlign: "center" }}>
        <CheckCircle2 size={44} style={{ margin: "0 auto 8px", position: "relative", zIndex: 1 }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "1.7rem", position: "relative", zIndex: 1 }}>Completaste la prueba de FinPath</h1>
        <p style={{ margin: 0, fontWeight: 700 }}>{name}</p>
        <p style={{ margin: "4px 0 0" }}>{bogotaDateTime(completedAt)} (hora de Colombia)</p>
      </div>
      <div className="card card-pad" style={{ marginTop: 16, textAlign: "center" }}>
        <div className="form-note">Código del participante</div>
        <strong style={{ display: "block", fontSize: "2rem", letterSpacing: ".08em", color: "#003ea2", margin: "4px 0" }}>{code}</strong>
        <p className="page-subtitle" style={{ margin: "10px 0 0" }}>
          No se realizó ningún cobro. Si llegaste al pago, solo registramos hasta dónde avanzaste. Gracias por ayudarnos a mejorar FinPath.
        </p>
      </div>
      <button className="btn btn-primary btn-block" style={{ marginTop: 16 }} onClick={() => navigate("/app")}>Seguir usando FinPath</button>
    </AppShell>
  );
}

export default function ExitSurveyPage() {
  const { user, profile } = useAuth();
  const { flags, exitSurveyDone, premiumDemoDone, refresh } = useApp();
  const guide = useGuide();
  const [discovered, setDiscovered] = useState(null);
  const [discoveredText, setDiscoveredText] = useState("");
  const [willDo, setWillDo] = useState("");
  const [ellis, setEllis] = useState("");
  const [prices, setPrices] = useState({});
  const [motivation, setMotivation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submittedAt, setSubmittedAt] = useState(null);
  const name = profile?.full_name || user?.user_metadata?.full_name || "Participante FinPath";
  const confirmed = flags.has("checkout_confirmed");

  if (submittedAt || exitSurveyDone) {
    let savedAt = null;
    try { savedAt = localStorage.getItem(doneKey(user?.id)); } catch { savedAt = null; }
    const at = submittedAt || (savedAt && !Number.isNaN(Date.parse(savedAt)) ? new Date(savedAt) : new Date());
    return <Closing name={name} userId={user?.id} completedAt={at} />;
  }

  const parsed = Object.fromEntries(PRICES.map(([key]) => [key, parsePrice(prices[key])]));
  const pricesComplete = PRICES.every(([key]) => parsed[key] !== null);
  const orderWarning = pricesComplete && !(parsed.price_too_cheap <= parsed.price_cheap &&
    parsed.price_cheap <= parsed.price_expensive && parsed.price_expensive <= parsed.price_too_expensive);
  const ready = discovered !== null && Boolean(ellis) && pricesComplete && (!confirmed || Boolean(motivation));

  const submit = async (e) => {
    e.preventDefault();
    if (!ready || busy) return;
    setBusy(true); setError("");
    const decision = flags.has("checkout_confirmed") ? "confirmed" : flags.has("premium_declined") ? "declined_offer"
      : flags.has("checkout_declined") ? "declined_checkout" : "none";
    try {
      await analytics.once("exit_survey_submitted", {
        user,
        properties: {
          discovered,
          discovered_text: discovered ? discoveredText.trim().slice(0, MAX_TEXT) : "",
          will_do: willDo.trim().slice(0, MAX_TEXT),
          sean_ellis: ellis,
          price_too_cheap: parsed.price_too_cheap, price_cheap: parsed.price_cheap,
          price_expensive: parsed.price_expensive, price_too_expensive: parsed.price_too_expensive,
          motivation: confirmed ? motivation : null,
          decision,
          demo_done: premiumDemoDone,
        },
      });
      await guide?.completeGuide();
      const now = new Date();
      try { localStorage.setItem(doneKey(user.id), now.toISOString()); } catch { /* Solo UI */ }
      await refresh();
      setSubmittedAt(now);
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err?.message || "No se pudo enviar la encuesta. Revisa tu conexión e inténtalo de nuevo.");
    } finally { setBusy(false); }
  };

  const choice = (active, onClick, label) => (
    <button type="button" className={`question-option ${active ? "selected" : ""}`} aria-pressed={active} onClick={onClick}>{label}</button>
  );

  return (
    <AppShell>
      <span className="eyebrow"><ClipboardList size={14} /> Encuesta final</span>
      <h1 className="page-title">¿Qué te pareció FinPath?</h1>
      <p className="page-subtitle">Son 2 minutos. Al enviar verás tu pantalla de cierre.</p>
      <form className="card card-pad" onSubmit={submit} noValidate>
        <div className="field">
          <label className="input-label">1. ¿Descubriste algo de tus finanzas que no sabías? *</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {choice(discovered === true, () => setDiscovered(true), "Sí")}
            {choice(discovered === false, () => setDiscovered(false), "No")}
          </div>
          {discovered === true && <div style={{ marginTop: 10 }}>
            <label className="input-label" htmlFor="discovered-text">¿Qué descubriste? (opcional)</label>
            <textarea id="discovered-text" className="input" rows={2} maxLength={MAX_TEXT} value={discoveredText}
              onChange={(e) => setDiscoveredText(e.target.value)} />
            <div className="form-note" style={{ textAlign: "right" }}>{discoveredText.length}/{MAX_TEXT}</div>
          </div>}
        </div>

        <div className="field">
          <label className="input-label" htmlFor="will-do">2. ¿Qué harás distinto esta semana? (opcional)</label>
          <textarea id="will-do" className="input" rows={2} maxLength={MAX_TEXT} value={willDo} onChange={(e) => setWillDo(e.target.value)} />
          <div className="form-note" style={{ textAlign: "right" }}>{willDo.length}/{MAX_TEXT}</div>
        </div>

        <div className="field">
          <label className="input-label">3. ¿Qué tan decepcionado estarías si FinPath dejara de existir? *</label>
          {ELLIS.map(([id, label]) => <div key={id}>{choice(ellis === id, () => setEllis(id), label)}</div>)}
        </div>

        <div className="field">
          <label className="input-label">4. Precio mensual de FinPath Premium, en pesos *</label>
          <p className="form-note" style={{ margin: "0 0 8px" }}>No hay respuestas correctas. Escribe lo primero que pienses.</p>
          {PRICES.map(([key, question]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label className="form-note" htmlFor={key} style={{ display: "block", color: "#28466f", fontWeight: 700, marginBottom: 4 }}>{question}</label>
              <input id={key} className="input" type="text" inputMode="numeric" autoComplete="off" placeholder="$"
                value={prices[key] || ""} aria-invalid={Boolean(prices[key]) && parsed[key] === null}
                onChange={(e) => setPrices((p) => ({ ...p, [key]: e.target.value }))} />
              {Boolean(prices[key]) && parsed[key] === null && <div className="form-note" style={{ color: "#9e2727" }}>Usa solo números enteros.</div>}
            </div>
          ))}
          {orderWarning && <div className="warning-box">Revisa el orden de los precios: normalmente van de menor a mayor.</div>}
        </div>

        {confirmed && <div className="field">
          <label className="input-label">5. ¿Qué fue lo que más te motivó? *</label>
          {MOTIVATIONS.map(([id, label]) => <div key={id}>{choice(motivation === id, () => setMotivation(id), label)}</div>)}
        </div>}

        {error && <div className="error-box" style={{ marginBottom: 12 }}>{error}</div>}
        <button className="btn btn-primary btn-block" disabled={!ready || busy}>{busy ? "Enviando…" : "Enviar y ver mi cierre"}</button>
        {!ready && <p className="form-note" style={{ textAlign: "center" }}>Responde las preguntas marcadas con *.</p>}
      </form>
    </AppShell>
  );
}
