import AppIcon from "../../utils/iconMap";
import Button from "../common/Button";
import Card from "../common/Card";

export default function GoalTemplateCard({ template, onUse }) {
    return (
        <Card highlighted={template.difficulty === "easy"} className="bg-opacity-95">
            <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/85 text-brand-blue shadow-sm">
                    <AppIcon name={template.iconKey} className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-black text-brand-black">{template.title}</h3>
                    <p className="mt-1 text-sm font-medium text-slate-700">{template.description}</p>
                    {/* <p className="mt-2 text-xs font-black uppercase tracking-wide text-slate-500">Dificultad: {template.difficulty}</p> */}
                </div>
            </div>
            <Button onClick={() => onUse(template.id)} className="mt-4 w-full">Usar esta meta</Button>
        </Card>
    );
}
