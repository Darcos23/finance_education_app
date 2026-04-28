import { getTrafficLightStatus } from "../../utils";
import Card from "./Card";

export default function FinancialTrafficLight({ goals }) {
    const status = getTrafficLightStatus(goals);
    const lights = [
        { key: "red", color: "bg-brand-red" },
        { key: "yellow", color: "bg-brand-yellow" },
        { key: "green", color: "bg-brand-green" },
    ];

    return (
        <Card>
            <div className="flex items-center gap-4">
                <div className="flex rounded-3xl bg-slate-100 p-2">
                    {lights.map((light) => (
                        <div key={light.key} className={`mx-1 h-8 w-8 rounded-full ${light.color} ${status.status === light.key ? "scale-110 ring-4 ring-white shadow-md" : "opacity-30"}`} />
                    ))}
                </div>
                <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Semaforo financiero</p>
                    <h3 className="text-lg font-black text-brand-black">{status.label}</h3>
                    <p className="text-sm text-slate-600">{status.message}</p>
                </div>
            </div>
        </Card>
    );
}
