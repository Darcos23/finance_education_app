export default function Card({ children, className = "", highlighted = false }) {
    return <section className={`rounded-[24px] border ${highlighted ? "border-brand-yellow bg-brand-yellow" : "border-blue-100 bg-white"} p-4 shadow-card ${className}`}>{children}</section>;
}
