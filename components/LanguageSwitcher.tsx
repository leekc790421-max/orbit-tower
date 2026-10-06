"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation, LOCALE_META, type Locale } from "@/lib/i18n";
import { Globe, ChevronDown } from "lucide-react";

const LOCALES: Locale[] = ["zh", "en", "ja"];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const meta = LOCALE_META[locale];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
      >
        <Globe size={13} />
        <span>{meta.flag}</span>
        <span className="hidden sm:inline">{meta.label}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 glass-panel rounded-lg border border-white/10 shadow-xl shadow-black/20 overflow-hidden z-50 min-w-[120px]">
          {LOCALES.map((loc) => {
            const m = LOCALE_META[loc];
            return (
              <button
                key={loc}
                onClick={() => {
                  setLocale(loc);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-all hover:bg-white/10 ${
                  loc === locale ? "text-cyan-300 bg-cyan-400/10" : "text-white/60"
                }`}
              >
                <span>{m.flag}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
