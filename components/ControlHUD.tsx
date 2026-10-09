"use client";

import { useState } from "react";
import { THEME_LABELS, LIGHT_COLORS, type Theme, type LightColor } from "@/data/units";
import { Monitor, Sun, Waves, Palette, ShoppingBag, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

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
  const { t, locale } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const getThemeLabel = (th: Theme) => {
    return t(`theme.${th}`);
  };

  const getLightLabel = (c: LightColor) => {
    const keyMap: Record<LightColor, string> = {
      amber: "light.amber",
      emerald: "light.emerald",
      "cyber-blue": "light.cyberBlue",
      aurora: "light.aurora",
    };
    return t(keyMap[c]);
  };

  return (
    <div className="fixed bottom-10 sm:bottom-4 right-1 sm:right-3 z-50 w-auto">
      {/* 手機版展開按鈕 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="sm:hidden glass-panel rounded-lg px-2.5 py-1.5 hud-border flex items-center gap-1.5 mb-1 w-full justify-center"
      >
        <Palette size={13} className="text-cyan-400" />
        <span className="text-[10px] text-cyan-300 font-bold tracking-wider">{t("hud.panel")}</span>
        {expanded ? <ChevronDown size={12} className="text-cyan-400" /> : <ChevronUp size={12} className="text-cyan-400" />}
      </button>

      <div className={`${expanded ? "flex" : "hidden"} sm:flex flex-col gap-1 sm:gap-2`}>
        {/* 認領按鈕 */}
        <button
          onClick={onPricingClick}
          className="glass-panel rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 hud-border flex items-center justify-center gap-1.5 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <ShoppingBag size={13} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] sm:text-xs text-cyan-300 font-bold tracking-wider">{t("hud.claimStore")}</span>
        </button>

        {/* 主題切換 */}
        <div className="glass-panel rounded-lg p-1.5 sm:p-2.5 hud-border">
          <div className="text-[8px] sm:text-[10px] tracking-widest text-cyan-400/70 mb-1 sm:mb-1.5 uppercase font-bold">
            {t("hud.sceneAmbience")}
          </div>
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {(Object.keys(THEME_LABELS) as Theme[]).map((th) => {
              const Icon = themeIcons[th];
              const isActive = theme === th;
              return (
                <button
                  key={th}
                  onClick={() => onThemeChange(th)}
                  className={`
                    cyber-button flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded text-[10px] sm:text-xs
                    transition-all duration-300 border
                    ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
                    }
                  `}
                >
                  <Icon size={12} className="flex-shrink-0" />
                  <span className="font-medium">{getThemeLabel(th)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 光譜色調 */}
        <div className="glass-panel rounded-lg p-1.5 sm:p-2.5 hud-border">
          <div className="text-[8px] sm:text-[10px] tracking-widest text-cyan-400/70 mb-1 sm:mb-1.5 uppercase font-bold flex items-center gap-1">
            <Palette size={10} />
            <span>{t("hud.spectrumHue")}</span>
          </div>
          <div className="flex gap-2 justify-center">
            {(Object.keys(LIGHT_COLORS) as LightColor[]).map((c) => {
              const isActive = lightColor === c;
              return (
                <button
                  key={c}
                  onClick={() => onLightColorChange(c)}
                  title={getLightLabel(c)}
                  className={`
                    w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-300
                    ${isActive ? "scale-110 border-white" : "border-white/20 hover:border-white/50"}
                  `}
                  style={{
                    backgroundColor: LIGHT_COLORS[c].hex,
                    boxShadow: isActive ? `0 0 12px ${LIGHT_COLORS[c].hex}` : "none",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
