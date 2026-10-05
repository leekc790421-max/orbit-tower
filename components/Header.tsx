"use client";

import { Hexagon } from "lucide-react";

export default function Header() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-center pt-6 pb-4">
        <div className="glass-panel rounded-2xl px-6 py-3 hud-border pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="relative">
              <Hexagon
                size={28}
                className="text-cyan-400"
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
            </div>
            {/* 標題 */}
            <div>
              <h1 className="text-sm font-bold tracking-[0.3em] text-white uppercase neon-text">
                Orbit Tower
              </h1>
              <p className="text-[9px] tracking-[0.2em] text-cyan-400/60 uppercase">
                賽博虛擬地產總部 · Cyber Virtual HQ
              </p>
            </div>
            {/* 狀態指示 */}
            <div className="flex items-center gap-1.5 ml-4 pl-4 border-l border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] text-emerald-400/80 tracking-wider uppercase">
                Online
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
