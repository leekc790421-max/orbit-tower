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
          pointer-events-auto glass-panel rounded-t-2xl sm:rounded-2xl p-5 sm:p-7 
          w-full sm:max-w-md mx-0 sm:mx-4
          border-t sm:border ${config.border} shadow-2xl ${config.glow}
          max-h-[75vh] sm:max-h-[85vh] overflow-y-auto
        `}
      >
        <div className="sm:hidden flex justify-center mb-4">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
            <div
              className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full animate-pulse"
              style={{
                backgroundColor:
                  unit.status === "available"
                    ? "#4488ff"
                    : unit.status === "isolated"
                    ? "#ff4444"
                    : unit.color || "#f5a623",
              }}
            />
            <span className="text-[11px] sm:text-xs tracking-wider uppercase font-bold text-white/70">
              {statusLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
          >
            <X size={16} className="text-white/60" />
          </button>
        </div>

        <div className="mb-4 sm:mb-5">
          <div className="text-[10px] sm:text-xs tracking-widest text-cyan-400/60 uppercase mb-1.5">
            {t("unit.unitId")}
          </div>
          <div className="font-mono text-sm sm:text-base text-cyan-300 tracking-wider break-all">{unit.id}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
          <div className="glass-panel rounded-xl p-3 sm:p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Building2 size={14} className="text-white/40" />
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">{t("unit.floorLabel")}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">{unit.floor}F</div>
          </div>
          <div className="glass-panel rounded-xl p-3 sm:p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin size={14} className="text-white/40" />
              <span className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider">{t("unit.faceLabel")}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {unit.face}
              {t("unit.faceSuffix") && <span className="text-sm text-white/40 ml-1">{t("unit.faceSuffix")}</span>}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
          <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mb-1.5">
            {t("unit.category")}
          </div>
          <div className="text-sm sm:text-base font-medium text-white">
            {unit.face} {t("unit.faceSuffix")} — {faceLabel}
          </div>
        </div>

        {unit.brand && (
          <div className="glass-panel rounded-xl p-3.5 sm:p-4 mb-4 sm:mb-5">
            <div className="text-[10px] sm:text-xs text-white/40 uppercase tracking-wider mb-2.5">
              {t("unit.tenant")}
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${unit.color}22`, border: `1px solid ${unit.color}44` }}
              >
                <Zap size={18} style={{ color: unit.color }} />
              </div>
              <div>
                <div className="text-base sm:text-lg font-bold" style={{ color: unit.color }}>
                  {unit.brand}
                </div>
                <div className="text-[11px] sm:text-xs text-white/50">{unit.service ? t(unit.service) : ""}</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pb-2">
          {unit.status === "available" && (
            <button className="flex-1 cyber-button border border-cyan-400/50 bg-cyan-400/10 rounded-xl px-4 sm:px-5 py-3.5 text-sm sm:text-base text-cyan-300 font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
              <span className="flex items-center justify-center gap-2.5">
                <Globe size={18} />
                {t("unit.bookViewing")}
              </span>
            </button>
          )}
          {unit.status === "isolated" && (
            <div className="flex-1 border border-red-400/30 bg-red-400/5 rounded-xl px-4 sm:px-5 py-3.5 text-sm sm:text-base text-red-300/60 font-bold tracking-wider uppercase text-center">
              <span className="flex items-center justify-center gap-2.5">
                <Shield size={18} />
                {t("unit.sandboxRunning")}
              </span>
            </div>
          )}
          {unit.status === "occupied" && unit.brand && (
            <button className="flex-1 cyber-button border border-amber-400/50 bg-amber-400/10 rounded-xl px-4 sm:px-5 py-3.5 text-sm sm:text-base text-amber-300 font-bold tracking-wider uppercase hover:bg-amber-400/20 transition-all">
              <span className="flex items-center justify-center gap-2.5">
                <Globe size={18} />
                {t("unit.visitBrand")}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
