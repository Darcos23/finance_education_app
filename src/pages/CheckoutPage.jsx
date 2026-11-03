import { useMemo, useState } from "react";
import { Building2, CheckCircle2, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import { useAuth } from "../context/AuthContext";
import { analytics } from "../lib/analytics";
import { appService } from "../services/appService";

const methods = [
  ["card","Tarjeta",CreditCard],
  ["nequi","Nequi",Smartphone],
  ["pse","PSE",Building2],
];

export default function CheckoutPage() {
  const { attemptId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step,setStep]=useState(1);
  const [method,setMethod]=useState("");
  const [form,setForm]=useState({});
  const [done,setDone]=useState(false);
  const [busy,setBusy]=useState(false);
  const [declining,setDeclining]=useState(false);
  const [declineReason,setDeclineReason]=useState("");

  const detailsReady=useMemo(()=>{
    if(method==="card") return form.holder && form.card && form.exp && form.cvc;
    if(method==="nequi") return form.phone;
    if(method==="pse") return form.bank && form.personType;
    return false;
  },[form,method]);

  const nextMethod=async()=>{
    if(!method) return;
    await appService.updateCheckout(user,attemptId,{payment_method:method});
    setStep(2);
  };

  const detailsComplete=async(e)=>{
    e.preventDefault();
    if(!detailsReady) return;
    setBusy(true);
    try{
      // IMPORTANTE: los datos del formulario NO se envían a Supabase.
      await appService.updateCheckout(user,attemptId,{
        details_completed_at:new Date().toISOString(),
        status:"details_completed"
      });
      await analytics.once("checkout_details_completed",{user,properties:{payment_method:method}});
      setStep(3);
    } finally {setBusy(false);}
  };

  const confirm=async()=>{
    setBusy(true);
    try{
      await appService.updateCheckout(user,attemptId,{
        confirmed_at:new Date().toISOString(),
        status:"confirmed_intent"
      });
      await analytics.once("checkout_confirmed",{user,properties:{payment_method:method,price:9000}});
      setDone(true);
    } finally {setBusy(false);}
  };

  const decline=async()=>{
    setBusy(true);
    try{
      await appService.updateCheckout(user,attemptId,{status:'abandoned'});
      await analytics.once('checkout_declined',{user,properties:{step,reason:declineReason}});
      setForm({});navigate('/app');
    }finally{setBusy(false);}
  };
  const declineOptions=[
    ['price_high','Precio alto'],['not_now','No lo necesito ahora'],
    ['trust','No confío en pagar en línea'],['more_free','Quiero probar más la versión gratis'],['other','Otro']
  ];
  return <AppShell>
    <span className="eyebrow"><ShieldCheck size={14}/> Checkout</span>
    <h1 className="page-title">FinPath Premium</h1>
    {/* <div className="warning-box" style={{marginBottom:14}}>
      <strong>Prueba académica:</strong> no se realizará ningún cobro. No ingreses datos bancarios reales. Usa datos ficticios como los sugeridos.
    </div> */}
    <div className="checkout-steps">{[1,2,3].map(n=><div key={n} className={`checkout-dot ${step>=n?"active":""}`}/>)}</div>

    {step===1&&<div className="card card-pad">
      <h2 style={{marginTop:0}}>1. Elige cómo pagarías</h2>
      {/* <p className="page-subtitle">Este paso mide si avanzas más allá del interés inicial.</p> */}
      <div className="payment-methods">
        {methods.map(([id,label,Icon])=><button key={id} className={`payment-method ${method===id?"selected":""}`} onClick={()=>setMethod(id)}><span style={{display:"flex",gap:10,alignItems:"center"}}><Icon size={20}/><strong>{label}</strong></span>{method===id&&<CheckCircle2 size={20} color="#0068fb"/>}</button>)}
      </div>
      <button className="btn btn-primary btn-block" style={{marginTop:14}} disabled={!method} onClick={nextMethod}>Continuar</button>
    </div>}

    {step===2&&<form className="card card-pad" onSubmit={detailsComplete} autoComplete="off">
      <h2 style={{marginTop:0}}>2. Completa datos</h2>
      {/* <p className="page-subtitle">Estos valores permanecen solo en esta pantalla y no se guardan ni se envían a la base de datos.</p> */}
      {method==="card"&&<>
        <div className="field"><label className="input-label">Nombre</label><input autoComplete="off" name="fp_simulated_input" className="input" value={form.holder||""} onChange={e=>setForm({...form,holder:e.target.value})} placeholder="Usuario Prueba" required/></div>
        <div className="field"><label className="input-label">Número</label><input autoComplete="off" name="fp_simulated_input" className="input" inputMode="numeric" value={form.card||""} onChange={e=>setForm({...form,card:e.target.value})} placeholder="0000 0000 0000 0000" required/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div className="field"><label className="input-label">Vence</label><input autoComplete="off" name="fp_simulated_input" className="input" value={form.exp||""} onChange={e=>setForm({...form,exp:e.target.value})} placeholder="12/30" required/></div>
          <div className="field"><label className="input-label">CVC</label><input autoComplete="off" name="fp_simulated_input" className="input" value={form.cvc||""} onChange={e=>setForm({...form,cvc:e.target.value})} placeholder="123" required/></div>
        </div>
      </>}
      {method==="nequi"&&<div className="field"><label className="input-label">Número</label><input autoComplete="off" name="fp_simulated_input" className="input" inputMode="numeric" value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="300 000 0000" required/></div>}
      {method==="pse"&&<>
        <div className="field"><label className="input-label">Banco</label><select autoComplete="off" name="fp_simulated_select" className="input" value={form.bank||""} onChange={e=>setForm({...form,bank:e.target.value})} required>
            <option value="">Selecciona</option>
            <option>Bancolombia</option>
            <option>Banco de Bogotá</option>
            <option>Banco Davivienda</option>
            <option>BBVA Colombia</option>
            <option>Banco de Occidente</option>
            <option>Banco AV Villas</option>
            <option>Banco Caja Social</option>
            <option>Banco Popular</option>
            <option>Banco Agrario de Colombia</option>
            <option>Scotiabank Colpatria</option>
            <option>Banco GNB Sudameris</option>
            <option>Banco Itaú</option>
            <option>Citibank</option>
            <option>Banco Pichincha</option>
            <option>Banco Falabella</option>
            <option>Banco Finandina</option>
            <option>Banco Mundo Mujer</option>
            <option>Bancamía</option>
          </select></div>
        <div className="field"><label className="input-label">Tipo de persona</label><select autoComplete="off" name="fp_simulated_select" className="input" value={form.personType||""} onChange={e=>setForm({...form,personType:e.target.value})} required><option value="">Selecciona</option><option>Natural</option><option>Jurídica</option></select></div>
      </>}
      <button className="btn btn-primary btn-block" disabled={busy||!detailsReady}>{busy?"Registrando etapa…":"Continuar a confirmación"}</button>
    </form>}

    {step===3&&!done&&<div className="card card-pad">
      <h2 style={{marginTop:0}}>3. ¿Confirmarías la compra?</h2>
      {/* <p className="page-subtitle">Si esto fuera la versión comercial, el siguiente botón enviaría el pago de <strong>$9.000 COP</strong>. En esta prueba no procesará dinero.</p> */}
      <button className="btn btn-yellow btn-block" disabled={busy} onClick={confirm}>{busy?"Registrando…":"Sí, finalizaría la compra por $9.000"}</button>
      <button className="btn btn-secondary btn-block" style={{marginTop:10}} onClick={()=>setDeclining(true)}>No, volver a FinPath Free</button>
    </div>}

    {done&&<div className="card card-pad">
      <div className="list-icon" style={{background:"#ebfaf3",color:"#1ba86b"}}><CheckCircle2/></div>
      <h2>Gracias. La prueba terminó aquí.</h2>
      <p className="page-subtitle">No se realizó ningún cobro. Registramos únicamente que llegaste hasta la confirmación final de intención de compra.</p>
      <button className="btn btn-primary btn-block" onClick={()=>navigate("/app")}>Volver a FinPath</button>
    </div>}
  </AppShell>
}
