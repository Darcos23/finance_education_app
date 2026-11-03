import { useEffect, useState } from "react";
import { Compass } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useGuide } from "../../context/GuideContext";
import { analytics } from "../../lib/analytics";

// Hoja inferior modal de primer uso. Se muestra una sola vez (cuando el usuario ya tiene diagnóstico y está en /app).
export default function GuideWelcome() {
  const { user } = useAuth();
  const guide = useGuide();
  const [busy, setBusy] = useState(false);
  const visible = Boolean(guide?.showWelcome);

  useEffect(() => {
    if (visible && user) analytics.once("guide_welcome_shown", { user });
  }, [visible, user?.id]);

  if (!visible) return null;
  const choose = async (action) => {
    if (busy) return;
    setBusy(true);
    try { await action(); } finally { setBusy(false); }
  };

  return (
    <div className="guide-sheet-backdrop">
      <div className="guide-sheet" role="dialog" aria-modal="true" aria-labelledby="guide-welcome-title">
        <div className="list-icon" style={{ background: "#fff6d7", color: "#8a6300" }}><Compass /></div>
        <h2 id="guide-welcome-title" style={{ margin: "14px 0 6px" }}>¿Te mostramos lo esencial?</h2>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          En unos 10 minutos recorres FinPath: una lección, una meta, un simulador y una muestra de Premium. Puedes desactivar la guía cuando quieras.
        </p>
        <button className="btn btn-yellow btn-block" disabled={busy} onClick={() => choose(guide.startGuide)}>Empezar recorrido guiado</button>
        <button className="btn btn-secondary btn-block" style={{ marginTop: 10 }} disabled={busy}
          onClick={() => choose(() => guide.disableGuide("welcome"))}>Prefiero explorar por mi cuenta</button>
      </div>
    </div>
  );
}
