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

  const logoSrc = theme === "cloud" ? "/logo-light.jpg" : "/logo-dark.jpg";

  return (
    <>
      {/* === 左上角：品牌 Logo === */}
      <div className="fixed top-2 sm:top-4 left-2 sm:left-3 z-40 pointer-events-auto">
        <div className="glass-panel rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 hud-border">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <img 
              src={logoSrc} 
              alt={t("brand.name")} 
              className="w-6 h-6 sm:w-8 sm:h-8 object-contain rounded-full"
            />
            <div className="min-w-0">
              <h1 className="text-[10px] sm:text-xs font-bold tracking-[0.1em] sm:tracking-[0.15em] text-white uppercase neon-text truncate">
                SNT <span className="text-cyan-400">|</span> {t("brand.nameShort")}
              </h1>
              <p className="text-[7px] sm:text-[9px] tracking-[0.08em] text-cyan-400/50 uppercase truncate">
                {t("brand.taglineShort")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* === 右上角：功能按鈕 === */}
      <div className="fixed top-2 sm:top-4 right-2 sm:right-3 z-40 pointer-events-auto">
        <div className="glass-panel rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 hud-border">
          {/* 桌機選單 */}
          <div className="hidden sm:flex items-center gap-1.5">
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

          {/* 手機選單 */}
          <div className="flex sm:hidden items-center gap-1.5">
            <LanguageSwitcher />
            <button
              onClick={() => setShareModalOpen(true)}
              className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all"
            >
              <Share2 size={13} className="text-white/50" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-7 h-7 rounded-md border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
            >
              {mobileMenuOpen ? (
                <X size={14} className="text-white/50" />
              ) : (
                <Menu size={14} className="text-white/50" />
              )}
            </button>
          </div>
        </div>

        {/* 手機展開選單 — 往下展開 */}
        {mobileMenuOpen && (
          <div className="sm:hidden mt-1 glass-panel rounded-lg p-2 hud-border space-y-1">
            <button onClick={() => { onAboutClick(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 text-left text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <Info size={13} />
              {t("nav.aboutFull")}
            </button>
            <button onClick={() => { onReadmeClick(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 text-left text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              <BookOpen size={13} />
              {t("nav.readmeFull")}
            </button>
            <button onClick={() => { onPricingClick(); setMobileMenuOpen(false); }} className="w-full text-left text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              {t("nav.pricing")}
            </button>
            <button onClick={() => { onLegalClick(); setMobileMenuOpen(false); }} className="w-full text-left text-xs px-3 py-2 rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all">
              {t("nav.terms")}
            </button>
            <button onClick={() => { onLoginClick(); setMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 text-xs px-3 py-2 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold">
              <LogIn size={13} />
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
