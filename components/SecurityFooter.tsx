"use client";

import { Shield, Lock, RefreshCw } from "lucide-react";

const SECURITY_ITEMS = [
  {
    icon: Shield,
    label: "防毒 / 防駭資安防線",
    status: "運作中",
    statusEn: "Active",
    color: "emerald",
  },
  {
    icon: Lock,
    label: "沙盒獨立隔離",
    status: "AES-256 加密中",
    statusEn: "Encrypting",
    color: "emerald",
  },
  {
    icon: RefreshCw,
    label: "系統防禦版本",
    status: "即時自動更新",
    statusEn: "Live Updated",
    color: "emerald",
  },
];

export default function SecurityFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="glass-panel border-t border-white/5">
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-2 px-4 flex-wrap">
          {SECURITY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="relative">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <Icon size={10} className="text-emerald-400/60 hidden sm:block" />
                <span className="text-[8px] sm:text-[9px] text-white/40 tracking-wider">
                  <span className="hidden sm:inline">{item.label}：</span>
                  <span className="text-emerald-400/70">{item.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
