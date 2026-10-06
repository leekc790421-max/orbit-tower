"use client";

import { useState } from "react";
import { X, BookOpen, Building, Bottle, Search, Code, Database, Cpu, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadmeModal({ isOpen, onClose }: ReadmeModalProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"overview" | "tech" | "api">("overview");

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <div className="relative w-full sm:max-w-4xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
            {/* 頂部 */}
            <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wider">
                  {t("readme.title")}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-400/60 tracking-wider mt-1">
                  {t("readme.subtitle")}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
              >
                <X size={16} className="text-white/40" />
              </button>
            </div>

            {/* Tabs */}
            <div className="sticky top-[73px] z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 flex gap-2">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
                icon={BookOpen}
                label={t("readme.tabOverview")}
              />
              <TabButton
                active={activeTab === "tech"}
                onClick={() => setActiveTab("tech")}
                icon={Code}
                label={t("readme.tabTech")}
              />
              <TabButton
                active={activeTab === "api"}
                onClick={() => setActiveTab("api")}
                icon={Database}
                label={t("readme.tabApi")}
              />
            </div>

            <div className="p-4 sm:p-6">
              {activeTab === "overview" && <OverviewContent />}
              {activeTab === "tech" && <TechContent />}
              {activeTab === "api" && <APIContent />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-cyan-400/10 border border-cyan-400/40 text-cyan-300"
          : "border border-white/10 text-white/50 hover:text-white/80 hover:border-white/30"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function OverviewContent() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* 三大核心機制 */}
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building size={20} className="text-cyan-400" />
          {t("readme.overviewTitle1")}
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            {t("readme.overviewDesc1")}
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">{t("readme.ov1Item1")}</span>：{t("readme.ov1Item1Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov1Item2")}</span>：{t("readme.ov1Item2Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov1Item3")}</span>：{t("readme.ov1Item3Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov1Item4")}</span>：{t("readme.ov1Item4Desc")}</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bottle size={20} className="text-cyan-400" />
          {t("readme.overviewTitle2")}
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            {t("readme.overviewDesc2")}
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">{t("readme.ov2Item1")}</span>：{t("readme.ov2Item1Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov2Item2")}</span>：{t("readme.ov2Item2Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov2Item3")}</span>：{t("readme.ov2Item3Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov2Item4")}</span>：{t("readme.ov2Item4Desc")}</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Search size={20} className="text-cyan-400" />
          {t("readme.overviewTitle3")}
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            {t("readme.overviewDesc3")}
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">{t("readme.ov3Item1")}</span>：{t("readme.ov3Item1Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov3Item2")}</span>：{t("readme.ov3Item2Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov3Item3")}</span>：{t("readme.ov3Item3Desc")}</li>
            <li>• <span className="text-white font-medium">{t("readme.ov3Item4")}</span>：{t("readme.ov3Item4Desc")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TechContent() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-cyan-400" />
          {t("readme.techTitle1")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TechCard title="Next.js 16" description="React Server Components + App Router" />
          <TechCard title="React Three Fiber" description="Three.js 3D 渲染引擎" />
          <TechCard title="TailwindCSS 4" description="原子化 CSS 框架" />
          <TechCard title="TypeScript" description="型別安全的 JavaScript" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Database size={20} className="text-cyan-400" />
          {t("readme.techTitle2")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TechCard title="Supabase" description="PostgreSQL + Realtime + Auth" />
          <TechCard title="Groq API" description="毫秒級 AI 推理引擎" />
          <TechCard title="Vercel Edge" description="全球 CDN + Edge Functions" />
          <TechCard title="Stripe" description="金流訂閱 & 一次性付款" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe size={20} className="text-cyan-400" />
          {t("readme.techTitle3")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TechCard title="Vercel" description="自動部署 + Preview Environments" />
          <TechCard title="Cloudflare" description="WAF + DDoS 防護 + CDN" />
          <TechCard title="IndexNow" description="即時搜尋引擎推送" />
          <TechCard title="Sentry" description="錯誤追蹤 & 效能監控" />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3">
          {t("readme.archTitle")}
        </h3>
        <pre className="text-xs sm:text-sm text-cyan-300 overflow-x-auto">
{`┌─────────────────────────────────────────────────────────────┐
│                SNT 光躍星樞 架構                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐         │
│  │  3D 場景 │◄────►│  React   │◄────►│ Supabase │         │
│  │ Three.js │      │  Next.js │      │PostgreSQL│         │
│  └──────────┘      └──────────┘      └──────────┘         │
│        │                 │                 │                │
│        ▼                 ▼                 ▼                │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐         │
│  │  Bloom   │      │  Groq    │      │  Stripe  │         │
│  │ 後處理   │      │  AI API  │      │  金流    │         │
│  └──────────┘      └──────────┘      └──────────┘         │
│        │                 │                 │                │
│        └─────────────────┴─────────────────┘                │
│                          │                                  │
│                          ▼                                  │
│                    ┌──────────┐                            │
│                    │ Vercel   │                            │
│                    │  Edge    │                            │
│                    └──────────┘                            │
│                          │                                  │
│                          ▼                                  │
│                    ┌──────────┐                            │
│                    │IndexNow  │                            │
│                    │搜尋推送  │                            │
│                    └──────────┘                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>
    </div>
  );
}

function APIContent() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">
          {t("readme.apiTitle1")}
        </h3>
        <div className="space-y-4">
          <APICard
            title={t("readme.apiStoresTable")}
            description={t("readme.apiStoresDesc")}
            fields={[
              "id: uuid (PK)",
              "floor: int (樓層)",
              "face: text (面向 A-F)",
              "brand_name: text",
              "owner_email: text",
              "is_claimed: boolean",
              "is_floor_locked: boolean",
              "kyc_status: text (pending/verified/rejected)",
              "payment_type: text (stripe/bank_wire/payoneer)",
            ]}
          />
          <APICard
            title={t("readme.apiPaymentTable")}
            description={t("readme.apiPaymentDesc")}
            fields={[
              "id: uuid (PK)",
              "store_id: uuid (FK → stores)",
              "amount: numeric",
              "payment_method: text",
              "transaction_ref: text",
              "proof_document_url: text",
              "status: text (pending/approved/rejected)",
            ]}
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">
          {t("readme.apiTitle2")}
        </h3>
        <div className="space-y-4">
          <EndpointCard
            method="POST"
            path="/api/checkout"
            description={t("readme.apiCheckout")}
          />
          <EndpointCard
            method="POST"
            path="/api/kyc/verify"
            description={t("readme.apiKyc")}
          />
          <EndpointCard
            method="POST"
            path="/api/drift/generate"
            description={t("readme.apiDrift")}
          />
          <EndpointCard
            method="POST"
            path="/api/indexnow/submit"
            description={t("readme.apiIndexNow")}
          />
          <EndpointCard
            method="GET"
            path="/api/stores/:id"
            description={t("readme.apiStoresGet")}
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3">
          {t("readme.apiTitle3")}
        </h3>
        <div className="space-y-3 text-sm text-white/70">
          <p>
            <span className="text-cyan-300 font-semibold">{t("readme.channelA")}</span>：{t("readme.channelADesc")}
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">{t("readme.channelB")}</span>：{t("readme.channelBDesc")}
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">{t("readme.channelC")}</span>：{t("readme.channelCDesc")}
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">{t("readme.channelD")}</span>：{t("readme.channelDDesc")}
          </p>
        </div>
      </div>
    </div>
  );
}

function TechCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="glass-panel rounded-lg p-3 border border-white/10">
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-xs text-white/60">{description}</div>
    </div>
  );
}

function APICard({ title, description, fields }: { title: string; description: string; fields: string[] }) {
  return (
    <div className="glass-panel rounded-lg p-4 border border-white/10">
      <div className="text-sm font-bold text-white mb-1">{title}</div>
      <div className="text-xs text-white/60 mb-3">{description}</div>
      <div className="space-y-1">
        {fields.map((field, i) => (
          <div key={i} className="text-xs text-cyan-300/80 font-mono">
            {field}
          </div>
        ))}
      </div>
    </div>
  );
}

function EndpointCard({ method, path, description }: { method: string; path: string; description: string }) {
  const methodColor = method === "GET" ? "text-emerald-400 bg-emerald-400/10" : "text-cyan-400 bg-cyan-400/10";
  return (
    <div className="flex items-start gap-3">
      <span className={`px-2 py-1 rounded text-xs font-bold ${methodColor}`}>
        {method}
      </span>
      <div className="flex-1">
        <div className="text-sm font-mono text-white mb-1">{path}</div>
        <div className="text-xs text-white/60">{description}</div>
      </div>
    </div>
  );
}
