"use client";

import { X, Info, Hexagon, Globe, Shield, Zap, Users, Building, Sparkles, Bottle, Search } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
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
                  關於 Orbit Tower
                </h2>
                <p className="text-xs sm:text-sm text-cyan-400/60 tracking-wider mt-1">
                  Cyber Luxury 數位地產商場
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
                      什麼是 Orbit Tower？
                    </h3>
                    <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                      Orbit Tower 是一個結合 <span className="text-cyan-300 font-semibold">3D 空間體驗</span>、<span className="text-cyan-300 font-semibold">品牌虛擬展示</span>與<span className="text-cyan-300 font-semibold">動態流量裂變</span>的 Cyber Luxury 數位地產商場。我們用六角晶體摩天樓的形態，打造了一座創新的虛擬企業總部平台，讓品牌可以在這裡「進駐」虛擬空間，建立自己的數位據點。
                    </p>
                  </div>
                </div>
              </div>

              {/* 三大核心機制 */}
              <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-cyan-400" />
                  三大核心機制
                </h3>
                <div className="space-y-4">
                  <CoreMechanism
                    icon={Building}
                    title="3D 空間展示"
                    description="高透光晶體大樓與動態樓層排序。每層樓 6 個品牌店面，共 36 個企業空間。選擇適合你的樓層和面向，建立虛擬總部。"
                  />
                  <CoreMechanism
                    icon={Bottle}
                    title="漂流瓶互動 (/drift)"
                    description="Groq API 毫秒級動態生成籤詩與優惠，提升顧客停留時間。每次拋接都是獨特的體驗，讓品牌與客戶建立更深層的連結。"
                  />
                  <CoreMechanism
                    icon={Search}
                    title="IndexNow 即時搜尋收錄"
                    description="更新內容 24 小時內快速報備搜尋引擎，建立自動化流量池。讓你的品牌在 Google、Bing 等搜尋引擎中快速被發現。"
                  />
                </div>
              </div>

              {/* 核心功能 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FeatureCard
                  icon={Globe}
                  title="網域綁定"
                  description="支援子網域自動配發，也可以綁定你自己的網域。讓客戶輕鬆找到你。"
                />
                <FeatureCard
                  icon={Shield}
                  title="資安保護"
                  description="獨立沙盒環境、AES-256 加密、多重身份驗證。你的資料絕對安全。"
                />
                <FeatureCard
                  icon={Zap}
                  title="AI 運算資源"
                  description="內建 AI 樓管 24 小時服務，提供運算資源和智能分析，幫助你的業務成長。"
                />
                <FeatureCard
                  icon={Users}
                  title="流量裂變"
                  description="透過漂流瓶互動與 IndexNow 即時收錄，自動建立流量池，讓品牌能見度指數成長。"
                />
              </div>

              {/* 適合誰 */}
              <div className="glass-panel rounded-xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Users size={20} className="text-cyan-400" />
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    適合誰使用？
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-white/70">
                  <p>• <span className="text-white font-semibold">新創團隊</span> — 需要低成本的數位據點，快速建立品牌形象</p>
                  <p>• <span className="text-white font-semibold">自由工作者</span> — 想要專業的企業形象，接案更有說服力</p>
                  <p>• <span className="text-white font-semibold">中小企業</span> — 擴展數位足跡，增加線上能見度</p>
                  <p>• <span className="text-white font-semibold">大型企業</span> — 建立創新形象，展示科技實力</p>
                </div>
              </div>

              {/* 如何開始 */}
              <div className="glass-panel rounded-xl p-5 border border-cyan-400/30 bg-cyan-400/5">
                <h3 className="text-base sm:text-lg font-bold text-white mb-4">
                  如何開始？
                </h3>
                <div className="space-y-3">
                  <Step number={1} text="點擊大樓中的空置戶別（藍色方塊），查看詳細資訊" />
                  <Step number={2} text="選擇適合你的方案（基礎免費 / 專業 $29 / 旗艦 $99）" />
                  <Step number={3} text="完成註冊和付款，系統自動配發網域與樓層" />
                  <Step number={4} text="開始建立你的虛擬企業總部！" />
                </div>
              </div>

              {/* 聯絡資訊 */}
              <div className="glass-panel rounded-xl p-5 border border-white/10">
                <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                  需要協助？
                </h3>
                <div className="space-y-2 text-sm text-white/70">
                  <p>📧 Email：support@orbit-tower.tw</p>
                  <p>💬 AI 樓管：點擊左下角對話按鈕，24 小時在線</p>
                  <p>❓ 常見問題：點擊右上角 FAQ 按鈕</p>
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
