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

// 付款方式（不含敏感資訊）
const PAYMENT_METHODS = [
  {
    id: "atm",
    name: "ATM 轉帳",
    nameEn: "ATM Transfer",
    icon: "🏧",
    description: "台灣客戶適用",
    descriptionEn: "For Taiwan customers",
  },
  {
    id: "bank",
    name: "銀行匯款",
    nameEn: "Bank Wire Transfer",
    icon: "🏦",
    description: "國內/國際匯款",
    descriptionEn: "Domestic/International",
  },
  {
    id: "payoneer",
    name: "Payoneer",
    nameEn: "Payoneer",
    icon: "💳",
    description: "跨境快速支付",
    descriptionEn: "Cross-border payment",
  },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { t, locale } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // 台灣錨定 TWD，國外錨定 USD
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
    // 付款方式選擇後，顯示聯絡資訊
    alert(`已選擇付款方式。請聯繫我們的顧問完成付款流程。\n\n聯絡方式：\n• Email: service@snt.tw\n• LINE: @snt-official`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal 主體 — 手機全螢幕 */}
      <div className="relative w-full sm:max-w-4xl h-[92vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        {/* 頂部標題 */}
        <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {selectedPlan ? t("pricing.checkout") : t("pricing.title")}
            </h2>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {selectedPlan ? t("pricing.checkoutSub") : t("pricing.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedPlan && (
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-[9px] sm:text-[10px] px-2 sm:px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                {t("pricing.back")}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
            >
              <X size={14} className="text-white/40" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {!selectedPlan ? (
            /* ===== 定價表 ===== */
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`
                      relative rounded-xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer
                      ${
                        plan.highlighted
                          ? "border-cyan-400/50 bg-cyan-400/5 shadow-lg shadow-cyan-400/10"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      }
                    `}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.badge && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-400 text-black text-[9px] font-bold tracking-wider uppercase">
                        {plan.badge}
                      </div>
                    )}
                    <div className="text-[9px] sm:text-[10px] text-white/40 tracking-wider uppercase mb-1">
                      {plan.nameEn}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span
                        className={`text-xl sm:text-2xl font-bold ${plan.highlighted ? "text-cyan-300" : "text-white"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-[10px] sm:text-xs text-white/40">{plan.priceNote}</span>
                    </div>
                    {plan.mrr && (
                      <div className="text-[9px] sm:text-[10px] text-amber-400/70 mb-3">{plan.mrr}</div>
                    )}
                    <ul className="space-y-1 sm:space-y-1.5 mt-3 sm:mt-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[10px] sm:text-[11px] text-white/60">
                          <ChevronRight
                            size={11}
                            className={`mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-cyan-400" : "text-white/30"}`}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`
                        w-full mt-4 sm:mt-5 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-bold tracking-wider uppercase
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
            /* ===== 付款方式選擇 ===== */
            <>
              {/* 已選方案摘要 */}
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-cyan-400/20 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider uppercase">
                      {t("pricing.selectedPlan")}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white mt-1 truncate">
                      {PLANS.find((p) => p.id === selectedPlan)?.name} —{" "}
                      {PLANS.find((p) => p.id === selectedPlan)?.price}
                      {PLANS.find((p) => p.id === selectedPlan)?.priceNote}
                    </div>
                  </div>
                  <Shield size={20} className="text-cyan-400/40 flex-shrink-0 ml-2" />
                </div>
              </div>

              {/* 付款方式 */}
              <div className="space-y-3 mb-4 sm:mb-6">
                <h3 className="text-[11px] sm:text-xs font-bold text-white/70 tracking-wider flex items-center gap-2">
                  <CreditCard size={13} className="text-cyan-400" />
                  選擇付款方式
                </h3>

                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSelectPayment(method.id)}
                    className="w-full glass-panel rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-white">
                          {locale === "zh" ? method.name : method.nameEn}
                        </div>
                        <div className="text-[10px] text-white/40">
                          {locale === "zh" ? method.description : method.descriptionEn}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>

              {/* 安全提示 */}
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-emerald-400/20 bg-emerald-400/5">
                <div className="flex items-start gap-2">
                  <Shield size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-[10px] sm:text-xs font-bold text-emerald-300 mb-1">
                      安全付款保障
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-white/60 leading-relaxed">
                      選擇付款方式後，系統將提供專屬付款資訊。所有交易均受安全保護，匯款後請上傳水單以便快速確認。
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
