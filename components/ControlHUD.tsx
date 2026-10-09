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
    <div className="fixed bottom-8 sm:bottom-10 md:bottom-4 right-1 sm:right-2 md:right-3 z-50 w-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="sm:hidden glass-panel rounded-lg px-2 py-1 hud-border flex items-center gap-1 mb-1 w-full justify-center"
      >
        <Palette size={11} className="text-cyan-400" />
        <span className="text-[9px] text-cyan-300 font-bold tracking-wider">{t("hud.panel")}</span>
        {expanded ? <ChevronDown size={10} className="text-cyan-400" /> : <ChevronUp size={10} className="text-cyan-400" />}
      </button>

      <div className={`${expanded ? "flex" : "hidden"} sm:flex flex-col gap-1 sm:gap-1.5 md:gap-2`}>
        <button
          onClick={onPricingClick}
          className="glass-panel rounded-lg sm:rounded-xl md:rounded-2xl px-2 py-1 sm:px-2.5 sm:py-1.5 md:px-3 md:py-2 hud-border flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <ShoppingBag size={11} className="text-cyan-400 group-hover:scale-110 transition-transform sm:w-[13px] sm:h-[13px] md:w-[14px] md:h-[14px]" />
          <span className="text-[9px] sm:text-[11px] md:text-xs text-cyan-300 font-bold tracking-wider">{t("hud.claimStore")}</span>
        </button>

        <div className="glass-panel rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-2.5 hud-border">
          <div className="text-[7px] sm:text-[9px] md:text-[10px] tracking-widest text-cyan-400/70 mb-0.5 sm:mb-1 md:mb-1.5 uppercase font-bold">
            {t("hud.sceneAmbience")}
          </div>
          <div className="flex flex-col gap-0.5 sm:gap-1 md:gap-1.5">
            {(Object.keys(THEME_LABELS) as Theme[]).map((th) => {
              const Icon = themeIcons[th];
              const isActive = theme === th;
              return (
                <button
                  key={th}
                  onClick={() => onThemeChange(th)}
                  className={`
                    cyber-button flex items-center gap-1 sm:gap-1.5 md:gap-2 px-1.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded sm:rounded-lg md:rounded-xl text-[9px] sm:text-[11px] md:text-xs
                    transition-all duration-300 border
                    ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/40 hover:text-white/70"
                    }
                  `}
                >
                  <Icon size={10} className="flex-shrink-0 sm:w-3 sm:h-3 md:w-[14px] md:h-[14px]" />
                  <span className="font-medium">{getThemeLabel(th)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-lg sm:rounded-xl md:rounded-2xl p-1 sm:p-2 md:p-2.5 hud-border">
          <div className="text-[7px] sm:text-[9px] md:text-[10px] tracking-widest text-cyan-400/70 mb-0.5 sm:mb-1 md:mb-1.5 uppercase font-bold flex items-center gap-0.5 sm:gap-1 md:gap-1.5">
            <Palette size={8} className="sm:w-[10px] sm:h-[10px] md:w-[12px] md:h-[12px]" />
            <span>{t("hud.spectrumHue")}</span>
          </div>
          <div className="flex gap-1.5 sm:gap-2 md:gap-2.5 justify-center">
            {(Object.keys(LIGHT_COLORS) as LightColor[]).map((c) => {
              const isActive = lightColor === c;
              return (
                <button
                  key={c}
                  onClick={() => onLightColorChange(c)}
                  title={getLightLabel(c)}
                  className={`
                    w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border-2 transition-all duration-300
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
