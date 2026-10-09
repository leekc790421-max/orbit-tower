"use client";

import { useState, useEffect } from "react";
import {
  Shield, CheckCircle, XCircle, Clock, Building2, DollarSign,
  RefreshCw, Eye, ChevronDown, ChevronUp, AlertTriangle,
  Users, TrendingUp, Globe, Zap,
} from "lucide-react";
import { useTranslation, I18nProvider } from "@/lib/i18n";

// ===== Types =====
interface Claim {
  id: string;
  store_id: string;
  brand_name: string;
  email: string;
  plan: string;
  payment_channel: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  review_reason?: string;
  stores?: {
    id: string;
    floor: number;
    face: string;
    brand_name?: string;
  };
}

interface DashboardStats {
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  totalRevenue: number;
}

// ===== Constants =====
const PLAN_LABELS: Record<string, { name: string; price: number }> = {
  landing: { name: "門戶體驗版", price: 35000 },
  growth: { name: "成長升級版", price: 60000 },
  scale: { name: "企業總部版", price: 120000 },
};

const CHANNEL_LABELS: Record<string, string> = {
  rakuten: "樂天銀行",
  bank_of_taiwan: "臺灣銀行",
  payoneer: "Payoneer",
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  pending: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", icon: Clock, label: "待審核" },
  approved: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", icon: CheckCircle, label: "已核准" },
  rejected: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", icon: XCircle, label: "已拒絕" },
};

// ===== Admin Dashboard =====
function AdminDashboardContent() {
  const { t } = useTranslation();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalClaims: 0, pendingClaims: 0, approvedClaims: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  // Load admin secret from localStorage (lazy init)
  const [adminSecret, setAdminSecret] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("orbit-admin-secret") || "";
  });
  const [secretInput, setSecretInput] = useState("");
  const [filter, setFilter] = useState<string>("pending");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch claims when adminSecret, filter, or refreshKey changes
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      if (!adminSecret) {
        if (!cancelled) { setAuthError(true); setLoading(false); }
        return;
      }
      if (!cancelled) setLoading(true);
      try {
        const res = await fetch(`/api/audit-release?status=${filter}`, {
          headers: { Authorization: `Bearer ${adminSecret}` },
        });
        if (cancelled) return;
        if (res.status === 401) { setAuthError(true); setLoading(false); return; }
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          const all = data.data || [];
          const pending = all.filter((c: Claim) => c.status === "pending").length;
          const approved = all.filter((c: Claim) => c.status === "approved").length;
          const revenue = all
            .filter((c: Claim) => c.status === "approved")
            .reduce((sum: number, c: Claim) => sum + (PLAN_LABELS[c.plan]?.price || 0), 0);
          setClaims(all);
          setStats({ totalClaims: all.length, pendingClaims: pending, approvedClaims: approved, totalRevenue: revenue });
        }
      } catch (err) {
        console.error("Fetch claims error:", err);
      }
      if (!cancelled) setLoading(false);
    }
    loadData();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminSecret, filter, refreshKey]);

  // Handle approve/reject
  const handleAction = async (claimId: string, action: "approve" | "reject") => {
    setActionLoading(claimId);
    try {
      const res = await fetch("/api/audit-release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ claim_id: claimId, action, reason: "管理員審核" }),
      });
      const data = await res.json();
      if (data.success) {
        setRefreshKey(k => k + 1);
      }
    } catch (err) {
      console.error("Action error:", err);
    }
    setActionLoading(null);
  };

  // Auth screen
  if (authError) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4">
        <div className="glass-panel rounded-2xl border border-cyan-400/30 p-8 max-w-md w-full">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={28} className="text-cyan-400" />
            <h1 className="text-xl font-bold text-white">管理員驗證</h1>
          </div>
          <p className="text-sm text-white/60 mb-4">請輸入管理員密鑰以存取後台</p>
          <input
            type="password"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && secretInput.trim()) {
                setAdminSecret(secretInput.trim());
                localStorage.setItem("orbit-admin-secret", secretInput.trim());
                setAuthError(false);
              }
            }}
            placeholder="ADMIN_SECRET"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40 mb-4"
          />
          <button
            onClick={() => {
              if (secretInput.trim()) {
                setAdminSecret(secretInput.trim());
                localStorage.setItem("orbit-admin-secret", secretInput.trim());
                setAuthError(false);
              }
            }}
            className="w-full py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 font-bold text-sm hover:bg-cyan-400/20 transition-all"
          >
            驗證並登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050510] text-white p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-cyan-400" />
            <div>
              <h1 className="text-lg font-bold tracking-wider">{t("admin.console.title")}</h1>
              <p className="text-[10px] text-cyan-400/60 tracking-wider">{t("admin.console.subtitle")}</p>
            </div>
          </div>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-xs"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {t("admin.console.refresh")}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard icon={Users} label="總認領數" value={stats.totalClaims} color="cyan" />
          <StatCard icon={Clock} label="待審核" value={stats.pendingClaims} color="amber" />
          <StatCard icon={CheckCircle} label="已核准" value={stats.approvedClaims} color="emerald" />
          <StatCard icon={DollarSign} label="預估營收" value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`} color="purple" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "pending", label: "待審核" },
            { key: "approved", label: "已核准" },
            { key: "rejected", label: "已拒絕" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border ${
                filter === tab.key
                  ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                  : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Claims List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw size={24} className="animate-spin text-cyan-400 mx-auto mb-3" />
            <p className="text-sm text-white/50">載入中...</p>
          </div>
        ) : claims.length === 0 ? (
          <div className="text-center py-12 glass-panel rounded-xl border border-white/10">
            <AlertTriangle size={24} className="text-white/30 mx-auto mb-3" />
            <p className="text-sm text-white/50">暫無{filter === "pending" ? "待審核" : filter === "approved" ? "已核准" : "已拒絕"}的認領記錄</p>
          </div>
        ) : (
          <div className="space-y-3">
            {claims.map((claim) => {
              const statusCfg = STATUS_CONFIG[claim.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const planInfo = PLAN_LABELS[claim.plan] || { name: claim.plan, price: 0 };
              const isExpanded = expandedId === claim.id;

              return (
                <div key={claim.id} className={`glass-panel rounded-xl border ${statusCfg.bg} overflow-hidden`}>
                  {/* Summary Row */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : claim.id)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <StatusIcon size={18} className={`${statusCfg.color} flex-shrink-0`} />
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-white truncate">{claim.brand_name}</div>
                        <div className="text-[10px] text-white/40 flex items-center gap-2 flex-wrap">
                          <span>{planInfo.name}</span>
                          <span>·</span>
                          <span>{CHANNEL_LABELS[claim.payment_channel] || claim.payment_channel}</span>
                          <span>·</span>
                          <span>{new Date(claim.created_at).toLocaleDateString("zh-TW")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {claim.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(claim.id, "approve"); }}
                            disabled={actionLoading === claim.id}
                            className="px-3 py-1.5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold hover:bg-emerald-400/20 transition-all disabled:opacity-50"
                          >
                            {actionLoading === claim.id ? "..." : "核准"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAction(claim.id, "reject"); }}
                            disabled={actionLoading === claim.id}
                            className="px-3 py-1.5 rounded-lg bg-red-400/10 border border-red-400/30 text-red-300 text-[10px] font-bold hover:bg-red-400/20 transition-all disabled:opacity-50"
                          >
                            {actionLoading === claim.id ? "..." : "拒絕"}
                          </button>
                        </>
                      )}
                      {isExpanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-3 space-y-2">
                      <DetailRow label="認領 ID" value={claim.id} mono />
                      <DetailRow label="店面 ID" value={claim.store_id} mono />
                      <DetailRow label="Email" value={claim.email} />
                      <DetailRow label="方案" value={`${planInfo.name} (NT$${planInfo.price.toLocaleString()})`} />
                      <DetailRow label="付款通道" value={CHANNEL_LABELS[claim.payment_channel] || claim.payment_channel} />
                      {claim.stores && (
                        <DetailRow label="樓層/面向" value={`${claim.stores.floor}F ${claim.stores.face}面`} />
                      )}
                      {claim.reviewed_at && (
                        <DetailRow label="審核時間" value={new Date(claim.reviewed_at).toLocaleString("zh-TW")} />
                      )}
                      {claim.review_reason && (
                        <DetailRow label="審核備註" value={claim.review_reason} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-[10px] text-white/20 tracking-wider">
          SNT 光躍星樞 Admin Console · {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}

// ===== Helper Components =====
function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    cyan: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    purple: "text-purple-400 border-purple-400/20 bg-purple-400/5",
  };
  return (
    <div className={`glass-panel rounded-xl border p-3 sm:p-4 ${colorMap[color] || colorMap.cyan}`}>
      <Icon size={16} className="mb-2 opacity-60" />
      <div className="text-lg sm:text-xl font-bold">{value}</div>
      <div className="text-[9px] sm:text-[10px] text-white/40 tracking-wider">{label}</div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[9px] text-white/30 uppercase tracking-wider flex-shrink-0">{label}</span>
      <span className={`text-[11px] text-white/70 text-right ${mono ? "font-mono break-all" : ""}`}>{value}</span>
    </div>
  );
}

// ===== Wrapper with I18nProvider =====
export default function AdminDashboard() {
  return (
    <I18nProvider>
      <AdminDashboardContent />
    </I18nProvider>
  );
}
