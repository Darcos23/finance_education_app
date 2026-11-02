
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/common/Brand";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!active) return;

        if (event === "PASSWORD_RECOVERY") {
          setAuthorized(true);
          setChecking(false);
        } else if (event === "SIGNED_OUT") {
          setAuthorized(false);
          setChecking(false);
        }
      }
    );

    // Permite continuar si se recarga la página
    // y Supabase ya recuperó la sesión.
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;

      if (!error && data.session) {
        setAuthorized(true);
      }

      setChecking(false);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setBusy(true);

    try {
      const { error: authError } = await updatePassword(password);

      if (authError) throw authError;

      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "No pudimos actualizar la contraseña."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <Brand />

      <h1 className="auth-title">
        Nueva contraseña
      </h1>

      <p className="page-subtitle">
        Protege tu cuenta de FinPath con una
        nueva contraseña.
      </p>

      <div className="auth-card">
        {checking ? (
          <p>Verificando enlace de recuperación...</p>
        ) : success ? (
          <>
            <div className="success-box" role="status">
              Tu contraseña se actualizó correctamente.
            </div>

            <Link
              to="/app"
              className="btn btn-primary btn-block"
            >
              Continuar a FinPath
            </Link>
          </>
        ) : !authorized ? (
          <>
            <div className="error-box" role="alert">
              No hay una sesión válida para actualizar
              tu contraseña. Solicita un nuevo enlace.
            </div>

            <Link
              to="/forgot-password"
              className="btn btn-primary btn-block"
            >
              Solicitar otro enlace
            </Link>
          </>
        ) : (
          <form onSubmit={submit}>
            <div className="field">
              <label className="input-label">
                Nueva contraseña
              </label>

              <input
                className="input"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label className="input-label">
                Confirmar nueva contraseña
              </label>

              <input
                className="input"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
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
                ? "Actualizando..."
                : "Guardar nueva contraseña"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
