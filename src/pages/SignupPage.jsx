import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Brand from "../components/common/Brand";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const { user, signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:"", email:"", password:"", consent:false });
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/triage" replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.consent) return setError("Necesitamos tu consentimiento para registrar interacciones de uso durante la prueba.");
    setBusy(true); setError(""); setNote("");
    const { data, error: authError } = await signUp(form);
    setBusy(false);
    if (authError) return setError(authError.message || "No pudimos crear la cuenta.");
    if (!data.session) {
      setNote("Cuenta creada. Revisa tu correo para confirmar el acceso.");
      return;
    }
    navigate("/triage", { replace:true });
  };

  return (
    <div className="auth-page">
      <Brand />
      <h1 className="auth-title">Empieza sin complicarte.</h1>
      <p className="page-subtitle">Solo pedimos lo necesario para guardar tu progreso.</p>
      <form className="auth-card" onSubmit={submit}>
        <div className="field"><label className="input-label">Nombre</label><input className="input" required maxLength={60} autoComplete="name" value={form.fullName} onChange={e=>setForm({...form,fullName:e.target.value})}/></div>
        <div className="field"><label className="input-label">Correo</label><input className="input" type="email" required autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div className="field"><label className="input-label">Contraseña</label><input className="input" type="password" minLength={6} required autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><div className="form-note">Mínimo 6 caracteres.</div></div>
        <label style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:".82rem",lineHeight:1.45,margin:"8px 0 16px"}}>
          <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})} style={{marginTop:3}}/>
          <span>Acepto participar en la prueba de FinPath y que se registren eventos de uso asociados a mi cuenta para fines académicos. No se recopilan credenciales bancarias.</span>
        </label>
        {error && <div className="error-box" style={{marginBottom:12}}>{error}</div>}
        {note && <div className="info-box" style={{marginBottom:12}}>{note}</div>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? "Creando…" : "Crear cuenta"}</button>
        <div className="auth-switch">¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></div>
      </form>
    </div>
  );
}
