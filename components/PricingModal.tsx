"use client";

import { useState } from "react";
import { X, Copy, Check, Building2, CreditCard, ExternalLink, ChevronRight, Shield } from "lucide-react";
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

const BANK_INFO = [
  {
    bank: "臺灣銀行 Bank of Taiwan",
    type: "國內/國際電匯",
    branch: "松山分行",
    swift: "BKTWTWTP",
    code: "0040646",
    account: "004-064004306448",
    icon: "🏦",
  },
  {
    bank: "樂天國際商業銀行 Rakuten Bank",
    type: "數位帳戶",
    branch: null,
    swift: null,
    code: "826",
    account: "81201001535981",
    icon: "🏦",
  },
];

const PAYONEER_URL =
  "https://link.payoneer.com/Token?t=4D0FBCB1CAEE48E48FEACE39662D6BB7&src=mobile";

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const { t, locale } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
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

              {/* 快速 Payoneer 入口 */}
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-white/10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <CreditCard size={18} className="text-cyan-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] sm:text-xs font-bold text-white">{t("pricing.quickPay")}</div>
                      <div className="text-[9px] sm:text-[10px] text-white/40 truncate">
                        {t("pricing.payoneerDesc")}
                      </div>
                    </div>
                  </div>
                  <a
                    href={PAYONEER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-[10px] sm:text-xs font-bold hover:bg-cyan-400/20 transition-all flex-shrink-0"
                  >
                    Payoneer
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* ===== 金流結帳資訊 ===== */
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

              {/* 銀行電匯資訊 */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <h3 className="text-[11px] sm:text-xs font-bold text-white/70 tracking-wider flex items-center gap-2">
                  <Building2 size={13} className="text-cyan-400" />
                  {t("pricing.wireTransfer")}
                </h3>

                {BANK_INFO.map((bank, idx) => (
                  <div
                    key={idx}
                    className="glass-panel rounded-xl p-3 sm:p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <span className="text-base sm:text-lg">{bank.icon}</span>
                      <div className="min-w-0">
                        <div className="text-[11px] sm:text-xs font-bold text-white truncate">{bank.bank}</div>
                        <div className="text-[9px] sm:text-[10px] text-white/40">{bank.type}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                      {bank.branch && (
                        <InfoRow
                          label={t("pricing.branch")}
                          value={bank.branch}
                          onCopy={() => handleCopy(bank.branch!, `bank-branch-${idx}`)}
                          copied={copiedField === `bank-branch-${idx}`}
                        />
                      )}
                      {bank.swift && (
                        <InfoRow
                          label={t("pricing.swiftCode")}
                          value={bank.swift}
                          highlight
                          onCopy={() => handleCopy(bank.swift!, `bank-swift-${idx}`)}
                          copied={copiedField === `bank-swift-${idx}`}
                        />
                      )}
                      {bank.code && (
                        <InfoRow
                          label={bank.swift ? t("pricing.branchCode") : t("pricing.bankCode")}
                          value={bank.code}
                          onCopy={() => handleCopy(bank.code!, `bank-code-${idx}`)}
                          copied={copiedField === `bank-code-${idx}`}
                        />
                      )}
                      <InfoRow
                        label={t("pricing.account")}
                        value={bank.account}
                        highlight
                        onCopy={() => handleCopy(bank.account, `bank-account-${idx}`)}
                        copied={copiedField === `bank-account-${idx}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Payoneer 快速支付 */}
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-cyan-400/20 mb-4 sm:mb-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                      <CreditCard size={16} className="text-cyan-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] sm:text-xs font-bold text-white">{t("pricing.payoneerQuick")}</div>
                      <div className="text-[9px] sm:text-[10px] text-white/40">
                        {t("pricing.payoneerMethods")}
                      </div>
                    </div>
                  </div>
                  <a
                    href={PAYONEER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold hover:bg-cyan-400/20 transition-all hover:shadow-lg hover:shadow-cyan-400/10 flex-shrink-0"
                  >
                    {t("pricing.goToPay")}
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* 注意事項 */}
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-amber-400/20 bg-amber-400/5">
                <div className="text-[9px] sm:text-[10px] text-amber-400/80 tracking-wider uppercase font-bold mb-2">
                  {t("pricing.wireNotice")}
                </div>
                <ul className="space-y-1 text-[10px] sm:text-[11px] text-white/60">
                  <li>• {t("pricing.wireNote1")}</li>
                  <li>• {t("pricing.wireNote2")}</li>
                  <li>• {t("pricing.wireNote3")}</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  highlight,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2 border border-white/5">
      <div className="min-w-0">
        <div className="text-[8px] sm:text-[9px] text-white/30 uppercase tracking-wider">{label}</div>
        <div
          className={`text-[11px] sm:text-xs font-mono font-bold ${highlight ? "text-cyan-300" : "text-white/80"} truncate`}
        >
          {value}
        </div>
      </div>
      <button
        onClick={onCopy}
        className={`
          ml-2 w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center transition-all flex-shrink-0
          ${
            copied
              ? "bg-emerald-400/20 border border-emerald-400/40"
              : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
          }
        `}
        title={t("pricing.copy")}
      >
        {copied ? (
          <Check size={11} className="text-emerald-400" />
        ) : (
          <Copy size={11} className="text-white/40" />
        )}
      </button>
    </div>
  );
}
