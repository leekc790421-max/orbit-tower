"use client";

import { useState } from "react";
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

  if (typeof window !== 'undefined' && isMobile !== (window.innerWidth < 768)) {
    setIsMobile(window.innerWidth < 768);
  }

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all z-10"
        >
          <X size={16} className="text-white/40" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center">
              <Icon size={32} className="text-cyan-400" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">
            {step.title}
          </h2>

          <p className="text-sm sm:text-base text-white/70 text-center mb-4 leading-relaxed">
            {step.description}
          </p>

          <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5 mb-6">
            <p className="text-xs sm:text-sm text-cyan-300 text-center">
              💡 {step.tip}
            </p>
          </div>

          <div className="flex justify-center gap-2 mb-6">
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
