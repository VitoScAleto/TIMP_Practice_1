import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./Context/AuthContext";
import { SettingsProvider } from "./Context/SettingsContext";

import HomePage from "./components/HomePage";
import SafetyMeasures from "./components/SafetyMeasures";
import Training from "./components/Training";
import Resources from "./components/Resources";
import Feedback from "./components/Feedback";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QrTicketsPage from "./components/QrTicketsPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import AdminPanelMain from "./components/admin/adminPanelMain";
import OperatorPanelMain from "./components/operator/operatorPanelMain";
import InspectorPanelMain from "./components/inspector/inspectorPanelMain";
import FacilityList from "./components/admin/FacilityPage";
import EventList from "./components/admin/EventPage";
import SectorManager from "./components/admin/SectorPage";
import AdminMap from "./components/admin/MapPage";
import OperatorScanner from "./components/operator/OperatorScannerPage";
import InspectorPage from "./components/inspector/InspectorPage";

const RoleBasedRoute = ({ requiredRole, element, fallbackPath = "/" }) => {
  const { user } = useAuth();

  if (user?.role === requiredRole) {
    return element;
  }
  return <Navigate to={fallbackPath} replace />;
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Загрузка...</div>;

  const isAdminPath = location.pathname.startsWith("/admin");
  const isOperatorPath = location.pathname.startsWith("/operator");
  const isInspectorPath = location.pathname.startsWith("/inspector");

  return (
    <>
      {!isAdminPath &&
        !isOperatorPath &&
        !isInspectorPath &&
        isAuthenticated && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />
          }
        />

        <Route
          path="/admin"
          element={
            <RoleBasedRoute requiredRole="admin" element={<AdminPanelMain />} />
          }
        >
          <Route index element={<Navigate to="/admin/facilities" replace />} />
          <Route path="facilities" element={<FacilityList />} />
          <Route path="events" element={<EventList />} />
          <Route path="sectors" element={<SectorManager />} />
          <Route path="map" element={<AdminMap />} />
        </Route>

        <Route
          path="/operator"
          element={
            <RoleBasedRoute
              requiredRole="operator"
              element={<OperatorPanelMain />}
            />
          }
        >
          <Route index element={<Navigate to="scanner" replace />} />
          <Route path="scanner" element={<OperatorScanner />} />
        </Route>

        <Route
          path="/inspector"
          element={
            <RoleBasedRoute
              requiredRole="inspector"
              element={<InspectorPanelMain />}
            />
          }
        >
          <Route index element={<Navigate to="checks" replace />} />
          <Route path="checks" element={<InspectorPage />} />
        </Route>

        <Route
          path="/safety-measures"
          element={
            isAuthenticated ? (
              <SafetyMeasures />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/training"
          element={
            isAuthenticated ? <Training /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/resources"
          element={
            isAuthenticated ? <Resources /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/feedback"
          element={
            isAuthenticated ? <Feedback /> : <Navigate to="/auth" replace />
          }
        />
        <Route
          path="/qr-tickets"
          element={
            isAuthenticated ? (
              <QrTicketsPage />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        <Route
          path="/auth"
          element={
            !isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />
          }
        />
        <Route
          path="/reset-password"
          element={
            !isAuthenticated ? (
              <ResetPasswordPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {!isAdminPath && !isOperatorPath && !isInspectorPath && <Footer />}
    </>
  );
};

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SettingsProvider>
  </AuthProvider>
);

export default App;
