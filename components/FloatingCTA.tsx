"use client";

import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FloatingCTAProps {
  onPricingClick: () => void;
}

export default function FloatingCTA({ onPricingClick }: FloatingCTAProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 5 seconds if not dismissed
    const timer = setTimeout(() => {
      if (!dismissed) {
        setVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  if (!visible || dismissed) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative glass-panel rounded-2xl px-6 py-4 border border-cyan-400/40 shadow-2xl shadow-cyan-400/20 backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
        >
          <X size={12} className="text-white/60" />
        </button>

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 flex items-center justify-center">
              <Sparkles size={24} className="text-cyan-400 animate-pulse" />
            </div>
            {/* Pulse ring */}
            <div className="absolute inset-0 rounded-xl bg-cyan-400/20 animate-ping" />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white tracking-wider mb-1">
              {t("cta.title")}
            </div>
            <div className="text-xs text-white/60">
              {t("cta.subtitle")}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onPricingClick}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold text-sm tracking-wider hover:from-cyan-300 hover:to-cyan-400 transition-all transform hover:scale-105 shadow-lg shadow-cyan-400/30 whitespace-nowrap"
          >
            {t("cta.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
