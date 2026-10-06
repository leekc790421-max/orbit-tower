"use client";

import { type Unit, FACE_LABELS, STATUS_LABELS, type UnitStatus } from "@/data/units";
import { X, Globe, Shield, Zap, Building2, MapPin } from "lucide-react";

interface UnitInfoCardProps {
  unit: Unit | null;
  onClose: () => void;
}

const statusConfig: Record<UnitStatus, { border: string; bg: string; glow: string; label: string }> = {
  available: {
    border: "border-blue-400/50",
    bg: "bg-blue-400/10",
    glow: "shadow-blue-400/20",
    label: "空置中",
  },
  occupied: {
    border: "border-amber-400/50",
    bg: "bg-amber-400/10",
    glow: "shadow-amber-400/20",
    label: "已進駐",
  },
  isolated: {
    border: "border-red-400/50",
    bg: "bg-red-400/10",
    glow: "shadow-red-400/20",
    label: "保護中",
  },
};

export default function UnitInfoCard({ unit, onClose }: UnitInfoCardProps) {
  if (!unit) return null;

  const config = statusConfig[unit.status];

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center pointer-events-none">
      {/* 手機版底部遮罩 */}
      <div className="absolute inset-0 bg-black/40 sm:bg-transparent pointer-events-auto sm:hidden" onClick={onClose} />
      
      <div
        className={`
          pointer-events-auto glass-panel rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 
          w-full sm:max-w-sm mx-0 sm:mx-4
          border-t sm:border ${config.border} shadow-2xl ${config.glow}
          max-h-[75vh] sm:max-h-[85vh] overflow-y-auto
        `}
      >
        {/* 手機拖曳指示條 */}
        <div className="sm:hidden flex justify-center mb-3">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* 頂部狀態列 */}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full ${config.bg} ${config.border} border`}>
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
              {config.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
          >
            <X size={14} className="text-white/60" />
          </button>
        </div>

        {/* 戶號識別碼 */}
        <div className="mb-3 sm:mb-4">
          <div className="text-[8px] sm:text-[9px] tracking-widest text-cyan-400/60 uppercase mb-1">
            戶籍識別碼 / Unit ID
          </div>
          <div className="font-mono text-xs sm:text-sm text-cyan-300 tracking-wider break-all">{unit.id}</div>
        </div>

        {/* 樓層與面向 */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="glass-panel rounded-lg p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={11} className="text-white/40" />
              <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">樓層</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">{unit.floor}F</div>
          </div>
          <div className="glass-panel rounded-lg p-2 sm:p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={11} className="text-white/40" />
              <span className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider">面向</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {unit.face}
              <span className="text-xs text-white/40 ml-1">面</span>
            </div>
          </div>
        </div>

        {/* 面向分類 */}
        <div className="glass-panel rounded-lg p-2 sm:p-2.5 mb-3 sm:mb-4">
          <div className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider mb-1">
            業態分類 / Category
          </div>
          <div className="text-xs sm:text-sm font-medium text-white">
            {unit.face} 面 — {FACE_LABELS[unit.face]}
          </div>
        </div>

        {/* 進駐品牌資訊 */}
        {unit.brand && (
          <div className="glass-panel rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
            <div className="text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider mb-2">
              進駐品牌 / Tenant
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
                <div className="text-[9px] sm:text-[10px] text-white/50">{unit.service}</div>
              </div>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex gap-2 pb-2">
          {unit.status === "available" && (
            <button className="flex-1 cyber-button border border-cyan-400/50 bg-cyan-400/10 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-cyan-300 font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
              <span className="flex items-center justify-center gap-2">
                <Globe size={14} />
                預約看房
              </span>
            </button>
          )}
          {unit.status === "isolated" && (
            <div className="flex-1 border border-red-400/30 bg-red-400/5 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-red-300/60 font-bold tracking-wider uppercase text-center">
              <span className="flex items-center justify-center gap-2">
                <Shield size={14} />
                沙盒運算中
              </span>
            </div>
          )}
          {unit.status === "occupied" && unit.brand && (
            <button className="flex-1 cyber-button border border-amber-400/50 bg-amber-400/10 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-amber-300 font-bold tracking-wider uppercase hover:bg-amber-400/20 transition-all">
              <span className="flex items-center justify-center gap-2">
                <Globe size={14} />
                造訪品牌
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
