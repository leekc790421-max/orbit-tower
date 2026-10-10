"use client";

import { useState } from "react";
import {
  ArrowLeft, Check, ChevronRight, Zap, Shield,
  Globe, Headphones, FileText, BarChart3,
} from "lucide-react";
import { I18nProvider, useTranslation } from "@/lib/i18n";
import Link from "next/link";

function PricingInner() {
  const { t, locale } = useTranslation();
  const isTW = locale === "zh";
  const [billingCycle, setBillingCycle] = useState<"project" | "monthly">("project");

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#050510]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft size={16} />
            <span className="text-xs sm:text-sm font-medium tracking-wider">Orbit Tower</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[11px] sm:text-xs text-white/40 hover:text-white/70 transition-colors">
              {t("landing.finalCtaSecondary")}
            </Link>
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="text-[11px] sm:text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 hover:bg-cyan-500/20 transition-all font-medium">
              LINE
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6 sm:mb-8">
            <Zap size={12} className="text-cyan-400" />
            <span className="text-[10px] sm:text-xs text-cyan-300/80 tracking-wider font-medium">AI Digital Headquarters</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4 sm:mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
            {t("pricing.subtitle")}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 sm:mt-8">
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xs sm:text-sm tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20">
              {t("pricing.ctaConsult")}
            </a>
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 font-semibold text-xs sm:text-sm tracking-wide hover:border-white/20 hover:text-white transition-all">
              {t("pricing.ctaDiagnose")}
            </a>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8 sm:mb-12">
        <button onClick={() => setBillingCycle("project")} className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${billingCycle === "project" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300" : "border border-white/10 text-white/40 hover:text-white/60"}`}>
          {isTW ? "專案建置" : "Project"}
        </button>
        <button onClick={() => setBillingCycle("monthly")} className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${billingCycle === "monthly" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300" : "border border-white/10 text-white/40 hover:text-white/60"}`}>
          {isTW ? "月度維運" : "Monthly Care"}
        </button>
      </div>

      {/* Plans */}
      {billingCycle === "project" ? <ProjectPlans /> : <CarePlans />}

      {/* FAQ */}
      <PricingFAQ />

      {/* Footer CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-3">{t("landing.finalTitle")}</h2>
          <p className="text-sm text-white/40 mb-8">{t("landing.finalDesc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm tracking-wide hover:from-cyan-400 hover:to-blue-400 transition-all shadow-xl shadow-cyan-500/20">
              {t("landing.finalCta")}
            </a>
            <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 font-semibold text-sm tracking-wide hover:border-white/20 hover:text-white transition-all">
              {t("landing.finalCtaSecondary")}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] sm:text-xs text-white/20 tracking-wider">{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-[10px] sm:text-xs text-white/20 hover:text-white/40 transition-colors">{t("nav.terms")}</Link>
            <Link href="/privacy" className="text-[10px] sm:text-xs text-white/20 hover:text-white/40 transition-colors">Privacy</Link>
            <Link href="/disclaimer" className="text-[10px] sm:text-xs text-white/20 hover:text-white/40 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── PROJECT PLANS ─── */
function ProjectPlans() {
  const { t, locale } = useTranslation();
  const isTW = locale === "zh";

  const plans = [
    {
      id: "launch",
      name: t("pricing.planLaunch"),
      forWho: t("pricing.planLaunchFor"),
      priceUSD: "$5,900",
      priceNT: "NT$198,000",
      delivery: t("pricing.deliveryLaunch"),
      cta: t("pricing.ctaLaunch"),
      features: [t("pricing.launchF1"), t("pricing.launchF2"), t("pricing.launchF3"), t("pricing.launchF4"), t("pricing.launchF5"), t("pricing.launchF6"), t("pricing.launchF7"), t("pricing.launchF8")],
      highlighted: false,
    },
    {
      id: "pro",
      name: t("pricing.planPro"),
      forWho: t("pricing.planProFor"),
      priceUSD: "$12,900",
      priceNT: "NT$438,000",
      delivery: t("pricing.deliveryPro"),
      cta: t("pricing.ctaPro"),
      features: [t("pricing.proF1"), t("pricing.proF2"), t("pricing.proF3"), t("pricing.proF4"), t("pricing.proF5"), t("pricing.proF6"), t("pricing.proF7"), t("pricing.proF8"), t("pricing.proF9"), t("pricing.proF10")],
      highlighted: true,
      badge: t("pricing.mostPopular"),
    },
    {
      id: "enterprise",
      name: t("pricing.planEnterprise"),
      forWho: t("pricing.planEnterpriseFor"),
      priceUSD: "$28,000",
      priceNT: "NT$950,000",
      delivery: t("pricing.deliveryEnterprise"),
      cta: t("pricing.ctaEnterprise"),
      features: [t("pricing.enterpriseF1"), t("pricing.enterpriseF2"), t("pricing.enterpriseF3"), t("pricing.enterpriseF4"), t("pricing.enterpriseF5"), t("pricing.enterpriseF6"), t("pricing.enterpriseF7"), t("pricing.enterpriseF8"), t("pricing.enterpriseF9"), t("pricing.enterpriseF10"), t("pricing.enterpriseF11")],
      highlighted: false,
    },
  ];

  return (
    <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-5 sm:p-6 md:p-8 transition-all duration-300 ${
                plan.highlighted
                  ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/[0.04] to-transparent shadow-2xl shadow-cyan-500/5 scale-[1.02]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] hover:bg-white/[0.03]"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold tracking-wider">
                  {plan.badge}
                </div>
              )}

              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-1">{plan.name}</h3>
                <p className="text-[10px] sm:text-xs text-white/30 leading-relaxed">{plan.forWho}</p>
              </div>

              <div className="mb-4 sm:mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl sm:text-3xl font-extrabold ${plan.highlighted ? "text-cyan-300" : "text-white"}`}>
                    {isTW ? plan.priceNT : `USD ${plan.priceUSD}`}
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-white/20 mt-1">
                  {isTW ? `USD ${plan.priceUSD}` : plan.priceNT}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4 sm:mb-6 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <Zap size={12} className="text-amber-400/60" />
                <span className="text-[10px] sm:text-xs text-white/40">{t("pricing.deliveryTime")}: {plan.delivery}</span>
              </div>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={13} className={`mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-cyan-400" : "text-white/30"}`} />
                    <span className="text-[11px] sm:text-xs text-white/50 leading-snug">{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="https://line.me/R/ti/p/@559julyu"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full text-center py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 shadow-lg shadow-cyan-500/20"
                    : "border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CARE PLANS ─── */
function CarePlans() {
  const { t, locale } = useTranslation();
  const isTW = locale === "zh";

  const plans = [
    {
      name: t("pricing.careLaunch"),
      priceUSD: "$199",
      priceNT: "NT$6,600",
      features: [t("pricing.careLaunchF1"), t("pricing.careLaunchF2"), t("pricing.careLaunchF3"), t("pricing.careLaunchF4")],
      icon: Shield,
    },
    {
      name: t("pricing.careGrowth"),
      priceUSD: "$499",
      priceNT: "NT$16,500",
      features: [t("pricing.careGrowthF1"), t("pricing.careGrowthF2"), t("pricing.careGrowthF3"), t("pricing.careGrowthF4"), t("pricing.careGrowthF5")],
      icon: Globe,
      highlighted: true,
    },
    {
      name: t("pricing.careCommand"),
      priceUSD: "$1,280",
      priceNT: "NT$42,000",
      features: [t("pricing.careCommandF1"), t("pricing.careCommandF2"), t("pricing.careCommandF3"), t("pricing.careCommandF4"), t("pricing.careCommandF5"), t("pricing.careCommandF6")],
      icon: BarChart3,
    },
  ];

  return (
    <section className="pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-2">{t("pricing.careTitle")}</h2>
          <p className="text-xs sm:text-sm text-white/40">{t("pricing.careSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                plan.highlighted
                  ? "border-cyan-500/30 bg-gradient-to-b from-cyan-500/[0.04] to-transparent shadow-2xl shadow-cyan-500/5"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15]"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${plan.highlighted ? "bg-cyan-500/10 border border-cyan-500/20" : "bg-white/[0.04] border border-white/[0.08]"}`}>
                <plan.icon size={18} className={plan.highlighted ? "text-cyan-400" : "text-white/40"} />
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-3">{plan.name}</h3>
              <div className="mb-4">
                <span className={`text-xl sm:text-2xl font-extrabold ${plan.highlighted ? "text-cyan-300" : "text-white"}`}>
                  {isTW ? plan.priceNT : `USD ${plan.priceUSD}`}
                </span>
                <span className="text-[10px] sm:text-xs text-white/30">/{isTW ? "月" : "mo"}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Check size={13} className={`mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-cyan-400" : "text-white/30"}`} />
                    <span className="text-[11px] sm:text-xs text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="https://line.me/R/ti/p/@559julyu" target="_blank" rel="noopener noreferrer" className={`block w-full text-center py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all ${plan.highlighted ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20" : "border border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white"}`}>
                {t("pricing.ctaConsult")}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING FAQ ─── */
function PricingFAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: t("pricing.faqQ1"), a: t("pricing.faqA1") },
    { q: t("pricing.faqQ2"), a: t("pricing.faqA2") },
    { q: t("pricing.faqQ3"), a: t("pricing.faqA3") },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.06]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t("pricing.faqTitle")}</h2>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 text-left"
              >
                <span className="text-xs sm:text-sm font-medium text-white/70">{faq.q}</span>
                <ChevronRight size={14} className={`text-white/30 transition-transform flex-shrink-0 ml-2 ${openIndex === i ? "rotate-90" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                  <p className="text-[11px] sm:text-xs text-white/40 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PricingPage() {
  return (
    <I18nProvider>
      <PricingInner />
    </I18nProvider>
  );
}
