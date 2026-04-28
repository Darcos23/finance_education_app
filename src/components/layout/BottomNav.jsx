import { useLocation, useNavigate } from "react-router-dom";

import AppIcon from "../../utils/iconMap";

const items = [
    { path: "/", label: "Inicio", icon: "Home" },
    { path: "/learn", label: "Aprender", icon: "BookOpenCheck" },
    { path: "/goals", label: "Metas", icon: "Target" },
    { path: "/profile", label: "Perfil", icon: "UserCircle" },
];

export default function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="safe-bottom shrink-0 border-t border-blue-100 bg-white px-3 py-2">
            <div className="grid grid-cols-4 gap-1">
                {items.map((item) => (
                    <button key={item.path} onClick={() => navigate(item.path)} className={`rounded-2xl px-2 py-2 text-center text-xs font-black transition ${isActive(item.path) ? "bg-brand-sky text-brand-blue" : "text-slate-400 hover:bg-blue-50"}`}>
                        <AppIcon name={item.icon} className="mx-auto h-5 w-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}
