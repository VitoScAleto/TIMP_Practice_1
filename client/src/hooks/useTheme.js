import { useEffect } from "react";
import { useSettings } from "../Context/SettingsContext";

export const useTheme = () => {
  const { settings, changeTheme } = useSettings();

  const toggleTheme = () => {
    const newTheme = settings.theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  useEffect(() => {
    document.body.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  return {
    theme: settings.theme,
    toggleTheme,
    isDark: settings.theme === "dark",
  };
};
