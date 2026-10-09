"use client";

import { type Unit, type UnitStatus } from "@/data/units";
import { X, Globe, Shield, Zap, Building2, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface UnitInfoCardProps {
  unit: Unit | null;
  onClose: () => void;
}

export default function UnitInfoCard({ unit, onClose }: UnitInfoCardProps) {
  const { t } = useTranslation();
  if (!unit) return null;

  const statusConfig: Record<UnitStatus, { border: string; bg: string; glow: string }> = {
    available: { border: "border-blue-400/50", bg: "bg-blue-400/10", glow: "shadow-blue-400/20" },
    occupied: { border: "border-amber-400/50", bg: "bg-amber-400/10", glow: "shadow-amber-400/20" },
    isolated: { border: "border-red-400/50", bg: "bg-red-400/10", glow: "shadow-red-400/20" },
  };

  const config = statusConfig[unit.status];
  const statusLabel = t(`status.${unit.status}`);
  const faceLabel = t(`face.${unit.face}`);

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40 sm:bg-transparent pointer-events-auto sm:hidden" onClick={onClose} />
      
      <div
        className={`
          pointer-events-auto glass-panel rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 
          w-full sm:max-w-sm mx-0 sm:mx-4
          border-t sm:border ${config.border} shadow-2xl ${config.glow}
          max-h-[75vh] sm:max-h-[85vh] overflow-y-auto
        `}
      >
        <div className="sm:hidden flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full ${config.bg} ${config.border} border`}>
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
              style={{
                backgroundColor:
                  unit.status === "available"
                    ? "#4488ff"
                    : unit.status === "isolated"
                    ? "#ff4444"
                    : unit.color || "#f5a623",
              }}
            />
            <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-white/70">
              {statusLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
          >
            <X size={14} className="text-white/60" />
          </button>
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="text-[8px] sm:text-[9px] tracking-widest text-cyan-400/60 uppercase mb-1">
            {t("unit.unitId")}
          </div>
          <div className="font-mono text-xs sm:text-sm text-cyan-300 tracking-wider break-all">{unit.id}</div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="glass-panel rounded-lg p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={12} className="text-white/40" />
              <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">{t("unit.floorLabel")}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">{unit.floor}F</div>
          </div>
          <div className="glass-panel rounded-lg p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-white/40" />
              <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">{t("unit.faceLabel")}</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {unit.face}
              {t("unit.faceSuffix") && <span className="text-xs text-white/40 ml-1">{t("unit.faceSuffix")}</span>}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-2 sm:p-2.5 mb-3 sm:mb-4">
          <div className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider mb-1">
            {t("unit.category")}
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">
            {unit.face} {t("unit.faceSuffix")} — {faceLabel}
          </div>
        </div>

        {unit.brand && (
          <div className="glass-panel rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
            <div className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider mb-2">
              {t("unit.tenant")}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${unit.color}22`, border: `1px solid ${unit.color}44` }}
              >
                <Zap size={14} style={{ color: unit.color }} />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold" style={{ color: unit.color }}>
                  {unit.brand}
                </div>
                <div className="text-[9px] sm:text-[10px] text-white/50">{unit.service ? t(unit.service) : ""}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pb-2">
          {unit.status === "available" && (
            <button className="flex-1 cyber-button border border-cyan-400/50 bg-cyan-400/10 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-cyan-300 font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
              <span className="flex items-center justify-center gap-2">
                <Globe size={14} />
                {t("unit.bookViewing")}
              </span>
            </button>
          )}
          {unit.status === "isolated" && (
            <div className="flex-1 border border-red-400/30 bg-red-400/5 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-red-300/60 font-bold tracking-wider uppercase text-center">
              <span className="flex items-center justify-center gap-2">
                <Shield size={14} />
                {t("unit.sandboxRunning")}
              </span>
            </div>
          )}
          {unit.status === "occupied" && unit.brand && (
            <button className="flex-1 cyber-button border border-amber-400/50 bg-amber-400/10 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-amber-300 font-bold tracking-wider uppercase hover:bg-amber-400/20 transition-all">
              <span className="flex items-center justify-center gap-2">
                <Globe size={14} />
                {t("unit.visitBrand")}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
