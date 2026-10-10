"use client";

import { useState } from "react";
import {
  Building2, Bot, Globe, Users, Shield, BarChart3,
  ArrowRight, Zap, X, ChevronDown, CheckCircle2,
  Headphones, FileText, FolderKanban, Activity,
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
      <svg className="absolute top-12 left-[8%] w-32 h-32 sm:w-40 sm:h-40 text-cyan-500/10 animate-[float_12s_ease-in-out_infinite]" viewBox="0 0 100 100">
        <polygon points="50,5 90,25 95,70 60,95 15,80 5,35" fill="currentColor" />
      </svg>
      <svg className="absolute top-[28%] right-[6%] w-28 h-28 sm:w-36 sm:h-36 text-cyan-400/8 animate-[float_16s_ease-in-out_infinite_reverse]" viewBox="0 0 100 100">
        <polygon points="30,2 75,10 95,50 80,90 25,95 5,55" fill="currentColor" />
      </svg>
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
              <HeroSection onEnter3D={() => { setExpanded(false); onEnter3D(); }} onPricingClick={onPricingClick} />
              <GoalsSection />
              <DepartmentsSection />
              <OutcomesSection onPricingClick={onPricingClick} />
              <ComparisonSection />
              <CasesSection />
              <RoadmapSection />
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

/* ─── HERO ─── */
function HeroSection({ onEnter3D, onPricingClick }: { onEnter3D: () => void; onPricingClick: () => void }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 pt-14 sm:pt-0 overflow-hidden">
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full border border-cyan-400/30 bg-cyan-400/5 backdrop-blur-md mb-3 sm:mb-6 md:mb-8">
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

        <p className="text-[10px] sm:text-sm md:text-base text-cyan-400/60 mb-4 sm:mb-6 md:mb-8 max-w-xl mx-auto leading-[1.4]">
          {t("landing.heroDesc")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 md:mb-3">
          {t("landing.heroFeatures").split(" · ").map((f, i) => (
            <span key={i} className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[11px] md:text-sm text-cyan-400/70 font-medium">
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
          <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5">
            {t("landing.heroCta")}
          </button>
          <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl border border-blue-900/20 bg-white/5 text-slate-900/80 font-semibold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5">
            {t("landing.heroCtaSecondary")}
          </button>
        </div>

        <button onClick={onEnter3D} className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 text-[11px] sm:text-xs md:text-sm text-slate-900/30 hover:text-cyan-400 transition-colors tracking-wide group">
          {t("landing.enter3d")}
          <ChevronDown size={11} className="group-hover:translate-y-0.5 transition-transform sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
        </button>
      </div>
    </section>
  );
}

/* ─── THREE CORE GOALS ─── */
function GoalsSection() {
  const { t } = useTranslation();
  const goals = [
    { icon: Shield, title: t("landing.goal1Title"), desc: t("landing.goal1Desc"), color: "cyan" },
    { icon: Users, title: t("landing.goal2Title"), desc: t("landing.goal2Desc"), color: "violet" },
    { icon: Bot, title: t("landing.goal3Title"), desc: t("landing.goal3Desc"), color: "emerald" },
  ];
  const colorMap: Record<string, { border: string; iconBg: string; icon: string }> = {
    cyan:    { border: "hover:border-cyan-400/30",    iconBg: "bg-cyan-400/5 border-cyan-400/20",    icon: "text-cyan-400" },
    violet:  { border: "hover:border-violet-400/30",  iconBg: "bg-violet-400/5 border-violet-400/20",  icon: "text-violet-400" },
    emerald: { border: "hover:border-emerald-400/30", iconBg: "bg-emerald-400/5 border-emerald-400/20", icon: "text-emerald-400" },
  };
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-cyan-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.goalsSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.goalsTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-5">
          {goals.map((g, i) => {
            const c = colorMap[g.color];
            return (
              <div key={i} className={`${glassCard} ${c.border} p-3 sm:p-4 md:p-6 hover:bg-white/90 hover:-translate-y-0.5 transition-all`}>
                <div className={`w-7 h-7 sm:w-9 sm:h-9 md:w-12 md:h-12 rounded-lg sm:rounded-xl md:rounded-xl border flex items-center justify-center mb-1.5 sm:mb-3 md:mb-4 ${c.iconBg}`}>
                  <g.icon size={14} className={`${c.icon} sm:w-[16px] sm:h-[16px] md:w-5 md:h-5`} />
                </div>
                <h3 className="text-[13px] sm:text-[14px] md:text-base font-bold text-slate-900/90 mb-0.5 sm:mb-1 md:mb-1.5 leading-snug">{g.title}</h3>
                <p className="text-[11px] sm:text-xs md:text-sm text-slate-900/40 leading-[1.4]">{g.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── AI DEPARTMENTS ─── */
function DepartmentsSection() {
  const { t } = useTranslation();
  const depts = [
    { icon: Headphones, title: t("landing.dept1Title"), desc: t("landing.dept1Desc") },
    { icon: FileText, title: t("landing.dept2Title"), desc: t("landing.dept2Desc") },
    { icon: FolderKanban, title: t("landing.dept3Title"), desc: t("landing.dept3Desc") },
    { icon: Activity, title: t("landing.dept4Title"), desc: t("landing.dept4Desc") },
    { icon: Shield, title: t("landing.dept5Title"), desc: t("landing.dept5Desc") },
  ];
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-indigo-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.deptSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.deptTitle")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-5">
          {depts.map((d, i) => (
            <div key={i} className={`${glassCard} ${glassCardHover} p-3 sm:p-4 md:p-5 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl md:rounded-xl bg-indigo-400/5 border border-indigo-400/15 flex items-center justify-center mb-1.5 sm:mb-2 md:mb-3">
                <d.icon size={12} className="text-indigo-400 sm:w-[14px] sm:h-[14px] md:w-[18px] md:h-[18px]" />
              </div>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900/80 mb-0.5 sm:mb-1 md:mb-1.5 leading-snug">{d.title}</h3>
              <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-900/40 leading-[1.4]">{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── OUTCOMES ─── */
function OutcomesSection({ onPricingClick }: { onPricingClick: () => void }) {
  const { t } = useTranslation();
  const outcomes = [
    t("landing.outcome1"), t("landing.outcome2"), t("landing.outcome3"), t("landing.outcome4"),
    t("landing.outcome5"), t("landing.outcome6"), t("landing.outcome7"), t("landing.outcome8"),
  ];
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-emerald-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.outcomesSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.outcomesTitle")}</h2>
        </div>
        <div className={`${glassCard} p-4 sm:p-6 md:p-8`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            {outcomes.map((o, i) => (
              <div key={i} className="flex items-start gap-2 sm:gap-3">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5 sm:w-[18px] sm:h-[18px]" />
                <span className="text-[11px] sm:text-xs md:text-sm text-slate-900/70 font-medium leading-snug">{o}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
            <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[13px] sm:text-sm tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5">
              {t("landing.heroCtaSecondary")}
            </button>
            <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-blue-900/20 bg-white/5 text-slate-900/80 font-semibold text-[13px] sm:text-sm tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5">
              {t("landing.heroCta")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── COMPARISON TABLE ─── */
function ComparisonSection() {
  const { t } = useTranslation();
  const rows = [1, 2, 3, 4, 5, 6] as const;
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-cyan-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.compareSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.compareTitle")}</h2>
        </div>
        <div className={`${glassCard} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-blue-900/10">
                  <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-bold text-slate-900/60">{t("landing.compareFeature")}</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-bold text-red-400/60">{t("landing.compareTraditional")}</th>
                  <th className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-[10px] sm:text-xs md:text-sm font-bold text-cyan-400">{t("landing.compareOrbit")}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r} className="border-b border-blue-900/5 last:border-0">
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-[11px] md:text-xs font-semibold text-slate-900/70">
                      {t(`landing.compareRow${r}`)}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-[11px] md:text-xs text-red-400/50">
                      {t(`landing.compareRow${r}T`)}
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 text-[10px] sm:text-[11px] md:text-xs text-cyan-400/80 font-medium">
                      {t(`landing.compareRow${r}O`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── CASE STUDIES ─── */
function CasesSection() {
  const { t } = useTranslation();
  const cases = [1, 2, 3] as const;
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-violet-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.casesSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.casesTitle")}</h2>
        </div>
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {cases.map((c) => (
            <div key={c} className={`${glassCard} ${glassCardHover} p-3 sm:p-4 md:p-6`}>
              <h3 className="text-[13px] sm:text-base md:text-lg font-bold text-slate-900/90 mb-2 sm:mb-3">{t(`landing.case${c}Title`)}</h3>
              <div className="space-y-1.5 sm:space-y-2 md:space-y-3">
                <div>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-cyan-400/60 tracking-wider uppercase">Background</span>
                  <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/50 leading-[1.4] mt-0.5">{t(`landing.case${c}Bg`)}</p>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-red-400/60 tracking-wider uppercase">Problem</span>
                  <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/50 leading-[1.4] mt-0.5">{t(`landing.case${c}Problem`)}</p>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-blue-400/60 tracking-wider uppercase">Solution</span>
                  <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/50 leading-[1.4] mt-0.5">{t(`landing.case${c}Solution`)}</p>
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-emerald-400/60 tracking-wider uppercase">Result</span>
                  <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/50 leading-[1.4] mt-0.5">{t(`landing.case${c}Result`)}</p>
                </div>
                <div className="pt-1 sm:pt-2 border-t border-blue-900/5">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-violet-400/60 tracking-wider uppercase">Key Learning</span>
                  <p className="text-[10px] sm:text-[11px] md:text-sm text-slate-900/60 leading-[1.4] mt-0.5 italic">{t(`landing.case${c}Learn`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ROADMAP ─── */
function RoadmapSection() {
  const { t } = useTranslation();
  const phases = [1, 2, 3, 4] as const;
  return (
    <section className="relative py-6 sm:py-10 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-4 sm:mb-8 md:mb-12">
          <p className="text-[9px] sm:text-[11px] md:text-sm text-amber-400/50 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 md:mb-4 font-semibold">{t("landing.roadmapSubtitle")}</p>
          <h2 className="text-base sm:text-xl md:text-4xl font-extrabold text-white tracking-tight">{t("landing.roadmapTitle")}</h2>
        </div>
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          {phases.map((p) => (
            <div key={p} className={`${glassCard} ${glassCardHover} p-3 sm:p-4 md:p-5 flex items-start gap-3 sm:gap-4`}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-400/5 border border-amber-400/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] sm:text-xs md:text-sm font-bold text-amber-400/70">{p}</span>
              </div>
              <div>
                <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-900/80 mb-0.5 sm:mb-1 leading-snug">{t(`landing.phase${p}Title`)}</h3>
                <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-900/40 leading-[1.4]">{t(`landing.phase${p}Desc`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FINAL CTA ─── */
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
        <h2 className="text-lg sm:text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2 sm:mb-4 md:mb-5">{t("landing.finalTitle")}</h2>
        <p className="text-[11px] sm:text-sm md:text-lg text-slate-900/40 mb-4 sm:mb-8 md:mb-10 max-w-lg mx-auto leading-[1.4]">{t("landing.finalDesc")}</p>

        <div className="flex items-center justify-center gap-3 sm:gap-8 md:gap-12 mb-5 sm:mb-8 md:mb-10">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-cyan-400 led-pulse font-mono-data">{s.value}</div>
              <div className="text-[8px] sm:text-[10px] md:text-sm text-slate-900/30 mt-0.5 sm:mt-0.5 md:mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 md:gap-4 px-3">
          <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20 hover:-translate-y-0.5">
            {t("landing.finalCta")}
          </button>
          <button onClick={onPricingClick} className="w-full sm:w-auto px-5 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl md:rounded-2xl border border-blue-900/20 bg-white/5 text-slate-900/80 font-semibold text-[13px] sm:text-[14px] md:text-base tracking-wide hover:border-cyan-400/50 hover:text-white transition-all hover:-translate-y-0.5">
            {t("landing.finalCtaSecondary")}
          </button>
        </div>

        <div className="orbit-line-contact mt-6 sm:mt-10 mx-auto flex items-center justify-center gap-3 sm:gap-4 rounded-xl border border-cyan-400/20 bg-white/80 p-3 sm:p-4 text-left backdrop-blur-md">
          <img src="/logo-light.jpg" alt="SNT Logo" className="h-14 w-12 sm:h-16 sm:w-14 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] sm:text-xs font-bold tracking-wider text-slate-900">SNT Orbit Tower</div>
            <div className="mt-0.5 text-[9px] sm:text-[10px] leading-relaxed text-slate-900/50">LINE 線上諮詢</div>
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[#06C755] px-2.5 py-1.5 text-[9px] font-bold text-white transition hover:brightness-110">
              <span aria-hidden="true">LINE</span> 即時諮詢
            </a>
          </div>
          <img src="/line-qr.png" alt="LINE QR Code" className="h-20 w-20 sm:h-24 sm:w-24 rounded-lg bg-white p-1" />
        </div>

        <div className="mt-8 sm:mt-12 md:mt-16 pt-3 sm:pt-6 md:pt-8 border-t border-white/10">
          <p className="text-[9px] sm:text-[10px] md:text-xs text-slate-900/20 tracking-wider">{t("footer.copyright")}</p>
        </div>
      </div>
    </section>
  );
}
