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
        className="sm:hidden glass-panel rounded-xl px-4 py-3 hud-border flex items-center gap-2 mb-2 w-full justify-center"
      >
        <Palette size={18} className="text-cyan-400" />
        <span className="text-sm text-cyan-300 font-bold tracking-wider">控制面板</span>
        {expanded ? <ChevronDown size={16} className="text-cyan-400" /> : <ChevronUp size={16} className="text-cyan-400" />}
      </button>

      {/* 面板主體 */}
      <div className={`${expanded ? "flex" : "hidden"} sm:flex flex-col gap-2 sm:gap-3`}>
        {/* 選購方案按鈕 */}
        <button
          onClick={onPricingClick}
          className="glass-panel rounded-xl px-4 py-3 hud-border flex items-center justify-center gap-2 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <ShoppingBag size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-cyan-300 font-bold tracking-wider">認領店面</span>
        </button>

        {/* 環境切換 */}
        <div className="glass-panel rounded-xl p-3 sm:p-4 hud-border">
          <div className="text-xs sm:text-sm tracking-widest text-cyan-400 mb-2 sm:mb-3 uppercase font-bold">
            場景氛圍
          </div>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {(Object.keys(THEME_LABELS) as Theme[]).map((t) => {
              const Icon = themeIcons[t];
              const isActive = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => onThemeChange(t)}
                  className={`
                    cyber-button flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                    transition-all duration-300 border
                    ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white/80"
                    }
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className="font-medium">{THEME_LABELS[t].zh}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 燈光切換 */}
        <div className="glass-panel rounded-xl p-3 sm:p-4 hud-border">
          <div className="text-xs sm:text-sm tracking-widest text-cyan-400 mb-2 sm:mb-3 uppercase font-bold flex items-center gap-2">
            <Palette size={14} />
            <span>光譜色調</span>
          </div>
          <div className="flex gap-3 justify-center">
            {(Object.keys(LIGHT_COLORS) as LightColor[]).map((c) => {
              const isActive = lightColor === c;
              return (
                <button
                  key={c}
                  onClick={() => onLightColorChange(c)}
                  title={LIGHT_COLORS[c].label}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all duration-300
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
          <div className="text-xs text-white/40 mt-2 text-center">
            {LIGHT_COLORS[lightColor].label}
          </div>
        </div>
      </div>
    </div>
  );
}
