"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, X } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: "Orbit Tower 是什麼？",
    answer:
      "Orbit Tower 是一個虛擬企業總部平台。我們用 3D 技術打造了一座六角晶體摩天樓，讓企業可以在這裡「進駐」虛擬空間，建立自己的數位據點。每個戶別都有專屬網域和 AI 資源，幫助你在線上建立專業形象。",
  },
  {
    question: "進駐需要多少費用？",
    answer:
      "我們提供三種方案：基礎方案 NT$35,000、專業方案 NT$60,000（最受歡迎）、旗艦方案 NT$120,000+（含月費 $3,000）。每個方案包含不同的樓層位置、網域功能和 AI 資源配額。",
  },
  {
    question: "如何綁定我自己的網域？",
    answer:
      "有兩種方式：(1) 系統自動配發子網域，例如 unit103.orbit-tower.tw；(2) 綁定你自己的網域，例如 www.yourbrand.com，透過 CNAME 設定就能無痛對接。不需要技術背景，AI 樓管會一步步教你設定。",
  },
  {
    question: "AI 樓管能做什麼？",
    answer:
      "AI 樓管 24 小時在線，可以回答你的問題、帶你參觀大樓、介紹方案價格、教你設定網域。當 AI 推薦某個樓層時，3D 鏡頭會自動移動到那個位置，讓你直接看到實際空間。",
  },
  {
    question: "我的資料安全嗎？",
    answer:
      "絕對安全。我們使用獨立沙盒環境和 AES-256 加密保護你的資料。每個企業戶別都是獨立隔離的，需要多重身份驗證才能存取。你的資料絕不會被用於訓練公開 AI 模型或賣給第三方。",
  },
  {
    question: "如何付款？",
    answer:
      "支援三種方式：(1) 銀行電匯（臺灣銀行松山分行）；(2) 樂天銀行數位帳戶；(3) Payoneer 線上支付（支援信用卡）。匯款後請保留憑證，1-2 個工作天內會完成對帳並開通你的空間。",
  },
  {
    question: "三種背景主題有什麼差別？",
    answer:
      "三種主題只是視覺風格不同，功能完全一樣：(1) 霓虹夜城 — 賽博龐克風格，適合科技業；(2) 雲海日出 — 溫暖大氣，適合品牌展示；(3) 深海秘境 — 神秘高級感，適合需要隱私的企業。你可以隨時切換。",
  },
  {
    question: "適合什麼樣的企業使用？",
    answer:
      "適合所有需要線上據點的企業：新創團隊可以用低成本建立專業形象；自由工作者可以提升接案說服力；中小企業可以擴展數位足跡；大型企業可以展示創新形象。無論你的產業或規模，都能在 Orbit Tower 找到適合的空間。",
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
          className="fixed top-20 sm:top-24 right-2 sm:right-6 z-40 glass-panel rounded-xl px-3 py-2 hud-border flex items-center gap-2 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <HelpCircle size={16} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-cyan-300 font-bold tracking-wider">常見問題</span>
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
