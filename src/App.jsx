import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import RequireTriage from "./components/layout/RequireTriage";
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
import GoalIdeasPage from "./pages/GoalIdeasPage";
import PremiumDemoPage from "./pages/PremiumDemoPage";
import ExitSurveyPage from "./pages/ExitSurveyPage";

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
const appPage = (node) => <ProtectedRoute><RequireTriage>{node}</RequireTriage></ProtectedRoute>;

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
        <Route path="/app" element={appPage(<HomePage />)} />
        <Route path="/learn" element={appPage(<LearnPage />)} />
        <Route path="/path/:pathId" element={appPage(<PathPage />)} />
        <Route path="/lesson/:lessonId" element={appPage(<LessonPage />)} />
        <Route path="/goals" element={appPage(<GoalsPage />)} />
        <Route path="/goals/new" element={appPage(<GoalFormPage />)} />
        <Route path="/goals/ideas" element={appPage(<GoalIdeasPage />)} />
        <Route path="/goals/:goalId" element={appPage(<GoalDetailPage />)} />
        <Route path="/simulators" element={appPage(<SimulatorsPage />)} />
        <Route path="/simulators/:simulatorId" element={appPage(<SimulatorPage />)} />
        <Route path="/premium" element={appPage(<PremiumPage />)} />
        <Route path="/premium/demo" element={appPage(<PremiumDemoPage />)} />
        <Route path="/checkout/:attemptId" element={appPage(<CheckoutPage />)} />
        <Route path="/profile" element={appPage(<ProfilePage />)} />
        <Route path="/fin" element={appPage(<ExitSurveyPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
