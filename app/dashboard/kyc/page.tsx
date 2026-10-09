"use client";

import { useState } from "react";
import { ArrowLeft, Shield, CheckCircle, Upload, Globe, AtSign, FileText, Building2, User, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { I18nProvider, useTranslation } from "@/lib/i18n";

type KycType = "domain" | "social" | "enterprise";
type KycStatus = "idle" | "pending" | "verified" | "rejected";

function KycContent() {
  const { t } = useTranslation();
  const [kycType, setKycType] = useState<KycType>("domain");
  const [status, setStatus] = useState<KycStatus>("idle");
  const [domain, setDomain] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [socialPlatform, setSocialPlatform] = useState<"instagram" | "website">("instagram");
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [verifyToken, setVerifyToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 生成驗證 Token
  const generateToken = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let token = "orbit-verify-";
    for (let i = 0; i < 8; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  };

  // 一級輕量驗證 — 域名
  const handleDomainVerify = async () => {
    if (!domain) return;
    setLoading(true);
    const token = generateToken();
    setVerifyToken(token);
    // 模擬 API 呼叫
    setTimeout(() => {
      setStatus("pending");
      setLoading(false);
    }, 1000);
  };

  // 一級輕量驗證 — 社群
  const handleSocialVerify = async () => {
    if (!socialHandle) return;
    setLoading(true);
    const token = generateToken();
    setVerifyToken(token);
    setTimeout(() => {
      setStatus("pending");
      setLoading(false);
    }, 1000);
  };

  // 二級企業驗證
  const handleEnterpriseVerify = async () => {
    if (!companyName || !taxId) return;
    setLoading(true);
    setTimeout(() => {
      setStatus("pending");
      setLoading(false);
    }, 1500);
  };

  // 上傳文件
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* 頂部導航 */}
      <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-xs sm:text-sm tracking-wider">{t("kyc.back")}</span>
          </Link>
          <div className="text-right">
            <h1 className="text-sm sm:text-lg font-bold text-white tracking-wider">
              {t("kyc.mainTitle")}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-cyan-400/60 tracking-wider mt-0.5">
              {t("kyc.mainSubtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* 內容區 */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
        {/* 說明 */}
        <div className="glass-panel rounded-xl p-4 sm:p-5 border border-cyan-400/20 bg-cyan-400/5">
          <div className="flex items-start gap-3">
            <Shield size={20} className="text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-white mb-1">{t("kyc.infoTitle")}</h2>
              <p className="text-xs text-white/60 leading-relaxed">{t("kyc.infoDesc")}</p>
            </div>
          </div>
        </div>

        {/* 驗證類型選擇 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => { setKycType("domain"); setStatus("idle"); setVerifyToken(null); }}
            className={`p-4 rounded-xl border transition-all text-left ${
              kycType === "domain"
                ? "border-cyan-400/50 bg-cyan-400/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <Globe size={20} className={kycType === "domain" ? "text-cyan-400 mb-2" : "text-white/40 mb-2"} />
            <div className="text-sm font-bold text-white">{t("kyc.typeDomain")}</div>
            <div className="text-[10px] text-white/50 mt-1">{t("kyc.typeDomainDesc")}</div>
            <div className="text-[9px] text-emerald-400/70 mt-2 font-medium">{t("kyc.recommended")}</div>
          </button>

          <button
            onClick={() => { setKycType("social"); setStatus("idle"); setVerifyToken(null); }}
            className={`p-4 rounded-xl border transition-all text-left ${
              kycType === "social"
                ? "border-cyan-400/50 bg-cyan-400/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <AtSign size={20} className={kycType === "social" ? "text-cyan-400 mb-2" : "text-white/40 mb-2"} />
            <div className="text-sm font-bold text-white">{t("kyc.typeSocial")}</div>
            <div className="text-[10px] text-white/50 mt-1">{t("kyc.typeSocialDesc")}</div>
            <div className="text-[9px] text-emerald-400/70 mt-2 font-medium">{t("kyc.recommended")}</div>
          </button>

          <button
            onClick={() => { setKycType("enterprise"); setStatus("idle"); setVerifyToken(null); }}
            className={`p-4 rounded-xl border transition-all text-left ${
              kycType === "enterprise"
                ? "border-amber-400/50 bg-amber-400/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <Building2 size={20} className={kycType === "enterprise" ? "text-amber-400 mb-2" : "text-white/40 mb-2"} />
            <div className="text-sm font-bold text-white">{t("kyc.typeEnterprise")}</div>
            <div className="text-[10px] text-white/50 mt-1">{t("kyc.typeEnterpriseDesc")}</div>
            <div className="text-[9px] text-amber-400/70 mt-2 font-medium">{t("kyc.goldRequired")}</div>
          </button>
        </div>

        {/* 驗證表單 */}
        <div className="glass-panel rounded-xl p-5 sm:p-6 border border-white/10">
          {/* 域名驗證 */}
          {kycType === "domain" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">{t("kyc.domainTitle")}</h3>
              </div>
              <p className="text-xs text-white/60">{t("kyc.domainDesc")}</p>
              
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">{t("kyc.domainLabel")}</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourbrand.com"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none transition-colors"
                />
              </div>

              {verifyToken && (
                <div className="p-4 rounded-lg bg-cyan-400/5 border border-cyan-400/20">
                  <div className="text-xs text-white/50 mb-2">{t("kyc.tokenInstruction")}</div>
                  <div className="font-mono text-sm text-cyan-300 bg-black/30 px-3 py-2 rounded mb-2 break-all">
                    {verifyToken}
                  </div>
                  <div className="text-[10px] text-white/40">{t("kyc.tokenPlacement")}</div>
                  <code className="text-[10px] text-cyan-400/60 bg-black/30 px-2 py-1 rounded mt-1 block">
                    &lt;meta name=&quot;orbit-verify&quot; content=&quot;{verifyToken}&quot; /&gt;
                  </code>
                </div>
              )}

              <button
                onClick={handleDomainVerify}
                disabled={!domain || loading}
                className="w-full py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-sm font-bold tracking-wider hover:bg-cyan-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {status === "idle" ? t("kyc.startVerify") : t("kyc.verified")}
              </button>
            </div>
          )}

          {/* 社群驗證 */}
          {kycType === "social" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <AtSign size={18} className="text-cyan-400" />
                <h3 className="text-base font-bold text-white">{t("kyc.socialTitle")}</h3>
              </div>
              <p className="text-xs text-white/60">{t("kyc.socialDesc")}</p>
              
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">{t("kyc.socialPlatformLabel")}</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSocialPlatform("instagram")}
                    className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${
                      socialPlatform === "instagram"
                        ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    Instagram
                  </button>
                  <button
                    onClick={() => setSocialPlatform("website")}
                    className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${
                      socialPlatform === "website"
                        ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {t("kyc.officialWebsite")}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">
                  {socialPlatform === "instagram" ? t("kyc.igHandle") : t("kyc.websiteUrl")}
                </label>
                <input
                  type="text"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  placeholder={socialPlatform === "instagram" ? "@yourbrand" : "https://yourbrand.com"}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-cyan-400/50 focus:outline-none transition-colors"
                />
              </div>

              {verifyToken && (
                <div className="p-4 rounded-lg bg-cyan-400/5 border border-cyan-400/20">
                  <div className="text-xs text-white/50 mb-2">{t("kyc.bioInstruction")}</div>
                  <div className="font-mono text-sm text-cyan-300 bg-black/30 px-3 py-2 rounded break-all">
                    {verifyToken}
                  </div>
                </div>
              )}

              <button
                onClick={handleSocialVerify}
                disabled={!socialHandle || loading}
                className="w-full py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-sm font-bold tracking-wider hover:bg-cyan-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t("kyc.startVerify")}
              </button>
            </div>
          )}

          {/* 企業驗證 */}
          {kycType === "enterprise" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 size={18} className="text-amber-400" />
                <h3 className="text-base font-bold text-white">{t("kyc.enterpriseTitle")}</h3>
              </div>
              <p className="text-xs text-white/60">{t("kyc.enterpriseDesc")}</p>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-400/5 border border-amber-400/20">
                <AlertCircle size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-300/80">{t("kyc.enterpriseWarning")}</p>
              </div>
              
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">{t("kyc.companyName")}</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={t("kyc.companyNamePlaceholder")}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">{t("kyc.taxIdLabel")}</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  placeholder="12345678"
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:border-amber-400/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 mb-1.5 block">{t("kyc.uploadDoc")}</label>
                <label className="flex flex-col items-center justify-center w-full h-28 rounded-lg bg-white/5 border border-dashed border-white/20 cursor-pointer hover:border-amber-400/40 transition-colors">
                  <Upload size={20} className="text-white/40 mb-2" />
                  <span className="text-xs text-white/50">{t("kyc.uploadHint")}</span>
                  <span className="text-[10px] text-white/30 mt-1">{t("kyc.uploadFormats")}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                </label>
                {documentUrl && (
                  <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {t("kyc.fileUploaded")}
                  </div>
                )}
              </div>

              <button
                onClick={handleEnterpriseVerify}
                disabled={!companyName || !taxId || loading}
                className="w-full py-3 rounded-lg bg-amber-400/10 border border-amber-400/40 text-amber-300 text-sm font-bold tracking-wider hover:bg-amber-400/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {t("kyc.submitReview")}
              </button>
            </div>
          )}
        </div>

        {/* 狀態顯示 */}
        {status === "pending" && (
          <div className="glass-panel rounded-xl p-5 border border-amber-400/20 bg-amber-400/5">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="text-amber-400 animate-spin" />
              <div>
                <div className="text-sm font-bold text-white">{t("kyc.statusPending")}</div>
                <div className="text-xs text-white/50 mt-0.5">{t("kyc.statusPendingDesc")}</div>
              </div>
            </div>
          </div>
        )}

        {status === "verified" && (
          <div className="glass-panel rounded-xl p-5 border border-emerald-400/20 bg-emerald-400/5">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-emerald-400" />
              <div>
                <div className="text-sm font-bold text-white">{t("kyc.statusVerified")}</div>
                <div className="text-xs text-white/50 mt-0.5">{t("kyc.statusVerifiedDesc")}</div>
              </div>
            </div>
          </div>
        )}

        {/* 驗證流程說明 */}
        <div className="glass-panel rounded-xl p-5 border border-white/10">
          <h3 className="text-sm font-bold text-white mb-3">{t("kyc.processTitle")}</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-cyan-400 font-bold">1</span>
              </div>
              <div>
                <div className="text-xs font-medium text-white">{t("kyc.step1Title")}</div>
                <div className="text-[10px] text-white/50">{t("kyc.step1Desc")}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-cyan-400 font-bold">2</span>
              </div>
              <div>
                <div className="text-xs font-medium text-white">{t("kyc.step2Title")}</div>
                <div className="text-[10px] text-white/50">{t("kyc.step2Desc")}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-cyan-400 font-bold">3</span>
              </div>
              <div>
                <div className="text-xs font-medium text-white">{t("kyc.step3Title")}</div>
                <div className="text-[10px] text-white/50">{t("kyc.step3Desc")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KycPage() {
  return (
    <I18nProvider>
      <KycContent />
    </I18nProvider>
  );
}
