import AppIcon from "../../utils/iconMap";
import Button from "./Button";

export default function EmptyState({ icon = "Sparkles", title, description, actionLabel, onAction }) {
    return (
        <div className="rounded-3xl border border-dashed border-blue-200 bg-blue-50 p-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-brand-blue shadow-sm">
                <AppIcon name={icon} className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-lg font-black text-brand-black">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{description}</p>
            {actionLabel && <Button onClick={onAction} className="mt-4 w-full">{actionLabel}</Button>}
        </div>
    );
}
