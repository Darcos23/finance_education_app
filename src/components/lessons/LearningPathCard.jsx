import { useNavigate } from "react-router-dom";

import AppIcon from "../../utils/iconMap";
import Badge from "../common/Badge";
import Button from "../common/Button";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";

const levelLabels = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" };

export default function LearningPathCard({ path, progress }) {
    const navigate = useNavigate();
    const completed = path.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
    const percent = path.lessons.length ? (completed / path.lessons.length) * 100 : 0;

    return (
        <Card>
            <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl text-white" style={{ backgroundColor: path.color }}>
                    <AppIcon name={path.iconKey} className="h-7 w-7" />
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-black">{path.title}</h3>
                        <Badge label={levelLabels[path.level]} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600">{path.description}</p>
                </div>
            </div>
            <ProgressBar value={percent} label={`${completed} de ${path.lessons.length} lecciones`} color={path.color} className="mt-4" />
            <Button onClick={() => navigate(`/learn/${path.id}`)} className="mt-4 w-full">Ver ruta</Button>
        </Card>
    );
}
