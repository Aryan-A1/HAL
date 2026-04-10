import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

const translations = { en, hi };

export const useTranslation = () => {
  const language = useLanguageStore((s) => s.language);
  const t = translations[language];
  return { t, language };
};
