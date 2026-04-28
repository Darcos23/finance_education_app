import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/common/Button";
import ProgressBar from "../components/common/ProgressBar";
import LessonStepCard from "../components/lessons/LessonStepCard";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import { useAppContext } from "../context/AppContext";
import { goalService, lessonService } from "../services";

export default function LessonPage() {
    const navigate = useNavigate();
    const { pathId, lessonId } = useParams();
    const { user, refresh } = useAppContext();
    const lesson = lessonService.getLessonById(lessonId);
    const [stepIndex, setStepIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [createdGoalId, setCreatedGoalId] = useState(null);

    if (!lesson) {
        return (
            <MobileShell topBar={<TopBar title="Leccion" />}>
                <Button variant="ghost" onClick={() => navigate(`/learn/${pathId}`)}>Volver</Button>
                <p className="mt-4 rounded-3xl bg-red-50 p-4 text-sm font-black text-red-700">No se encontro la leccion.</p>
            </MobileShell>
        );
    }

    const step = lesson.steps[stepIndex];
    const isLast = stepIndex === lesson.steps.length - 1;

    const next = () => {
        if (!isLast) {
            setStepIndex((current) => current + 1);
            setSelected(null);
            return;
        }
        lessonService.completeLesson(user.id, lesson.id);
        refresh();
        navigate(`/learn/${pathId}`);
    };

    const createGoalFromStep = (templateId) => {
        const goal = goalService.createGoalFromTemplate(templateId, user.id);
        setCreatedGoalId(goal.id);
        refresh();
        setStepIndex((current) => Math.min(current + 1, lesson.steps.length - 1));
        setSelected(null);
    };

    return (
        <MobileShell topBar={<TopBar title="Leccion" subtitle={lesson.title} />}>
            <Button variant="ghost" onClick={() => navigate(`/learn/${pathId}`)}>Volver a la ruta</Button>
            <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
                    <span>Paso {stepIndex + 1} de {lesson.steps.length}</span>
                    <span>{lesson.xpReward} XP</span>
                </div>
                <ProgressBar value={((stepIndex + 1) / lesson.steps.length) * 100} color="#1e67b8" showPercentage={false} />
            </div>
            {createdGoalId && <div className="mt-4 rounded-3xl bg-green-50 p-3 text-sm font-black text-green-700">Habito guardado como meta activa.</div>}
            <LessonStepCard step={step} selected={selected} onSelect={setSelected} onNext={next} onCreateGoal={createGoalFromStep} isLast={isLast} />
        </MobileShell>
    );
}
