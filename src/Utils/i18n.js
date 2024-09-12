// src/i18n.js
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Language resources
const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      profile: "Profile",
      logout: "Logout",
    },
  },
  fr: {
    translation: {
      welcome: "Bienvenue",
      profile: "Profil",
      logout: "Se déconnecter",
    },
  },
  hi: {
    translation: {
      welcome: "स्वागत है",
      profile: "प्रोफ़ाइल",
      logout: "लॉग आउट",
    },
  },
};

i18n
  .use(LanguageDetector) // Automatically detect the user's language
  .use(initReactI18next) // Bind React with i18next
  .init({
    resources,
    fallbackLng: "en", // Fallback language if detection fails
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
