import { GOAL_TEMPLATES, LEARNING_PATHS } from "../../data";
import AppIcon from "../../utils/iconMap";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";

export const levelLabels = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" };

export const levelText = {
    beginner: "Estas empezando a construir tus habitos financieros. Empieza con lecciones cortas, ahorro pequeno y seguimiento simple.",
    intermediate: "Ya tienes algunas bases. Puedes fortalecer presupuesto, seguimiento y constancia semanal.",
    advanced: "Tienes buenas bases. Puedes enfocarte en decisiones, planificacion y metas combinadas.",
};

export default function TriageResultCard({ result, onGoGoals, onGoLearn, onGoHome }) {
    const paths = LEARNING_PATHS.filter((path) => result.recommendedPathIds.includes(path.id));
    const templates = GOAL_TEMPLATES.filter((template) => result.recommendedGoalTemplateIds.includes(template.id));

    return (
        <Card>
            <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-green text-white">
                    <AppIcon name="CheckCircle2" className="h-9 w-9" />
                </div>
                <h2 className="mt-4 text-2xl font-black">Tu punto de partida financiero</h2>
                <div className="mt-3 flex justify-center">
                    <Badge label={levelLabels[result.level]} />
                </div>
                <p className="mt-3 text-sm text-slate-600">{levelText[result.level]}</p>
            </div>
            {/* <div className="mt-5 rounded-3xl bg-blue-50 p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Intereses detectados</p>
                <p className="mt-2 text-sm font-bold text-brand-black">{result.interests.join(" · ") || "habits"}</p>
            </div> */}
            <div className="mt-4 space-y-2">
                <h3 className="font-black">Rutas recomendadas</h3>
                {paths.map((path) => (
                    <div key={path.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-sky text-brand-blue">
                            <AppIcon name={path.iconKey} className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-bold">{path.title}</span>
                    </div>
                ))}
            </div>
            <div className="mt-4 space-y-2">
                <h3 className="font-black">Metas sugeridas</h3>
                {templates.slice(0, 2).map((template) => (
                    <div key={template.id} className="flex items-center gap-3 rounded-2xl bg-yellow-50 p-3">
                        <AppIcon name={template.iconKey} className="h-5 w-5 text-yellow-800" />
                        <span className="text-sm font-bold">{template.title}</span>
                    </div>
                ))}
            </div>
            <div className="mt-5 space-y-3">
                <Button onClick={onGoGoals} className="w-full">Crear mi primera meta</Button>
                <Button onClick={onGoLearn} variant="secondary" className="w-full">Ver rutas recomendadas</Button>
                <Button onClick={onGoHome} variant="ghost" className="w-full">Ir al inicio</Button>
            </div>
        </Card>
    );
}
