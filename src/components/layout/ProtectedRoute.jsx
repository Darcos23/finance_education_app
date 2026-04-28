import { Navigate, useLocation } from "react-router-dom";

import { authService, userService } from "../../services";

export default function ProtectedRoute({ children, requireTriage = true }) {
    const location = useLocation();
    const user = userService.getCurrentUser();

    if (!authService.isAuthenticated() || !user) return <Navigate to="/login" replace />;
    if (requireTriage && !user.hasCompletedTriage && location.pathname !== "/triage") return <Navigate to="/triage" replace />;

    return children;
}
