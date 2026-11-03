import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Lightbulb, LockKeyhole, Sparkles } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import PremiumDecision from "../components/experiment/PremiumDecision";
import { PREMIUM_CONFIG } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { analytics } from "../lib/analytics";
import {
  GROUP_COLORS, PREFILL_LABELS, RADIOGRAPHY_FIELDS, buildPrefill, computeRadiography, money, validateRadiography,
} from "../lib/radiography";

const acceptLabel = `Quiero Premium por $${PREMIUM_CONFIG.monthlyPrice.toLocaleString("es-CO")}/mes`;
const pctLabel = (n) => `${Math.round(n)} %`;

function readMicro(userId) {
  try { return JSON.parse(localStorage.getItem(`finpath_last_micro_${userId}`) || "null"); } catch { return null; }
}

// Dona SVG: necesidades, flexibles, ahorro y disponible. Si falta dinero, las partes se escalan al total de salidas.
function Donut({ r }) {
  const outgo = r.needs + r.flex + r.savings;
  const base = Math.max(r.income, outgo, 1);
  const parts = [
    ["needs", r.needs], ["flex", r.flex], ["savings", r.savings], ["available", Math.max(r.available, 0)],
  ].filter(([, value]) => value > 0);
  const radius = 54, circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" width="150" height="150" role="img"
      aria-label={`Distribución de tu ingreso: necesidades ${pctLabel(r.pct.needs)}, flexibles ${pctLabel(r.pct.flex)}, ahorro ${pctLabel(r.pct.savings)}`}>
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#e8eef7" strokeWidth="20" />
      {parts.map(([key, value]) => {
        const length = (value / base) * circumference;
        const circle = <circle key={key} cx="70" cy="70" r={radius} fill="none" stroke={GROUP_COLORS[key]} strokeWidth="20"
          strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} transform="rotate(-90 70 70)" />;
        offset += length;
        return circle;
      })}
      <text x="70" y="64" textAnchor="middle" fontSize="11" fill="#63738c">{r.available < 0 ? "Faltan" : "Disponible"}</text>
      <text x="70" y="82" textAnchor="middle" fontSize="15" fontWeight="800" fill={r.available < 0 ? "#b92828" : "#003ea2"}>
        {money(Math.abs(r.available))}
      </text>
    </svg>
  );
}

function Result({ r }) {
  const legend = [
    ["needs", "Necesidades", r.needs, r.pct.needs],
    ["flex", "Gastos flexibles", r.flex, r.pct.flex],
    ["savings", "Ahorro", r.savings, r.pct.savings],
    ["available", r.available < 0 ? "Faltante" : "Disponible", Math.abs(r.available), Math.abs(r.pct.available)],
  ];
  const maxCategory = Math.max(...r.categories.map((c) => c.value), 1);
  const reference = [
    ["Necesidades", r.pct.needs, 50, "needs"], ["Flexibles", r.pct.flex, 30, "flex"], ["Ahorro", r.pct.savings, 20, "savings"],
  ];
  return <>
    <div className="card card-pad" style={{ marginTop: 16 }}>
      <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>Tu mes en una imagen</h2>
      <div className="radiography-summary">
        <Donut r={r} />
        <div className="radiography-legend">
          {legend.map(([key, label, value, percent]) => (
            <div key={key} className="radiography-legend-row">
              <span className="radiography-dot" style={{ background: key === "available" && r.available < 0 ? "#e64c4c" : GROUP_COLORS[key] }} />
              <span style={{ flex: 1 }}>{label}</span>
              <strong>{money(value)}</strong><span className="form-note" style={{ minWidth: 38, textAlign: "right" }}>{pctLabel(percent)}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="form-note" style={{ margin: "10px 0 0" }}>Porcentajes sobre tu ingreso neto de {money(r.income)} al mes.</p>
    </div>

    <div className="card card-pad">
      <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>En qué se va tu dinero</h2>
      {r.categories.length === 0 ? <p className="page-subtitle">No registraste gastos ni ahorro.</p> :
        r.categories.map((c) => (
          <div key={c.key} className="radiography-bar-row">
            <div className="radiography-bar-label"><span>{c.label}</span><strong>{money(c.value)}</strong></div>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${(c.value / maxCategory) * 100}%`, background: GROUP_COLORS[c.group] }} /></div>
          </div>
        ))}
    </div>

    <div className="card card-pad">
      <h2 style={{ margin: "0 0 2px", fontSize: "1.2rem" }}>Comparación con 50/30/20</h2>
      <p className="form-note" style={{ margin: "0 0 10px" }}>Referencia general, no una regla.</p>
      {reference.map(([label, yours, ref, key]) => (
        <div key={label} className="radiography-bar-row">
          <div className="radiography-bar-label"><span>{label}</span><span><strong>{pctLabel(yours)}</strong> <span className="form-note">· ref. {ref} %</span></span></div>
          <div className="radiography-ref-track">
            <div className="radiography-ref-fill" style={{ width: `${Math.min(100, Math.max(0, yours))}%`, background: GROUP_COLORS[key] }} />
            <div className="radiography-ref-mark" style={{ left: `${ref}%` }} aria-hidden="true" />
          </div>
        </div>
      ))}
    </div>

    {r.findings.length > 0 && <div className="card card-pad">
      <h2 style={{ margin: "0 0 10px", fontSize: "1.2rem" }}>Lo que encontramos</h2>
      <div className="list">
        {r.findings.map((text) => <div key={text} className="info-box" style={{ display: "flex", gap: 8 }}><Lightbulb size={16} style={{ flex: "0 0 auto", marginTop: 2 }} />{text}</div>)}
      </div>
    </div>}
    <p className="form-note" style={{ textAlign: "center", marginTop: 12 }}>Resultado educativo aproximado. No es asesoría financiera.</p>
  </>;
}

export default function PremiumDemoPage() {
  const { user } = useAuth();
  const { experimentState, goals, triage, premiumDemoDone, refresh } = useApp();
  const navigate = useNavigate();
  const unlocked = Boolean(experimentState?.minimum_journey_completed_at);
  const [prefill] = useState(() => buildPrefill({ micro: user ? readMicro(user.id) : null, goals }));
  const [values, setValues] = useState(() => ({ ...prefill.values }));
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);

  useEffect(() => {
    if (unlocked && user && !premiumDemoDone) analytics.once("premium_demo_started", { user });
  }, [unlocked, user?.id, premiumDemoDone]);

  if (!unlocked) return <Navigate to="/premium" replace />;

  const calculate = async (e) => {
    e.preventDefault();
    if (lock.current || result) return;
    const { numbers, errors: found, valid } = validateRadiography(values);
    setErrors(found);
    if (!valid) return;
    lock.current = true; setBusy(true);
    const computed = computeRadiography(numbers, { goals, triageAnswers: triage?.answers || {} });
    setResult(computed);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
    try {
      // NUNCA se envían montos: solo categorías de resultado y cuántos campos venían pre-llenados.
      await analytics.once("premium_demo_completed", {
        user, properties: { ...computed.eventProperties, prefilled_fields: Object.keys(prefill.values).length },
      });
      await refresh();
    } finally { setBusy(false); }
  };

  const header = (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button className="icon-btn" aria-label="Volver a Premium" onClick={() => navigate("/premium")}><ArrowLeft size={20} /></button>
        <span className="eyebrow"><Sparkles size={14} /> Muestra Premium</span>
      </div>
      <h1 className="page-title">Tu radiografía financiera</h1>
    </>
  );

  if (premiumDemoDone && !result) return (
    <AppShell>
      {header}
      <div className="card card-pad">
        <div className="list-icon"><LockKeyhole /></div>
        <p className="page-subtitle" style={{ margin: "12px 0 0" }}>Ya usaste tu muestra gratuita. La radiografía completa y actualizable es parte de Premium.</p>
      </div>
      <PremiumDecision stage="after_demo" entry="demo" acceptLabel={acceptLabel} />
    </AppShell>
  );

  if (result) return (
    <AppShell>
      {header}
      <p className="page-subtitle">Esta es tu muestra gratuita de una sola vez. Con Premium podrías actualizarla cada mes.</p>
      <Result r={result} />
      {busy ? <p className="form-note" style={{ textAlign: "center" }}>Guardando…</p>
        : <PremiumDecision stage="after_demo" entry="demo" acceptLabel={acceptLabel} />}
    </AppShell>
  );

  const set = (key, value) => setValues((current) => ({ ...current, [key]: value }));
  return (
    <AppShell>
      {header}
      <p className="page-subtitle">Escribe montos mensuales aproximados en pesos. Solo el ingreso es obligatorio; lo que dejes vacío cuenta como 0. Puedes generarla una sola vez.</p>
      <form className="card card-pad" onSubmit={calculate} noValidate>
        {RADIOGRAPHY_FIELDS.map((f) => (
          <div className="field" key={f.key}>
            <label className="input-label" htmlFor={`rx-${f.key}`}>{f.label}{f.required ? " *" : ""}</label>
            <input id={`rx-${f.key}`} className="input" type="text" inputMode="numeric"
              autoComplete="off" placeholder="0" value={values[f.key] || ""}
              aria-invalid={Boolean(errors[f.key])} onChange={(e) => set(f.key, e.target.value)} />
            {prefill.sources[f.key] && <div className="form-note" style={{ marginTop: 4 }}>{PREFILL_LABELS[prefill.sources[f.key]]} · puedes editarlo</div>}
            {errors[f.key] && <div className="form-note" style={{ color: "#9e2727", marginTop: 4 }}>{errors[f.key]}</div>}
          </div>
        ))}
        <div className="info-box" style={{ marginBottom: 12 }}>Estos valores se procesan en tu celular y no se guardan.</div>
        <button className="btn btn-primary btn-block" disabled={busy}>Generar mi radiografía</button>
      </form>
    </AppShell>
  );
}
