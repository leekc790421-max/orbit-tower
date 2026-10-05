"use client";

import { useState } from "react";
import { X, Copy, Check, Building2, CreditCard, ExternalLink, ChevronRight, Shield } from "lucide-react";

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

const PLANS: Plan[] = [
  {
    id: "landing",
    name: "門戶體驗版",
    nameEn: "Landing",
    price: "$35,000",
    priceNote: "/ 次",
    features: [
      "標準六角戶別空間（1F~3F）",
      "子網域配發 (unit.orbit-tower.tw)",
      "基礎頻寬與運算配額",
      "AI 樓管基礎導覽",
      "Email 技術支援",
    ],
  },
  {
    id: "growth",
    name: "成長升級版",
    nameEn: "Growth",
    price: "$60,000",
    priceNote: "/ 次",
    mrr: undefined,
    features: [
      "優選樓層戶別（4F~5F）",
      "獨立頂級網域 CNAME 綁定",
      "進階 AI 運算配額",
      "24/7 技術支援",
      "品牌客製化配色",
      "優先沙盒環境",
    ],
    highlighted: true,
    badge: "最受歡迎",
  },
  {
    id: "scale",
    name: "企業總部版",
    nameEn: "Scale",
    price: "$120,000+",
    priceNote: "/ 次",
    mrr: "MRR 維護費 $3,000/月",
    features: [
      "頂樓 Penthouse 旗艦空間（6F）",
      "8K Lab 等級硬體規格",
      "完整機密沙盒環境",
      "專屬客戶經理",
      "無限 AI 運算配額",
      "SLA 99.9% 保證",
      "優先新功能體驗",
    ],
  },
];

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
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal 主體 */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        {/* 頂部標題 */}
        <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wider">
              {selectedPlan ? "金流結帳與對帳資訊" : "選擇進駐方案"}
            </h2>
            <p className="text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {selectedPlan ? "PAYMENT & WIRE TRANSFER" : "SELECT YOUR PLAN"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedPlan && (
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all"
              >
                ← 返回方案
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
            >
              <X size={16} className="text-white/40" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedPlan ? (
            /* ===== 定價表 ===== */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`
                      relative rounded-xl p-5 border transition-all duration-300 cursor-pointer
                      ${
                        plan.highlighted
                          ? "border-cyan-400/50 bg-cyan-400/5 shadow-lg shadow-cyan-400/10 scale-[1.02]"
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
                    <div className="text-[10px] text-white/40 tracking-wider uppercase mb-1">
                      {plan.nameEn}
                    </div>
                    <div className="text-base font-bold text-white mb-2">{plan.name}</div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span
                        className={`text-2xl font-bold ${plan.highlighted ? "text-cyan-300" : "text-white"}`}
                      >
                        {plan.price}
                      </span>
                      <span className="text-xs text-white/40">{plan.priceNote}</span>
                    </div>
                    {plan.mrr && (
                      <div className="text-[10px] text-amber-400/70 mb-3">{plan.mrr}</div>
                    )}
                    <ul className="space-y-1.5 mt-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/60">
                          <ChevronRight
                            size={12}
                            className={`mt-0.5 flex-shrink-0 ${plan.highlighted ? "text-cyan-400" : "text-white/30"}`}
                          />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`
                        w-full mt-5 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase
                        transition-all border
                        ${
                          plan.highlighted
                            ? "bg-cyan-400/10 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20"
                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                        }
                      `}
                    >
                      選擇方案
                    </button>
                  </div>
                ))}
              </div>

              {/* 快速 Payoneer 入口 */}
              <div className="glass-panel rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-cyan-400" />
                    <div>
                      <div className="text-xs font-bold text-white">快速線上支付</div>
                      <div className="text-[10px] text-white/40">
                        透過 Payoneer 安全支付通道
                      </div>
                    </div>
                  </div>
                  <a
                    href={PAYONEER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold hover:bg-cyan-400/20 transition-all"
                  >
                    Payoneer 支付
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </>
          ) : (
            /* ===== 金流結帳資訊 ===== */
            <>
              {/* 已選方案摘要 */}
              <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-cyan-400/60 tracking-wider uppercase">
                      已選方案
                    </div>
                    <div className="text-sm font-bold text-white mt-1">
                      {PLANS.find((p) => p.id === selectedPlan)?.name} —{" "}
                      {PLANS.find((p) => p.id === selectedPlan)?.price}
                      {PLANS.find((p) => p.id === selectedPlan)?.priceNote}
                    </div>
                  </div>
                  <Shield size={24} className="text-cyan-400/40" />
                </div>
              </div>

              {/* 銀行電匯資訊 */}
              <div className="space-y-4 mb-6">
                <h3 className="text-xs font-bold text-white/70 tracking-wider flex items-center gap-2">
                  <Building2 size={14} className="text-cyan-400" />
                  銀行電匯資訊 / Wire Transfer
                </h3>

                {BANK_INFO.map((bank, idx) => (
                  <div
                    key={idx}
                    className="glass-panel rounded-xl p-4 border border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{bank.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{bank.bank}</div>
                        <div className="text-[10px] text-white/40">{bank.type}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {bank.branch && (
                        <InfoRow
                          label="分行"
                          value={bank.branch}
                          onCopy={() => handleCopy(bank.branch!, `bank-branch-${idx}`)}
                          copied={copiedField === `bank-branch-${idx}`}
                        />
                      )}
                      {bank.swift && (
                        <InfoRow
                          label="SWIFT Code"
                          value={bank.swift}
                          highlight
                          onCopy={() => handleCopy(bank.swift!, `bank-swift-${idx}`)}
                          copied={copiedField === `bank-swift-${idx}`}
                        />
                      )}
                      {bank.code && (
                        <InfoRow
                          label={bank.swift ? "分行解款代號" : "銀行代碼"}
                          value={bank.code}
                          onCopy={() => handleCopy(bank.code!, `bank-code-${idx}`)}
                          copied={copiedField === `bank-code-${idx}`}
                        />
                      )}
                      <InfoRow
                        label="帳號"
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
              <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 mb-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
                      <CreditCard size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Payoneer 快速線上支付</div>
                      <div className="text-[10px] text-white/40">
                        支援信用卡、銀行轉帳等多種支付方式
                      </div>
                    </div>
                  </div>
                  <a
                    href={PAYONEER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-xs font-bold hover:bg-cyan-400/20 transition-all hover:shadow-lg hover:shadow-cyan-400/10"
                  >
                    前往 Payoneer 支付
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* 注意事項 */}
              <div className="glass-panel rounded-xl p-4 border border-amber-400/20 bg-amber-400/5">
                <div className="text-[10px] text-amber-400/80 tracking-wider uppercase font-bold mb-2">
                  ⚠️ 匯款注意事項
                </div>
                <ul className="space-y-1 text-[11px] text-white/60">
                  <li>• 匯款完成後請保留交易憑證並通知專屬顧問</li>
                  <li>• 財務人工對帳完成後（1-2 個工作天內）正式開通授權</li>
                  <li>• 國際電匯請備註「Orbit Tower [方案名稱]」以便快速對帳</li>
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
  return (
    <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5">
      <div>
        <div className="text-[9px] text-white/30 uppercase tracking-wider">{label}</div>
        <div
          className={`text-xs font-mono font-bold ${highlight ? "text-cyan-300" : "text-white/80"}`}
        >
          {value}
        </div>
      </div>
      <button
        onClick={onCopy}
        className={`
          ml-2 w-7 h-7 rounded-md flex items-center justify-center transition-all
          ${
            copied
              ? "bg-emerald-400/20 border border-emerald-400/40"
              : "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20"
          }
        `}
        title="複製"
      >
        {copied ? (
          <Check size={12} className="text-emerald-400" />
        ) : (
          <Copy size={12} className="text-white/40" />
        )}
      </button>
    </div>
  );
}
