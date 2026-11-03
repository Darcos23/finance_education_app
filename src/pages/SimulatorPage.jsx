import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { SIMULATORS } from "../data";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { appService } from "../services/appService";

const money=n=>`$${Math.round(Number(n||0)).toLocaleString("es-CO")}`;

export default function SimulatorPage(){
  const { simulatorId }=useParams(); const sim=SIMULATORS.find(s=>s.id===simulatorId);
  const { user }=useAuth(); const { refresh }=useApp();
  const [values,setValues]=useState({});
  const [result,setResult]=useState(null);


  const set=(key,val)=>setValues(v=>({...v,[key]:val}));
  const calculate=async(e)=>{
    e.preventDefault(); let output=null,code="neutral";
    if(simulatorId==="micro_expenses"){
      const weekly=Number(values.amount||0)*Number(values.times||0);
      const monthly=weekly*4.33, yearly=weekly*52;
      code=monthly>200000?"high":monthly>80000?"medium":"low";
      output={headline:`${money(monthly)} al mes`,detail:`Aproximadamente ${money(yearly)} al año si el patrón se mantiene.`};
    }
    if(simulatorId==="savings_goal"){
      const remaining=Math.max(0,Number(values.target||0)-Number(values.current||0));
      const monthly=Math.max(1,Number(values.monthly||0));
      const months=Math.ceil(remaining/monthly);
      code=months<=3?"short":months<=12?"medium":"long";
      output={headline:`${months} ${months===1?"mes":"meses"}`,detail:`Con aportes de ${money(monthly)} mensuales para cubrir ${money(remaining)} restantes.`};
    }
    if(simulatorId==="small_debt"){
      let balance=Number(values.balance||0); const payment=Math.max(1,Number(values.payment||0)); const rate=Number(values.rate||0)/100/12;
      let months=0,totalInterest=0;
      while(balance>0 && months<120){
        const interest=balance*rate; totalInterest+=interest; balance=Math.max(0,balance+interest-payment); months++;
        if(payment<=interest){months=120;break;}
      }
      code=months>=120?"insufficient":months<=6?"short":"medium";
      output={headline:months>=120?"La cuota no alcanza":`${months} meses aprox.`,detail:months>=120?"La cuota mensual no cubre adecuadamente los intereses en esta simulación.":`Intereses aproximados: ${money(totalInterest)}.`};
    }
    if(simulatorId==="weekly_budget"){
      const income=Number(values.income||0), fixed=Number(values.fixed||0), flexible=Number(values.flexible||0), savings=Number(values.savings||0);
      const balance=income-fixed-flexible-savings;
      code=balance<0?"negative":balance<income*.1?"tight":"healthy";
      output={headline:`Saldo: ${money(balance)}`,detail:balance<0?"Tus gastos y metas superan el ingreso de la semana.":"Este saldo queda después de gastos y ahorro planeado."};
    }
    setResult(output);
    await appService.saveSimulatorRun(user,simulatorId,code);
    await refresh();
  };

  const fields=useMemo(()=>{
    if(simulatorId==="micro_expenses") return [["amount","Valor de cada gasto"],["times","Veces por semana"]];
    if(simulatorId==="savings_goal") return [["target","Meta total"],["current","Ya tienes"],["monthly","Puedes aportar al mes"]];
    if(simulatorId==="small_debt") return [["balance","Saldo de la deuda"],["payment","Cuota mensual"],["rate","Tasa anual estimada (%)"]];
    return [["income","Ingresos de la semana"],["fixed","Gastos necesarios"],["flexible","Gastos flexibles"],["savings","Ahorro o metas"]];
  },[simulatorId]);

  if(!sim) return <AppShell><div className="empty">Simulador no encontrado.</div></AppShell>;

  return <AppShell>
    <span className="eyebrow"><Calculator size={14}/> Simulador guiado</span>
    <h1 className="page-title">{sim.title}</h1>
    <p className="page-subtitle">{sim.description}</p>
    <form className="card card-pad" onSubmit={calculate}>
      {fields.map(([key,label])=><div className="field" key={key}><label className="input-label">{label}</label><input className="input" type="number" min="0" step="any" required value={values[key]||""} onChange={e=>set(key,e.target.value)}/></div>)}
      <div className="info-box" style={{marginBottom:12}}>Los valores se usan para calcular el resultado en tu navegador. FinPath guarda que completaste el simulador, pero no almacena estos montos.</div>
      <button className="btn btn-primary btn-block">Calcular escenario</button>
    </form>
    {result&&<div className="sim-result"><strong>{result.headline}</strong><span>{result.detail}</span><div className="form-note" style={{marginTop:8}}>Resultado educativo aproximado.</div></div>}
  </AppShell>
}
