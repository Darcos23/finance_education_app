import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const Loading = () => <div className="auth-page"><div className="auth-card">Cargando FinPath…</div></div>;

// Diagnóstico obligatorio. Usa SOLO `initialized` (primera carga), nunca hydrated ni loadingData:
// así una recarga de datos (refresh) no desmonta la página activa (por ejemplo, una lección a mitad).
export default function RequireTriage({ children }) {
  const { initialized, triage, dataError, refresh } = useApp();
  const [retrying, setRetrying] = useState(false);
  if (!initialized || retrying) return <Loading />;
  // Si la primera carga falló, no sabemos si existe diagnóstico: no enviar a /triage (evita rehacerlo y sobrescribir respuestas).
  if (dataError && !triage) {
    const retry = async () => {
      setRetrying(true);
      try { await refresh(); } finally { setRetrying(false); }
    };
    return (
      <div className="auth-page"><div className="auth-card">
        <div className="error-box">No se pudo cargar FinPath: {dataError}</div>
        <button className="btn btn-primary btn-block" style={{ marginTop: 14 }} onClick={retry}>Reintentar</button>
      </div></div>
    );
  }
  if (!triage) return <Navigate to="/triage" replace />;
  return children;
}
