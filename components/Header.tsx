"use client";

import { LogIn, Menu, X, Share2, Info, BookOpen } from "lucide-react";
import { useState } from "react";
import type { Theme } from "@/data/units";
import { useTranslation } from "@/lib/i18n";
import LanguageSwitcher from "./LanguageSwitcher";
import ShareModal from "./ShareModal";

interface HeaderProps {
  theme?: Theme;
  onLoginClick: () => void;
  onPricingClick: () => void;
  onLegalClick: () => void;
  onAboutClick: () => void;
  onReadmeClick: () => void;
}

export default function Header({ theme = "cyber", onLoginClick, onPricingClick, onLegalClick, onAboutClick, onReadmeClick }: HeaderProps) {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const logoSrc = "/orbit-logo.jpg";

  return (
    <>
      {/* === 左上角：品牌 Logo === */}
      <div className="orbit-control-left fixed top-1.5 sm:top-2.5 md:top-4 left-1.5 sm:left-2 md:left-3 z-50 pointer-events-auto">
        <div className="orbit-header-panel glass-hud-premium rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hud-border">
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
            <img 
              src={logoSrc} 
              alt={t("brand.name")} 
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 object-contain rounded-full"
            />
            <div className="min-w-0">
              <h1 className="text-[9px] sm:text-[10px] md:text-xs font-bold tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.15em] text-white uppercase neon-text truncate max-w-[80px] sm:max-w-[100px] md:max-w-none font-tech">
                SNT <span className="text-cyan-400">|</span> {t("brand.nameShort")}
              </h1>
              <p className="text-[6px] sm:text-[7px] md:text-[9px] tracking-[0.06em] text-cyan-400/50 uppercase truncate font-mono-data">
                {t("brand.taglineShort")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === 右上角：功能按鈕 === */}
      <div className="orbit-control-right fixed top-1.5 sm:top-2.5 md:top-4 right-1.5 sm:right-2 md:right-3 z-50 pointer-events-auto">
        <div className="orbit-header-actions glass-hud-premium rounded-lg sm:rounded-xl px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 hud-border">
          {/* 桌面選單 (> 768px) */}
          <div className="hidden md:flex items-center gap-1.5">
            <button onClick={onAboutClick} className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              <Info size={12} />
              {t("nav.about")}
            </button>
            <button onClick={onReadmeClick} className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              <BookOpen size={12} />
              {t("nav.readme")}
            </button>
            <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              <Share2 size={12} />
            </button>
            <button onClick={onPricingClick} className="text-[11px] px-2 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              {t("nav.pricing")}
            </button>
            <button onClick={onLegalClick} className="text-[11px] px-2 py-1.5 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              {t("nav.terms")}
            </button>
            <LanguageSwitcher />
            <button onClick={onLoginClick} className="flex items-center gap-1 text-[11px] px-2 py-1.5 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 transition-all tracking-wider font-bold">
              <LogIn size={12} />
              {t("nav.login")}
            </button>
          </div>

          {/* 車載機選單 (640-768px) — 精簡橫向 */}
          <div className="hidden sm:flex md:hidden items-center gap-1">
            <button onClick={onAboutClick} className="flex items-center gap-0.5 text-[9px] px-1.5 py-1 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              <Info size={10} />
              {t("nav.about")}
            </button>
            <button onClick={onPricingClick} className="text-[9px] px-1.5 py-1 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all tracking-wider">
              {t("nav.pricing")}
            </button>
            <button onClick={() => setShareModalOpen(true)} className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all">
              <Share2 size={10} className="text-white/50" />
            </button>
            <LanguageSwitcher />
            <button onClick={onLoginClick} className="flex items-center gap-0.5 text-[9px] px-1.5 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 transition-all tracking-wider font-bold">
              <LogIn size={10} />
              {t("nav.login")}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
            >
              {mobileMenuOpen ? (
                <X size={11} className="text-white/50" />
              ) : (
                <Menu size={11} className="text-white/50" />
              )}
            </button>
          </div>

          {/* 手機選單 (< 640px) */}
          <div className="flex sm:hidden items-center gap-1">
            <LanguageSwitcher />
            <button
              onClick={() => setShareModalOpen(true)}
              className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all"
            >
              <Share2 size={12} className="text-white/50" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-6 h-6 rounded-md border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
            >
              {mobileMenuOpen ? (
                <X size={13} className="text-white/50" />
              ) : (
                <Menu size={13} className="text-white/50" />
              )}
            </button>
          </div>
        </div>

        {/* 手機/車載機展開選單 — 往下展開 */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-1 glass-panel rounded-lg p-2 hud-border space-y-1 min-w-[160px]">
            <button onClick={() => { onAboutClick(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 text-left text-[11px] sm:text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <Info size={12} />
              {t("nav.aboutFull")}
            </button>
            <button onClick={() => { onReadmeClick(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 text-left text-[11px] sm:text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <BookOpen size={12} />
              {t("nav.readmeFull")}
            </button>
            <button onClick={() => { onPricingClick(); setMobileMenuOpen(false); }} className="w-full text-left text-[11px] sm:text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              {t("nav.pricing")}
            </button>
            <button onClick={() => { onLegalClick(); setMobileMenuOpen(false); }} className="w-full text-left text-[11px] sm:text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              {t("nav.terms")}
            </button>
            <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 text-[11px] sm:text-xs px-3 py-2 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
              <LogIn size={12} />
              {t("nav.login")}
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
}
