// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend"; // Load translations from files

i18n
  .use(HttpBackend) // Use the backend to load translations
  .use(LanguageDetector) // Automatically detect the user's language
  .use(initReactI18next) // Bind React with i18next
  .init({
    backend: {
      loadPath: (lng, ns) => {
        return `/locales/${lng}/${ns}.json`;
      }
    },
    fallbackLng: "en", // Fallback language if detection fails
    ns: ['language','setting','stdFinance','stdLibrary'], // Specify your namespace
    defaultNS: 'language', // Set default namespace
    detection: {
      // Language detection options
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["localStorage", "cookie"], // Save detected language in cache
 
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
  });

export default i18n;
