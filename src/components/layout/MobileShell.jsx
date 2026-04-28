export default function MobileShell({ children, topBar, bottomNav, center = false }) {
    return (
        <div className="flex h-dvh min-h-dvh w-full items-center justify-center overflow-hidden bg-gradient-to-br from-brand-sky via-white to-blue-50 p-3">
            <div className={`relative mx-auto flex h-[min(860px,calc(100dvh-1.5rem))] w-[min(430px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[34px] border border-white/70 bg-white shadow-soft ${center ? "justify-center" : ""}`}>
                {topBar}
                <main className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar safe-bottom">
                    {children}
                </main>
                {bottomNav}
            </div>
        </div>
    );
}
