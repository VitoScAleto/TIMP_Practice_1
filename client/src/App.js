import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Импортируем BrowserRouter и Routes
import HomePage from "./components/HomePage";
import SafetyMeasures from "./components/SafetyMeasures";
import Training from "./components/Training";
import Resources from "./components/Resources";
import Feedback from "./components/Feedback";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Используем BrowserRouter */}
      <Navbar /> {/* Navbar будет отображаться на всех страницах */}
      <Routes>
        {" "}
        {/* Используем Routes вместо Switch */}
        <Route path="/" element={<HomePage />} />{" "}
        {/* Используем element вместо component */}
        <Route path="/safety-measures" element={<SafetyMeasures />} />
        <Route path="/training" element={<Training />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer /> {/* Footer будет отображаться на всех страницах */}
    </BrowserRouter>
  );
}

export default App;
