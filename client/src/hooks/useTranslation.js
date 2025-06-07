import en from "../locales/en";
import ru from "../locales/ru";
import { useLanguage } from "./useLanguage";

const translations = {
  en,
  ru,
};

export const useTranslation = () => {
  const { language } = useLanguage();
  const lang = (language || "en").slice(0, 2);
  const tObj = translations[lang] || translations.en;

  return {
    t: (key) => {
      return key.split(".").reduce((acc, part) => acc?.[part], tObj) || key;
    },
  };
};
