"use client";

import { ArrowLeft, Shield, Lock, Database, Eye, Users, Cookie, Mail, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { I18nProvider, useTranslation } from "@/lib/i18n";

function PrivacyContent() {
  const { t } = useTranslation();
  const [lastUpdated, setLastUpdated] = useState("2026-10-09");

  useEffect(() => {
    // 從 API 讀取最後更新日期
    fetch("/api/system-update")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.privacy) {
          setLastUpdated(data.data.privacy);
        }
      })
      .catch(() => {
        // 使用預設日期
      });
  }, []);

  const SECTIONS = [
    {
      icon: Shield,
      title: t("privacy.section1Title"),
      color: "cyan",
      content: t("privacy.section1Content"),
    },
    {
      icon: Database,
      title: t("privacy.section2Title"),
      color: "emerald",
      content: t("privacy.section2Content"),
    },
    {
      icon: Eye,
      title: t("privacy.section3Title"),
      color: "cyan",
      content: t("privacy.section3Content"),
    },
    {
      icon: Users,
      title: t("privacy.section4Title"),
      color: "cyan",
      content: t("privacy.section4Content"),
    },
    {
      icon: Cookie,
      title: t("privacy.section5Title"),
      color: "emerald",
      content: t("privacy.section5Content"),
    },
    {
      icon: Lock,
      title: t("privacy.section6Title"),
      color: "cyan",
      content: t("privacy.section6Content"),
    },
    {
      icon: Mail,
      title: t("privacy.section7Title"),
      color: "cyan",
      content: t("privacy.section7Content"),
    },
    {
      icon: RefreshCw,
      title: t("privacy.section8Title"),
      color: "cyan",
      content: t("privacy.section8Content"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-xs sm:text-sm tracking-wider">{t("privacy.back")}</span>
          </Link>
          <div className="text-right">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {t("privacy.mainTitle")}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {t("privacy.mainSubtitle")}
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
                {t("privacy.lastUpdated")}
              </div>
              <div className="text-xs sm:text-sm text-cyan-300 font-mono mt-1">
                {lastUpdated}
              </div>
            </div>
            <Shield size={24} className="text-cyan-400/40" />
          </div>
        </div>

        {/* 前言 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10">
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
            {t("privacy.intro")}
          </p>
        </div>

        {/* 章節 */}
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
                    {t("privacy.section")} {idx + 1}
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

        {/* 底部 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-cyan-400/20 bg-cyan-400/5 mt-6 sm:mt-8">
          <div className="text-center space-y-3">
            <p className="text-xs sm:text-sm text-white/70">
              {t("privacy.agreement")}
            </p>
            <div className="text-[10px] sm:text-xs text-white/40">
              {t("privacy.contactInfo")}
            </div>
            <div className="text-xs sm:text-sm text-cyan-400/60 font-mono">
              support@orbit-tower.tw
            </div>
            <Link
              href="/"
              className="inline-block w-full sm:w-auto px-8 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-xs sm:text-sm font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all mt-4"
            >
              {t("privacy.backToSite")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <I18nProvider>
      <PrivacyContent />
    </I18nProvider>
  );
}
