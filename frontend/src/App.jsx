import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import PlatformPage from "./pages/PlatformPage";
import DocsPage from "./pages/DocsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import RunTest from "./pages/RunTest";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";

import ClickSpark from "./components/ClickSpark";
import TargetCursor from "./components/TargetCursor";
import SmoothScroll from "./components/SmoothScroll";

export default function App() {
  return (
    <ClickSpark
      sparkColor="#ffffff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {/* Site-wide animated TargetCursor */}
      <TargetCursor 
        spinDuration={8}
        hideDefaultCursor
        parallaxOn
        hoverDuration={0.2}
        cursorColor="#ffffff"
        cursorColorOnTarget="#B497CF"
        targetSelector="button, a, input[type='submit'], [role='button'], .cursor-target"
      />

      <BrowserRouter>
        <SmoothScroll>
          <ScrollToTop />
        <Routes>
          {/* Public Marketing & Legal Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/platform" element={<PlatformPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />

          {/* Authentication Pages (Login, Signup & Register) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/register" element={<SignupPage />} />

          {/* Protected Dashboard Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
              <Route path="run-test" element={<RunTest />} />
              <Route path="history" element={<History />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Route>

          {/* Fallback to Home Page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </SmoothScroll>
      </BrowserRouter>
    </ClickSpark>
  );
}
