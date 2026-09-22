import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import OperationLayout from "@/layouts/OperationLayout";

import AlertsPage from "@/pages/Alerts";
import ChatbotPage from "@/pages/Chatbot";
import DocumentsPage from "@/pages/Documents";
import GISPage from "@/pages/GIS";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import ReportsPage from "@/pages/Reports";
import SchoolPage from "@/pages/Schools";
import TimetablePage from "@/pages/Timetable";

import PersonnelPage from "@/pages/Personnel";
import SectorsPage from "@/pages/Sector";
import StudentsPage from "@/pages/Students";
import BoardingPage from "@/pages/Boarding";

import { useAuth } from "@/store/auth";
import { canAccess } from "@/utils/permission";



const RequireAuth = () => {
  const { user } = useAuth();

  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccess(user.role, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};


function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />

        {/* Operations (protected) */}
        <Route element={<RequireAuth />}>
          <Route element={<OperationLayout />}>
            <Route path="/operations/documents" element={<DocumentsPage />} />

            <Route path="/operations/timetable" element={<TimetablePage />} />

            <Route path="/operations/schools" element={<SchoolPage />} />

            <Route path="/operations/gis" element={<GISPage />} />

            <Route path="/operations/reports" element={<ReportsPage />} />

            <Route path="/operations/personnel" element={<PersonnelPage />} />

            <Route path="/operations/sectors" element={<SectorsPage />} />

            <Route path="/operations/students" element={<StudentsPage />} />

            <Route path="/operations/boarding" element={<BoardingPage />} />

            <Route path="/operations/alerts" element={<AlertsPage />} />

            <Route path="/operations/chatbot" element={<ChatbotPage />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
