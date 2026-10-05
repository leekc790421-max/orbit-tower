"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Orbit Tower 是什麼？什麼是賽博虛擬地產？",
    answer:
      "Orbit Tower 是一座六角晶體摩天樓形態的虛擬企業總部平台。企業可在此「進駐」虛擬戶別，獲得專屬網域、AI 運算資源與品牌展示空間。結合 3D 互動體驗與實際 B2B 服務，打造獨特的數位商業地產模式。",
  },
  {
    question: "進駐 Orbit Tower 需要多少費用？",
    answer:
      "我們提供三種 B2B 方案：門戶體驗版 NT$35,000/次、成長升級版 NT$60,000/次（最受歡迎）、企業總部版 NT$120,000+/次（含 MRR 維護費 $3,000/月）。每個方案都包含不同的樓層位置、網域功能與 AI 運算配額。",
  },
  {
    question: "什麼是戶號實名制？如何綁定自己的網域？",
    answer:
      "每戶具備唯一識別碼（如 TOWER-F12-U03），需通過手機/Email 實名驗證開通。網域對映支援兩種方式：標準子網域（unit103.orbit-tower.tw）由系統自動配發；獨立頂級網域可透過 CNAME 無痛綁定您自有的 www.clientbrand.com。",
  },
  {
    question: "AI 樓管能做什麼？如何幫助我的企業？",
    answer:
      "AI 樓管（Orbit Building Agent）24 小時在線，可提供：樓層導覽與戶別介紹、B2B 方案說明、網域綁定教學、機密沙盒環境說明。當 AI 推薦樓層時，3D 鏡頭會自動聚焦到該戶別，提供沉浸式帶看體驗。",
  },
  {
    question: "機密沙盒（F面）是什麼？資安如何保障？",
    answer:
      "F 面「機密沙盒實案」專區專為需要高度資安防護的企業設計。特色包括：獨立隔離運算環境、AES-256 加密、紅色保護罩視覺標識、需通過多重身份驗證。客戶資料絕不用於公開模型訓練或出售給第三方。",
  },
  {
    question: "如何付款？支援哪些支付方式？",
    answer:
      "支援三種支付方式：(1) 臺灣銀行電匯（松山分行，SWIFT: BKTWTWTP）；(2) 樂天國際商業銀行數位帳戶；(3) Payoneer 快速線上支付（支援信用卡、銀行轉帳）。匯款完成後請保留憑證，1-2 個工作天內完成對帳開通。",
  },
  {
    question: "3D 大樓的三種環境背景有什麼差異？",
    answer:
      "提供三種沉浸式環境：(1) 賽博夜城 — 雨後暗黑霓虹街景，適合科技新創；(2) 雲海高山 — 高空雲海日出，展現頂級尊榮感；(3) 深海星光 — 深海微光與生物螢光粒子，營造高資安防衛意象。可隨時一鍵切換。",
  },
  {
    question: "Orbit Tower 適合哪些類型的企業？",
    answer:
      "六角大樓六個面向分別服務不同業態：A面科技新創、B面個人品牌、C面自動金流商戶、D面AI診斷專區、E面GEO搜尋品牌、F面機密沙盒實案。無論您是新創團隊、自由職業者、還是大型企業，都能找到適合的虛擬總部空間。",
  },
];

export default function FAQSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <>
      {/* FAQ 觸發按鈕 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-20 sm:top-24 right-2 sm:right-6 z-40 glass-panel rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2 hud-border flex items-center gap-1.5 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <HelpCircle size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[9px] sm:text-[10px] text-cyan-300 font-bold tracking-wider">FAQ</span>
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
                  常見問題 / FAQ
                </h2>
                <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
                  FREQUENTLY ASKED QUESTIONS
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
