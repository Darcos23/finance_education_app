import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LearningPathCard from "../components/lessons/LearningPathCard";
import LessonCard from "../components/lessons/LessonCard";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ProgressBar from "../components/common/ProgressBar";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import BottomNav from "../components/layout/BottomNav";
import { useAppContext } from "../context/AppContext";
import { lessonService } from "../services";
import AppIcon from "../utils/iconMap";

const filters = [
    { key: "all", label: "Todas" },
    { key: "recommended", label: "Recomendadas" },
    { key: "beginner", label: "Basicas" },
    // { key: "habits", label: "Habitos" },
];

export default function LearnPage() {
    const navigate = useNavigate();
    const { pathId } = useParams();
    const { user, version } = useAppContext();
    const [filter, setFilter] = useState("recommended");
    const progress = lessonService.getUserLessonProgress(user.id);
    const selectedPath = pathId ? lessonService.getPathById(pathId) : null;

    const paths = useMemo(() => {
        if (filter === "recommended") return lessonService.getRecommendedPaths(user);
        if (filter === "beginner") return lessonService.getLearningPaths().filter((path) => path.level === "beginner");
        if (filter === "habits") return lessonService.getLearningPaths().filter((path) => path.tags.includes("habits"));
        return lessonService.getLearningPaths();
    }, [filter, user, version]);

    if (selectedPath) {
        const completed = selectedPath.lessons.filter((lesson) => progress.completedLessonIds.includes(lesson.id)).length;
        const percent = selectedPath.lessons.length ? (completed / selectedPath.lessons.length) * 100 : 0;
        return (
            <MobileShell topBar={<TopBar title="Ruta" subtitle={selectedPath.title} />} bottomNav={<BottomNav />}>
                <Button variant="ghost" onClick={() => navigate("/learn")}>Volver a rutas</Button>
                <Card className="mt-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-3xl text-white" style={{ backgroundColor: selectedPath.color }}>
                            <AppIcon name={selectedPath.iconKey} className="h-8 w-8" />
                        </div>
                        <div>
                            <Badge label={selectedPath.level} />
                            <h2 className="mt-2 text-2xl font-black">{selectedPath.title}</h2>
                            <p className="mt-1 text-sm text-slate-600">{selectedPath.description}</p>
                        </div>
                    </div>
                    <ProgressBar value={percent} color={selectedPath.color} label="Progreso de la ruta" className="mt-4" />
                </Card>
                <div className="mt-5 space-y-3">
                    {selectedPath.lessons.map((lesson) => {
                        const completedLesson = progress.completedLessonIds.includes(lesson.id);
                        const available = lessonService.isLessonAvailable(selectedPath, lesson, progress);
                        return <LessonCard key={lesson.id} path={selectedPath} lesson={lesson} completed={completedLesson} available={available} />;
                    })}
                </div>
            </MobileShell>
        );
    }

    return (
        <MobileShell topBar={<TopBar title="Aprender" subtitle="Lecciones financieras" />} bottomNav={<BottomNav />}>
            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-black text-brand-black">Aprende finanzas personales</h2>
                    <p className="text-sm text-slate-600">Rutas cortas, practicas y conectadas con tus metas.</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {filters.map((item) => (
                        <button key={item.key} onClick={() => setFilter(item.key)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-black ${filter === item.key ? "bg-brand-blue text-white" : "bg-blue-50 text-brand-blue"}`}>{item.label}</button>
                    ))}
                </div>
                {paths.map((path) => <LearningPathCard key={path.id} path={path} progress={progress} />)}
            </div>
        </MobileShell>
    );
}
