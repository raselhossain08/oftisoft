"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enCommon from "@/locales/en/common.json";
import bnCommon from "@/locales/bn/common.json";
import enDashboard from "@/locales/en/dashboard.json";
import bnDashboard from "@/locales/bn/dashboard.json";

const resources = {
  en: {
    common: enCommon,
    dashboard: enDashboard,
  },
  bn: {
    common: bnCommon,
    dashboard: bnDashboard,
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18next;
