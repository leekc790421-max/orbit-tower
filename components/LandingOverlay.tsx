"use client";

import {
  Building2, Bot, Globe, Users, Search, Share2,
  Workflow, Megaphone, BarChart3, ArrowRight, Zap,
  Eye, MessageSquare, TrendingUp, ChevronDown,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LandingOverlayProps {
  onEnter3D: () => void;
  onPricingClick: () => void;
}

/* ============================================================
   深色毛玻璃背景 — 讓 3D 大樓隱約可見
   ============================================================ */
function DarkGlassBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 深色漸變底色 */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95" />

      {/* 不規則深色色塊 */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-[40%_60%_55%_45%_/_50%_45%_55%_50%] bg-gradient-to-br from-cyan-900/20 to-blue-900/10 animate-[float_14s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-[55%_45%_40%_60%_/_60%_50%_50%_40%] bg-gradient-to-bl from-indigo-900/15 to-slate-900/10 animate-[float_18s_ease-in-out_infinite_reverse]" />
      <div className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-[45%_55%_60%_40%_/_40%_55%_45%_60%] bg-gradient-to-t from-cyan-900/10 to-transparent animate-[float_20s_ease-in-out_infinite]" />

      {/* 網格底紋 */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      {/* 不規則多邊形 SVG */}
      <svg className="absolute top-12 left-[8%] w-32 h-32 sm:w-48 sm:h-48 text-cyan-500/10 animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,5 90,25 95,70 60,95 15,80 5,35" fill="currentColor" />
      </svg>
      <svg className="absolute top-[28%] right-[6%] w-28 h-28 sm:w-40 sm:h-40 text-cyan-400/8 animate-[float_16s_ease-in-out_infinite_reverse]" viewBox="0 0 100 100">
        <polygon points="30,2 75,10 95,50 80,90 25,95 5,55" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-[22%] left-[4%] w-32 h-32 sm:w-44 sm:h-44 text-blue-400/8 animate-[float_18s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,0 100,38 82,100 18,100 0,38" fill="currentColor" />
      </svg>

      {/* 科技線條裝飾 */}
      <svg className="absolute top-0 left-0 w-full h-full opacity-[0.05]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <line x1="0" y1="200" x2="1000" y2="350" stroke="url(#lineGrad1)" strokeWidth="1" />
        <line x1="0" y1="600" x2="1000" y2="500" stroke="url(#lineGrad2)" strokeWidth="1" />
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      {/* 發光圓點 */}
      <div className="absolute top-[12%] left-[18%] w-2 h-2 rounded-full bg-cyan-400/30" />
      <div className="absolute top-[42%] right-[22%] w-2.5 h-2.5 rounded-full bg-cyan-300/25" />
      <div className="absolute bottom-[32%] left-[38%] w-1.5 h-1.5 rounded-full bg-blue-400/30" />
      <div className="absolute top-[58%] left-[68%] w-2 h-2 rounded-full bg-cyan-400/20" />

      {/* 中心光暈 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-indigo-500/5 blur-[80px]" />
    </div>
  );
}

export default function LandingOverlay({ onEnter3D, onPricingClick }: LandingOverlayProps) {
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <DarkGlassBg />
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
   通用毛玻璃卡片樣式
   ============================================================ */
const glassCard = "rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md";
const glassCardHover = "hover:border-cyan-400/30 hover:bg-white/[0.06] transition-all";

/* ============================================================
   HERO
   ============================================================ */
function HeroSection({ onEnter3D, onPricingClick }: { onEnter3D: () => void; onPricingClick: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-6 pt-16 sm:pt-0 overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-md mb-5 sm:mb-8">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] sm:text-sm text-cyan-300 tracking-wider font-semibold">
            {t("landing.heroBadge")}
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-2xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.15] mb-3 sm:mb-6 tracking-tight">
          {t("landing.heroTitle")}
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-xl text-white/50 mb-3 sm:mb-4 max-w-2xl mx-auto leading-relaxed">
          {t("landing.heroSubtitle")}
        </p>

        {/* Features line */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3 mb-2 sm:mb-3">
          {t("landing.heroFeatures").split(" · ").map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-[10px] sm:text-sm text-cyan-400/70 font-medium">
              {i > 0 && <span className="text-cyan-400/30">·</span>}
              {f}
            </span>
          ))}
        </div>

        {/* Deploy badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-400/5 border border-emerald-400/20 mb-6 sm:mb-10">
          <Zap size={11} className="text-emerald-400" />
          <span className="text-[10px] sm:text-sm text-emerald-400/80 font-semibold">{t("landing.heroDeploy")}</span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm sm:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5"
          >
            {t("landing.heroCta")}
          </button>
          <button
            onClick={onEnter3D}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 text-white/80 font-semibold text-sm sm:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5"
          >
            {t("landing.heroCtaSecondary")}
          </button>
        </div>

        {/* Enter 3D */}
        <button
          onClick={onEnter3D}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/30 hover:text-cyan-400 transition-colors tracking-wide group"
        >
          {t("landing.enter3d")}
          <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />
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
    <section className="relative py-8 sm:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[10px] sm:text-sm text-cyan-400/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 font-semibold">
            {t("landing.problemSubtitle")}
          </p>
          <h2 className="text-lg sm:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.problemTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-5">
          {problems.map((p, i) => (
            <div
              key={i}
              className={`group relative ${glassCard} ${glassCardHover} p-3 sm:p-6 border-red-400/10 hover:border-red-400/30`}
            >
              <div className="flex items-start gap-3 sm:gap-5">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-400/5 border border-red-400/15 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <p.icon size={16} className="text-red-400/70 sm:text-red-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white/90 mb-1 sm:mb-2">{p.title}</h3>
                  <p className="text-[11px] sm:text-sm text-white/40 leading-relaxed">{p.desc}</p>
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
    { icon: Building2, title: t("landing.solution2Title"), sub: t("landing.solution2Sub"), desc: t("landing.solution2Desc"), color: "violet" },
    { icon: Globe, title: t("landing.solution3Title"), sub: t("landing.solution3Sub"), desc: t("landing.solution3Desc"), color: "emerald" },
    { icon: TrendingUp, title: t("landing.solution4Title"), sub: t("landing.solution4Sub"), desc: t("landing.solution4Desc"), color: "amber" },
  ];
  const colorMap: Record<string, { border: string; iconBg: string; icon: string; sub: string }> = {
    cyan:    { border: "hover:border-cyan-400/30",    iconBg: "bg-cyan-400/5 border-cyan-400/20",    icon: "text-cyan-400",    sub: "text-cyan-400/60" },
    violet:  { border: "hover:border-violet-400/30",  iconBg: "bg-violet-400/5 border-violet-400/20",  icon: "text-violet-400",  sub: "text-violet-400/60" },
    emerald: { border: "hover:border-emerald-400/30", iconBg: "bg-emerald-400/5 border-emerald-400/20", icon: "text-emerald-400", sub: "text-emerald-400/60" },
    amber:   { border: "hover:border-amber-400/30",   iconBg: "bg-amber-400/5 border-amber-400/20",   icon: "text-amber-400",   sub: "text-amber-400/60" },
  };
  return (
    <section className="relative py-8 sm:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[10px] sm:text-sm text-cyan-400/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 font-semibold">
            {t("landing.solutionSubtitle")}
          </p>
          <h2 className="text-lg sm:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.solutionTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-5">
          {solutions.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div
                key={i}
                className={`${glassCard} ${c.border} p-3 sm:p-6 hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all`}
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border flex items-center justify-center mb-2 sm:mb-4 ${c.iconBg}`}>
                  <s.icon size={16} className={`${c.icon} sm:w-[22px] sm:h-[22px]`} />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white/90 mb-0.5 sm:mb-1">{s.title}</h3>
                <p className={`text-[10px] sm:text-xs tracking-wider mb-1.5 sm:mb-3 font-semibold ${c.sub}`}>{s.sub}</p>
                <p className="text-[11px] sm:text-sm text-white/40 leading-relaxed">{s.desc}</p>
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
    <section className="relative py-8 sm:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[10px] sm:text-sm text-cyan-400/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 font-semibold">
            {t("landing.showcaseSubtitle")}
          </p>
          <h2 className="text-lg sm:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.showcaseTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {showcases.map((s, i) => (
            <div
              key={i}
              className={`group ${glassCard} ${glassCardHover} p-2.5 sm:p-5 cursor-pointer hover:-translate-y-0.5`}
            >
              <div className="text-xl sm:text-3xl mb-1.5 sm:mb-3">{s.icon}</div>
              <h3 className="text-xs sm:text-base font-bold text-white/90 mb-0.5 sm:mb-1">{s.title}</h3>
              <p className="text-[9px] sm:text-xs text-cyan-400/50 tracking-wider mb-1.5 sm:mb-2 font-semibold">{s.sub}</p>
              <p className="text-[10px] sm:text-sm text-white/40 leading-relaxed line-clamp-2">{s.desc}</p>
              <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-sm text-cyan-400/60 group-hover:text-cyan-400 transition-colors font-medium">
                <ArrowRight size={11} />
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
    <section className="relative py-8 sm:py-20 px-3 sm:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-6 sm:mb-12">
          <p className="text-[10px] sm:text-sm text-indigo-400/50 tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-2 sm:mb-4 font-semibold">
            {t("landing.autoSubtitle")}
          </p>
          <h2 className="text-lg sm:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-4">
            {t("landing.autoTitle")}
          </h2>
          <p className="text-[11px] sm:text-base text-white/40 max-w-xl mx-auto">{t("landing.autoDesc")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${glassCard} ${glassCardHover} p-2.5 sm:p-5`}
            >
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-indigo-400/5 border border-indigo-400/15 flex items-center justify-center mb-1.5 sm:mb-3">
                <item.icon size={14} className="text-indigo-400 sm:w-[18px] sm:h-[18px]" />
              </div>
              <h3 className="text-[11px] sm:text-sm font-bold text-white/80 mb-1 sm:mb-2">{item.title}</h3>
              <p className="text-[10px] sm:text-xs text-white/40 leading-relaxed line-clamp-2">{item.desc}</p>
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
    <section className="relative py-10 sm:py-20 px-3 sm:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight mb-3 sm:mb-5">
          {t("landing.finalTitle")}
        </h2>
        <p className="text-[11px] sm:text-lg text-white/40 mb-6 sm:mb-10 max-w-lg mx-auto leading-relaxed">
          {t("landing.finalDesc")}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 sm:gap-12 mb-6 sm:mb-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-xl sm:text-3xl font-extrabold text-cyan-400">{s.value}</div>
              <div className="text-[9px] sm:text-sm text-white/30 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm sm:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5"
          >
            {t("landing.finalCta")}
          </button>
          <button className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 text-white/80 font-semibold text-sm sm:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5">
            {t("landing.finalCtaSecondary")}
          </button>
        </div>

        {/* Bottom */}
        <div className="mt-10 sm:mt-16 pt-4 sm:pt-8 border-t border-white/10">
          <p className="text-[10px] sm:text-xs text-white/20 tracking-wider">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
