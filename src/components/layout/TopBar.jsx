import { useNavigate } from "react-router-dom";

import { APP_CONFIG } from "../../data";
import AppIcon from "../../utils/iconMap";

export default function TopBar({ title, subtitle }) {
    const navigate = useNavigate();
    return (
        <header className="shrink-0 bg-brand-blue px-4 py-4 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-sky text-brand-blue shadow-sm">
                        <AppIcon name="TrendingUp" className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold leading-none opacity-80">{APP_CONFIG.appName}</p>
                        <h1 className="text-lg font-black leading-tight">{title}</h1>
                        {subtitle && <p className="text-xs opacity-80">{subtitle}</p>}
                    </div>
                </div>
                <button onClick={() => navigate("/profile")} className="rounded-2xl bg-white/15 px-3 py-2 transition hover:bg-white/25" aria-label="Ir al perfil">
                    <AppIcon name="Menu" className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
}
