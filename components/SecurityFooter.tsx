"use client";

import { Shield, Lock, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

export default function SecurityFooter() {
  const { t } = useTranslation();

  const items = [
    {
      icon: Shield,
      label: t("security.protection"),
      labelFull: t("security.protectionFull"),
      status: t("security.active"),
    },
    {
      icon: Lock,
      label: t("security.encryption"),
      labelFull: t("security.encryptionFull"),
      status: t("security.encrypting"),
    },
    {
      icon: RefreshCw,
      label: t("security.sysUpdate"),
      labelFull: t("security.sysUpdateFull"),
      status: t("security.upToDate"),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      <div className="glass-panel border-t border-white/5">
        <div className="flex items-center justify-center gap-2 sm:gap-6 py-1.5 sm:py-2 px-2 sm:px-4 flex-wrap">
          {items.map((item, idx) => {
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
