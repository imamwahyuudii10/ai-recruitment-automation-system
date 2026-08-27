import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { PublicShell } from "./components/layout/PublicShell";
import { AIInsightsPage } from "./pages/AIInsightsPage";
import { ActivityPage } from "./pages/ActivityPage";
import { ApplicationPage } from "./pages/ApplicationPage";
import { ApplicationSuccessPage } from "./pages/ApplicationSuccessPage";
import { CandidateDetailPage } from "./pages/CandidateDetailPage";
import { CandidatesPage } from "./pages/CandidatesPage";
import { CareersPage } from "./pages/CareersPage";
import { DashboardPage } from "./pages/DashboardPage";
import { JobsPage } from "./pages/JobsPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PublicJobDetailPage } from "./pages/PublicJobDetailPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicShell />}>
          <Route path="/" element={<CareersPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/careers/:jobId" element={<PublicJobDetailPage />} />
          <Route path="/apply/:jobId" element={<ApplicationPage />} />
          <Route
            path="/application-success"
            element={<ApplicationSuccessPage />}
          />
        </Route>

        <Route element={<AppShell />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/candidates" element={<CandidatesPage />} />
          <Route
            path="/admin/candidates/:id"
            element={<CandidateDetailPage />}
          />
          <Route path="/admin/jobs" element={<JobsPage />} />
          <Route path="/admin/ai-insights" element={<AIInsightsPage />} />
          <Route path="/admin/activity" element={<ActivityPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
