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
    <div className="fixed bottom-16 sm:bottom-8 right-2 sm:right-8 z-50 w-auto">
      <button
        onClick={() => setExpanded(!expanded)}
        className="sm:hidden glass-panel rounded-2xl px-5 py-4 hud-border flex items-center gap-3 mb-3 w-full justify-center"
      >
        <Palette size={22} className="text-cyan-400" />
        <span className="text-base text-cyan-300 font-bold tracking-wider">{t("hud.panel")}</span>
        {expanded ? <ChevronDown size={20} className="text-cyan-400" /> : <ChevronUp size={20} className="text-cyan-400" />}
      </button>

      <div className={`${expanded ? "flex" : "hidden"} sm:flex flex-col gap-3 sm:gap-4`}>
        <button
          onClick={onPricingClick}
          className="glass-panel rounded-2xl px-5 py-4 hud-border flex items-center justify-center gap-3 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all group"
        >
          <ShoppingBag size={22} className="text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-base text-cyan-300 font-bold tracking-wider">{t("hud.claimStore")}</span>
        </button>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 hud-border">
          <div className="text-sm sm:text-base tracking-widest text-cyan-400 mb-3 sm:mb-4 uppercase font-bold">
            {t("hud.sceneAmbience")}
          </div>
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {(Object.keys(THEME_LABELS) as Theme[]).map((th) => {
              const Icon = themeIcons[th];
              const isActive = theme === th;
              return (
                <button
                  key={th}
                  onClick={() => onThemeChange(th)}
                  className={`
                    cyber-button flex items-center gap-3 px-4 py-3 rounded-xl text-base
                    transition-all duration-300 border
                    ${
                      isActive
                        ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/50 hover:text-white/80"
                    }
                  `}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className="font-medium">{getThemeLabel(th)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 sm:p-5 hud-border">
          <div className="text-sm sm:text-base tracking-widest text-cyan-400 mb-3 sm:mb-4 uppercase font-bold flex items-center gap-2">
            <Palette size={18} />
            <span>{t("hud.spectrumHue")}</span>
          </div>
          <div className="flex gap-4 justify-center">
            {(Object.keys(LIGHT_COLORS) as LightColor[]).map((c) => {
              const isActive = lightColor === c;
              return (
                <button
                  key={c}
                  onClick={() => onLightColorChange(c)}
                  title={getLightLabel(c)}
                  className={`
                    w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-300
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
          <div className="text-sm text-white/40 mt-3 text-center">
            {getLightLabel(lightColor)}
          </div>
        </div>
      </div>
    </div>
  );
}
