import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ProgressBar from "../components/common/ProgressBar";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import TriageQuestionCard from "../components/triage/TriageQuestionCard";
import TriageResultCard from "../components/triage/TriageResultCard";
import { useAppContext } from "../context/AppContext";
import { TRIAGE_QUESTIONS } from "../data";
import { store } from "../storage";
import { triageService, userService } from "../services";

export default function TriagePage() {
    const navigate = useNavigate();
    const { user, refresh } = useAppContext();
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(store.getTriageResult());
    const question = TRIAGE_QUESTIONS[step];

    const selectOption = (questionId, optionId) => setAnswers((current) => ({ ...current, [questionId]: optionId }));

    const next = () => {
        if (step < TRIAGE_QUESTIONS.length - 1) {
            setStep((current) => current + 1);
            return;
        }
        const built = triageService.buildTriageResult(user.id, answers);
        triageService.save(built);
        userService.markTriageCompleted(built.level, built.interests);
        setResult(built);
        refresh();
    };

    return (
        <MobileShell topBar={<TopBar title="Diagnostico" subtitle="Personaliza tu aprendizaje" />}>
            {!result ? (
                <>
                    <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
                        <span>Diagnostico financiero</span>
                        <span>Pregunta {step + 1} de {TRIAGE_QUESTIONS.length}</span>
                    </div>
                    <ProgressBar value={((step + 1) / TRIAGE_QUESTIONS.length) * 100} showPercentage={false} color="#ffcc2a" />
                    <TriageQuestionCard
                        question={question}
                        selectedOptionId={answers[question.id]}
                        onSelect={selectOption}
                        canGoBack={step > 0}
                        onBack={() => setStep((current) => Math.max(current - 1, 0))}
                        onContinue={next}
                        isLast={step === TRIAGE_QUESTIONS.length - 1}
                    />
                </>
            ) : (
                <TriageResultCard result={result} onGoGoals={() => navigate("/goals")} onGoLearn={() => navigate("/learn")} onGoHome={() => navigate("/")} />
            )}
        </MobileShell>
    );
}
