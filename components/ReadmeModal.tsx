"use client";

import { useState } from "react";
import { X, BookOpen, Building, Bottle, Search, Code, Database, Cpu, Globe } from "lucide-react";

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReadmeModal({ isOpen, onClose }: ReadmeModalProps) {
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
                  系統說明 / README
                </h2>
                <p className="text-xs sm:text-sm text-cyan-400/60 tracking-wider mt-1">
                  SNT 光躍星樞 技術架構與核心機制
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
                label="系統概覽"
              />
              <TabButton
                active={activeTab === "tech"}
                onClick={() => setActiveTab("tech")}
                icon={Code}
                label="技術架構"
              />
              <TabButton
                active={activeTab === "api"}
                onClick={() => setActiveTab("api")}
                icon={Database}
                label="API & 資料"
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
  return (
    <div className="space-y-6">
      {/* 三大核心機制 */}
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building size={20} className="text-cyan-400" />
          1. 3D 空間展示
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            SNT 光躍星樞採用 <span className="text-cyan-300 font-semibold">Three.js + React Three Fiber</span> 打造高透光晶體大樓，結合動態樓層排序與即時光照渲染。
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">六角晶體架構</span>：每層樓 6 個品牌店面，共 36 個企業空間</li>
            <li>• <span className="text-white font-medium">MeshPhysicalMaterial</span>：高透光玻璃材質 (transmission: 0.9)，打造極致質感</li>
            <li>• <span className="text-white font-medium">Bloom 後處理</span>：霓虹極光光效，強化 Cyber Luxury 視覺體驗</li>
            <li>• <span className="text-white font-medium">動態樓層排序</span>：根據品牌進駐狀態自動調整樓層配置</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bottle size={20} className="text-cyan-400" />
          2. 漂流瓶互動 (/drift)
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            結合 <span className="text-cyan-300 font-semibold">Groq API</span> 毫秒級動態生成籤詩與專屬優惠，提升顧客停留時間與品牌互動深度。
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">即時生成</span>：Groq API 毫秒級回應，流暢無延遲</li>
            <li>• <span className="text-white font-medium">動態籤詩</span>：結合品牌特色與用戶互動，生成獨特內容</li>
            <li>• <span className="text-white font-medium">專屬優惠</span>：每次拋接都可獲得品牌折價券或限量優惠</li>
            <li>• <span className="text-white font-medium">流量裂變</span>：鼓勵用戶分享，建立病毒式傳播效應</li>
          </ul>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Search size={20} className="text-cyan-400" />
          3. IndexNow 即時搜尋收錄
        </h3>
        <div className="space-y-3 text-sm sm:text-base text-white/70">
          <p>
            更新內容 <span className="text-cyan-300 font-semibold">24 小時內快速報備搜尋引擎</span>，建立自動化流量池，讓品牌在 Google、Bing 等搜尋引擎中快速被發現。
          </p>
          <ul className="space-y-2 ml-4">
            <li>• <span className="text-white font-medium">即時推送</span>：內容更新後自動通知搜尋引擎，無需等待爬蟲</li>
            <li>• <span className="text-white font-medium">多引擎支援</span>：同時推送至 Google、Bing、Yandex 等主要搜尋引擎</li>
            <li>• <span className="text-white font-medium">自動化流程</span>：結合 Supabase Webhook，觸發自動收錄機制</li>
            <li>• <span className="text-white font-medium">SEO 最佳化</span>：自動生成 Schema Markup、Open Graph、Twitter Card</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function TechContent() {
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu size={20} className="text-cyan-400" />
          前端技術棧
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
          後端 & 資料庫
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
          部署 & 監控
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
          系統架構圖
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
  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-xl p-5 border border-white/10">
        <h3 className="text-base sm:text-lg font-bold text-white mb-4">
          資料庫結構 (Supabase)
        </h3>
        <div className="space-y-4">
          <APICard
            title="stores 資料表"
            description="品牌店面資訊"
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
            title="payment_audit_logs 資料表"
            description="交易與實名審核紀錄"
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
          API 端點
        </h3>
        <div className="space-y-4">
          <EndpointCard
            method="POST"
            path="/api/checkout"
            description="建立結帳訂單 (Stripe / 電匯 / Payoneer)"
          />
          <EndpointCard
            method="POST"
            path="/api/kyc/verify"
            description="提交實名驗證 (域名 / 企業證件)"
          />
          <EndpointCard
            method="POST"
            path="/api/drift/generate"
            description="Groq API 生成漂流瓶籤詩與優惠"
          />
          <EndpointCard
            method="POST"
            path="/api/indexnow/submit"
            description="推送 URL 至搜尋引擎"
          />
          <EndpointCard
            method="GET"
            path="/api/stores/:id"
            description="取得品牌店面詳細資訊"
          />
        </div>
      </div>

      <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
        <h3 className="text-base sm:text-lg font-bold text-white mb-3">
          金流通道
        </h3>
        <div className="space-y-3 text-sm text-white/70">
          <p>
            <span className="text-cyan-300 font-semibold">通道 A (國內台幣)</span>：樂天國際商業銀行 — 用戶轉帳後輸入後五碼 + 上傳截圖
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">通道 B (海外電匯)</span>：臺灣銀行松山分行 — 上傳 SWIFT 水單
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">通道 C (美金快速支付)</span>：Payoneer — 點擊跳轉專屬 Token 連結 + 輸入交易號
          </p>
          <p>
            <span className="text-cyan-300 font-semibold">通道 D (線上刷卡)</span>：Stripe — 预留接口，未來啟用
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
