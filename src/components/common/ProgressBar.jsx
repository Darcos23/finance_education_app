import { clampPercentage } from "../../utils";

export default function ProgressBar({ value = 0, label = "", color = "#32b984", showPercentage = true, className = "" }) {
    const safe = clampPercentage(value);
    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="mb-1 flex justify-between text-xs font-bold text-slate-600">
                    <span>{label}</span>
                    {showPercentage && <span>{Math.round(safe)}%</span>}
                </div>
            )}
            <div className="h-3 overflow-hidden rounded-full bg-blue-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${safe}%`, backgroundColor: color }} />
            </div>
        </div>
    );
}
