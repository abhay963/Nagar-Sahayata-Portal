import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Inline translation objects
const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      reports: "Reports",
      categories: "Categories",
      departments: "Departments",
      analytics: "Analytics",
      settings: "Settings",
      totalIssues: "Total Issues",
      resolved: "Resolved",
      pending: "Pending",
      departmentsCount: "Departments",
      staffPanel: "Staff Panel",
      selectLanguage: "Select Language",
      governmentOfJharkhand: "Government of Jharkhand", // Consistent key with capital G
    },
  },
  hi: {
    translation: {
      dashboard: "डैशबोर्ड",
      reports: "रिपोर्ट्स",
      categories: "श्रेणियाँ",
      departments: "विभाग",
      analytics: "विश्लेषण",
      settings: "सेटिंग्स",
      totalIssues: "कुल मुद्दे",
      resolved: "सुलझाए गए",
      pending: "लंबित",
      departmentsCount: "विभाग",
      staffPanel: "स्टाफ पैनल",
      governmentOfJharkhand: "झारखंड सरकार", // Same key in Hindi
      selectLanguage: "भाषा चुनें",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safe from xss
  },
});

export default i18n;
