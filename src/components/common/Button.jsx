const buttonClasses = {
    primary: "bg-brand-blue text-white hover:bg-blue-800",
    secondary: "bg-white text-brand-blue border border-brand-blue hover:bg-brand-sky",
    danger: "bg-brand-red text-white hover:brightness-95",
    success: "bg-brand-green text-white hover:brightness-95",
    yellow: "bg-brand-yellow text-brand-black hover:brightness-95",
    ghost: "bg-transparent text-brand-blue hover:bg-brand-sky",
};

const buttonSizes = {
    sm: "px-3 py-2 text-xs rounded-xl",
    md: "px-4 py-3 text-sm rounded-2xl",
    lg: "px-5 py-4 text-base rounded-2xl",
};

export default function Button({ children, variant = "primary", size = "md", disabled = false, type = "button", className = "", onClick }) {
    return (
        <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${buttonClasses[variant]} ${buttonSizes[size]} ${className}`}>
            {children}
        </button>
    );
}
