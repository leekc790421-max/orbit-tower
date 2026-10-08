"use client";

import { X, Info, Hexagon, Globe, Shield, Zap, Users, Building, Sparkles, Droplets, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useTranslation();
  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

          <div className="relative w-full sm:max-w-3xl h-[85vh] sm:h-auto sm:max-h-[85vh] overflow-y-auto glass-panel rounded-t-2xl sm:rounded-2xl border-t sm:border border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
            {/* 頂部 */}
            <div className="sticky top-0 z-10 glass-panel border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wider">
                  {t('about.title')}
                </h2>
                <p className="text-xs sm:text-sm text-cyan-400/60 tracking-wider mt-1">
                  {t('about.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all"
              >
                <X size={16} className="text-white/40" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* 主介紹 */}
              <div className="glass-panel rounded-xl p-5 border border-white/10">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
                    <Hexagon size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                      {t('about.whatTitle')}
                    </h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                      {t('about.whatDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* 三大核心機制 */}
              <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-cyan-400" />
                  {t('about.coreMech')}
                </h3>
                <div className="space-y-4">
                  <CoreMechanism
                    icon={Building}
                    title={t('about.mech1Title')}
                    description={t('about.mech1Desc')}
                  />
                  <CoreMechanism
                    icon={Droplets}
                    title={t('about.mech2Title')}
                    description={t('about.mech2Desc')}
                  />
                  <CoreMechanism
                    icon={Search}
                    title={t('about.mech3Title')}
                    description={t('about.mech3Desc')}
                  />
                </div>
              </div>

              {/* 核心功能 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Globe}
                  title={t('about.featDomain')}
                  description={t('about.featDomainDesc')}
                />
                <FeatureCard
                  icon={Shield}
                  title={t('about.featSecurity')}
                  description={t('about.featSecurityDesc')}
                />
                <FeatureCard
                  icon={Zap}
                  title={t('about.featAI')}
                  description={t('about.featAIDesc')}
                />
                <FeatureCard
                  icon={Users}
                  title={t('about.featTraffic')}
                  description={t('about.featTrafficDesc')}
                />
              </div>

              {/* 適合誰 */}
              <div className="glass-panel rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={20} className="text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {t('about.whoTitle')}
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-white/70">
                  <p>• <span className="text-white font-semibold">{t('about.whoStartup')}</span> — {t('about.whoStartupDesc')}</p>
                  <p>• <span className="text-white font-semibold">{t('about.whoFreelance')}</span> — {t('about.whoFreelanceDesc')}</p>
                  <p>• <span className="text-white font-semibold">{t('about.whoSME')}</span> — {t('about.whoSMEDesc')}</p>
                  <p>• <span className="text-white font-semibold">{t('about.whoEnterprise')}</span> — {t('about.whoEnterpriseDesc')}</p>
                </div>
              </div>

              {/* 如何開始 */}
              <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                  {t('about.howTitle')}
                </h3>
                <div className="space-y-3">
                  <Step number={1} text={t('about.how1')} />
                  <Step number={2} text={t('about.how2')} />
                  <Step number={3} text={t('about.how3')} />
                  <Step number={4} text={t('about.how4')} />
                </div>
              </div>

              {/* 聯絡資訊 */}
              <div className="glass-panel rounded-xl p-5 border border-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                  {t('about.helpTitle')}
                </h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>{t('about.helpEmail')}</p>
                  <p>{t('about.helpAI')}</p>
                  <p>{t('about.helpFAQ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CoreMechanism({ icon: Icon, title, description }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-cyan-400" />
      </div>
      <div>
        <h4 className="text-sm sm:text-base font-bold text-white mb-1">{title}</h4>
        <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: React.ComponentType<{ size?: number; className?: string }>; title: string; description: string }) {
  return (
    <div className="glass-panel rounded-xl p-4 border border-white/10 hover:border-cyan-400/30 transition-all">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center flex-shrink-0">
          <Icon size={20} className="text-cyan-400" />
        </div>
        <div>
          <h4 className="text-sm sm:text-base font-bold text-white mb-1">{title}</h4>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-cyan-300">{number}</span>
      </div>
      <p className="text-sm sm:text-base text-white/70 pt-1">{text}</p>
    </div>
  );
}
