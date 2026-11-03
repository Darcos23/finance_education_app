import { useState } from "react";

// Motivo de rechazo de un toque. Se reutiliza en la oferta, en la muestra Premium y en el checkout.
export const DECLINE_REASONS = [
  ["price_high", "Precio alto"],
  ["not_now", "No lo necesito ahora"],
  ["trust", "No confío en pagar en línea"],
  ["more_free", "Quiero probar más la versión gratis"],
  ["not_valuable", "No vi suficiente valor"],
  ["other", "Otro"],
];

export default function DeclineReasons({ onConfirm, onCancel, busy = false }) {
  const [reason, setReason] = useState("");
  return (
    <div className="card card-pad" style={{ marginTop: 14 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: "1.2rem" }}>¿Qué te hizo dudar?</h2>
      <p className="form-note" style={{ margin: 0 }}>Elige la opción que más se parezca. Nos ayuda a mejorar FinPath.</p>
      <div role="radiogroup" aria-label="Motivo">
        {DECLINE_REASONS.map(([id, label]) => (
          <button key={id} type="button" role="radio" aria-checked={reason === id}
            className={`question-option ${reason === id ? "selected" : ""}`} disabled={busy}
            onClick={() => setReason(id)}>{label}</button>
        ))}
      </div>
      <button type="button" className="btn btn-primary btn-block" style={{ marginTop: 14 }}
        disabled={!reason || busy} onClick={() => onConfirm(reason)}>{busy ? "Registrando…" : "Confirmar"}</button>
      <button type="button" className="btn btn-secondary btn-block" style={{ marginTop: 10 }}
        disabled={busy} onClick={onCancel}>Volver</button>
    </div>
  );
}
