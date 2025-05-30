import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const AppContent = () => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />
          }
        />
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
          path="/auth"
          element={
            !isAuthenticated ? <AuthPage /> : <Navigate to="/" replace />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

const App = () => (
  <AuthProvider>
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  </AuthProvider>
);

export default App;
