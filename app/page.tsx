"use client";

import { useState, useCallback } from "react";
import * as THREE from "three";
import Scene from "@/components/Scene";
import Header from "@/components/Header";
import ControlHUD from "@/components/ControlHUD";
import FloorIndicator from "@/components/FloorIndicator";
import UnitInfoCard from "@/components/UnitInfoCard";
import AIConcierge from "@/components/AIConcierge";
import PricingModal from "@/components/PricingModal";
import AuthModal from "@/components/AuthModal";
import LegalModal from "@/components/LegalModal";
import SecurityFooter from "@/components/SecurityFooter";
import FAQSection from "@/components/FAQSection";
import Onboarding from "@/components/Onboarding";
import AboutModal from "@/components/AboutModal";
import ReadmeModal from "@/components/ReadmeModal";
import { I18nProvider, useTranslation } from "@/lib/i18n";
import type { Theme, LightColor, Unit } from "@/data/units";

function HomeInner() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>("cyber");
  const [lightColor, setLightColor] = useState<LightColor>("cyber-blue");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeFloor, setActiveFloor] = useState<number | null>(null);

  // Modal 狀態
  const [pricingOpen, setPricingOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  
  // 首次進入顯示新手引導 - 使用 lazy initialization
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const hasVisited = localStorage.getItem("orbit-tower-visited");
    if (!hasVisited) {
      localStorage.setItem("orbit-tower-visited", "true");
      return true;
    }
    return false;
  });
  
  const [aboutOpen, setAboutOpen] = useState(false);
  const [readmeOpen, setReadmeOpen] = useState(false);

  const handleUnitClick = useCallback((unit: Unit, _position: THREE.Vector3) => {
    setSelectedUnit(unit);
    setActiveFloor(unit.floor);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedUnit(null);
  }, []);

  const handleFloorSelect = useCallback((floor: number) => {
    setActiveFloor(floor);
  }, []);

  return (
    <main className="relative w-full h-full">
      {/* 3D 場景 */}
      <Scene theme={theme} lightColor={lightColor} onUnitClick={handleUnitClick} />

      {/* 掃描線覆蓋層（手機版 CSS 自動隱藏） */}
      <div className="scanline-overlay" />

      {/* 頂部標題（含登入/定價/條款/關於/README 入口） */}
      <Header
        theme={theme}
        onLoginClick={() => setAuthOpen(true)}
        onPricingClick={() => setPricingOpen(true)}
        onLegalClick={() => setLegalOpen(true)}
        onAboutClick={() => setAboutOpen(true)}
        onReadmeClick={() => setReadmeOpen(true)}
      />

      {/* 左側樓層指示器 */}
      <FloorIndicator activeFloor={activeFloor} onFloorSelect={handleFloorSelect} />

      {/* 右下角控制面板 */}
      <ControlHUD
        theme={theme}
        lightColor={lightColor}
        onThemeChange={setTheme}
        onLightColorChange={setLightColor}
        onPricingClick={() => setPricingOpen(true)}
      />

      {/* 左下角 AI 樓管 */}
      <AIConcierge />

      {/* 戶別資訊卡 */}
      <UnitInfoCard unit={selectedUnit} onClose={handleCloseCard} />

      {/* 資安防護狀態 + 免責聲明入口 Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <SecurityFooter />
        {/* 免責聲明按鈕 */}
        <div className="flex items-center justify-center pb-0.5 sm:pb-1 pointer-events-auto">
          <button
            onClick={() => setLegalOpen(true)}
            className="text-[7px] sm:text-[9px] text-white/20 hover:text-white/40 tracking-wider transition-colors px-2 sm:px-3 py-0.5 sm:py-1"
          >
            {t("security.disclaimer")}
          </button>
        </div>
      </div>

      {/* FAQ 區塊 */}
      <FAQSection />

      {/* 關於區塊 */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />

      {/* README 系統說明 */}
      <ReadmeModal isOpen={readmeOpen} onClose={() => setReadmeOpen(false)} />

      {/* 新手引導 */}
      {onboardingOpen && (
        <Onboarding onClose={() => setOnboardingOpen(false)} />
      )}

      {/* ===== Modals ===== */}
      <PricingModal isOpen={pricingOpen} onClose={() => setPricingOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} />
    </main>
  );
}

export default function Home() {
  return (
    <I18nProvider>
      <HomeInner />
    </I18nProvider>
  );
}
