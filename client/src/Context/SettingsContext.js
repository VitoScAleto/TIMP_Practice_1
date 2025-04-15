import React, { createContext, useContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children, userEmail }) => {
  const getInitialSettings = () => {
    const savedSettings = localStorage.getItem("userSettings");
    const defaultSettings = {
      email: userEmail || "",
      theme: "light",
      language: "ru",
      name: "",
    };
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  };

  const [settings, setSettings] = useState(getInitialSettings());

  useEffect(() => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    document.body.setAttribute("data-theme", settings.theme);
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
