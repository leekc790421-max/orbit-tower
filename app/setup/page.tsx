"use client";

import { useState } from "react";
import { CheckCircle, Copy, ExternalLink, ArrowRight, Database, Key, Code } from "lucide-react";

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);

  const [supabaseUrl, setSupabaseUrl] = useState("");
  const [supabaseAnonKey, setSupabaseAnonKey] = useState("");
  const [supabaseServiceKey, setSupabaseServiceKey] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [adminSecret, setAdminSecret] = useState("");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqlMigration = `-- 在 Supabase SQL Editor 執行這段 SQL
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor INTEGER NOT NULL,
  face TEXT NOT NULL,
  is_claimed BOOLEAN DEFAULT false,
  brand_name TEXT,
  owner_email TEXT,
  plan TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO stores (floor, face) VALUES
(1,'A'),(1,'B'),(1,'C'),(1,'D'),(1,'E'),(1,'F'),
(2,'A'),(2,'B'),(2,'C'),(2,'D'),(2,'E'),(2,'F'),
(3,'A'),(3,'B'),(3,'C'),(3,'D'),(3,'E'),(3,'F'),
(4,'A'),(4,'B'),(4,'C'),(4,'D'),(4,'E'),(4,'F'),
(5,'A'),(5,'B'),(5,'C'),(5,'D'),(5,'E'),(5,'F'),
(6,'A'),(6,'B'),(6,'C'),(6,'D'),(6,'E'),(6,'F');`;

  return (
    <div className="min-h-screen bg-[#050510] text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Orbit Tower 設定精靈
          </h1>
          <p className="text-white/60">跟著步驟完成設定，讓網站正式營運</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? "bg-cyan-400 text-black" : "bg-white/10 text-white/40"
                }`}
              >
                {step > s ? <CheckCircle size={20} /> : s}
              </div>
              {s < 4 && <div className={`w-16 h-1 ${step > s ? "bg-cyan-400" : "bg-white/10"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Supabase */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-8 border border-cyan-400/30">
              <div className="flex items-center gap-3 mb-6">
                <Database size={28} className="text-cyan-400" />
                <h2 className="text-2xl font-bold">步驟 1：建立 Supabase 專案</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/80 mb-3">1. 前往 Supabase 建立新專案</p>
                  <a
                    href="https://supabase.com/dashboard/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-400/10 border border-cyan-400/40 rounded-lg text-cyan-300 hover:bg-cyan-400/20 transition-all"
                  >
                    開啟 Supabase <ExternalLink size={16} />
                  </a>
                </div>

                <div>
                  <p className="text-white/80 mb-3">2. 建立完成後，到 Settings → API 複製這 3 個值：</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">Project URL</label>
                      <input
                        type="text"
                        value={supabaseUrl}
                        onChange={(e) => setSupabaseUrl(e.target.value)}
                        placeholder="https://xxxxx.supabase.co"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">anon public key</label>
                      <input
                        type="text"
                        value={supabaseAnonKey}
                        onChange={(e) => setSupabaseAnonKey(e.target.value)}
                        placeholder="eyJhbGci..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-white/60 mb-1 block">service_role key (secret)</label>
                      <input
                        type="password"
                        value={supabaseServiceKey}
                        onChange={(e) => setSupabaseServiceKey(e.target.value)}
                        placeholder="eyJhbGci..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400/40"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey}
                  className="w-full py-4 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  下一步 <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: API Keys */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-8 border border-purple-400/30">
              <div className="flex items-center gap-3 mb-6">
                <Key size={28} className="text-purple-400" />
                <h2 className="text-2xl font-bold">步驟 2：設定 API Keys</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/80 mb-3">1. 取得 Groq API Key（用於 AI 漂流瓶）</p>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-purple-400/10 border border-purple-400/40 rounded-lg text-purple-300 hover:bg-purple-400/20 transition-all mb-3"
                  >
                    開啟 Groq Console <ExternalLink size={16} />
                  </a>
                  <input
                    type="password"
                    value={groqKey}
                    onChange={(e) => setGroqKey(e.target.value)}
                    placeholder="gsk_xxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/40"
                  />
                </div>

                <div>
                  <p className="text-white/80 mb-3">2. 設定管理員密碼（用於 /admin 後台）</p>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="輸入強密碼（至少 12 字元）"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400/40"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border border-white/20 text-white/60 rounded-lg hover:bg-white/5 transition-all"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!groqKey || !adminSecret}
                    className="flex-1 py-4 bg-purple-400 text-black font-bold rounded-lg hover:bg-purple-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    下一步 <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: SQL Migration */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-8 border border-emerald-400/30">
              <div className="flex items-center gap-3 mb-6">
                <Code size={28} className="text-emerald-400" />
                <h2 className="text-2xl font-bold">步驟 3：執行資料庫遷移</h2>
              </div>

              <div className="space-y-4">
                <p className="text-white/80">
                  1. 回到 Supabase Dashboard → SQL Editor
                </p>
                <p className="text-white/80">
                  2. 點擊 "New Query"，複製下方 SQL 並執行：
                </p>

                <div className="relative">
                  <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-xs text-emerald-300 overflow-x-auto">
                    <code>{sqlMigration}</code>
                  </pre>
                  <button
                    onClick={() => copyToClipboard(sqlMigration, "sql")}
                    className="absolute top-2 right-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs flex items-center gap-1 transition-all"
                  >
                    {copied === "sql" ? <CheckCircle size={12} /> : <Copy size={12} />}
                    {copied === "sql" ? "已複製" : "複製"}
                  </button>
                </div>

                <p className="text-white/60 text-sm">
                  這段 SQL 會建立 stores 資料表並插入 36 個店面（6 層 × 6 面）
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 border border-white/20 text-white/60 rounded-lg hover:bg-white/5 transition-all"
                  >
                    上一步
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-1 py-4 bg-emerald-400 text-black font-bold rounded-lg hover:bg-emerald-300 transition-all flex items-center justify-center gap-2"
                  >
                    下一步 <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-8 border border-amber-400/30">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={28} className="text-amber-400" />
                <h2 className="text-2xl font-bold">步驟 4：完成設定</h2>
              </div>

              <div className="space-y-4">
                <p className="text-white/80 mb-4">
                  將以下資訊提供給工程師，或自行到 Vercel Dashboard 設定環境變數：
                </p>

                <div className="bg-black/50 border border-white/10 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs text-white/40 mb-1">NEXT_PUBLIC_SUPABASE_URL</div>
                    <div className="text-sm text-amber-300 font-mono break-all">{supabaseUrl}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</div>
                    <div className="text-sm text-amber-300 font-mono break-all">{supabaseAnonKey}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">SUPABASE_SERVICE_ROLE_KEY</div>
                    <div className="text-sm text-amber-300 font-mono break-all">{supabaseServiceKey}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">GROQ_API_KEY</div>
                    <div className="text-sm text-amber-300 font-mono break-all">{groqKey}</div>
                  </div>
                  <div>
                    <div className="text-xs text-white/40 mb-1">ADMIN_SECRET</div>
                    <div className="text-sm text-amber-300 font-mono break-all">{adminSecret}</div>
                  </div>
                </div>

                <button
                  onClick={() => copyToClipboard(
                    `NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}\nNEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}\nSUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}\nGROQ_API_KEY=${groqKey}\nADMIN_SECRET=${adminSecret}`,
                    "all"
                  )}
                  className="w-full py-4 bg-amber-400 text-black font-bold rounded-lg hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
                >
                  {copied === "all" ? <CheckCircle size={20} /> : <Copy size={20} />}
                  {copied === "all" ? "已複製全部" : "複製全部環境變數"}
                </button>

                <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4">
                  <p className="text-emerald-300 text-sm">
                    ✅ 設定完成後，訪問 <a href="/admin" className="underline">/admin</a> 測試管理後台
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full py-4 border border-white/20 text-white/60 rounded-lg hover:bg-white/5 transition-all"
                >
                  重新開始
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
