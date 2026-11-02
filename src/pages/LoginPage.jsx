import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/common/Brand";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/app" replace />;

  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    const { error: authError } = await signIn(form);
    setBusy(false);
    if (authError) return setError("No pudimos iniciar sesión. Revisa tu correo y contraseña.");
    navigate("/app", { replace:true });
  };

  return (
    <div className="auth-page">
      <Brand />
      <h1 className="auth-title">Qué bueno verte.</h1>
      <p className="page-subtitle">Continúa desde donde quedaste.</p>
      <form className="auth-card" onSubmit={submit}>
        <div className="field"><label className="input-label">Correo</label><input className="input" type="email" required autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div className="field"><label className="input-label">Contraseña</label><input className="input" type="password" required minLength={6} autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>

        <div style={{ textAlign: "right", marginBottom: 12 }}>
          <Link
            to="/forgot-password"
            style={{
              color: "#0068fb",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && <div className="error-box">{error}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Ingresando…" : "Iniciar sesión"}</button>
        <div className="auth-switch">¿Primera vez? <Link to="/signup">Crear cuenta</Link></div>
      </form>
    </div>
  );
}
