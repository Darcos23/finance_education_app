
import { useState } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/common/Brand";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const { error: authError } = await resetPassword(
        email.trim()
      );

      if (authError) throw authError;

      setSuccess(true);
    } catch (err) {
      setError(
        "No pudimos procesar la solicitud. Intenta nuevamente más tarde."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <Brand />

      <h1 className="auth-title">
        Recuperar contraseña
      </h1>

      <p className="page-subtitle">
        Ingresa tu correo electrónico para recuperar
        el acceso a tu cuenta de FinPath.
      </p>

      <form className="auth-card" onSubmit={submit}>
        {success ? (
          <>
            <div className="success-box" role="status">
              Si el correo está registrado, recibirás
              un enlace para restablecer tu contraseña.
              Revisa también tu carpeta de spam.
            </div>

            <Link
              to="/login"
              className="btn btn-primary btn-block"
            >
              Volver al inicio de sesión
            </Link>
          </>
        ) : (
          <>
            <div className="field">
              <label className="input-label">
                Correo electrónico
              </label>

              <input
                className="input"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
              />
            </div>

            {error && (
              <div className="error-box" role="alert">
                {error}
              </div>
            )}

            <button
              className="btn btn-primary btn-block"
              disabled={busy}
            >
              {busy
                ? "Enviando..."
                : "Enviar enlace de recuperación"}
            </button>

            <div className="auth-switch">
              <Link to="/login">
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
