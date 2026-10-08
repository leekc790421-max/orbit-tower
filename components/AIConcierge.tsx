"use client";

import { useState, useRef, useMemo } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

export default function AIConcierge() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  // Welcome message always reflects current locale
  const welcomeMessage: Message = useMemo(() => ({
    id: "welcome",
    role: "assistant",
    content: t("ai.welcome"),
  }), [t]);

  // All messages = welcome + user conversation
  const messages = useMemo(() => [welcomeMessage, ...userMessages], [welcomeMessage, userMessages]);

  const suggestions = [t("ai.sug1"), t("ai.sug2"), t("ai.sug3"), t("ai.sug4")];

  const handleSend = async (text?: string) => {
    const content = text || input;
    if (!content.trim()) return;

    idCounter.current += 1;
    const userMsg: Message = {
      id: `msg-${idCounter.current}`,
      role: "user",
      content: content.trim(),
    };
    setUserMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const delay = 800 + (idCounter.current % 10) * 120;
    setTimeout(() => {
      const response = generateResponse(content.trim());
      idCounter.current += 1;
      const aiMsg: Message = {
        id: `msg-${idCounter.current}`,
        role: "assistant",
        content: response,
      };
      setUserMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, delay);
  };

  const generateResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes("3f") || lower.includes("3") || lower.includes("三")) {
      return t("ai.resp3f");
    }
    if (lower.includes("f") || lower.includes("sandbox") || lower.includes("沙盒") || lower.includes("サンド")) {
      return t("ai.respSandbox");
    }
    if (lower.includes("plan") || lower.includes("pricing") || lower.includes("b2b") || lower.includes("方案") || lower.includes("プラン")) {
      return t("ai.respPlan");
    }
    if (lower.includes("domain") || lower.includes("cname") || lower.includes("網域") || lower.includes("ドメイン")) {
      return t("ai.respDomain");
    }
    return t("ai.respDefault");
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-14 sm:bottom-6 left-2 sm:left-6 z-50 w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-panel border border-cyan-400/30 flex items-center justify-center hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 group"
        >
          <MessageCircle size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-400 rounded-full animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-12 sm:bottom-6 left-2 sm:left-6 right-2 sm:right-auto z-50 sm:w-[360px] h-[60vh] sm:h-[520px] max-h-[520px] glass-panel rounded-2xl border border-cyan-400/20 flex flex-col shadow-2xl shadow-cyan-400/10">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                <Bot size={14} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold text-white tracking-wider">{t("ai.title")}</div>
                <div className="text-[8px] sm:text-[9px] text-cyan-400/60">{t("ai.subtitle")}</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
            >
              <X size={14} className="text-white/40" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-cyan-400/20 border border-cyan-400/40"
                      : "bg-white/10 border border-white/20"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={10} className="text-cyan-400" />
                  ) : (
                    <User size={10} className="text-white/60" />
                  )}
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] sm:text-xs leading-relaxed whitespace-pre-line ${
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
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center">
                  <Bot size={10} className="text-cyan-400" />
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

          {userMessages.length === 0 && (
            <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-[9px] sm:text-[10px] px-2 py-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300/70 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div className="p-2 sm:p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={t("ai.placeholder")}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] sm:text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40 transition-colors"
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
