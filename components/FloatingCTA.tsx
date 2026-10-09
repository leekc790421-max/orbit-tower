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
    <div className="fixed bottom-16 sm:bottom-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[92vw] sm:max-w-[90vw]">
      <div className="relative glass-panel rounded-lg sm:rounded-2xl px-2.5 sm:px-5 py-2 sm:py-3 border border-cyan-400/40 shadow-2xl shadow-cyan-400/20 backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/60 border border-white/20 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
        >
          <X size={8} className="text-white/60 sm:w-2.5 sm:h-2.5" />
        </button>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 flex items-center justify-center">
              <Sparkles size={13} className="text-cyan-400 animate-pulse sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="text-[11px] sm:text-sm font-bold text-white tracking-wider truncate">
              {t("cta.title")}
            </div>
            <div className="text-[8px] sm:text-xs text-white/50 truncate">
              {t("cta.subtitle")}
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={onPricingClick}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold text-[10px] sm:text-sm tracking-wider hover:from-cyan-300 hover:to-cyan-400 transition-all whitespace-nowrap flex-shrink-0"
          >
            {t("cta.button")}
          </button>
        </div>
      </div>
    </div>
  );
}
