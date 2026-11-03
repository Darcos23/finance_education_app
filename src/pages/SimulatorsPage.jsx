import { Calculator, Coffee, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { SIMULATORS } from "../data";

const icons={micro_expenses:Coffee,savings_goal:PiggyBank,small_debt:CreditCard,weekly_budget:TrendingUp};

export default function SimulatorsPage(){
  return <AppShell>
    <span className="eyebrow"><Calculator size={14}/> Practica antes de decidir</span>
    <h1 className="page-title">Simuladores</h1>
    <p className="page-subtitle">Explora escenarios y observa su impacto. Estos cálculos son educativos y no constituyen asesoría financiera.</p>
    <div className="list">
      {SIMULATORS.map(sim=>{const Icon=icons[sim.id]||Calculator;return <Link key={sim.id} className="list-card" data-guide={`sim-${sim.id}`} to={`/simulators/${sim.id}`}><div className="list-icon"><Icon/></div><div><h3>{sim.title}</h3><p>{sim.description}</p></div></Link>})}
    </div>
  </AppShell>
}
