import { ArrowRight, BrainCircuit, Target, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Brand from "../components/common/Brand";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Brand />
      <div className="landing-hero">
        <img className="landing-logo" src={`${import.meta.env.BASE_URL}finpath-logo.png`} alt="" />
        <h1 className="landing-title">Aprende a manejar tu dinero <span>desde tu realidad.</span></h1>
        <p className="landing-copy">
          FinPath parte de un diagnóstico, te recomienda qué aprender y conecta ese aprendizaje con práctica,
          metas y seguimiento.
        </p>
        <Link className="btn btn-primary btn-block" to="/signup">Empezar gratis <ArrowRight size={18}/></Link>
        <Link className="btn btn-secondary btn-block" style={{marginTop:10}} to="/login">Ya tengo cuenta</Link>

        <div className="feature-strip">
          <div className="feature-mini"><BrainCircuit size={24} color="#0068fb"/><div><strong>Empieza por un diagnóstico</strong><span>Recibe una ruta según lo que necesitas reforzar.</span></div></div>
          <div className="feature-mini"><Target size={24} color="#0068fb"/><div><strong>Lleva el aprendizaje a una meta</strong><span>Convierte una intención en una acción medible.</span></div></div>
          <div className="feature-mini"><TrendingUp size={24} color="#0068fb"/><div><strong>Observa tu progreso</strong><span>Revisa avances sin llenar una pantalla de información.</span></div></div>
        </div>
        {/* <p className="form-note" style={{textAlign:"center"}}>
          Versión de prueba académica. Registramos interacciones de uso para evaluar el producto; no conectamos cuentas bancarias.
        </p> */}
      </div>
    </div>
  );
}
