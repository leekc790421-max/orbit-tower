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
    label: "空置待租 Available",
  },
  occupied: {
    border: "border-amber-400/50",
    bg: "bg-amber-400/10",
    glow: "shadow-amber-400/20",
    label: "已進駐 Occupied",
  },
  isolated: {
    border: "border-red-400/50",
    bg: "bg-red-400/10",
    glow: "shadow-red-400/20",
    label: "資安保護中 Isolated",
  },
};

export default function UnitInfoCard({ unit, onClose }: UnitInfoCardProps) {
  if (!unit) return null;

  const config = statusConfig[unit.status];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none">
      <div
        className={`
          pointer-events-auto glass-panel rounded-2xl p-6 max-w-sm w-full mx-4
          border ${config.border} shadow-2xl ${config.glow}
          animate-in fade-in zoom-in-95 duration-300
        `}
        style={{
          animation: "float 6s ease-in-out infinite, pulse-glow 2s ease-in-out infinite",
        }}
      >
        {/* 頂部狀態列 */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.border} border`}>
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor:
                  unit.status === "available"
                    ? "#4488ff"
                    : unit.status === "isolated"
                    ? "#ff4444"
                    : unit.color || "#f5a623",
              }}
            />
            <span className="text-[10px] tracking-wider uppercase font-bold text-white/70">
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
        <div className="mb-4">
          <div className="text-[9px] tracking-widest text-cyan-400/60 uppercase mb-1">
            戶籍識別碼 / Unit ID
          </div>
          <div className="font-mono text-sm text-cyan-300 tracking-wider">{unit.id}</div>
        </div>

        {/* 樓層與面向 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="glass-panel rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Building2 size={12} className="text-white/40" />
              <span className="text-[9px] text-white/40 uppercase tracking-wider">樓層</span>
            </div>
            <div className="text-lg font-bold text-white">{unit.floor}F</div>
          </div>
          <div className="glass-panel rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin size={12} className="text-white/40" />
              <span className="text-[9px] text-white/40 uppercase tracking-wider">面向</span>
            </div>
            <div className="text-lg font-bold text-white">
              {unit.face}
              <span className="text-xs text-white/40 ml-1">面</span>
            </div>
          </div>
        </div>

        {/* 面向分類 */}
        <div className="glass-panel rounded-lg p-2.5 mb-4">
          <div className="text-[9px] text-white/40 uppercase tracking-wider mb-1">
            業態分類 / Category
          </div>
          <div className="text-sm font-medium text-white">
            {unit.face} 面 — {FACE_LABELS[unit.face]}
          </div>
        </div>

        {/* 進駐品牌資訊 */}
        {unit.brand && (
          <div className="glass-panel rounded-lg p-3 mb-4">
            <div className="text-[9px] text-white/40 uppercase tracking-wider mb-2">
              進駐品牌 / Tenant
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${unit.color}22`, border: `1px solid ${unit.color}44` }}
              >
                <Zap size={16} style={{ color: unit.color }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: unit.color }}>
                  {unit.brand}
                </div>
                <div className="text-[10px] text-white/50">{unit.service}</div>
              </div>
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex gap-2">
          {unit.status === "available" && (
            <button className="flex-1 cyber-button border border-cyan-400/50 bg-cyan-400/10 rounded-lg px-4 py-2.5 text-xs text-cyan-300 font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
              <span className="flex items-center justify-center gap-2">
                <Globe size={14} />
                預約看房
              </span>
            </button>
          )}
          {unit.status === "isolated" && (
            <div className="flex-1 border border-red-400/30 bg-red-400/5 rounded-lg px-4 py-2.5 text-xs text-red-300/60 font-bold tracking-wider uppercase text-center">
              <span className="flex items-center justify-center gap-2">
                <Shield size={14} />
                沙盒運算中
              </span>
            </div>
          )}
          {unit.status === "occupied" && unit.brand && (
            <button className="flex-1 cyber-button border border-amber-400/50 bg-amber-400/10 rounded-lg px-4 py-2.5 text-xs text-amber-300 font-bold tracking-wider uppercase hover:bg-amber-400/20 transition-all">
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
