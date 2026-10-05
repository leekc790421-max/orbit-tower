"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield, Check } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "login" | "register" | "forgot" | "otp";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView("otp");
    }, 1000);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setView("otp");
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full sm:max-w-md h-[88vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
        {/* 頂部 */}
        <div className="sticky top-0 z-10 glass-panel px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex items-center justify-between border-b border-white/10 rounded-t-2xl">
          <div className="flex items-center gap-2 sm:gap-3">
            {view !== "login" && (
              <button
                onClick={() => setView("login")}
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:border-white/30 transition-all"
              >
                <ArrowLeft size={13} className="text-white/60" />
              </button>
            )}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wider">
                {view === "login" && "登入 / Login"}
                {view === "register" && "註冊 / Register"}
                {view === "forgot" && "忘記密碼 / Reset"}
                {view === "otp" && "驗證碼 / OTP"}
              </h2>
              <p className="text-[8px] sm:text-[9px] text-cyan-400/60 tracking-wider mt-0.5">
                {view === "login" && "ORBIT TOWER ACCESS PORTAL"}
                {view === "register" && "CREATE YOUR ACCOUNT"}
                {view === "forgot" && "RESET YOUR PASSWORD"}
                {view === "otp" && "ENTER VERIFICATION CODE"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
          >
            <X size={14} className="text-white/40" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center">
                <Check size={28} className="text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-emerald-400">登入成功</div>
              <div className="text-[10px] text-white/40 mt-1">歡迎回到 Orbit Tower</div>
            </div>
          ) : view === "login" ? (
            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  密碼 / Password
                </label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-10 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-3.5 h-3.5 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-[10px] text-white/50">記住我</span>
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
                >
                  忘記密碼？
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 disabled:opacity-50 transition-all"
              >
                {loading ? "驗證中..." : "登入"}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-3 bg-transparent text-white/30">或</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 sm:py-2.5 rounded-lg border border-white/10 text-white/50 text-[11px] sm:text-xs hover:bg-white/5 hover:text-white/70 transition-all"
              >
                OTP 快速驗證（無密碼登入）
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40">還沒有帳號？</span>
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 ml-1 transition-colors"
                >
                  立即註冊
                </button>
              </div>
            </form>
          ) : view === "register" ? (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  企業名稱 / Company
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder="您的企業名稱"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  手機號碼 / Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="0912-345-678"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                />
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  設定密碼 / Password
                </label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="至少 8 個字元"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-3.5 h-3.5 mt-0.5 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-[10px] text-white/50 leading-relaxed">
                  我已閱讀並同意{" "}
                  <span className="text-cyan-400/70 hover:text-cyan-400 cursor-pointer">
                    《SNT Orbit 服務條款與免責聲明》
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 disabled:opacity-50 transition-all"
              >
                {loading ? "處理中..." : "註冊並發送驗證碼"}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40">已有帳號？</span>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 ml-1 transition-colors"
                >
                  返回登入
                </button>
              </div>
            </form>
          ) : view === "forgot" ? (
            <form onSubmit={handleForgot} className="space-y-3 sm:space-y-4">
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-white/10 mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Shield size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
                    請輸入您註冊時使用的 Email，我們將發送 OTP 密碼重置連結至您的信箱。
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  註冊 Email
                </label>
                <div className="relative">
                  <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 sm:pl-10 pr-4 py-2.5 text-[11px] sm:text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 disabled:opacity-50 transition-all"
              >
                {loading ? "發送中..." : "發送重置連結"}
              </button>
            </form>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-emerald-400/20 bg-emerald-400/5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
                    驗證碼已發送至您的 Email。請檢查信箱並輸入 6 位數驗證碼。
                    <br />
                    <span className="text-[9px] text-white/40">
                      （未收到？請檢查垃圾郵件資料夾）
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  OTP 驗證碼
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 sm:py-3 text-center text-base sm:text-lg font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors tracking-widest"
                />
              </div>

              <button className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
                驗證並繼續
              </button>

              <div className="text-center">
                <button className="text-[10px] text-white/40 hover:text-white/60 transition-colors">
                  重新發送驗證碼（60 秒後可重試）
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
