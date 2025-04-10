import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import SafetyMeasures from "./components/SafetyMeasures";
import Training from "./components/Training";
import Resources from "./components/Resources";
import Feedback from "./components/Feedback";
import AuthPage from "./components/AuthPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверка аутентификации при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Здесь можно добавить проверку токена/сессии
        // const response = await api.get('/auth/check');
        // if (response.data.authenticated) {
        //   setIsAuthenticated(true);
        //   setUser(response.data.user);
        // }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    // Можно сохранить токен в localStorage
    // localStorage.setItem('token', userData.token);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Очищаем токен при выходе
    // localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Загрузка...</div>; // Или красивый лоадер
  }

  return (
    <BrowserRouter>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        user={user}
      />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomePage user={user} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/safety-measures"
          element={
            isAuthenticated ? (
              <SafetyMeasures user={user} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/training"
          element={
            isAuthenticated ? (
              <Training user={user} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/resources"
          element={
            isAuthenticated ? (
              <Resources user={user} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/feedback"
          element={
            isAuthenticated ? (
              <Feedback user={user} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage onLogin={handleLogin} />
            )
          }
        />
        {/* Дополнительные маршруты */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
