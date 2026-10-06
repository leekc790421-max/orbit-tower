"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, Hexagon, MousePointer, Palette, MessageCircle, HelpCircle } from "lucide-react";

interface OnboardingProps {
  onClose: () => void;
}

const STEPS = [
  {
    icon: Hexagon,
    title: "歡迎來到 Orbit Tower",
    description: "這是一座 3D 虛擬企業總部大樓。每層樓有 6 個戶別，代表不同的企業空間。",
    tip: "用滑鼠拖曳可以旋轉大樓，滾輪可以縮小放大",
  },
  {
    icon: MousePointer,
    title: "點擊戶別查看詳情",
    description: "每個發光的方塊是一個企業戶別。點擊它可以看到該戶別的詳細資訊。",
    tip: "藍色 = 空置中，彩色 = 已進駐，紅色 = 保護中",
  },
  {
    icon: Palette,
    title: "自訂你的體驗",
    description: "右下角的控制面板可以切換背景主題和燈光顏色，打造你的專屬氛圍。",
    tip: "三種背景：賽博夜城、雲海高山、深海星光",
  },
  {
    icon: MessageCircle,
    title: "AI 樓管隨時待命",
    description: "左下角的 AI 樓管可以回答你的問題，帶你參觀大樓，介紹方案價格。",
    tip: "試試問：「帶我看 3F 的空置戶」",
  },
  {
    icon: HelpCircle,
    title: "需要幫助？",
    description: "右上角的 FAQ 按鈕有常見問題解答。也可以隨時問 AI 樓管。",
    tip: "準備好了嗎？開始探索你的虛擬總部吧！",
  },
];

export default function Onboarding({ onClose }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleSkip} />

      {/* 主面板 */}
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-cyan-400/30 shadow-2xl shadow-cyan-400/20">
        {/* 關閉按鈕 */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:border-red-400/50 hover:bg-red-400/10 transition-all z-10"
        >
          <X size={16} className="text-white/40" />
        </button>

        {/* 內容區 */}
        <div className="p-6 sm:p-8">
          {/* 圖示 */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cyan-400/10 border-2 border-cyan-400/30 flex items-center justify-center">
              <Icon size={32} className="text-cyan-400" />
            </div>
          </div>

          {/* 標題 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-3">
            {step.title}
          </h2>

          {/* 描述 */}
          <p className="text-sm sm:text-base text-white/70 text-center mb-4 leading-relaxed">
            {step.description}
          </p>

          {/* 小提示 */}
          <div className="glass-panel rounded-xl p-4 border border-cyan-400/20 bg-cyan-400/5 mb-6">
            <p className="text-xs sm:text-sm text-cyan-300 text-center">
              💡 {step.tip}
            </p>
          </div>

          {/* 進度指示器 */}
          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStep
                    ? "w-8 bg-cyan-400"
                    : idx < currentStep
                    ? "w-4 bg-cyan-400/50"
                    : "w-4 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* 按鈕區 */}
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all text-sm sm:text-base"
            >
              跳過教學
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-3 rounded-lg bg-cyan-400/10 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-400/20 transition-all text-sm sm:text-base font-bold flex items-center justify-center gap-2"
            >
              {currentStep < STEPS.length - 1 ? (
                <>
                  下一步
                  <ChevronRight size={18} />
                </>
              ) : (
                "開始探索"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
