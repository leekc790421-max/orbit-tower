"use client";

import { ArrowUpRight, Check, X } from "lucide-react";
import { useState } from "react";

type PageKey = "services" | "cases" | "plans" | "contact";

const pages: Record<PageKey, { label: string; eyebrow: string; title: string; intro: string }> = {
  services: { label: "服務", eyebrow: "CAPABILITIES", title: "把品牌、內容與 AI，組成一個能工作的數位總部。", intro: "從策略與設計，到 3D 體驗、AI 接待與轉換流程，Orbit Tower 把分散的數位觸點整合成清楚、快速、可持續經營的商業入口。" },
  cases: { label: "案例", eyebrow: "SELECTED WORK", title: "讓訪客不只看見你，而是知道下一步要做什麼。", intro: "我們以商業目標為核心，設計可以被探索、被理解，也能把興趣導向詢問與預約的品牌體驗。" },
  plans: { label: "方案", eyebrow: "ENGAGEMENT", title: "從一個清楚的入口開始，逐步長成完整的品牌空間。", intro: "依照你的階段選擇啟動方式；先驗證方向，再擴充內容、AI 與沉浸式互動，不必一次承擔所有複雜度。" },
  contact: { label: "聯絡", eyebrow: "START A CONVERSATION", title: "告訴我們，你正在打造哪一座數位總部。", intro: "留下你的目標與目前遇到的問題，我們會用最短路徑回覆適合的下一步。" },
};

const serviceItems = ["品牌策略與網站架構", "3D 產品與空間展示", "AI 多語接待與內容系統", "轉換流程、表單與預約設計"];
const caseItems = ["科技品牌數位總部", "AI 產品展示入口", "跨語系商業網站", "互動式展館與活動頁"];

export default function ClassicView({ onOpenSpatial }: { onOpenSpatial: () => void }) {
  const [activePage, setActivePage] = useState<PageKey | null>(null);
  const page = activePage ? pages[activePage] : null;

  return (
    <section className="business-view h-full overflow-y-auto">
      <nav className="business-nav" aria-label="網站頁面">
        <a className="business-brand" href="#top" onClick={() => setActivePage(null)}>
          <span className="business-brand-mark">O</span>
          <span>ORBIT TOWER</span>
        </a>
        <div className="business-nav-links">
          {(Object.keys(pages) as PageKey[]).map((key) => (
            <button key={key} type="button" onClick={() => setActivePage(key)} className={activePage === key ? "is-active" : ""}>
              {pages[key].label}
            </button>
          ))}
        </div>
        <span className="business-nav-status">DIGITAL BUSINESS EXPERIENCE</span>
        <button type="button" className="business-spatial-link" onClick={onOpenSpatial}>進入 3D <ArrowUpRight size={14} /></button>
      </nav>

      <div id="top" className="business-shell mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 lg:px-12">
        {!page ? (
          <>
            <header className="business-hero">
              <div className="business-hero-copy">
                <p className="business-kicker">ORBIT TOWER / DIGITAL BUSINESS EXPERIENCE</p>
                <h1>讓你的網站，<br /><em>成為一座會工作的總部。</em></h1>
                <p className="business-lead">科技商業網站、AI 接待與沉浸式品牌展示，集中在一個清楚、快速、能帶來下一步的入口。</p>
                <div className="business-hero-actions">
                  <button type="button" className="business-primary" onClick={() => setActivePage("contact")}>開始討論 <ArrowUpRight size={16} /></button>
                  <button type="button" className="business-secondary" onClick={() => setActivePage("services")}>查看服務</button>
                </div>
              </div>
              <div className="business-hero-grid" aria-label="服務特色">
                <div><strong>01</strong><span>清楚的商業敘事</span></div>
                <div><strong>02</strong><span>可被探索的體驗</span></div>
                <div><strong>03</strong><span>能持續經營的系統</span></div>
              </div>
            </header>
            <section className="business-feature-grid">
              <button type="button" onClick={() => setActivePage("services")}><span>01 / 服務</span><strong>從策略到實作，整合品牌與轉換。</strong><ArrowUpRight size={18} /></button>
              <button type="button" onClick={() => setActivePage("cases")}><span>02 / 案例</span><strong>讓複雜的科技產品變得容易理解。</strong><ArrowUpRight size={18} /></button>
              <button type="button" onClick={() => setActivePage("plans")}><span>03 / 方案</span><strong>從一頁入口，逐步長成數位總部。</strong><ArrowUpRight size={18} /></button>
            </section>
          </>
        ) : (
          <section className="business-page" aria-live="polite">
            <button type="button" className="business-page-close" onClick={() => setActivePage(null)} aria-label="返回首頁"><X size={18} /> 返回首頁</button>
            <div className="business-page-header"><p className="business-kicker">{page.eyebrow}</p><h2>{page.title}</h2><p className="business-lead">{page.intro}</p></div>
            {activePage === "services" && <div className="business-list">{serviceItems.map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong><ArrowUpRight size={18} /></div>)}</div>}
            {activePage === "cases" && <div className="business-list">{caseItems.map((item, i) => <div key={item}><span>0{i + 1}</span><strong>{item}</strong><ArrowUpRight size={18} /></div>)}</div>}
            {activePage === "plans" && <div className="business-plan-grid"><article><span>START</span><h3>先把入口做好</h3><p>適合需要快速上線、整理品牌敘事與建立詢問流程的團隊。</p><b><Check size={15} /> 商業網站與內容架構</b><b><Check size={15} /> 聯絡與預約流程</b></article><article><span>SPATIAL</span><h3>讓品牌被探索</h3><p>適合需要 3D 展示、互動導覽與更深品牌記憶點的團隊。</p><b><Check size={15} /> 沉浸式 3D 空間</b><b><Check size={15} /> AI 接待與多語內容</b></article></div>}
            {activePage === "contact" && <div className="business-contact"><a className="business-primary" href="mailto:hello@xingdeng.tw">hello@xingdeng.tw <ArrowUpRight size={16} /></a><p>或直接使用右上角的預約入口，讓我們了解你的專案階段。</p></div>}
          </section>
        )}
      </div>
    </section>
  );
}
