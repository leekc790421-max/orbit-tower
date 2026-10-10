"use client";

import { useState } from "react";
import {
  Building2, Bot, Globe, Users, Search, Share2,
  Workflow, Megaphone, BarChart3, ArrowRight, Zap, X,
  Eye, MessageSquare, TrendingUp, ChevronDown,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface LandingOverlayProps {
  onEnter3D: () => void;
  onPricingClick: () => void;
}

function DarkGlassBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-slate-900/95" />

      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-[40%_60%_55%_45%_/_50%_45%_55%_50%] bg-gradient-to-br from-cyan-300/25 to-blue-300/15 animate-[float_14s_ease-in-out_infinite]" />
      <div className="absolute top-1/3 -right-48 w-[400px] h-[400px] rounded-[55%_45%_40%_60%_/_60%_50%_50%_40%] bg-gradient-to-bl from-blue-300/20 to-white/10 animate-[float_18s_ease-in-out_infinite_reverse]" />
      <div className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-[45%_55%_60%_40%_/_40%_55%_45%_60%] bg-gradient-to-t from-sky-300/20 to-transparent animate-[float_20s_ease-in-out_infinite]" />

      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(14,116,204,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(14,116,204,0.22) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <svg className="absolute top-12 left-[8%] w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 text-cyan-500/10 animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,5 90,25 95,70 60,95 15,80 5,35" fill="currentColor" />
      </svg>
      <svg className="absolute top-[28%] right-[6%] w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 text-cyan-400/8 animate-[float_16s_ease-in-out_infinite_reverse]" viewBox="0 0 100 100">
        <polygon points="30,2 75,10 95,50 80,90 25,95 5,55" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-[22%] left-[4%] w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 text-blue-400/8 animate-[float_18s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,0 100,38 82,100 18,100 0,38" fill="currentColor" />
      </svg>

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

      <div className="absolute top-[12%] left-[18%] w-2 h-2 rounded-full bg-cyan-400/30" />
      <div className="absolute top-[42%] right-[22%] w-2.5 h-2.5 rounded-full bg-cyan-300/25" />
      <div className="absolute bottom-[32%] left-[38%] w-1.5 h-1.5 rounded-full bg-blue-400/30" />
      <div className="absolute top-[58%] left-[68%] w-2 h-2 rounded-full bg-cyan-400/20" />

      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-to-r from-cyan-500/5 via-blue-500/3 to-indigo-500/5 blur-[80px]" />
    </div>
  );
}

export default function LandingOverlay({ onEnter3D, onPricingClick }: LandingOverlayProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {!expanded && (
        <div className="fixed left-2 top-[4.5rem] z-[45] pointer-events-none sm:left-4 sm:top-20">
          <button
            type="button"
            aria-expanded={false}
            onClick={() => setExpanded(true)}
            className="glass-panel hud-border pointer-events-auto flex min-h-10 items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-cyan-100 shadow-lg transition hover:border-cyan-300/60 hover:bg-cyan-950/80"
          >
            <Building2 size={15} aria-hidden="true" />
            <span>{t("landing.openGuide")}</span>
            <ChevronDown size={13} aria-hidden="true" />
          </button>
        </div>
      )}

      {expanded && (
        <div className="orbit-landing fixed inset-0 z-[60] pointer-events-none">
          <aside
            aria-label={t("landing.heroTitle")}
            className="orbit-landing-drawer fixed inset-y-0 left-0 overflow-x-hidden overflow-y-auto overscroll-contain pointer-events-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <DarkGlassBg />
            <button
              type="button"
              aria-label={t("landing.closeGuide")}
              onClick={() => setExpanded(false)}
              className="orbit-landing-close fixed top-3 z-[70] ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/30 bg-slate-950/80 text-white/80 backdrop-blur-md transition hover:border-cyan-200 hover:text-white"
            >
              <X size={16} aria-hidden="true" />
            </button>
            <div className="relative z-10 pointer-events-none">
              <HeroSection
                onEnter3D={() => {
                  setExpanded(false);
                  onEnter3D();
                }}
                onPricingClick={onPricingClick}
              />
              <ProblemSection />
              <SolutionSection />
              <ShowcaseSection />
              <AutomationSection />
              <FinalCTA onPricingClick={onPricingClick} />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

const glassCard = "rounded-lg sm:rounded-xl md:rounded-2xl border border-blue-900/[0.12] bg-white/65 backdrop-blur-md";
const glassCardHover = "hover:border-cyan-400/30 hover:bg-white/90 transition-all";

function HeroSection({ onEnter3D, onPricingClick }: { onEnter3D: () => void; onPricingClick: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 pt-14 sm:pt-0 overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-md mb-3 sm:mb-6 md:mb-8">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[9px] sm:text-[11px] md:text-sm text-cyan-300 tracking-wider font-semibold">
            {t("landing.heroBadge")}
          </span>
        </div>

        <h1 className="text-xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.15] mb-2 sm:mb-4 md:mb-6 tracking-tight">
          {t("landing.heroTitle")}
        </h1>

        <p className="text-[11px] sm:text-base md:text-xl text-slate-900/50 mb-2 sm:mb-3 md:mb-4 max-w-2xl mx-auto leading-[1.4]">
          {t("landing.heroSubtitle")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
          {t("landing.heroFeatures").split(" · ").map((f, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 sm:gap-0.5 md:gap-1 text-[9px] sm:text-[11px] md:text-sm text-cyan-400/70 font-medium">
              {i > 0 && <span className="text-cyan-400/30">·</span>}
              {f}
            </span>
          ))}
        </div>

        <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full bg-emerald-400/5 border border-emerald-400/20 mb-4 sm:mb-8 md:mb-10">
          <Zap size={10} className="text-emerald-400 sm:w-[11px] sm:h-[11px] md:w-3 md:h-3" />
          <span className="text-[9px] sm:text-[11px] md:text-sm text-emerald-400/80 font-semibold">{t("landing.heroDeploy")}</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 mb-5 sm:mb-10 md:mb-12 px-3">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5"
          >
            {t("landing.heroCta")}
          </button>
          <button
            onClick={onEnter3D}
            className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl border border-blue-900/20 bg-white/5 text-slate-900/80 font-semibold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5"
          >
            {t("landing.heroCtaSecondary")}
          </button>
        </div>

        <button
          onClick={onEnter3D}
          className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-900/30 hover:text-cyan-400 transition-colors tracking-wide group"
        >
          {t("landing.enter3d")}
          <ChevronDown size={11} className="group-hover:translate-y-0.5 transition-transform sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
        </button>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { t } = useTranslation();
  const problems = [
    { icon: Eye, title: t("landing.problem1Title"), desc: t("landing.problem1Desc") },
    { icon: MessageSquare, title: t("landing.problem2Title"), desc: t("landing.problem2Desc") },
    { icon: BarChart3, title: t("landing.problem3Title"), desc: t("landing.problem3Desc") },
    { icon: Users, title: t("landing.problem4Title"), desc: t("landing.problem4Desc") },
  ];
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-cyan-400/50 tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">
            {t("landing.problemSubtitle")}
          </p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.problemTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-5">
          {problems.map((p, i) => (
            <div
              key={i}
              className={`group relative ${glassCard} ${glassCardHover} p-3 sm:p-4 md:p-6 border-red-400/10 hover:border-red-400/30`}
            >
              <div className="flex items-start gap-2.5 sm:gap-4 md:gap-5">
                <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-xl bg-red-400/5 border border-red-400/15 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <p.icon size={14} className="text-red-400/70 sm:w-[16px] sm:h-[16px] md:w-5 md:h-5 md:text-red-400" />
                </div>
                <div>
                  <h3 className="text-[13px] sm:text-[14px] md:text-base font-bold text-slate-900/90 mb-0.5 sm:mb-1.5 md:mb-2 leading-snug">{p.title}</h3>
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-900/40 leading-[1.4]">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-cyan-400/50 tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">
            {t("landing.solutionSubtitle")}
          </p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.solutionTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-5">
          {solutions.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <div
                key={i}
                className={`${glassCard} ${c.border} p-3 sm:p-4 md:p-6 hover:bg-white/90 hover:-translate-y-0.5 transition-all`}
              >
                <div className={`w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-xl border flex items-center justify-center mb-1.5 sm:mb-3 md:mb-4 ${c.iconBg}`}>
                  <s.icon size={14} className={`${c.icon} sm:w-[16px] sm:h-[16px] md:w-5 md:h-5`} />
                </div>
                <h3 className="text-[13px] sm:text-[14px] md:text-base font-bold text-slate-900/90 mb-0.5 sm:mb-1 md:mb-1 leading-snug">{s.title}</h3>
                <p className={`text-[9px] sm:text-[10px] md:text-xs tracking-wider mb-1 sm:mb-2 md:mb-3 font-semibold ${c.sub}`}>{s.sub}</p>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-900/40 leading-[1.4]">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ShowcaseSection() {
  const { t } = useTranslation();
  const showcases = [
    { title: t("landing.showcase1Title"), sub: t("landing.showcase1Sub"), desc: t("landing.showcase1Desc"), icon: "🏠" },
    { title: t("landing.showcase2Title"), sub: t("landing.showcase2Sub"), desc: t("landing.showcase2Desc"), icon: "💎" },
    { title: t("landing.showcase3Title"), sub: t("landing.showcase3Sub"), desc: t("landing.showcase3Desc"), icon: "💼" },
    { title: t("landing.showcase4Title"), sub: t("landing.showcase4Sub"), desc: t("landing.showcase4Desc"), icon: "🏢" },
  ];
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-cyan-400/50 tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">
            {t("landing.showcaseSubtitle")}
          </p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">
            {t("landing.showcaseTitle")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5">
          {showcases.map((s, i) => (
            <div
              key={i}
              className={`group ${glassCard} ${glassCardHover} p-2.5 sm:p-4 md:p-5 cursor-pointer hover:-translate-y-0.5`}
            >
              <div className="text-lg sm:text-2xl md:text-3xl mb-1 sm:mb-2 md:mb-3">{s.icon}</div>
              <h3 className="text-[11px] sm:text-[13px] md:text-base font-bold text-slate-900/90 mb-0.5 sm:mb-0.5 md:mb-1 leading-snug">{s.title}</h3>
              <p className="text-[8px] sm:text-[10px] md:text-xs text-cyan-400/50 tracking-wider mb-1 sm:mb-1.5 md:mb-2 font-semibold">{s.sub}</p>
              <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/40 leading-[1.4] line-clamp-2">{s.desc}</p>
              <div className="mt-1.5 sm:mt-2 md:mt-3 flex items-center gap-1 text-[9px] sm:text-[10px] md:text-sm text-cyan-400/60 group-hover:text-cyan-400 transition-colors font-medium">
                <ArrowRight size={10} className="sm:w-[11px] sm:h-[11px] md:w-3 md:h-3" />
                <span>{t("landing.viewDemo")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-indigo-400/50 tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">
            {t("landing.autoSubtitle")}
          </p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight mb-1.5 sm:mb-3 md:mb-4">
            {t("landing.autoTitle")}
          </h2>
          <p className="text-[11px] sm:text-sm md:text-base text-slate-900/40 max-w-xl mx-auto leading-[1.4]">{t("landing.autoDesc")}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className={`${glassCard} ${glassCardHover} p-2 sm:p-3.5 md:p-5`}
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl md:rounded-xl bg-indigo-400/5 border border-indigo-400/15 flex items-center justify-center mb-1 sm:mb-2 md:mb-3">
                <item.icon size={12} className="text-indigo-400 sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]" />
              </div>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900/80 mb-0.5 sm:mb-1.5 md:mb-2 leading-snug">{item.title}</h3>
              <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-900/40 leading-[1.4] line-clamp-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onPricingClick }: { onPricingClick: () => void }) {
  const { t } = useTranslation();
  const stats = [
    { value: t("landing.finalStats1Val"), label: t("landing.finalStats1") },
    { value: t("landing.finalStats2Val"), label: t("landing.finalStats2") },
    { value: t("landing.finalStats3Val"), label: t("landing.finalStats3") },
  ];
  return (
    <section className="relative py-8 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-4 md:mb-5">
          {t("landing.finalTitle")}
        </h2>
        <p className="text-[11px] sm:text-sm md:text-lg text-slate-900/40 mb-4 sm:mb-8 md:mb-10 max-w-lg mx-auto leading-[1.4]">
          {t("landing.finalDesc")}
        </p>

        <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-12 mb-5 sm:mb-8 md:mb-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-cyan-400 led-pulse font-mono-data">{s.value}</div>
              <div className="text-[8px] sm:text-[10px] md:text-sm text-slate-900/30 mt-0.5 sm:mt-0.5 md:mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* LED 動態數據跑馬燈 */}
        <div className="led-ticker glass-hud-premium rounded-lg px-4 py-2 mb-5 sm:mb-8 md:mb-10 max-w-2xl mx-auto hud-border">
          <div className="led-ticker-content text-[10px] sm:text-xs text-cyan-400/80 font-mono-data">
            <span className="led-blink">⚡</span> 35ms 響應時間 &nbsp;|&nbsp; 
            <span className="led-blink">🔒</span> 100% 沙盒隔離 &nbsp;|&nbsp; 
            <span className="led-blink">🌐</span> 中英日三語支援 &nbsp;|&nbsp; 
            <span className="led-blink">⚡</span> 7天快速部署 &nbsp;|&nbsp; 
            <span className="led-blink">🔒</span> SOC2 合規 &nbsp;|&nbsp; 
            <span className="led-blink">🌐</span> 全球 CDN 加速 &nbsp;|&nbsp; 
            <span className="led-blink">⚡</span> 99.9% 在線率 &nbsp;|&nbsp; 
            <span className="led-blink">🔒</span> 端到端加密
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 px-3">
          <button
            onClick={onPricingClick}
            className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5"
          >
            {t("landing.finalCta")}
          </button>
          <button className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl border border-blue-900/20 bg-white/5 text-slate-900/80 font-semibold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5">
            {t("landing.finalCtaSecondary")}
          </button>
        </div>

        <div className="orbit-line-contact mt-6 sm:mt-10 mx-auto flex items-center justify-center gap-3 sm:gap-4 rounded-xl border border-cyan-400/20 bg-white/80 p-3 sm:p-4 text-left backdrop-blur-md">
          <img src="/logo-light.jpg" alt="光曜星樞 SNT Logo" className="h-14 w-12 sm:h-16 sm:w-14 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-900">光曜星樞 SNT</div>
            <div className="mt-0.5 text-[9px] sm:text-[10px] leading-relaxed text-slate-900/50">掃描 QR Code，或直接加入 LINE 聯絡我們</div>
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-2.5 py-1.5 text-[9px] font-bold text-white transition hover:brightness-110">
              <span aria-hidden="true">LINE</span> 即時諮詢
            </a>
          </div>
          <img src="/line-qr.png" alt="加入光曜星樞 LINE 的 QR Code" className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-white p-1" />
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 pt-3 sm:pt-6 md:pt-8 border-t border-white/10">
          <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-900/20 tracking-wider">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
