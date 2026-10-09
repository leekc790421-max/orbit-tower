"use client";

import { useState } from "react";
import { X, CreditCard, ChevronRight, Shield } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  priceNote: string;
  mrr?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

const PAYMENT_METHODS = [
  {
    id: "rakuten",
    name: "通道 A — 樂天國際銀行",
    nameEn: "Channel A — Rakuten Bank",
    nameJa: "チャネルA — 楽天銀行",
    icon: "🏦",
    description: "國內大額匯款（推薦）",
    descriptionEn: "Domestic large transfer (Recommended)",
    descriptionJa: "国内大口送金（推奨）",
  },
  {
    id: "bank_of_taiwan",
    name: "通道 B — 台灣銀行松山分行",
    nameEn: "Channel B — Bank of Taiwan, Songshan Br.",
    nameJa: "チャネルB — 台湾銀行松山支店",
    icon: "🏛️",
    description: "海外電匯",
    descriptionEn: "Overseas wire transfer",
    descriptionJa: "海外送金",
  },
  {
    id: "payoneer",
    name: "通道 C — Payoneer",
    nameEn: "Channel C — Payoneer",
    nameJa: "チャネルC — Payoneer",
    icon: "💳",
    description: "跨境快速支付（USD）",
    descriptionEn: "Cross-border fast payment (USD)",
    descriptionJa: "越境クイック決済（USD）",
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { t, locale } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const isTW = locale === "zh";
  
  const PLANS: Plan[] = [
    {
      id: "lite",
      name: t("pricing.planLite"),
      nameEn: "Lite",
      price: isTW ? "NT$129,000" : "USD $3,999",
      priceNote: t("pricing.perProject"),
      features: [
        t("pricing.liteF1"),
        t("pricing.liteF2"),
        t("pricing.liteF3"),
        t("pricing.liteF4"),
      ],
    },
    {
      id: "pro",
      name: t("pricing.planPro"),
      nameEn: "Pro",
      price: isTW ? "NT$329,000" : "USD $9,999",
      priceNote: t("pricing.perProject"),
      features: [
        t("pricing.proF1"),
        t("pricing.proF2"),
        t("pricing.proF3"),
        t("pricing.proF4"),
        t("pricing.proF5"),
      ],
      highlighted: true,
      badge: t("pricing.mostPopular"),
    },
    {
      id: "enterprise",
      name: t("pricing.planEnterprise"),
      nameEn: "Enterprise",
      price: isTW ? "NT$990,000+" : "USD $29,999+",
      priceNote: t("pricing.perProject"),
      features: [
        t("pricing.enterpriseF1"),
        t("pricing.enterpriseF2"),
        t("pricing.enterpriseF3"),
        t("pricing.enterpriseF4"),
      ],
    },
  ];

  const handleSelectPayment = (methodId: string) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId);
    const methodName = locale === "zh" ? method?.name : locale === "ja" ? method?.nameJa : method?.nameEn;
    const msg = locale === "zh"
      ? `已選擇：${methodName}\n\n系統將提供專屬付款資訊。\n匯款後請上傳水單，由後台 AI 確認審核。\n\n聯絡：service@snt.tw`
      : locale === "ja"
      ? `選択済み：${methodName}\n\n専用お支払い情報をご案内します。\n送金後、振込明細書をアップロードしてください。\n\n連絡先：service@snt.tw`
      : `Selected: ${methodName}\n\nYou will receive dedicated payment info.\nAfter transfer, upload the receipt for AI audit.\n\nContact: service@snt.tw`;
    alert(msg);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-t-2xl md:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-[13px] sm:text-base md:text-lg font-bold text-white tracking-wider">
              {selectedPlan ? t("pricing.checkout") : t("pricing.title")}
            </h2>
            <p className="text-[8px] sm:text-[9px] md:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {selectedPlan ? t("pricing.checkoutSub") : t("pricing.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-1.5 md:gap-2">
            {selectedPlan && (
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-[8px] sm:text-[9px] md:text-[10px] px-1.5 sm:px-2 md:px-3 py-1 sm:py-1 md:py-1.5 rounded-lg sm:rounded-xl md:rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                {t("pricing.back")}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
            >
              <X size={12} className="text-white/40 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-2.5 sm:p-4 md:p-6">
          {!selectedPlan ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`
                      relative rounded-lg sm:rounded-xl md:rounded-xl p-3 sm:p-4 md:p-5 border transition-all duration-300 cursor-pointer
                      ${
                        plan.highlighted
                          ? "border-cyan-400/50 bg-cyan-400/5 shadow-lg shadow-cyan-400/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }
                    `}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.badge && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 sm:px-2.5 md:px-3 py-0.5 rounded-full bg-cyan-400 text-black text-[8px] sm:text-[8px] md:text-[9px] font-bold tracking-wider uppercase">
                        {plan.badge}
                      </div>
                    )}
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] text-white/40 tracking-wider uppercase mb-0.5 sm:mb-0.5 md:mb-1">
                      {plan.nameEn}
                    </div>
                    <div className="text-[13px] sm:text-base md:text-base font-bold text-white mb-1 sm:mb-1.5 md:mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-0.5 sm:gap-0.5 md:gap-1 mb-0.5 sm:mb-0.5 md:mb-1">
                      <span
                        className={`text-lg sm:text-xl md:text-2xl font-bold ${plan.highlighted ? "text-cyan-300" : "text-white"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-white/40">{plan.priceNote}</span>
                    </div>
                    {plan.mrr && (
                      <div className="text-[8px] sm:text-[9px] md:text-[10px] text-amber-400/70 mb-2 sm:mb-2.5 md:mb-3">{plan.mrr}</div>
                    )}
                    <ul className="space-y-0.5 sm:space-y-1 md:space-y-1.5 mt-2 sm:mt-3 md:mt-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-1.5 md:gap-2 text-[10px] sm:text-[10px] md:text-[11px] text-white/60">
                          <ChevronRight
                            size={10}
                            className={`mt-0.5 flex-shrink-0 sm:w-[10px] sm:h-[10px] md:w-[11px] md:h-[11px] ${plan.highlighted ? "text-cyan-400" : "text-white/30"}`}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`
                        w-full mt-3 sm:mt-4 md:mt-5 py-2 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl md:rounded-xl text-[10px] sm:text-[11px] md:text-xs font-bold tracking-wider uppercase
                        transition-all border
                        ${
                          plan.highlighted
                            ? "bg-cyan-400/10 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      {t("pricing.selectPlan")}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="glass-panel rounded-lg sm:rounded-xl md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-cyan-400/20 mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[8px] sm:text-[9px] md:text-[10px] text-cyan-400/60 tracking-wider uppercase">
                      {t("pricing.selectedPlan")}
                    </div>
                    <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white mt-0.5 sm:mt-0.5 md:mt-1 truncate">
                      {PLANS.find((p) => p.id === selectedPlan)?.name} —{" "}
                      {PLANS.find((p) => p.id === selectedPlan)?.price}
                      {PLANS.find((p) => p.id === selectedPlan)?.priceNote}
                    </div>
                  </div>
                  <Shield size={16} className="text-cyan-400/40 flex-shrink-0 ml-2 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </div>
              </div>

              <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-[10px] sm:text-[11px] md:text-xs font-bold text-white/70 tracking-wider flex items-center gap-1.5 sm:gap-1.5 md:gap-2">
                  <CreditCard size={11} className="text-cyan-400 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                  {locale === "zh" ? "選擇付款方式" : locale === "ja" ? "お支払い方法を選択" : "Select Payment Method"}
                </h3>

                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectPayment(method.id)}
                    className="w-full glass-panel rounded-lg sm:rounded-xl md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-white/10 hover:border-cyan-400/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                      <span className="text-lg sm:text-xl md:text-2xl">{method.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] sm:text-xs md:text-sm font-bold text-white truncate">
                          {locale === "zh" ? method.name : locale === "ja" ? method.nameJa : method.nameEn}
                        </div>
                        <div className="text-[8px] sm:text-[9px] md:text-[10px] text-white/40 truncate">
                          {locale === "zh" ? method.description : locale === "ja" ? method.descriptionJa : method.descriptionEn}
                        </div>
                      </div>
                      <ChevronRight size={12} className="text-white/20 group-hover:text-cyan-400 transition-colors flex-shrink-0 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="glass-panel rounded-lg sm:rounded-xl md:rounded-xl p-2.5 sm:p-3 md:p-4 border border-emerald-400/20 bg-emerald-400/5">
                <div className="flex items-start gap-1.5 sm:gap-1.5 md:gap-2">
                  <Shield size={12} className="text-emerald-400 flex-shrink-0 mt-0.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                  <div className="flex-1">
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-bold text-emerald-300 mb-0.5 sm:mb-0.5 md:mb-1">
                      {locale === "zh" ? "安全付款保障" : locale === "ja" ? "安全な決済" : "Secure Payment"}
                    </div>
                    <p className="text-[9px] sm:text-[9px] md:text-[10px] text-white/60 leading-[1.4]">
                      {locale === "zh"
                        ? "系統即時抓取美金匯率，自動換算台幣定價。匯款後請上傳水單，由後台 AI 確認審核。帳號資訊將於選擇通道後顯示。"
                        : locale === "ja"
                        ? "システムがリアルタイム為替を取得し、自動的に台湾元換算します。送金後、明細書をアップロードするとAI審査します。口座情報はチャネル選択後に表示。"
                        : "System fetches real-time FX rates for auto TWD conversion. After transfer, upload receipt for AI audit. Account details shown after selecting a channel."}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
