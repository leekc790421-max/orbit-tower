"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { zh } from "./locales/zh";
import { en } from "./locales/en";
import { ja } from "./locales/ja";

export type Locale = "zh" | "en" | "ja";

export const LOCALE_META: Record<Locale, { label: string; flag: string; htmlLang: string; ogLocale: string }> = {
  zh: { label: "中文", flag: "🇹🇼", htmlLang: "zh-TW", ogLocale: "zh_TW" },
  en: { label: "English", flag: "🇺🇸", htmlLang: "en", ogLocale: "en_US" },
  ja: { label: "日本語", flag: "🇯🇵", htmlLang: "ja", ogLocale: "ja_JP" },
};

const LOCALES: Record<Locale, typeof zh> = { zh, en, ja };

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const saved = localStorage.getItem("orbit-tower-locale") as Locale | null;
  if (saved && saved in LOCALES) return saved;
  const lang = navigator.language.slice(0, 2);
  if (lang in LOCALES) return lang as Locale;
  return "zh";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("orbit-tower-locale", newLocale);
    document.documentElement.lang = LOCALE_META[newLocale].htmlLang;
  }, []);

  const t = useCallback(
    (key: string) => getNestedValue(LOCALES[locale] as unknown as Record<string, unknown>, key),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}
