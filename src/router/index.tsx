import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import OperationLayout from "@/layouts/OperationLayout";

import AlertsPage from "@/pages/Alerts";
import CampusesPage from "@/pages/Campuses";
import CampusDetail from "@/pages/Campuses/CampusDetail";
import ChatbotPage from "@/pages/Chatbot";
import DocumentsPage from "@/pages/Documents";
import GISPage from "@/pages/GIS";
import HomePage from "@/pages/Home";
import ReportsPage from "@/pages/Reports";
import SchoolPage from "@/pages/Schools";
import TimetablePage from "@/pages/Timetable";

import OperationsDashboardPage from "@/pages/OperationsDashboard";
import CatalogsPage from "@/pages/Catalogs";
import TasksPage from "@/pages/Tasks";



function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Operations */}
        <Route element={<OperationLayout />}>
          <Route path="/operations" element={<Navigate to="/operations/schools" replace />} />

          <Route path="/operations/dashboard" element={<OperationsDashboardPage />} />

          <Route path="/operations/documents" element={<DocumentsPage />} />

          <Route path="/operations/timetable" element={<TimetablePage />} />

          <Route path="/operations/schools" element={<SchoolPage />} />

          <Route path="/operations/campuses" element={<CampusesPage />} />

          <Route path="/operations/campuses/:campusId" element={<CampusDetail />} />

          <Route path="/operations/gis" element={<GISPage />} />

          <Route path="/operations/reports" element={<ReportsPage />} />

          <Route path="/operations/personnel" element={<Navigate to="/operations/schools?tab=personnel" replace />} />

          <Route path="/operations/sectors" element={<Navigate to="/operations/schools?tab=sectors" replace />} />

          <Route path="/operations/students" element={<Navigate to="/operations/schools?tab=students" replace />} />

          <Route path="/operations/alerts" element={<AlertsPage />} />

          <Route path="/operations/chatbot" element={<ChatbotPage />} />

          <Route path="/operations/tasks" element={<TasksPage />} />

          <Route path="/operations/catalogs" element={<CatalogsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
