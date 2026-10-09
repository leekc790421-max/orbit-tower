"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
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
  let current: unknown = obj;
  for (const key of path.split(".")) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : path;
}

function getPreferredLocale(): Locale {
  try {
    const saved = window.localStorage.getItem("orbit-tower-locale") as Locale | null;
    if (saved && saved in LOCALES) return saved;
  } catch {
    // Browser storage can be disabled; fall back to the browser language.
  }
  const language = window.navigator.language.slice(0, 2);
  return language in LOCALES ? (language as Locale) : "zh";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Keep server and first client render deterministic, then apply saved/browser preference.
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const preferred = getPreferredLocale();
    // Intentional post-hydration sync: browser-only locale preference is unavailable on the server.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(preferred);
    document.documentElement.lang = LOCALE_META[preferred].htmlLang;
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.lang = LOCALE_META[newLocale].htmlLang;
    try {
      window.localStorage.setItem("orbit-tower-locale", newLocale);
    } catch {
      // The selected language still applies for the current page session.
    }
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
