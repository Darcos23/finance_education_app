const badgeClasses = {
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-brand-blue",
    dark: "bg-brand-black text-white",
};

export default function Badge({ label, variant = "info" }) {
    return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${badgeClasses[variant] || badgeClasses.info}`}>{label}</span>;
}
