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
      <div className="border-t border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 md:gap-4 py-0.5 sm:py-0.5 md:py-1 px-1.5 sm:px-3 md:px-4 flex-wrap">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-0.5 sm:gap-0.5 md:gap-1">
                <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <Icon size={7} className="text-emerald-400/50 hidden sm:block" />
                <span className="text-[5px] sm:text-[7px] md:text-[8px] text-white/30 tracking-wider whitespace-nowrap">
                  <span className="sm:hidden">{item.label}：</span>
                  <span className="hidden sm:inline">{item.labelFull}：</span>
                  <span className="text-emerald-400/60">{item.status}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
