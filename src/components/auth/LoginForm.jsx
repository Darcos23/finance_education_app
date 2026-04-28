import { useState } from "react";

import { APP_CONFIG } from "../../data";
import { authService } from "../../services";
import AppIcon from "../../utils/iconMap";
import Button from "../common/Button";
import Card from "../common/Card";

export default function LoginForm({ onAuthenticated }) {
    const [form, setForm] = useState({ name: "", email: "", password: "", rememberSession: true });
    const [error, setError] = useState("");

    const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

    const submit = (event) => {
        event.preventDefault();
        if (!form.email || !form.password) {
            setError("Ingresa correo y contrasena para continuar.");
            return;
        }
        const result = authService.login(form);
        if (result.ok) onAuthenticated(result.user);
        else setError(result.error);
    };

    const useDemo = () => {
        const result = authService.createDemoUser();
        onAuthenticated(result.user);
    };

    return (
        <Card>
            <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand-blue text-white shadow-card">
                    <AppIcon name="TrendingUp" className="h-11 w-11" />
                </div>
                <h1 className="mt-4 text-3xl font-black text-brand-black">{APP_CONFIG.appName}</h1>
                <p className="mt-2 text-sm font-medium text-slate-600">{APP_CONFIG.appSlogan}</p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-3">
                <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none focus:border-brand-blue" value={form.email} onChange={(event) => setField("email", event.target.value)} placeholder="Correo electrónico" type="email" />
                <input className="w-full rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 outline-none focus:border-brand-blue" value={form.password} onChange={(event) => setField("password", event.target.value)} placeholder="Contraseña" type="password" />
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <input type="checkbox" checked={form.rememberSession} onChange={(event) => setField("rememberSession", event.target.checked)} />
                    Recordarme en este dispositivo
                </label>
                {error && <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
                <Button type="submit" className="w-full py-4">Entrar</Button>
                <Button onClick={useDemo} variant="yellow" className="w-full py-4">Usar usuario demo</Button>
            </form>
            <p className="mt-4 text-center text-xs text-slate-500">Prototipo academico.</p>
        </Card>
    );
}
