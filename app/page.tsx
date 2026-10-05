"use client";

import { useState, useCallback } from "react";
import * as THREE from "three";
import Scene from "@/components/Scene";
import Header from "@/components/Header";
import ControlHUD from "@/components/ControlHUD";
import FloorIndicator from "@/components/FloorIndicator";
import UnitInfoCard from "@/components/UnitInfoCard";
import AIConcierge from "@/components/AIConcierge";
import type { Theme, LightColor, Unit } from "@/data/units";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("cyber");
  const [lightColor, setLightColor] = useState<LightColor>("cyber-blue");
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [activeFloor, setActiveFloor] = useState<number | null>(null);

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

      {/* 掃描線覆蓋層 */}
      <div className="scanline-overlay" />

      {/* 頂部標題 */}
      <Header />

      {/* 左側樓層指示器 */}
      <FloorIndicator activeFloor={activeFloor} onFloorSelect={handleFloorSelect} />

      {/* 右下角控制面板 */}
      <ControlHUD
        theme={theme}
        lightColor={lightColor}
        onThemeChange={setTheme}
        onLightColorChange={setLightColor}
      />

      {/* 左下角 AI 樓管 */}
      <AIConcierge />

      {/* 戶別資訊卡 */}
      <UnitInfoCard unit={selectedUnit} onClose={handleCloseCard} />

      {/* 底部狀態列 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-4 text-[9px] tracking-widest text-white/20 uppercase">
            <span>Orbit Tower v1.0</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>3D Interactive Experience</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Hex Crystal Architecture</span>
          </div>
        </div>
      </div>
    </main>
  );
}
