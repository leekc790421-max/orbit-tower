"use client";

import { FLOORS } from "@/data/units";
import { Building } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface FloorIndicatorProps {
  activeFloor: number | null;
  onFloorSelect: (floor: number) => void;
}

export default function FloorIndicator({ activeFloor, onFloorSelect }: FloorIndicatorProps) {
  const { t } = useTranslation();

  const floorLabels = [t("floor.f1"), t("floor.f2"), t("floor.f3"), t("floor.f4"), t("floor.f5"), t("floor.f6")];

  return (
    <div className="orbit-control-left orbit-floor-indicator fixed left-0.5 sm:left-1.5 md:left-3 top-1/2 -translate-y-1/2 z-40">
      <div className="glass-hud-premium rounded-md sm:rounded-lg md:rounded-lg p-0.5 sm:p-1 md:p-1.5 hud-border">
        <div className="text-[5px] sm:text-[6px] md:text-[7px] tracking-widest text-cyan-400/50 text-center mb-0 sm:mb-0.5 md:mb-1 uppercase font-bold font-tech">
          {t("floor.label")}
        </div>
        <div className="flex flex-col-reverse gap-px sm:gap-0.5 md:gap-0.5">
          {FLOORS.map((floor) => {
            const isActive = activeFloor === floor.floor;
            const occupiedCount = floor.units.filter((u) => u.status === "occupied").length;
            const isolatedCount = floor.units.filter((u) => u.status === "isolated").length;
            return (
              <button
                key={floor.floor}
                onClick={() => onFloorSelect(floor.floor)}
                className={`
                  relative group flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1
                  px-0.5 sm:px-1.5 md:px-2 py-0.5 sm:py-1 md:py-1 rounded sm:rounded-md md:rounded-md text-[7px] sm:text-[9px] md:text-[10px]
                  transition-all duration-300 border
                  ${
                    isActive
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                      : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
                  }
                `}
              >
                <Building size={7} className="sm:w-[9px] sm:h-[9px] md:w-[10px] md:h-[10px]" />
                <span className="font-mono-data font-bold">{floor.floor}F</span>
                <div className="hidden sm:flex gap-0.5 ml-auto">
                  {occupiedCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 led-blink" />}
                  {isolatedCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-400 led-blink" />}
                </div>
                <div className="absolute left-full ml-2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[9px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden sm:block">
                  {floorLabels[floor.floor - 1]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
