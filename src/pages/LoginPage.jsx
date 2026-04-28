import { Navigate, useNavigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import MobileShell from "../components/layout/MobileShell";
import { useAppContext } from "../context/AppContext";
import { authService } from "../services";

export default function LoginPage() {
    const navigate = useNavigate();
    const { refresh } = useAppContext();

    if (authService.isAuthenticated()) return <Navigate to="/" replace />;

    const onAuthenticated = (user) => {
        refresh();
        navigate(user.hasCompletedTriage ? "/" : "/triage", { replace: true });
    };

    return (
        <MobileShell center>
            <LoginForm onAuthenticated={onAuthenticated} />
        </MobileShell>
    );
}
