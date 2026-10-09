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
      <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex items-center justify-center pt-3 sm:pt-6 px-2 sm:px-4">
          <div className="glass-panel rounded-xl sm:rounded-2xl px-4 sm:px-7 py-3 sm:py-4 hud-border pointer-events-auto w-full max-w-3xl">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              {/* Logo + 標題 */}
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <img 
                    src={logoSrc} 
                    alt={t("brand.name")} 
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-full"
                  />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-lg font-bold tracking-[0.15em] sm:tracking-[0.3em] text-white uppercase neon-text truncate">
                    SNT <span className="text-cyan-400">|</span> {t("brand.nameShort")}
                  </h1>
                  <p className="text-[11px] sm:text-sm tracking-[0.1em] sm:tracking-[0.2em] text-cyan-400/60 uppercase truncate">
                    <span className="hidden sm:inline">ORBIT TOWER · {t("brand.taglineShort")}</span>
                    <span className="sm:hidden">{t("brand.taglineShort")}</span>
                  </p>
                </div>
              </div>

              {/* 桌機選單 */}
              <div className="hidden sm:flex items-center gap-2.5">
                <button
                  onClick={onAboutClick}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
                >
                  <Info size={15} />
                  {t("nav.about")}
                </button>
                <button
                  onClick={onReadmeClick}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
                >
                  <BookOpen size={15} />
                  {t("nav.readme")}
                </button>
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
                >
                  <Share2 size={15} />
                  {t("nav.share")}
                </button>
                <button
                  onClick={onPricingClick}
                  className="text-sm px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
                >
                  {t("nav.pricing")}
                </button>
                <button
                  onClick={onLegalClick}
                  className="text-sm px-4 py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all tracking-wider"
                >
                  {t("nav.terms")}
                </button>
                <LanguageSwitcher />
                <button
                  onClick={onLoginClick}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20 transition-all tracking-wider font-bold"
                >
                  <LogIn size={15} />
                  {t("nav.login")}
                </button>
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400/80 tracking-wider uppercase">
                    {t("nav.online")}
                  </span>
                </div>
              </div>

              {/* 手機漢堡選單 */}
              <div className="flex sm:hidden items-center gap-2">
                <LanguageSwitcher />
                <button
                  onClick={() => setShareModalOpen(true)}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-cyan-400/30 transition-all"
                >
                  <Share2 size={18} className="text-white/60" />
                </button>
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
                >
                  {mobileMenuOpen ? (
                    <X size={20} className="text-white/60" />
                  ) : (
                    <Menu size={20} className="text-white/60" />
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
                  className="w-full flex items-center gap-3 text-left text-base px-4 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <Info size={18} />
                  {t("nav.aboutFull")}
                </button>
                <button
                  onClick={() => {
                    onReadmeClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 text-left text-base px-4 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  <BookOpen size={18} />
                  {t("nav.readmeFull")}
                </button>
                <button
                  onClick={() => {
                    onPricingClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-base px-4 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  {t("nav.pricing")}
                </button>
                <button
                  onClick={() => {
                    onLegalClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left text-base px-4 py-3.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  {t("nav.terms")}
                </button>
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 text-base px-4 py-3.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 font-bold"
                >
                  <LogIn size={18} />
                  {t("nav.login")}
                </button>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-400/80 tracking-wider uppercase">
                    {t("nav.online")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
    </>
  );
}
