"use client";

import { useState } from "react";
import { THEME_LABELS, LIGHT_COLORS, type Theme, type LightColor } from "@/data/units";
import { Monitor, Sun, Waves, Palette, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";

interface ControlHUDProps {
  theme: Theme;
  lightColor: LightColor;
  onThemeChange: (theme: Theme) => void;
  onLightColorChange: (color: LightColor) => void;
  onPricingClick: () => void;
}

const themeIcons: Record<Theme, typeof Monitor> = {
  cyber: Monitor,
  cloud: Sun,
  deepsea: Waves,
};

export default function ControlHUD({
  theme,
  lightColor,
  onThemeChange,
  onLightColorChange,
  onPricingClick,
}: ControlHUDProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-14 sm:bottom-6 right-2 sm:right-6 z-50 w-auto">
      {/* 手機版：收合按鈕 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="sm:hidden glass-panel rounded-xl px-3 py-2 hud-border flex items-center gap-2 mb-2 w-full justify-center"
      >
        <Palette size={14} className="text-cyan-400" />
        <span className="text-[10px] text-cyan-300 font-bold tracking-wider">控制面板</span>
        {expanded ? <ChevronDown size={12} className="text-cyan-400" /> : <ChevronUp size={12} className="text-cyan-400" />}
      </button>

      {/* 面板主體 */}
      <div className={`${expanded ? "flex" : "hidden"} sm:flex flex-col gap-2 sm:gap-3`}>
        {/* 選購方案按鈕 */}
        <button
          onClick={onPricingClick}
          className="glass-panel rounded-xl px-3 py-2 hud-border flex items-center justify-center gap-2 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <ShoppingBag size={14} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs text-cyan-300 font-bold tracking-wider">選購方案</span>
        </button>

        {/* 環境切換 */}
        <div className="glass-panel rounded-xl p-2 sm:p-3 hud-border">
          <div className="text-[8px] sm:text-[10px] tracking-widest text-cyan-400 mb-1.5 sm:mb-2 uppercase font-bold">
            環境背景
          </div>
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {(Object.keys(THEME_LABELS) as Theme[]).map((t) => {
              const Icon = themeIcons[t];
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`
                    cyber-button flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs
                    transition-all duration-300 border
                    ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white/80"
                    }
                  `}
                >
                  <Icon size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="font-medium text-[9px] sm:text-xs">{THEME_LABELS[t].zh}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 燈光切換 */}
        <div className="glass-panel rounded-xl p-2 sm:p-3 hud-border">
          <div className="text-[8px] sm:text-[10px] tracking-widest text-cyan-400 mb-1.5 sm:mb-2 uppercase font-bold flex items-center gap-1">
            <Palette size={10} />
            <span>光譜自訂</span>
          </div>
          <div className="flex gap-2 sm:gap-2.5 justify-center">
            {(Object.keys(LIGHT_COLORS) as LightColor[]).map((c) => {
              const isActive = lightColor === c;
              return (
                <button
                  key={c}
                  onClick={() => onLightColorChange(c)}
                  title={LIGHT_COLORS[c].label}
                  className={`
                    w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-300
                    ${isActive ? "scale-110 border-white" : "border-white/20 hover:border-white/50"}
                  `}
                  style={{
                    backgroundColor: LIGHT_COLORS[c].hex,
                    boxShadow: isActive ? `0 0 15px ${LIGHT_COLORS[c].hex}` : "none",
                  }}
                />
              );
            })}
          </div>
          <div className="text-[8px] sm:text-[9px] text-white/40 mt-1.5 text-center">
            {LIGHT_COLORS[lightColor].label}
          </div>
        </div>
      </div>
    </div>
  );
}
