import Button from "../common/Button";
import Card from "../common/Card";

export default function TriageQuestionCard({ question, selectedOptionId, onSelect, onBack, onContinue, canGoBack, isLast }) {
    return (
        <Card className="mt-5">
            <h2 className="text-2xl font-black text-brand-black">{question.question}</h2>
            <p className="mt-2 text-sm text-slate-600">{question.description}</p>
            <div className="mt-5 space-y-3">
                {question.options.map((option) => (
                    <button key={option.id} onClick={() => onSelect(question.id, option.id)} className={`w-full rounded-2xl border p-4 text-left text-sm font-bold transition ${selectedOptionId === option.id ? "border-brand-blue bg-brand-sky text-brand-blue" : "border-blue-100 bg-white text-slate-700 hover:border-brand-blue"}`}>
                        {option.label}
                    </button>
                ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
                <Button variant="secondary" disabled={!canGoBack} onClick={onBack}>Atras</Button>
                <Button disabled={!selectedOptionId} onClick={onContinue}>{isLast ? "Ver resultado" : "Continuar"}</Button>
            </div>
        </Card>
    );
}
