"use client";

import { Hexagon, LogIn, Menu, X, Share2 } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onLoginClick: () => void;
  onPricingClick: () => void;
  onLegalClick: () => void;
}

export default function Header({ onLoginClick, onPricingClick, onLegalClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Orbit Tower — 賽博虛擬地產總部",
      text: "六角晶體摩天樓 3D 互動體驗，企業旗艦空間、網域對映、AI 樓管導覽",
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
                <Hexagon size={20} className="text-cyan-400 sm:w-7 sm:h-7" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-[10px] sm:text-sm font-bold tracking-[0.15em] sm:tracking-[0.3em] text-white uppercase neon-text truncate">
                  Orbit Tower
                </h1>
                <p className="text-[7px] sm:text-[9px] tracking-[0.1em] sm:tracking-[0.2em] text-cyan-400/60 uppercase truncate">
                  <span className="hidden sm:inline">賽博虛擬地產總部 · Cyber Virtual HQ</span>
                  <span className="sm:hidden">Cyber HQ</span>
                </p>
              </div>
            </div>

            {/* 桌機選單 */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                <Share2 size={12} />
                分享
              </button>
              <button
                onClick={onPricingClick}
                className="text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                定價方案
              </button>
              <button
                onClick={onLegalClick}
                className="text-[10px] px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
              >
                服務條款
              </button>
              <button
                onClick={onLoginClick}
                className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 transition-all tracking-wider font-bold"
              >
                <LogIn size={12} />
                登入
              </button>
              <div className="flex items-center gap-1.5 pl-3 border-l border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400/80 tracking-wider uppercase">
                  Online
                </span>
              </div>
            </div>

            {/* 手機漢堡選單 */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all"
              >
                <Share2 size={14} className="text-white/60" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
              >
                {mobileMenuOpen ? (
                  <X size={16} className="text-white/60" />
                ) : (
                  <Menu size={16} className="text-white/60" />
                )}
              </button>
            </div>
          </div>

          {/* 手機展開選單 */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onPricingClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-[11px] px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                定價方案 / Pricing
              </button>
              <button
                onClick={() => {
                  onLegalClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left text-[11px] px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
              >
                服務條款 / Terms
              </button>
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-[11px] px-3 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold"
              >
                <LogIn size={14} />
                登入 / Login
              </button>
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] text-emerald-400/80 tracking-wider uppercase">
                  System Online
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
