"use client";

import { useState } from "react";
import {
  Building2, Bot, Globe, Users, Search, Share2,
  Workflow, Megaphone, BarChart3, ArrowRight, Zap,
  Eye, MessageSquare, TrendingUp,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LandingOverlayProps {
  onEnter3D: () => void;
  onPricingClick: () => void;
}

export default function LandingOverlay({ onEnter3D, onPricingClick }: LandingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-[#050510]">
      {/* HERO */}
      <HeroSection onEnter3D={onEnter3D} onPricingClick={onPricingClick} />
      {/* PROBLEM */}
      <ProblemSection />
      {/* SOLUTION */}
      <SolutionSection />
      {/* SHOWCASE */}
      <ShowcaseSection />
      {/* AUTOMATION */}
      <AutomationSection />
      {/* FINAL CTA */}
      <FinalCTA onPricingClick={onPricingClick} />
    </div>
  );
}

/* ============================================================
   HERO
   ============================================================ */
function HeroSection({ onEnter3D, onPricingClick }: { onEnter3D: () => void; onPricingClick: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* BG effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-purple-900/10" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 mb-6 sm:mb-8">
          <Globe size={12} className="text-cyan-400" />
          <span className="text-[10px] sm:text-xs text-cyan-300 tracking-wider font-medium">
            {t("landing.heroBadge")}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6 tracking-wide">
          {t("landing.heroTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-white/60 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed">
          {t("landing.heroSubtitle")}
        </p>

        {/* Features line */}
        <p className="text-[10px] sm:text-xs text-cyan-400/60 tracking-wider mb-2">
          {t("landing.heroFeatures")}
        </p>

        {/* Deploy badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/30 mb-8 sm:mb-10">
          <Zap size={11} className="text-emerald-400" />
          <span className="text-[10px] sm:text-xs text-emerald-300 font-medium">{t("landing.heroDeploy")}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold text-sm tracking-wider hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-400/25"
          >
            {t("landing.heroCta")}
          </button>
          <button
            onClick={onEnter3D}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 text-white/80 font-medium text-sm tracking-wider hover:border-cyan-400/50 hover:text-cyan-300 transition-all"
          >
            {t("landing.heroCtaSecondary")}
          </button>
        </div>

        {/* Enter 3D */}
        <button
          onClick={onEnter3D}
          className="text-xs text-white/30 hover:text-cyan-400 transition-colors tracking-wider"
        >
          {t("landing.enter3d")}
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
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs text-cyan-400/50 tracking-[0.3em] uppercase mb-3">
            {t("landing.problemSubtitle")}
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide">
            {t("landing.problemTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-5 sm:p-6 hover:border-red-400/25 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center flex-shrink-0">
                  <p.icon size={18} className="text-red-400/70" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{p.title}</h3>
                  <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed">{p.desc}</p>
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
    { icon: Bot, title: t("landing.solution1Title"), sub: t("landing.solution1Sub"), desc: t("landing.solution1Desc"), color: "cyan" },
    { icon: Building2, title: t("landing.solution2Title"), sub: t("landing.solution2Sub"), desc: t("landing.solution2Desc"), color: "purple" },
    { icon: Globe, title: t("landing.solution3Title"), sub: t("landing.solution3Sub"), desc: t("landing.solution3Desc"), color: "emerald" },
    { icon: TrendingUp, title: t("landing.solution4Title"), sub: t("landing.solution4Sub"), desc: t("landing.solution4Desc"), color: "amber" },
  ];
  const colorMap: Record<string, string> = {
    cyan: "border-cyan-400/20 bg-cyan-400/5",
    purple: "border-purple-400/20 bg-purple-400/5",
    emerald: "border-emerald-400/20 bg-emerald-400/5",
    amber: "border-amber-400/20 bg-amber-400/5",
  };
  const iconColor: Record<string, string> = {
    cyan: "text-cyan-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
  };
  return (
    <section className="py-16 sm:py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs text-cyan-400/50 tracking-[0.3em] uppercase mb-3">
            {t("landing.solutionSubtitle")}
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide">
            {t("landing.solutionTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {solutions.map((s, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-5 sm:p-6 hover:scale-[1.02] transition-all ${colorMap[s.color]}`}
            >
              <s.icon size={24} className={`${iconColor[s.color]} mb-3`} />
              <h3 className="text-sm sm:text-base font-bold text-white mb-1">{s.title}</h3>
              <p className="text-[10px] sm:text-xs text-cyan-400/60 tracking-wider mb-2">{s.sub}</p>
              <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed">{s.desc}</p>
            </div>
          ))}
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
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs text-cyan-400/50 tracking-[0.3em] uppercase mb-3">
            {t("landing.showcaseSubtitle")}
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide">
            {t("landing.showcaseTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showcases.map((s, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-cyan-400/30 hover:bg-cyan-400/[0.03] transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3">{s.icon}</div>
              <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5">{s.title}</h3>
              <p className="text-[10px] text-cyan-400/60 tracking-wider mb-2">{s.sub}</p>
              <p className="text-[10px] sm:text-[11px] text-white/40 leading-relaxed">{s.desc}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-cyan-400/50 group-hover:text-cyan-400 transition-colors">
                <ArrowRight size={10} />
                <span>View Demo</span>
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
    <section className="py-16 sm:py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-xs text-purple-400/50 tracking-[0.3em] uppercase mb-3">
            {t("landing.autoSubtitle")}
          </p>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide mb-3">
            {t("landing.autoTitle")}
          </h2>
          <p className="text-[11px] sm:text-xs text-white/40 max-w-xl mx-auto">{t("landing.autoDesc")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4 hover:border-purple-400/30 hover:bg-purple-400/[0.03] transition-all"
            >
              <item.icon size={18} className="text-purple-400/70 mb-2.5" />
              <h3 className="text-[11px] sm:text-xs font-bold text-white mb-1">{item.title}</h3>
              <p className="text-[10px] text-white/40 leading-relaxed">{item.desc}</p>
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
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-white tracking-wide mb-4">
          {t("landing.finalTitle")}
        </h2>
        <p className="text-[11px] sm:text-sm text-white/50 mb-8 max-w-lg mx-auto">
          {t("landing.finalDesc")}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-8 sm:mb-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl font-bold text-cyan-300">{s.value}</div>
              <div className="text-[9px] sm:text-[10px] text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-bold text-sm tracking-wider hover:from-cyan-300 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-400/25"
          >
            {t("landing.finalCta")}
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 text-white/80 font-medium text-sm tracking-wider hover:border-cyan-400/50 hover:text-cyan-300 transition-all">
            {t("landing.finalCtaSecondary")}
          </button>
        </div>

        {/* Bottom spacer */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[9px] text-white/20 tracking-wider">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
