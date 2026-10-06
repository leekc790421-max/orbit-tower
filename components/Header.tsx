"use client";

import { LogIn, Menu, X, Share2, Info, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Theme } from "@/data/units";

interface HeaderProps {
  theme?: Theme;
  onLoginClick: () => void;
  onPricingClick: () => void;
  onLegalClick: () => void;
  onAboutClick: () => void;
  onReadmeClick: () => void;
}

export default function Header({ theme = "cyber", onLoginClick, onPricingClick, onLegalClick, onAboutClick, onReadmeClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 根據主題選擇 logo
  const logoSrc = theme === "cloud" ? "/logo-light.jpg" : "/logo-dark.jpg";

  const handleShare = async () => {
    const shareData = {
      title: "SNT 光躍星樞 | 3D Cyber Luxury 專屬空間地產與自動化流量商場",
      text: "SNT 光躍星樞 (Orbit Tower) 結合 3D 空間展示、/drift 漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("連結已複製到剪貼簿！");
      } catch {
        // fallback failed
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-center pt-3 sm:pt-6 px-2 sm:px-4">
        <div className="glass-panel rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3 hud-border pointer-events-auto w-full max-w-2xl">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {/* Logo + 標題 */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img 
                  src={logoSrc} 
                  alt="SNT 光躍星樞" 
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold tracking-[0.15em] sm:tracking-[0.3em] text-white uppercase neon-text truncate">
                  SNT <span className="text-cyan-400">|</span> 光躍星樞
                </h1>
                <p className="text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.2em] text-cyan-400/60 uppercase truncate">
                  <span className="hidden sm:inline">ORBIT TOWER · 3D SAAS NEXUS</span>
                  <span className="sm:hidden">3D SAAS NEXUS</span>
                </p>
              </div>
            </div>

            {/* 桌機選單 */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onAboutClick}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                <Info size={13} />
                關於
              </button>
              <button
                onClick={onReadmeClick}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                <BookOpen size={13} />
                系統說明
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                <Share2 size={13} />
                分享
              </button>
              <button
                onClick={onPricingClick}
                className="text-xs px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                方案價格
              </button>
              <button
                onClick={onLegalClick}
                className="text-xs px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                使用條款
              </button>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 transition-all tracking-wider font-bold"
              >
                <LogIn size={13} />
                登入
              </button>
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-400/80 tracking-wider uppercase">
                  Online
                </span>
              </div>
            </div>

            {/* 手機漢堡選單 */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all"
              >
                <Share2 size={16} className="text-white/60" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
              >
                {mobileMenuOpen ? (
                  <X size={18} className="text-white/60" />
                ) : (
                  <Menu size={18} className="text-white/60" />
                )}
              </button>
            </div>
          </div>

          {/* 手機展開選單 */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onAboutClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-left text-sm px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                <Info size={15} />
                關於 SNT 光躍星樞
              </button>
              <button
                onClick={() => {
                  onReadmeClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 text-left text-sm px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                <BookOpen size={15} />
                系統說明 / README
              </button>
              <button
                onClick={() => {
                  onPricingClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                方案價格
              </button>
              <button
                onClick={() => {
                  onLegalClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-sm px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                使用條款
              </button>
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm px-4 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold"
              >
                <LogIn size={16} />
                登入
              </button>
              <div className="flex items-center justify-center gap-2 pt-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400/80 tracking-wider uppercase">
                  系統線上
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
