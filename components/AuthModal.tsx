"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, Shield, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "login" | "register" | "forgot" | "otp";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { t } = useTranslation();
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
                {view === "login" && t("auth.login")}
                {view === "register" && t("auth.register")}
                {view === "forgot" && t("auth.forgot")}
                {view === "otp" && t("auth.otp")}
              </h2>
              <p className="text-[8px] sm:text-[9px] text-cyan-400/60 tracking-wider mt-0.5">
                {view === "login" && t("auth.loginSub")}
                {view === "register" && t("auth.registerSub")}
                {view === "forgot" && t("auth.forgotSub")}
                {view === "otp" && t("auth.otpSub")}
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
              <div className="text-sm font-bold text-emerald-400">{t("auth.loginSuccess")}</div>
              <div className="text-[10px] text-white/40 mt-1">{t("auth.welcomeBack")}</div>
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
                  {t("auth.password")}
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
                  <span className="text-[10px] text-white/50">{t("auth.rememberMe")}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 transition-colors"
                >
                  {t("auth.forgotPassword")}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 disabled:opacity-50 transition-all"
              >
                {loading ? t("auth.verifying") : t("auth.login")}
              </button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="px-3 bg-transparent text-white/30">{t("auth.orDivider")}</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-2 sm:py-2.5 rounded-lg border border-white/10 text-white/50 text-[11px] sm:text-xs hover:bg-white/5 hover:text-white/70 transition-all"
              >
                {t("auth.otpQuickLogin")}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40">{t("auth.noAccount")}</span>
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 ml-1 transition-colors"
                >
                  {t("auth.registerNow")}
                </button>
              </div>
            </form>
          ) : view === "register" ? (
            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  {t("auth.company")}
                </label>
                <div className="relative">
                  <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    placeholder={t("auth.companyPlaceholder")}
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
                  {t("auth.phone")}
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
                  {t("auth.setPassword")}
                </label>
                <div className="relative">
                  <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder={t("auth.passwordMin")}
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
                  {t("auth.agreeTerms")}{" "}
                  <span className="text-cyan-400/70 hover:text-cyan-400 cursor-pointer">
                    {t("auth.termsLink")}
                  </span>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !agreed}
                className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 disabled:opacity-50 transition-all"
              >
                {loading ? t("auth.processing") : t("auth.sendOtp")}
              </button>

              <div className="text-center pt-2">
                <span className="text-[10px] text-white/40">{t("auth.hasAccount")}</span>
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="text-[10px] text-cyan-400/70 hover:text-cyan-400 ml-1 transition-colors"
                >
                  {t("auth.backToLogin")}
                </button>
              </div>
            </form>
          ) : view === "forgot" ? (
            <form onSubmit={handleForgot} className="space-y-3 sm:space-y-4">
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-white/10 mb-3 sm:mb-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Shield size={16} className="text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
                    {t("auth.forgotDesc")}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  {t("auth.registerEmail")}
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
                {loading ? t("auth.sending") : t("auth.sendReset")}
              </button>
            </form>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-panel rounded-xl p-3 sm:p-4 border border-emerald-400/20 bg-emerald-400/5">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div className="text-[10px] sm:text-[11px] text-white/60 leading-relaxed">
                    {t("auth.otpSent")}
                    <br />
                    <span className="text-[9px] text-white/40">
                      {t("auth.otpSpam")}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[9px] sm:text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">
                  {t("auth.otpCode")}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 sm:py-3 text-center text-base sm:text-lg font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/40 transition-colors tracking-widest"
                />
              </div>

              <button className="w-full py-2.5 sm:py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 text-[11px] sm:text-xs font-bold tracking-wider uppercase hover:bg-cyan-400/20 transition-all">
                {t("auth.verifyContinue")}
              </button>

              <div className="text-center">
                <button className="text-[10px] text-white/40 hover:text-white/60 transition-colors">
                  {t("auth.resendOtp")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
