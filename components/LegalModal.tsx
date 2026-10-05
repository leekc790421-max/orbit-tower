"use client";

import { X, Bot, Shield, Zap, CreditCard } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CLAUSES = [
  {
    icon: Bot,
    title: "AI 運算與生成內容免責",
    titleEn: "AI Output Disclaimer",
    color: "cyan",
    content: `本系統提供之 AI 生成數據、分析與建議僅供企業營運參考，不構成任何法律、金融或醫療之絕對保證。企業應自行評估最終執行決策。

AI-generated data, analysis, and recommendations provided by this system are for business reference only and do not constitute absolute guarantees in legal, financial, or medical matters. Enterprises should independently evaluate final execution decisions.`,
  },
  {
    icon: Shield,
    title: "獨立沙盒與資料隱私聲明",
    titleEn: "Sandbox & Privacy Guarantee",
    color: "emerald",
    content: `客戶資料均於獨立沙盒（Sandbox）與 AES-256 加密環境中運算，本平台承諾絕不將企業機密資料用於公開模型訓練或出售給第三方。

All customer data is processed within isolated sandbox environments with AES-256 encryption. This platform commits to never using enterprise confidential data for public model training or selling to third parties.`,
  },
  {
    icon: Zap,
    title: "系統服務等級與 API 降級備援",
    titleEn: "SLA & Fallback Disclaimer",
    content: `系統預設具備多模型（Groq/DeepSeek/Claude）降級備援機制。若因上游大模型 API 業者發生不可抗力之全球性中斷，系統將自動切換備援線路，但不承擔因第三方 API 服務中斷所造成之衍生損失。

The system features multi-model (Groq/DeepSeek/Claude) fallback mechanisms by default. In the event of force majeure global outages from upstream LLM API providers, the system will automatically switch to backup routes, but does not assume liability for derivative losses caused by third-party API service interruptions.`,
  },
  {
    icon: CreditCard,
    title: "匯款對帳與交易條款",
    titleEn: "Payment & Wire Terms",
    content: `銀行電匯與 Payoneer 支付完成後，請保留交易憑證並通知專屬顧問。系統將於財務人工對帳完成後（1-2 個工作天內）正式開通授權。

After completing bank wire transfers and Payoneer payments, please retain transaction receipts and notify your dedicated consultant. The system will officially activate authorization after manual financial reconciliation is completed (within 1-2 business days).`,
  },
];

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        {/* 頂部 */}
        <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wider">
              免責聲明與服務條款
            </h2>
            <p className="text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              TERMS OF SERVICE & DISCLAIMER
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
          >
            <X size={16} className="text-white/40" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 前言 */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 mb-6">
            <p className="text-[11px] text-white/60 leading-relaxed">
              歡迎使用 Orbit Tower 賽博虛擬地產總部服務。在使用本平台提供的任何服務之前，請仔細閱讀並理解以下條款與聲明。
              使用本服務即表示您同意遵守以下所有條款。
            </p>
            <p className="text-[10px] text-white/40 leading-relaxed mt-2">
              Welcome to Orbit Tower Cyber Virtual HQ. Please carefully read and understand the following terms and disclaimers before using any services provided by this platform.
              By using this service, you agree to comply with all the following terms.
            </p>
          </div>

          {/* 四大條款 */}
          {CLAUSES.map((clause, idx) => {
            const Icon = clause.icon;
            return (
              <div
                key={idx}
                className="glass-panel rounded-xl p-5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      clause.color === "cyan"
                        ? "bg-cyan-400/10 border border-cyan-400/30"
                        : clause.color === "emerald"
                        ? "bg-emerald-400/10 border border-emerald-400/30"
                        : "bg-white/5 border border-white/10"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        clause.color === "cyan"
                          ? "text-cyan-400"
                          : clause.color === "emerald"
                          ? "text-emerald-400"
                          : "text-white/60"
                      }
                    />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 tracking-wider uppercase">
                      條款 {idx + 1} / Clause {idx + 1}
                    </div>
                    <h3 className="text-sm font-bold text-white mt-0.5">{clause.title}</h3>
                    <div className="text-[9px] text-white/40">{clause.titleEn}</div>
                  </div>
                </div>
                <div className="pl-12">
                  <p className="text-[11px] text-white/60 leading-relaxed whitespace-pre-line">
                    {clause.content}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 簽署區 */}
          <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5 mt-6">
            <div className="text-center">
              <div className="text-[10px] text-white/40 tracking-wider uppercase mb-2">
                最後更新 / Last Updated
              </div>
              <div className="text-xs text-cyan-300 font-mono">2026-10-05</div>
              <div className="text-[10px] text-white/40 mt-3">
                如有任何疑問，請聯繫我們的客服團隊
              </div>
              <div className="text-[10px] text-cyan-400/60 mt-1">
                support@orbit-tower.tw
              </div>
            </div>
          </div>

          {/* 確認按鈕 */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all mt-4"
          >
            我已閱讀並理解以上條款
          </button>
        </div>
      </div>
    </div>
  );
}
