"use client";

import { ArrowUpRight, CalendarDays, Lightbulb, Newspaper, Sparkles } from "lucide-react";

const editions = [
  { day: "01", date: "MON", title: "AI 旗艦館進入空間化時代", dek: "從一頁式官網到可探索的數位總部，品牌體驗正在從平面入口轉向可被記住的空間敘事。", tag: "FEATURE" },
  { day: "02", date: "TUE", title: "企業網站的下一個轉換節點", dek: "3D 展示、AI 接待與名單收集不再是分散工具，而是同一座數位建築裡的連續旅程。", tag: "STRATEGY" },
  { day: "03", date: "WED", title: "從流量到停留：設計一個值得探索的品牌入口", dek: "當訪客可以旋轉、聚焦、深入每一層內容，品牌訊息就不必再依賴一張長長的落地頁。", tag: "DESIGN" },
  { day: "04", date: "THU", title: "多語 AI 接待，讓全球訪客即刻得到回應", dek: "中英日三語的即時溝通，將陌生訪客轉化為可持續培養的商務關係。", tag: "AI / CX" },
  { day: "05", date: "FRI", title: "數位展館的資安邊界如何被看見", dek: "隔離沙盒、加密資料與權限分層，正在成為企業選擇沉浸式體驗時的基本信任條件。", tag: "SECURITY" },
  { day: "06", date: "SAT", title: "品牌內容不只是資訊，而是空間動線", dek: "把服務、案例與 CTA 安排在清晰樓層，讓使用者每一步都知道下一個值得前往的地方。", tag: "EDITORIAL" },
  { day: "07", date: "SUN", title: "本週觀察：Orbit Tower 的新入口", dek: "閱讀、探索與預約現在可以在同一個入口切換；選擇熟悉的報紙，也可以前往沉浸式空間。", tag: "WEEKLY" },
];

const tips = [
  ["01", "讓瀏覽器保持輕盈", "先以 2D 內容快速傳達價值，再把 WebGL 留給真正需要沉浸感的關鍵段落。"],
  ["02", "CTA 要像下一層樓", "每個行動按鈕都應該清楚回答：點擊後會去哪裡、會看見什麼、需要花多少時間。"],
  ["03", "用內容建立回訪理由", "固定週期更新報導與密技，讓品牌網站從一次性展示變成可被收藏的編輯入口。"],
];

export default function ClassicView() {
  return (
    <section className="classic-view h-full overflow-y-auto">
      <div className="classic-shell mx-auto max-w-7xl px-5 pb-20 pt-28 sm:px-8 lg:px-12">
        <header className="classic-masthead border-y-2 border-slate-900/80 py-5 sm:py-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="classic-kicker">THE ORBIT TOWER / WEEKLY EDITION 07</p>
              <h2 className="classic-title">光躍星報</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">給正在打造下一座數位總部的人：7 天份報導、3C 密技，以及一個可隨時回到 3D 空間的閱讀入口。</p>
            </div>
            <div className="classic-date flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-slate-500"><CalendarDays size={15} /> 2026.10.11 / TAIPEI</div>
          </div>
        </header>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.45fr_.8fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cyan-700"><Newspaper size={15} /> SEVEN-DAY REPORT</div>
            <div className="classic-editions grid gap-5 sm:grid-cols-2">
              {editions.map((edition, index) => (
                <article key={edition.day} className={`classic-story ${index === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                  <div className="flex items-start justify-between gap-3"><span className="classic-day">{edition.day}</span><span className="classic-tag">{edition.tag}</span></div>
                  <h3>{edition.title}</h3>
                  <p>{edition.dek}</p>
                  <a href="#contact" className="classic-link">閱讀本期 <ArrowUpRight size={15} /></a>
                </article>
              ))}
            </div>
          </div>

          <aside className="classic-rail">
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cyan-700"><Lightbulb size={15} /> 3C 密技</div>
            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">把日常工具，變成更好的工作流。</h3>
            <div className="mt-6 divide-y divide-slate-900/10">
              {tips.map(([number, title, text]) => <div key={number} className="py-5"><div className="flex gap-3"><span className="classic-tip-number">{number}</span><div><h4 className="font-bold text-slate-900">{title}</h4><p className="mt-1 text-sm leading-6 text-slate-600">{text}</p></div></div></div>)}
            </div>
            <div className="classic-note mt-5"><Sparkles size={18} /><p>想看更完整的空間動線？切換到 3D 模式，旋轉大樓並點擊每一個樓層。</p></div>
          </aside>
        </div>

        <footer id="contact" className="classic-footer mt-12 border-t-2 border-slate-900/80 pt-6"><div><p className="classic-kicker">CONTACT / NEXT ISSUE</p><h3>讓你的品牌也擁有一座可探索的總部。</h3></div><a href="mailto:hello@xingdeng.tw" className="classic-link">聯絡 Orbit Tower <ArrowUpRight size={15} /></a></footer>
      </div>
    </section>
  );
}
