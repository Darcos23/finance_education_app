import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import MobileShell from "../components/layout/MobileShell";
import AppIcon from "../utils/iconMap";

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <MobileShell center>
            <Card className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-brand-blue">
                    <AppIcon name="SearchX" className="h-8 w-8" />
                </div>
                <h1 className="mt-4 text-2xl font-black">Pagina no encontrada</h1>
                <p className="mt-2 text-sm text-slate-600">La ruta solicitada no existe en el prototipo.</p>
                <Button onClick={() => navigate("/")} className="mt-5 w-full">Ir al inicio</Button>
            </Card>
        </MobileShell>
    );
}
