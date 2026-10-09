"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Calendar, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { I18nProvider, useTranslation } from "@/lib/i18n";

interface UpdateRecord {
  disclaimer: string;
  terms: string;
  privacy: string;
  lastAutoUpdate: string;
  updateCount: number;
  needsAutoUpdate: boolean;
  nextAutoUpdate: string;
}

function UpdatesContent() {
  const { t } = useTranslation();
  const [record, setRecord] = useState<UpdateRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // 載入更新狀態
  const loadStatus = async () => {
    try {
      const res = await fetch("/api/system-update");
      const data = await res.json();
      if (data.success) {
        setRecord(data.data);
      }
    } catch (error) {
      console.error("Failed to load update status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadStatus();
    };
    init();
  }, []);

  // 觸發更新
  const triggerUpdate = async (type: string) => {
    setUpdating(true);
    setMessage("");
    try {
      const res = await fetch("/api/system-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, force: true }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(t("admin.updates.updateSuccess"));
        await loadStatus();
      } else {
        setMessage(`${t("admin.updates.updateFailed")}: ${data.error}`);
      }
    } catch (error) {
      setMessage(t("admin.updates.updateFailed"));
    } finally {
      setUpdating(false);
    }
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-xs sm:text-sm tracking-wider">{t("admin.updates.back")}</span>
          </Link>
          <div className="text-right">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {t("admin.updates.mainTitle")}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {t("admin.updates.mainSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* 內容區 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6">
        {/* 系統狀態 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-bold text-white">
              {t("admin.updates.systemStatus")}
            </h2>
            {record?.needsAutoUpdate ? (
              <div className="flex items-center gap-2 text-amber-400">
                <AlertCircle size={16} />
                <span className="text-xs">{t("admin.updates.needsUpdate")}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={16} />
                <span className="text-xs">{t("admin.updates.upToDate")}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel rounded-lg p-3 border border-white/10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                {t("admin.updates.lastUpdate")}
              </div>
              <div className="text-xs text-white/80 flex items-center gap-2">
                <Clock size={14} className="text-cyan-400" />
                {record && formatDate(record.lastAutoUpdate)}
              </div>
            </div>
            <div className="glass-panel rounded-lg p-3 border border-white/10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                {t("admin.updates.updateCount")}
              </div>
              <div className="text-xs text-white/80 flex items-center gap-2">
                <RefreshCw size={14} className="text-cyan-400" />
                {record?.updateCount || 0} {t("admin.updates.times")}
              </div>
            </div>
            <div className="glass-panel rounded-lg p-3 border border-white/10 sm:col-span-2">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                {t("admin.updates.nextAutoUpdate")}
              </div>
              <div className="text-xs text-white/80 flex items-center gap-2">
                <Calendar size={14} className="text-cyan-400" />
                {record && formatDate(record.nextAutoUpdate)}
              </div>
            </div>
          </div>
        </div>

        {/* 文件更新狀態 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10">
          <h2 className="text-sm sm:text-base font-bold text-white mb-4">
            {t("admin.updates.documentStatus")}
          </h2>

          <div className="space-y-3">
            {/* 免責聲明 */}
            <div className="glass-panel rounded-lg p-3 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{t("admin.updates.disclaimer")}</div>
                <div className="text-[10px] text-white/40 mt-1">
                  {record?.disclaimer && formatDate(record.disclaimer)}
                </div>
              </div>
              <button
                onClick={() => triggerUpdate("disclaimer")}
                disabled={updating}
                className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs hover:bg-cyan-400/20 transition-all disabled:opacity-50"
              >
                {t("admin.updates.updateNow")}
              </button>
            </div>

            {/* 服務條款 */}
            <div className="glass-panel rounded-lg p-3 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{t("admin.updates.terms")}</div>
                <div className="text-[10px] text-white/40 mt-1">
                  {record?.terms && formatDate(record.terms)}
                </div>
              </div>
              <button
                onClick={() => triggerUpdate("terms")}
                disabled={updating}
                className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs hover:bg-cyan-400/20 transition-all disabled:opacity-50"
              >
                {t("admin.updates.updateNow")}
              </button>
            </div>

            {/* 隱私權政策 */}
            <div className="glass-panel rounded-lg p-3 border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">{t("admin.updates.privacy")}</div>
                <div className="text-[10px] text-white/40 mt-1">
                  {record?.privacy && formatDate(record.privacy)}
                </div>
              </div>
              <button
                onClick={() => triggerUpdate("privacy")}
                disabled={updating}
                className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs hover:bg-cyan-400/20 transition-all disabled:opacity-50"
              >
                {t("admin.updates.updateNow")}
              </button>
            </div>
          </div>

          {/* 全部更新按鈕 */}
          <button
            onClick={() => triggerUpdate("all")}
            disabled={updating}
            className="w-full mt-4 px-4 py-2.5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-xs font-bold hover:bg-emerald-400/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={updating ? "animate-spin" : ""} />
            {t("admin.updates.updateAll")}
          </button>
        </div>

        {/* 訊息 */}
        {message && (
          <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5">
            <p className="text-xs text-white/70 text-center">{message}</p>
          </div>
        )}

        {/* 說明 */}
        <div className="glass-panel rounded-xl p-4 sm:p-6 border border-white/10">
          <h2 className="text-sm sm:text-base font-bold text-white mb-3">
            {t("admin.updates.howItWorks")}
          </h2>
          <div className="text-xs text-white/60 space-y-2">
            <p>{t("admin.updates.howItWorks1")}</p>
            <p>{t("admin.updates.howItWorks2")}</p>
            <p>{t("admin.updates.howItWorks3")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpdatesPage() {
  return (
    <I18nProvider>
      <UpdatesContent />
    </I18nProvider>
  );
}
