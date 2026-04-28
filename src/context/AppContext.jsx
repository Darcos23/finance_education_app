import { createContext, useContext, useMemo, useState } from "react";
import { Outlet } from "react-router-dom";

import { authService, userService } from "../services";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [version, setVersion] = useState(0);
    const [user, setUser] = useState(userService.getCurrentUser());

    const refresh = () => {
        setUser(userService.getCurrentUser());
        setVersion((current) => current + 1);
    };

    const value = useMemo(() => ({
        user,
        version,
        refresh,
        setUser,
        isAuthenticated: authService.isAuthenticated(),
    }), [user, version]);

    return <AppContext.Provider value={value}>{children || <Outlet />}</AppContext.Provider>;
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext debe usarse dentro de AppProvider");
    return context;
}
