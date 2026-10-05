"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "您好！我是 Orbit Tower 的 AI 樓管。🏢\n\n歡迎來到賽博虛擬地產總部。目前我們有 6 層樓、每層 6 戶的六角晶體空間可供進駐。\n\n需要我帶您參觀哪些樓層？或者您對哪個業態分類有興趣？",
  },
];

const SUGGESTIONS = [
  "帶我看 3F 的空置戶",
  "F 面機密沙盒是什麼？",
  "B2B 方案有哪些？",
  "如何綁定自己的網域？",
];

export default function AIConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // 模擬 AI 回應
    setTimeout(() => {
      const response = generateResponse(content.trim());
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const generateResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("3f") || lower.includes("3樓") || lower.includes("三樓")) {
      return "好的！讓我為您聚焦到 3F 商戶營運層。\n\n目前 3F 的戶別狀態：\n• 301 (A面 科技新創) — 空置待租\n• 302 (B面 個人品牌) — 空置待租\n• 303 (C面 自動金流) — 空置待租\n\n要幫您預約 301 戶的實地參觀嗎？";
    }
    if (lower.includes("f面") || lower.includes("機密") || lower.includes("沙盒")) {
      return "F 面是我們的「機密沙盒實案」專區，專為需要高度資安防護的企業設計。\n\n特色：\n🔒 獨立隔離運算環境\n🛡️ 紅色保護罩視覺標識\n🔐 需通過多重身份驗證\n\n目前 306 戶由 Vault-X 進駐，進行機密沙盒運算。";
    }
    if (lower.includes("方案") || lower.includes("價格") || lower.includes("b2b")) {
      return "我們提供三種 B2B 進駐方案：\n\n💎 基礎方案 — NT$35,000/月\n• 標準六角戶別空間\n• 子網域配發 (unit.orbit-tower.tw)\n• 基礎頻寬與運算配額\n\n🏆 專業方案 — NT$60,000/月\n• 優選樓層戶別\n• 獨立頂級網域 CNAME 綁定\n• 進階 AI 運算配額\n• 24/7 技術支援\n\n👑 旗艦方案 — NT$120,000/月\n• 頂樓 Penthouse 空間\n• 8K Lab 等級硬體\n• 完整沙盒環境\n• 專屬客戶經理";
    }
    if (lower.includes("網域") || lower.includes("domain") || lower.includes("cname")) {
      return "網域綁定非常簡單！\n\n1️⃣ 標準子網域：系統自動配發\n   例如：unit103.orbit-tower.tw\n\n2️⃣ 獨立頂級網域：CNAME 無痛綁定\n   支援將您的 www.clientbrand.com 對映至本大樓戶別。\n\n3️⃣ DNS 設定：後台一鍵完成\n   無需技術背景，AI 樓管引導設定。\n\n需要我協助您進行網域規劃嗎？";
    }
    return "感謝您的詢問！作為 Orbit Tower 的 AI 樓管，我可以為您提供：\n\n🏢 樓層導覽與戶別介紹\n📋 B2B 方案說明\n🌐 網域綁定教學\n🔐 機密沙盒環境說明\n\n請告訴我您感興趣的方向，我會為您詳細介紹！";
  };

  return (
    <>
      {/* 對話按鈕 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full glass-panel border border-cyan-400/30 flex items-center justify-center hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 animate-float group"
        >
          <MessageCircle size={22} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
        </button>
      )}

      {/* 對話框 */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-[360px] h-[520px] glass-panel rounded-2xl border border-cyan-400/20 flex flex-col shadow-2xl shadow-cyan-400/10">
          {/* 標題列 */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                <Bot size={16} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white tracking-wider">AI 樓管</div>
                <div className="text-[9px] text-cyan-400/60">Orbit Building Agent</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
            >
              <X size={14} className="text-white/40" />
            </button>
          </div>

          {/* 訊息區 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-cyan-400/20 border border-cyan-400/40"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={12} className="text-cyan-400" />
                  ) : (
                    <User size={12} className="text-white/60" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "assistant"
                      ? "bg-white/5 border border-white/10 text-white/80"
                      : "bg-cyan-400/10 border border-cyan-400/20 text-cyan-100"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                  <Bot size={12} className="text-cyan-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 建議選項 */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[10px] px-2 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300/70 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 輸入區 */}
          <div className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="輸入訊息..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center hover:bg-cyan-400/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <Send size={14} className="text-cyan-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
