"use client";

import { ArrowLeft, Bot, Shield, Globe, CreditCard, FileText, Lock, Scale, AlertTriangle, RefreshCw, Copyright } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface DisclaimerPageProps {
  onBack: () => void;
}

export default function DisclaimerPage({ onBack }: DisclaimerPageProps) {
  const { t } = useTranslation();

  const SECTIONS = [
    {
      icon: FileText,
      title: t("disclaimer.section1Title"),
      color: "cyan",
      content: t("disclaimer.section1Content"),
    },
    {
      icon: FileText,
      title: t("disclaimer.section2Title"),
      color: "cyan",
      content: t("disclaimer.section2Content"),
    },
    {
      icon: Bot,
      title: t("disclaimer.section3Title"),
      color: "emerald",
      content: t("disclaimer.section3Content"),
    },
    {
      icon: AlertTriangle,
      title: t("disclaimer.section4Title"),
      color: "cyan",
      content: t("disclaimer.section4Content"),
    },
    {
      icon: Globe,
      title: t("disclaimer.section5Title"),
      color: "cyan",
      content: t("disclaimer.section5Content"),
    },
    {
      icon: CreditCard,
      title: t("disclaimer.section6Title"),
      color: "cyan",
      content: t("disclaimer.section6Content"),
    },
    {
      icon: Globe,
      title: t("disclaimer.section7Title"),
      color: "cyan",
      content: t("disclaimer.section7Content"),
    },
    {
      icon: Lock,
      title: t("disclaimer.section8Title"),
      color: "emerald",
      content: t("disclaimer.section8Content"),
    },
    {
      icon: RefreshCw,
      title: t("disclaimer.section9Title"),
      color: "cyan",
      content: t("disclaimer.section9Content"),
    },
    {
      icon: Copyright,
      title: t("disclaimer.section10Title"),
      color: "cyan",
      content: t("disclaimer.section10Content"),
    },
    {
      icon: Scale,
      title: t("disclaimer.section11Title"),
      color: "cyan",
      content: t("disclaimer.section11Content"),
    },
    {
      icon: RefreshCw,
      title: t("disclaimer.section12Title"),
      color: "cyan",
      content: t("disclaimer.section12Content"),
    },
    {
      icon: Scale,
      title: t("disclaimer.section13Title"),
      color: "emerald",
      content: t("disclaimer.section13Content"),
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-y-auto">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-xs sm:text-sm tracking-wider">{t("disclaimer.back")}</span>
          </button>
          <div className="text-right">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {t("disclaimer.mainTitle")}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {t("disclaimer.mainSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* 內容區 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* 最後更新日期 */}
        <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[9px] sm:text-[10px] text-white/40 tracking-wider uppercase">
                {t("disclaimer.lastUpdated")}
              </div>
              <div className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
                2026-10-09
              </div>
            </div>
            <Shield size={24} className="text-cyan-400/40" />
          </div>
        </div>

        {/* 前言 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {t("disclaimer.intro")}
          </p>
        </div>

        {/* 13 個章節 */}
        {SECTIONS.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div
              key={idx}
              className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    section.color === "cyan"
                      ? "bg-cyan-400/10 border border-cyan-400/30"
                      : section.color === "emerald"
                      ? "bg-emerald-400/10 border border-emerald-400/30"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      section.color === "cyan"
                        ? "text-cyan-400"
                        : section.color === "emerald"
                        ? "text-emerald-400"
                        : "text-white/60"
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] sm:text-xs text-white/30 tracking-wider uppercase">
                    {t("disclaimer.section")} {idx + 1}
                  </div>
                  <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                    {section.title}
                  </h2>
                </div>
              </div>
              <div className="pl-13 sm:pl-16">
                <div className="text-xs sm:text-sm text-white/60 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </div>
          );
        })}

        {/* 底部確認 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-cyan-400/20 bg-cyan-400/5 mt-6 sm:mt-8">
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm text-white/70">
              {t("disclaimer.agreement")}
            </p>
            <div className="text-[10px] sm:text-xs text-white/40">
              {t("disclaimer.contactInfo")}
            </div>
            <div className="text-xs sm:text-sm text-cyan-400/60 font-mono">
              support@orbit-tower.tw
            </div>
            <button
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all mt-4"
            >
              {t("disclaimer.backToSite")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
