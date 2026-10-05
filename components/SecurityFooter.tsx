"use client";

import { Shield, Lock, RefreshCw } from "lucide-react";

const SECURITY_ITEMS = [
  {
    icon: Shield,
    label: "防毒/防駭",
    labelFull: "防毒 / 防駭資安防線",
    status: "運作中",
    statusEn: "Active",
  },
  {
    icon: Lock,
    label: "沙盒隔離",
    labelFull: "沙盒獨立隔離",
    status: "AES-256",
    statusEn: "Encrypting",
  },
  {
    icon: RefreshCw,
    label: "系統版本",
    labelFull: "系統防禦版本",
    status: "即時更新",
    statusEn: "Live Updated",
  },
];

export default function SecurityFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="glass-panel border-t border-white/5">
        <div className="flex items-center justify-center gap-2 sm:gap-6 py-1.5 sm:py-2 px-2 sm:px-4 flex-wrap">
          {SECURITY_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <Icon size={9} className="text-emerald-400/60 hidden sm:block" />
                <span className="text-[7px] sm:text-[9px] text-white/40 tracking-wider whitespace-nowrap">
                  <span className="hidden sm:inline">{item.labelFull}：</span>
                  <span className="sm:hidden">{item.label}：</span>
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
