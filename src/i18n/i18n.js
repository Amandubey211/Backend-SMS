import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import commonEN from '../locales/en/common.json';
import commonAR from '../locales/ar/common.json';
import headerEN from '../locales/en/header.json';
import headerAR from '../locales/ar/header.json';
import footerEN from '../locales/en/footer.json';
import footerAR from '../locales/ar/footer.json';
import homeEN from '../locales/en/home.json';
import homeAR from '../locales/ar/home.json';

i18n
  .use(LanguageDetector) // Detects the language from the browser
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    fallbackLng: 'en', // Default language
    debug: true, // To see logs for the i18n initialization
    interpolation: {
      escapeValue: false, // React already escapes by default
    },
    resources: {
      en: {
        common: commonEN,
        header: headerEN,
        footer: footerEN,
        home: homeEN,
      },
      ar: {
        common: commonAR,
        header: headerAR,
        footer: footerAR,
        home: homeAR,
      },
    },
  });

export default i18n;
