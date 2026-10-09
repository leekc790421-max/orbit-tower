"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, Hexagon, MousePointer, Palette, MessageCircle, HelpCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface OnboardingProps {
  onClose: () => void;
}

const STEP_ICONS = [Hexagon, MousePointer, Palette, MessageCircle, HelpCircle];

export default function Onboarding({ onClose }: OnboardingProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const steps = [
    {
      title: t("onboarding.step1Title"),
      description: t("onboarding.step1Desc"),
      tip: isMobile ? t("onboarding.step1TipMobile") : t("onboarding.step1TipDesktop"),
    },
    {
      title: t("onboarding.step2Title"),
      description: t("onboarding.step2Desc"),
      tip: t("onboarding.step2Tip"),
    },
    {
      title: t("onboarding.step3Title"),
      description: t("onboarding.step3Desc"),
      tip: t("onboarding.step3Tip"),
    },
    {
      title: t("onboarding.step4Title"),
      description: t("onboarding.step4Desc"),
      tip: t("onboarding.step4Tip"),
    },
    {
      title: t("onboarding.step5Title"),
      description: t("onboarding.step5Desc"),
      tip: t("onboarding.step5Tip"),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const step = steps[currentStep];
  const Icon = STEP_ICONS[currentStep];

  return (
    <div className="pointer-events-none fixed inset-0 z-[200]">
      <div className="pointer-events-none absolute inset-0 bg-black/[0.08]" />

      <div className="pointer-events-auto absolute bottom-16 left-2 top-20 flex max-h-[calc(100svh-9rem)] w-[min(19rem,calc(100vw-1rem))] flex-col overflow-y-auto rounded-2xl border border-cyan-400/30 bg-slate-950/75 shadow-2xl shadow-cyan-400/10 backdrop-blur-md sm:bottom-auto sm:left-auto sm:right-20 sm:top-20 sm:max-h-[calc(100svh-6rem)] sm:w-full sm:max-w-sm glass-panel">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all z-10"
        >
          <X size={16} className="text-white/40" />
        </button>

        <div className="p-3 sm:p-5">
          <div className="mb-3 flex justify-center sm:mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-cyan-400/30 bg-cyan-400/10 sm:h-14 sm:w-14">
              <Icon size={24} className="text-cyan-400" />
            </div>
          </div>

          <h2 className="mb-2 text-base font-bold text-center text-white sm:text-lg">
            {step.title}
          </h2>

          <p className="mb-3 text-xs leading-relaxed text-center text-white/75 sm:text-sm">
            {step.description}
          </p>

          <div className="glass-panel mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
            <p className="text-[11px] text-center text-cyan-200 sm:text-xs">
              💡 {step.tip}
            </p>
          </div>

          <div className="mb-4 flex justify-center gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-8 bg-cyan-400"
                    : idx < currentStep
                    ? "w-4 bg-cyan-400/50"
                    : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm sm:text-base"
            >
              {t("onboarding.skip")}
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 transition-all text-sm sm:text-base font-bold flex items-center justify-center gap-2"
            >
              {currentStep < steps.length - 1 ? (
                <>
                  {t("onboarding.next")}
                  <ChevronRight size={18} />
                </>
              ) : (
                t("onboarding.start")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
