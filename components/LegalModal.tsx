"use client";

import { X, Bot, Shield, Zap, CreditCard } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const { t } = useTranslation();

  const CLAUSES = [
    {
      icon: Bot,
      title: t("legal.clause1Title"),
      color: "cyan",
      content: t("legal.clause1Content"),
    },
    {
      icon: Shield,
      title: t("legal.clause2Title"),
      color: "emerald",
      content: t("legal.clause2Content"),
    },
    {
      icon: Zap,
      title: t("legal.clause3Title"),
      color: "cyan",
      content: t("legal.clause3Content"),
    },
    {
      icon: CreditCard,
      title: t("legal.clause4Title"),
      color: "cyan",
      content: t("legal.clause4Content"),
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-3xl h-[90vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        {/* 頂部 */}
        <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {t("legal.title")}
            </h2>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {t("legal.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
          >
            <X size={14} className="text-white/40" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {/* 前言 */}
          <div className="glass-panel rounded-xl p-3 sm:p-4 border border-white/10 mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
              {t("legal.intro")}
            </p>
            <p className="text-[9px] sm:text-[10px] text-white/40 leading-relaxed mt-2">
              {t("legal.introEn")}
            </p>
          </div>

          {/* 四大條款 */}
          {CLAUSES.map((clause, idx) => {
            const Icon = clause.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      clause.color === "cyan"
                        ? "bg-cyan-400/10 border border-cyan-400/30"
                        : clause.color === "emerald"
                        ? "bg-emerald-400/10 border border-emerald-400/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={
                        clause.color === "cyan"
                          ? "text-cyan-400"
                          : clause.color === "emerald"
                          ? "text-emerald-400"
                          : "text-white/60"
                      }
                    />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-white/30 tracking-wider uppercase">
                      {t("legal.clause")} {idx + 1}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">{clause.title}</h3>
                  </div>
                </div>
                <div className="pl-10 sm:pl-12">
                  <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed whitespace-pre-line">
                    {clause.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 簽署區 */}
          <div className="glass-panel rounded-xl p-3 sm:p-4 border border-cyan-400/20 bg-cyan-400/5 mt-4 sm:mt-6">
            <div className="text-center">
              <div className="text-[9px] sm:text-[10px] text-white/40 tracking-wider uppercase mb-2">
                {t("legal.lastUpdated")}
              </div>
              <div className="text-[11px] sm:text-xs text-cyan-300 font-mono">2026-10-05</div>
              <div className="text-[10px] text-white/40 mt-3">
                {t("legal.contactUs")}
              </div>
              <div className="text-[10px] text-cyan-400/60 mt-1">
                support@snt-nexus.tw
              </div>
            </div>
          </div>

          {/* 確認按鈕 */}
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all mt-3 sm:mt-4"
          >
            {t("legal.agree")}
          </button>
        </div>
      </div>
    </div>
  );
}
