import AppIcon from "../../utils/iconMap";
import Button from "../common/Button";
import Card from "../common/Card";

export default function LessonStepCard({ step, selected, onSelect, onNext, onCreateGoal, isLast }) {
    const isAction = step.type === "action";
    const needsSelection = ["question", "interaction", "action"].includes(step.type);

    return (
        <Card className="mt-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-sky text-brand-blue">
                <AppIcon name={step.iconKey || "BookOpen"} className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-black text-brand-black">{step.title}</h2>
            <p className="mt-3 text-center text-sm font-medium text-slate-600">{step.body}</p>

            {step.options && (
                <div className="mt-5 space-y-3">
                    {step.options.map((option) => (
                        <button key={option.id} onClick={() => onSelect(option.id)} className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${selected === option.id ? "border-brand-blue bg-brand-sky text-brand-blue" : "border-blue-100 bg-white text-slate-700 hover:border-brand-blue"}`}>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                                <AppIcon name={option.iconKey || "Circle"} className="h-5 w-5" />
                            </span>
                            <span className="text-sm font-black">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-5">
                {isAction ? (
                    <Button disabled={!selected} onClick={() => onCreateGoal(selected)} className="w-full">Guardar habito</Button>
                ) : (
                    <Button disabled={needsSelection && !selected} onClick={onNext} className="w-full">{isLast ? "Finalizar" : step.type === "question" ? "Ver resultado" : "Continuar"}</Button>
                )}
            </div>
        </Card>
    );
}
