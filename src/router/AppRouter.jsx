import { createHashRouter, Navigate } from "react-router-dom";

import { AppProvider } from "../context/AppContext";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import { authService, userService } from "../services";
import LoginPage from "../pages/LoginPage";
import TriagePage from "../pages/TriagePage";
import HomePage from "../pages/HomePage";
import LearnPage from "../pages/LearnPage";
import LessonPage from "../pages/LessonPage";
import GoalsPage from "../pages/GoalsPage";
import GoalFormPage from "../pages/GoalFormPage";
import GoalDetailPage from "../pages/GoalDetailPage";
import ProfilePage from "../pages/ProfilePage";
import NotFoundPage from "../pages/NotFoundPage";

function InitialRedirect() {
    const user = userService.getCurrentUser();
    if (!authService.isAuthenticated() || !user) return <Navigate to="/login" replace />;
    if (!user.hasCompletedTriage) return <Navigate to="/triage" replace />;
    return <HomePage />;
}

const router = createHashRouter([
    {
        path: "/",
        element: <AppProvider />,
        children: [
            { index: true, element: <InitialRedirect /> },
            { path: "login", element: <LoginPage /> },
            { path: "triage", element: <ProtectedRoute requireTriage={false}><TriagePage /></ProtectedRoute> },
            { path: "learn", element: <ProtectedRoute><LearnPage /></ProtectedRoute> },
            { path: "learn/:pathId", element: <ProtectedRoute><LearnPage /></ProtectedRoute> },
            { path: "lesson/:pathId/:lessonId", element: <ProtectedRoute><LessonPage /></ProtectedRoute> },
            { path: "goals", element: <ProtectedRoute><GoalsPage /></ProtectedRoute> },
            { path: "goals/new", element: <ProtectedRoute><GoalFormPage /></ProtectedRoute> },
            { path: "goals/:goalId", element: <ProtectedRoute><GoalDetailPage /></ProtectedRoute> },
            { path: "profile", element: <ProtectedRoute requireTriage={false}><ProfilePage /></ProtectedRoute> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

export default router;
