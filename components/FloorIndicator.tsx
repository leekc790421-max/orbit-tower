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
    <div className="fixed left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40">
      <div className="glass-panel rounded-md sm:rounded-lg p-0.5 sm:p-1.5 hud-border">
        <div className="text-[6px] sm:text-[7px] tracking-widest text-cyan-400/50 text-center mb-0.5 sm:mb-1 uppercase font-bold">
          {t("floor.label")}
        </div>
        <div className="flex flex-col-reverse gap-px sm:gap-0.5">
          {FLOORS.map((floor) => {
            const isActive = activeFloor === floor.floor;
            const occupiedCount = floor.units.filter((u) => u.status === "occupied").length;
            const isolatedCount = floor.units.filter((u) => u.status === "isolated").length;
            return (
              <button
                key={floor.floor}
                onClick={() => onFloorSelect(floor.floor)}
                className={`
                  relative group flex items-center justify-center gap-0.5 sm:gap-1
                  px-1 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px]
                  transition-all duration-300 border
                  ${
                    isActive
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                      : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
                  }
                `}
              >
                <Building size={8} className="sm:w-[10px] sm:h-[10px]" />
                <span className="font-mono font-bold">{floor.floor}F</span>
                <div className="hidden sm:flex gap-0.5 ml-auto">
                  {occupiedCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  {isolatedCount > 0 && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
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
