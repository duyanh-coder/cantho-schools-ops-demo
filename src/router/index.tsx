import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import OperationLayout from "@/layouts/OperationLayout";

import AlertsPage from "@/pages/Alerts";
import ChatbotPage from "@/pages/Chatbot";
import DocumentsPage from "@/pages/Documents";
import GISPage from "@/pages/GIS";
import HomePage from "@/pages/Home";
import ReportsPage from "@/pages/Reports";
import SchoolPage from "@/pages/Schools";
import TimetablePage from "@/pages/Timetable";



function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Operations */}
        <Route element={<OperationLayout />}>
          <Route path="/operations/documents" element={<DocumentsPage />} />

          <Route path="/operations/timetable" element={<TimetablePage />} />

          <Route path="/operations/schools" element={<SchoolPage />} />

          <Route path="/operations/gis" element={<GISPage />} />

          <Route path="/operations/reports" element={<ReportsPage />} />

          <Route path="/operations/alerts" element={<AlertsPage />} />

          <Route path="/operations/chatbot" element={<ChatbotPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
