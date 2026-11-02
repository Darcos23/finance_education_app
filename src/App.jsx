import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { analytics, touchSession } from "./lib/analytics";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import TriagePage from "./pages/TriagePage";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import PathPage from "./pages/PathPage";
import LessonPage from "./pages/LessonPage";
import GoalsPage from "./pages/GoalsPage";
import GoalFormPage from "./pages/GoalFormPage";
import GoalDetailPage from "./pages/GoalDetailPage";
import SimulatorsPage from "./pages/SimulatorsPage";
import SimulatorPage from "./pages/SimulatorPage";
import PremiumPage from "./pages/PremiumPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function RouteTracker() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    analytics.pageView(location.pathname, user);
    touchSession(user);
  }, [location.pathname, user?.id]);

  return null;
}

const protectedPage = (node) => <ProtectedRoute>{node}</ProtectedRoute>;

export default function App() {
  return (
    <>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/reset-password" element={<ResetPasswordPage />}/>
        <Route path="/triage" element={protectedPage(<TriagePage />)} />
        <Route path="/app" element={protectedPage(<HomePage />)} />
        <Route path="/learn" element={protectedPage(<LearnPage />)} />
        <Route path="/path/:pathId" element={protectedPage(<PathPage />)} />
        <Route path="/lesson/:lessonId" element={protectedPage(<LessonPage />)} />
        <Route path="/goals" element={protectedPage(<GoalsPage />)} />
        <Route path="/goals/new" element={protectedPage(<GoalFormPage />)} />
        <Route path="/goals/:goalId" element={protectedPage(<GoalDetailPage />)} />
        <Route path="/simulators" element={protectedPage(<SimulatorsPage />)} />
        <Route path="/simulators/:simulatorId" element={protectedPage(<SimulatorPage />)} />
        <Route path="/premium" element={protectedPage(<PremiumPage />)} />
        <Route path="/checkout/:attemptId" element={protectedPage(<CheckoutPage />)} />
        <Route path="/profile" element={protectedPage(<ProfilePage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
