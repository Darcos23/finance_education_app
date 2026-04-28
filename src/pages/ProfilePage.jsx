import { useNavigate } from "react-router-dom";

import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import MobileShell from "../components/layout/MobileShell";
import TopBar from "../components/layout/TopBar";
import BottomNav from "../components/layout/BottomNav";
import { useAppContext } from "../context/AppContext";
import { authService, lessonService, userService } from "../services";
import { store } from "../storage";
import AppIcon from "../utils/iconMap";

const levelLabels = { beginner: "Principiante", intermediate: "Intermedio", advanced: "Avanzado" };

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, refresh } = useAppContext();
    const progress = lessonService.getUserLessonProgress(user.id);

    const logout = () => {
        authService.logout();
        refresh();
        navigate("/login", { replace: true });
    };

    const clear = () => {
        store.clearAll();
        refresh();
        navigate("/login", { replace: true });
    };

    const reset = () => {
        userService.resetTriage();
        refresh();
        navigate("/triage", { replace: true });
    };

    return (
        <MobileShell topBar={<TopBar title="Perfil" subtitle="Resumen del prototipo" />} bottomNav={<BottomNav />}>
            <Card className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand-sky text-brand-blue">
                    <AppIcon name={user.avatarIcon || "UserCircle"} className="h-11 w-11" />
                </div>
                <h2 className="mt-3 text-2xl font-black">{user.name}</h2>
                <p className="text-sm text-slate-500">{user.email}</p>
                <div className="mt-3 flex justify-center">
                    <Badge label={levelLabels[user.financialLevel] || user.financialLevel} />
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-3xl bg-blue-50 p-3"><p className="text-xl font-black">{user.totalLessonsCompleted || 0}</p><p className="text-xs text-slate-500">Lecciones</p></div>
                    <div className="rounded-3xl bg-green-50 p-3"><p className="text-xl font-black">{user.totalGoalsCompleted || 0}</p><p className="text-xs text-slate-500">Metas</p></div>
                    <div className="rounded-3xl bg-yellow-50 p-3"><p className="text-xl font-black">{progress.xp || 0}</p><p className="text-xs text-slate-500">XP</p></div>
                </div>
            </Card>
            <div className="mt-4 space-y-3">
                <Button onClick={reset} variant="secondary" className="w-full">Reiniciar triage</Button>
                <Button onClick={logout} variant="yellow" className="w-full">Cerrar sesion</Button>
                <Button onClick={clear} variant="danger" className="w-full">Borrar datos del prototipo</Button>
            </div>
        </MobileShell>
    );
}
