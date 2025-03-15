import React from "react";
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
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Главная страница */}
        <Route
          path="/"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
        />
        {/* Другие страницы */}
        <Route path="/safety-measures" element={<SafetyMeasures />} />
        <Route path="/training" element={<Training />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/feedback" element={<Feedback />} />
        {/* Страница авторизации */}
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" /> // Перенаправляем на главную, если пользователь аутентифицирован
            ) : (
              <AuthPage setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
