import { useSettings } from "../Context/SettingsContext";
import { useEffect } from "react";

/**

 * @returns {{
 *   language: string,
 *   setLanguage: (lang: string) => void,
 *   isRussian: boolean,
 *   isEnglish: boolean,
 *   toggleLanguage: () => void,
 *   availableLanguages: Array<{code: string, name: string}>
 * }}
 */
export const useLanguage = () => {
  const { settings, changeLanguage } = useSettings();

  const availableLanguages = [
    { code: "ru", name: "Русский" },
    { code: "en", name: "English" },
  ];

  const setLanguage = (lang) => {
    try {
      if (!availableLanguages.some((l) => l.code === lang)) {
        console.warn(`Attempt to set unsupported language: ${lang}`);
        return;
      }
      changeLanguage(lang);

      document.documentElement.lang = lang;
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const toggleLanguage = () => {
    setLanguage(settings.language === "ru" ? "en" : "ru");
  };

  useEffect(() => {
    document.documentElement.lang = settings.language;
  }, [settings.language]);

  return {
    language: settings.language,
    setLanguage,
    toggleLanguage,
    isRussian: settings.language === "ru",
    isEnglish: settings.language === "en",
    availableLanguages,
  };
};
