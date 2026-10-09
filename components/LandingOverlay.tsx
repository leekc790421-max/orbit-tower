"use client";

import { useState, useEffect } from "react";
import {
  Building2, Bot, Globe, Users, Search, Share2,
  Workflow, Megaphone, BarChart3, ArrowRight, Zap,
  Eye, MessageSquare, TrendingUp, Shield, Cpu,
  Layers, Rocket, ChevronDown,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LandingOverlayProps {
  onEnter3D: () => void;
  onPricingClick: () => void;
}

/* ============================================================
   GEOMETRIC BACKGROUND — 不規則幾何圖 + 科技商業感
   ============================================================ */
function GeometricBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 主漸變底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-white" />

      {/* 大不規則色塊 */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-[40%_60%_55%_45%_/_50%_45%_55%_50%] bg-gradient-to-br from-blue-100/60 to-cyan-50/40 animate-[float_14s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-[55%_45%_40%_60%_/_60%_50%_50%_40%] bg-gradient-to-bl from-sky-100/50 to-blue-50/30 animate-[float_18s_ease-in-out_infinite_reverse]" />
      <div className="absolute -bottom-20 left-1/4 w-[700px] h-[450px] rounded-[45%_55%_60%_40%_/_40%_55%_45%_60%] bg-gradient-to-t from-indigo-50/40 to-transparent animate-[float_20s_ease-in-out_infinite]" />

      {/* 網格底紋 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(59,130,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.5) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* 不規則多邊形 SVG */}
      <svg className="absolute top-12 left-[8%] w-48 h-48 text-blue-200/30 animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,5 90,25 95,70 60,95 15,80 5,35" fill="currentColor" />
      </svg>
      <svg className="absolute top-[28%] right-[6%] w-40 h-40 text-cyan-200/25 animate-[float_16s_ease-in-out_infinite_reverse]" viewBox="0 0 100 100">
        <polygon points="30,2 75,10 95,50 80,90 25,95 5,55" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-[22%] left-[4%] w-44 h-44 text-sky-200/30 animate-[float_18s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,0 100,38 82,100 18,100 0,38" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-[8%] right-[12%] w-36 h-36 text-indigo-200/20 animate-[float_13s_ease-in-out_infinite_reverse]" viewBox="0 0 100 100">
        <polygon points="25,5 75,5 100,50 75,95 25,95 0,50" fill="currentColor" />
      </svg>
      <svg className="absolute top-[55%] left-[45%] w-28 h-28 text-blue-100/30 animate-[float_15s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,0 80,20 100,60 80,100 20,100 0,60 20,20" fill="currentColor" />
      </svg>

      {/* 科技線條裝飾 */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.06]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <line x1="0" y1="200" x2="1000" y2="350" stroke="url(#lineGrad1)" strokeWidth="1" />
        <line x1="0" y1="600" x2="1000" y2="500" stroke="url(#lineGrad2)" strokeWidth="1" />
        <line x1="200" y1="0" x2="400" y2="1000" stroke="url(#lineGrad1)" strokeWidth="0.5" />
        <line x1="700" y1="0" x2="600" y2="1000" stroke="url(#lineGrad2)" strokeWidth="0.5" />
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* 小圓點裝飾 */}
      <div className="absolute top-[12%] left-[18%] w-2.5 h-2.5 rounded-full bg-blue-300/40" />
      <div className="absolute top-[42%] right-[22%] w-3 h-3 rounded-full bg-cyan-300/35" />
      <div className="absolute bottom-[32%] left-[38%] w-2 h-2 rounded-full bg-indigo-300/40" />
      <div className="absolute top-[58%] left-[68%] w-3.5 h-3.5 rounded-full bg-sky-300/30" />
      <div className="absolute top-[72%] left-[12%] w-2 h-2 rounded-full bg-blue-400/25" />
      <div className="absolute top-[25%] left-[55%] w-1.5 h-1.5 rounded-full bg-cyan-400/30" />

      {/* 細線框裝飾 */}
      <div className="absolute top-[18%] right-[28%] w-24 h-24 border border-blue-200/25 rounded-xl rotate-12" />
      <div className="absolute bottom-[38%] left-[58%] w-20 h-20 border border-cyan-200/20 rounded-full" />
      <div className="absolute top-[48%] left-[6%] w-16 h-16 border border-indigo-200/15 rotate-45 rounded-sm" />
      <div className="absolute top-[8%] left-[42%] w-12 h-12 border border-blue-300/20 rotate-[30deg] rounded-lg" />

      {/* 中心光暈 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gradient-to-r from-blue-100/25 via-cyan-50/15 to-indigo-100/25 blur-[100px]" />
    </div>
  );
}

export default function LandingOverlay({ onEnter3D, onPricingClick }: LandingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <GeometricBg />
      <div className="relative z-10">
        <HeroSection onEnter3D={onEnter3D} onPricingClick={onPricingClick} />
        <ProblemSection />
        <SolutionSection />
        <ShowcaseSection />
        <AutomationSection />
        <FinalCTA onPricingClick={onPricingClick} />
      </div>
    </div>
  );
}

/* ============================================================
    HERO
    ============================================================ */
function HeroSection({ onEnter3D, onPricingClick }: { onEnter3D: () => void; onPricingClick: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-blue-200/60 bg-white/80 backdrop-blur-md mb-8 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-xs sm:text-sm text-blue-600 tracking-wider font-semibold">
            {t("landing.heroBadge")}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-5 sm:mb-7 tracking-tight">
          {t("landing.heroTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-gray-500 mb-4 max-w-2xl mx-auto leading-relaxed font-medium">
          {t("landing.heroSubtitle")}
        </p>

        {/* Features line */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-3">
          {t("landing.heroFeatures").split(" · ").map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-blue-600/80 font-medium">
              {i > 0 && <span className="text-blue-300">·</span>}
              {f}
            </span>
          ))}
        </div>

        {/* Deploy badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/60 mb-10 shadow-sm">
          <Zap size={13} className="text-emerald-500" />
          <span className="text-xs sm:text-sm text-emerald-600 font-semibold">{t("landing.heroDeploy")}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base tracking-wide hover:from-blue-700 hover:to-cyan-600 transition-all shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            {t("landing.heroCta")}
          </button>
          <button
            onClick={onEnter3D}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl border-2 border-gray-200 bg-white/90 text-gray-700 font-semibold text-base tracking-wide hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {t("landing.heroCtaSecondary")}
          </button>
        </div>

        {/* Enter 3D */}
        <button
          onClick={onEnter3D}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 transition-colors tracking-wide group"
        >
          {t("landing.enter3d")}
          <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}

/* ============================================================
    PROBLEM SECTION
    ============================================================ */
function ProblemSection() {
  const { t } = useTranslation();
  const problems = [
    { icon: Eye, title: t("landing.problem1Title"), desc: t("landing.problem1Desc") },
    { icon: MessageSquare, title: t("landing.problem2Title"), desc: t("landing.problem2Desc") },
    { icon: BarChart3, title: t("landing.problem3Title"), desc: t("landing.problem3Desc") },
    { icon: Users, title: t("landing.problem4Title"), desc: t("landing.problem4Desc") },
  ];
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm text-blue-500/70 tracking-[0.3em] uppercase mb-4 font-semibold">
            {t("landing.problemSubtitle")}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("landing.problemTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
          {problems.map((p, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-red-100 bg-white/80 backdrop-blur-sm p-6 sm:p-8 hover:border-red-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <p.icon size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">{p.title}</h3>
                  <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
    SOLUTION SECTION
    ============================================================ */
function SolutionSection() {
  const { t } = useTranslation();
  const solutions = [
    { icon: Bot, title: t("landing.solution1Title"), sub: t("landing.solution1Sub"), desc: t("landing.solution1Desc"), color: "blue" },
    { icon: Building2, title: t("landing.solution2Title"), sub: t("landing.solution2Sub"), desc: t("landing.solution2Desc"), color: "violet" },
    { icon: Globe, title: t("landing.solution3Title"), sub: t("landing.solution3Sub"), desc: t("landing.solution3Desc"), color: "emerald" },
    { icon: TrendingUp, title: t("landing.solution4Title"), sub: t("landing.solution4Sub"), desc: t("landing.solution4Desc"), color: "amber" },
  ];
  const colorMap: Record<string, { card: string; iconBg: string; icon: string; sub: string }> = {
    blue:    { card: "border-blue-100 hover:border-blue-200",   iconBg: "bg-blue-50 border-blue-100",   icon: "text-blue-500",   sub: "text-blue-500/70" },
    violet:  { card: "border-violet-100 hover:border-violet-200", iconBg: "bg-violet-50 border-violet-100", icon: "text-violet-500", sub: "text-violet-500/70" },
    emerald: { card: "border-emerald-100 hover:border-emerald-200", iconBg: "bg-emerald-50 border-emerald-100", icon: "text-emerald-500", sub: "text-emerald-500/70" },
    amber:   { card: "border-amber-100 hover:border-amber-200", iconBg: "bg-amber-50 border-amber-100", icon: "text-amber-500", sub: "text-amber-500/70" },
  };
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm text-blue-500/70 tracking-[0.3em] uppercase mb-4 font-semibold">
            {t("landing.solutionSubtitle")}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("landing.solutionTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-7">
          {solutions.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div
                key={i}
                className={`rounded-2xl border bg-white/80 backdrop-blur-sm p-6 sm:p-8 hover:shadow-lg hover:-translate-y-1 transition-all ${c.card}`}
              >
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-4 ${c.iconBg}`}>
                  <s.icon size={26} className={c.icon} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{s.title}</h3>
                <p className={`text-xs sm:text-sm tracking-wider mb-3 font-semibold ${c.sub}`}>{s.sub}</p>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
    SHOWCASE SECTION
    ============================================================ */
function ShowcaseSection() {
  const { t } = useTranslation();
  const showcases = [
    { title: t("landing.showcase1Title"), sub: t("landing.showcase1Sub"), desc: t("landing.showcase1Desc"), icon: "🏠" },
    { title: t("landing.showcase2Title"), sub: t("landing.showcase2Sub"), desc: t("landing.showcase2Desc"), icon: "💎" },
    { title: t("landing.showcase3Title"), sub: t("landing.showcase3Sub"), desc: t("landing.showcase3Desc"), icon: "💼" },
    { title: t("landing.showcase4Title"), sub: t("landing.showcase4Sub"), desc: t("landing.showcase4Desc"), icon: "🏢" },
  ];
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm text-blue-500/70 tracking-[0.3em] uppercase mb-4 font-semibold">
            {t("landing.showcaseSubtitle")}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("landing.showcaseTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {showcases.map((s, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-6 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">{s.title}</h3>
              <p className="text-xs text-blue-500/60 tracking-wider mb-3 font-semibold">{s.sub}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm text-blue-400 group-hover:text-blue-600 transition-colors font-medium">
                <ArrowRight size={14} />
                <span>{t("landing.viewDemo")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
    AUTOMATION MARKETING MATRIX
    ============================================================ */
function AutomationSection() {
  const { t } = useTranslation();
  const items = [
    { icon: Bot, title: t("landing.auto1Title"), desc: t("landing.auto1Desc") },
    { icon: Search, title: t("landing.auto2Title"), desc: t("landing.auto2Desc") },
    { icon: MessageSquare, title: t("landing.auto3Title"), desc: t("landing.auto3Desc") },
    { icon: Share2, title: t("landing.auto4Title"), desc: t("landing.auto4Desc") },
    { icon: Workflow, title: t("landing.auto5Title"), desc: t("landing.auto5Desc") },
    { icon: Zap, title: t("landing.auto6Title"), desc: t("landing.auto6Desc") },
    { icon: Megaphone, title: t("landing.auto7Title"), desc: t("landing.auto7Desc") },
    { icon: BarChart3, title: t("landing.auto8Title"), desc: t("landing.auto8Desc") },
  ];
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-50/25 to-transparent" />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-xs sm:text-sm text-indigo-500/70 tracking-[0.3em] uppercase mb-4 font-semibold">
            {t("landing.autoSubtitle")}
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            {t("landing.autoTitle")}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">{t("landing.autoDesc")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm p-5 sm:p-6 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3">
                <item.icon size={20} className="text-indigo-500" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
    FINAL CTA
    ============================================================ */
function FinalCTA({ onPricingClick }: { onPricingClick: () => void }) {
  const { t } = useTranslation();
  const stats = [
    { value: t("landing.finalStats1Val"), label: t("landing.finalStats1") },
    { value: t("landing.finalStats2Val"), label: t("landing.finalStats2") },
    { value: t("landing.finalStats3Val"), label: t("landing.finalStats3") },
  ];
  return (
    <section className="relative py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
          {t("landing.finalTitle")}
        </h2>
        <p className="text-sm sm:text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
          {t("landing.finalDesc")}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 sm:gap-14 mb-10 sm:mb-12">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">{s.value}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-base tracking-wide hover:from-blue-700 hover:to-cyan-600 transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-0.5"
          >
            {t("landing.finalCta")}
          </button>
          <button className="w-full sm:w-auto px-10 py-4 rounded-2xl border-2 border-gray-200 bg-white/90 text-gray-700 font-semibold text-base tracking-wide hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            {t("landing.finalCtaSecondary")}
          </button>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-8 border-t border-gray-200/60">
          <p className="text-xs text-gray-400 tracking-wider">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
