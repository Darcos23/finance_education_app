import { useNavigate } from "react-router-dom";

import AppIcon from "../../utils/iconMap";
import Badge from "../common/Badge";
import Button from "../common/Button";

export default function LessonCard({ path, lesson, completed, available }) {
    const navigate = useNavigate();
    return (
        <div className={`rounded-3xl border p-4 ${completed ? "border-green-200 bg-green-50" : available ? "border-blue-100 bg-white" : "border-slate-200 bg-slate-50 opacity-70"}`}>
            <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${completed ? "bg-brand-green text-white" : "bg-brand-sky text-brand-blue"}`}>
                    <AppIcon name={completed ? "CheckCircle2" : available ? "BookOpen" : "Lock"} className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-black">{lesson.order}. {lesson.title}</h3>
                        <Badge label={completed ? "Completada" : available ? "Disponible" : "Bloqueada"} variant={completed ? "success" : available ? "info" : "dark"} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{lesson.description}</p>
                    <p className="mt-2 text-xs font-bold text-slate-500">{lesson.estimatedMinutes} min · {lesson.xpReward} XP</p>
                </div>
            </div>
            <Button disabled={!available} onClick={() => navigate(`/lesson/${path.id}/${lesson.id}`)} className="mt-4 w-full" variant={completed ? "secondary" : "primary"}>
                {completed ? "Revisar leccion" : "Iniciar leccion"}
            </Button>
        </div>
    );
}
