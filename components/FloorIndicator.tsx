"use client";

import { FLOORS } from "@/data/units";
import { Building } from "lucide-react";

interface FloorIndicatorProps {
  activeFloor: number | null;
  onFloorSelect: (floor: number) => void;
}

export default function FloorIndicator({ activeFloor, onFloorSelect }: FloorIndicatorProps) {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40">
      <div className="glass-panel rounded-xl p-2 hud-border">
        <div className="text-[8px] tracking-widest text-cyan-400/60 text-center mb-2 uppercase font-bold">
          樓層
        </div>
        <div className="flex flex-col-reverse gap-1">
          {FLOORS.map((floor) => {
            const isActive = activeFloor === floor.floor;
            const occupiedCount = floor.units.filter((u) => u.status === "occupied").length;
            const isolatedCount = floor.units.filter((u) => u.status === "isolated").length;
            return (
              <button
                key={floor.floor}
                onClick={() => onFloorSelect(floor.floor)}
                className={`
                  relative group flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px]
                  transition-all duration-300 border
                  ${
                    isActive
                      ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                      : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/5"
                  }
                `}
              >
                <Building size={10} />
                <span className="font-mono font-bold">{floor.floor}F</span>
                {/* 狀態指示點 */}
                <div className="flex gap-0.5 ml-auto">
                  {occupiedCount > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                  {isolatedCount > 0 && (
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  )}
                </div>
                {/* 懸停提示 */}
                <div className="absolute left-full ml-2 px-2 py-1 rounded bg-black/80 border border-white/10 text-[9px] text-white/70 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                  {floor.label}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
