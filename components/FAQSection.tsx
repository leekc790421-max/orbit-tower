"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, X } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const FAQ_DATA: FAQItem[] = [
    { question: t("faq.q1"), answer: t("faq.a1") },
    { question: t("faq.q2"), answer: t("faq.a2") },
    { question: t("faq.q3"), answer: t("faq.a3") },
    { question: t("faq.q4"), answer: t("faq.a4") },
    { question: t("faq.q5"), answer: t("faq.a5") },
    { question: t("faq.q6"), answer: t("faq.a6") },
    { question: t("faq.q7"), answer: t("faq.a7") },
    { question: t("faq.q8"), answer: t("faq.a8") },
    { question: t("faq.q9"), answer: t("faq.a9") },
    { question: t("faq.q10"), answer: t("faq.a10") },
    { question: t("faq.q11"), answer: t("faq.a11") },
    { question: t("faq.q12"), answer: t("faq.a12") },
  ];

  return (
    <>
      {/* FAQ 觸發按鈕 — 右側中間位置 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-1/2 -translate-y-1/2 right-1 sm:right-3 z-40 glass-panel rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1.5 sm:py-2 hud-border flex items-center gap-1 sm:gap-1.5 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <HelpCircle size={12} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline text-[10px] text-cyan-300 font-bold tracking-wider">{t("faq.title")}</span>
        </button>
      )}

      {/* FAQ 面板 */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full sm:max-w-2xl h-[85vh] sm:h-auto sm:max-h-[80vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
            {/* 頂部 */}
            <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-sm sm:text-lg font-bold text-white tracking-wider">
                  {t("faq.titleFull")}
                </h2>
                <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
                  {t("faq.subtitle")}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
              >
                <X size={14} className="text-white/40" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
              {FAQ_DATA.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-panel rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    className="w-full flex items-start gap-3 p-3 sm:p-4 text-left"
                  >
                    <HelpCircle size={14} className="text-cyan-400 mt-0.5 flex-shrink-0 hidden sm:block" />
                    <span className="text-[11px] sm:text-xs font-bold text-white flex-1 leading-relaxed">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-white/40 flex-shrink-0 transition-transform ${
                        expandedIndex === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedIndex === idx && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pl-6 sm:pl-10">
                      <p className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
