import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://orbit.xingdeng.tw";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Orbit Tower 賽博虛擬總部 | SNT 光躍星樞",
  description:
    "打造專屬 AI 數位旗艦館，結合 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款。7~14 天快速部署，讓您的品牌向全球展示。",
  keywords: [
    // Brand
    "SNT 光躍星樞",
    "SNT 光躍星枢",
    "SNT Nexus",
    "Orbit Tower",
    // Core product - Chinese
    "AI數位旗艦館",
    "3D品牌展示",
    "虛擬展館",
    "數位展廳",
    "品牌展示平台",
    "3D網站",
    "沉浸式體驗",
    "AI客服",
    "AI導購",
    "多語系網站",
    "跨境收款",
    "Payoneer",
    "企業官網",
    "品牌官網",
    "數位行銷",
    "SEO優化",
    // Core product - English
    "AI digital flagship store",
    "3D brand showcase",
    "virtual showroom",
    "digital showroom",
    "brand showcase platform",
    "3D website",
    "immersive experience",
    "AI customer service",
    "multilingual website",
    "cross-border payment",
    "corporate website",
    "digital marketing",
    // Core product - Japanese
    "AIデジタル旗艦館",
    "3Dブランドショーケース",
    "バーチャルショールーム",
    "デジタルショールーム",
    "ブランド展示プラットフォーム",
    "3Dウェブサイト",
    "没入型体験",
    "AIカスタマーサービス",
    "多言語ウェブサイト",
    "越境決済",
    "企業ウェブサイト",
    // Industry keywords
    "Three.js",
    "WebGL",
    "React",
    "Next.js",
    "Cyber Luxury",
    "六角晶體",
    "B2B 平台",
    "機密沙盒",
    // High-intent keywords
    "免費預約展示",
    "快速建置官網",
    "7天上线",
    "品牌數位轉型",
  ],
  authors: [{ name: "SNT Nexus Team" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: "SNT 光躍星樞 | AI數位旗艦館",
    title: "SNT 光躍星樞 | AI數位旗艦館 — 3D品牌展示 × 多語客服 × 跨境收款",
    description: "打造專屬 AI 數位旗艦館，結合 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款。7~14 天快速部署。",
    images: [
      {
        url: `${SITE_URL}/og-image.svg`,
        width: 1200,
        height: 630,
        alt: "SNT 光躍星樞 | AI數位旗艦館 — 3D品牌展示 × 多語客服 × 跨境收款",
      },
    ],
    alternateLocale: ["en_US", "ja_JP"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SNT 光躍星樞 | AI數位旗艦館 — 3D品牌展示 × 多語客服 × 跨境收款",
    description: "打造專屬 AI 數位旗艦館，結合 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款。7~14 天快速部署。",
    images: [`${SITE_URL}/og-image.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "zh-TW": SITE_URL,
      "en": SITE_URL,
      "ja": SITE_URL,
    },
  },
  other: {
    "ja:title": "SNT 光躍星枢 | AIデジタル旗艦館 — 3Dブランド展示 × 多言語AI客服 × 越境決済",
    "ja:description": "専用AIデジタル旗艦館を構築。3Dブランド展示、中英日三言語AIカスタマーサービス、グローバル顧客対応、越境決済を統合。7〜14日で迅速デプロイ。",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#050510",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-TW" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        {/* hreflang tags for multi-language SEO */}
        <link rel="alternate" hrefLang="zh-TW" href={SITE_URL} />
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="ja" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
        {/* Structured Data: FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "SNT 光躍星樞是什麼？什麼是 AI 數位旗艦館？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT 光躍星樞 (Orbit Tower) 是一個 AI 數位旗艦館平台，讓企業透過 3D 空間展示品牌、產品與服務。結合中英日三語 AI 客服、全球客戶接待與跨境付款，7~14 天快速部署。",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is SNT Orbit Tower? What is an AI Digital Flagship Store?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT Orbit Tower is an AI Digital Flagship Store platform that enables enterprises to showcase their brand, products, and services through 3D spatial experiences. Combined with trilingual AI customer service (Chinese, English, Japanese), global client reception, and cross-border payments. Deployed in 7-14 days.",
                  },
                },
                {
                  "@type": "Question",
                  name: "SNT 光躍星枢とは何ですか？AIデジタル旗艦館とは？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT 光躍星枢 (Orbit Tower) は、企業が3D空間でブランド・製品・サービスを展示できるAIデジタル旗艦館プラットフォームです。中英日三言語AIカスタマーサービス、グローバル顧客対応、越境決済を統合し、7〜14日で迅速デプロイ。",
                  },
                },
                {
                  "@type": "Question",
                  name: "AI 數位旗艦館的方案價格是多少？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "我們提供三種方案：Lite USD $3,999（標準3D展示館）、Pro USD $9,999（客製品牌館，最受歡迎）、Enterprise USD $29,999+（全客製方案）。所有方案皆含中英日三語系、AI 客服、品牌展示。",
                  },
                },
                {
                  "@type": "Question",
                  name: "如何預約免費展示？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "點擊網站右上角「方案價格」或左下方 AI 樓管，即可預約免費展示。我們的顧問會在 24 小時內與您聯繫，了解需求並安排線上示範。完全免費，無需信用卡。",
                  },
                },
                {
                  "@type": "Question",
                  name: "建置完成後可以修改內容嗎？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "可以。所有方案都支援即時更新品牌資訊、產品圖片、影片內容。AI 樓管協助您快速調整展示內容，確保數位旗艦館始終保持最新狀態。",
                  },
                },
                {
                  "@type": "Question",
                  name: "支援哪些產業？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "我們服務超過 20 種產業：科技新創、醫美診所、房仲業、顧問公司、餐飲品牌、電商、教育機構、律師事務所、設計工作室等。每個產業都有專屬展示模板和 AI 客服話術。",
                  },
                },
                {
                  "@type": "Question",
                  name: "如何確保投資報酬率？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "我們提供完整的數據分析儀表板：訪客數量、停留時間、熱門頁面、AI 客服對話記錄、名單轉換率。根據現有客戶數據，平均 3 個月內可回收投資成本。",
                  },
                },
                {
                  "@type": "Question",
                  name: "支援哪些付款方式？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "台灣客戶支援 ATM 轉帳、銀行匯款。海外客戶支援 Payoneer 跨境收款、國際電匯。所有付款皆安全可靠。",
                  },
                },
                {
                  "@type": "Question",
                  name: "需要 VR 設備嗎？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "不需要。手機與電腦即可使用。SNT 光躍星樞採用網頁 3D 技術，無需安裝任何軟體或購買額外設備。",
                  },
                },
              ],
            }),
          }}
        />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "SNT 光躍星樞",
              alternateName: "SNT Nexus / Orbit Tower / SNT 光躍星枢",
              url: SITE_URL,
              logo: `${SITE_URL}/logo-dark.jpg`,
              description: "SNT 光躍星樞 (Orbit Tower) 是 AI 數位旗艦館平台，提供 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款服務。7~14 天快速部署。",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["Chinese", "English", "Japanese"],
              },
            }),
          }}
        />
        {/* Structured Data: Service */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "AI Digital Flagship Store Platform",
              name: "SNT 光躍星樞 — AI 數位旗艦館",
              description: "打造專屬 AI 數位旗艦館，結合 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款。7~14 天快速部署，讓您的品牌向全球展示。",
              provider: {
                "@type": "Organization",
                name: "SNT Nexus Team",
                url: SITE_URL,
              },
              areaServed: [
                { "@type": "Country", name: "Taiwan" },
                { "@type": "Country", name: "Japan" },
                { "@type": "Country", name: "United States" },
                { "@type": "Country", name: "Hong Kong" },
                { "@type": "Country", name: "Singapore" },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "AI 數位旗艦館方案",
                itemListElement: [
                  {
                    "@type": "Offer",
                    name: "Lite — 標準3D展示館",
                    price: "3999",
                    priceCurrency: "USD",
                    description: "標準3D展示館、AI客服、品牌展示、中英日語系、專屬網址",
                  },
                  {
                    "@type": "Offer",
                    name: "Pro — 客製品牌館",
                    price: "9999",
                    priceCurrency: "USD",
                    description: "客製品牌館、AI客服、AI導購、影音展示、名單收集、中英日語系",
                  },
                  {
                    "@type": "Offer",
                    name: "Enterprise — 全客製方案",
                    priceSpecification: {
                      "@type": "PriceSpecification",
                      minPrice: "29999",
                      priceCurrency: "USD",
                    },
                    description: "企業客製功能、API整合、CRM整合、專屬開發",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className="h-full overflow-hidden">
        {children}
        {/* ===== SSR SEO Content Block — 搜尋引擎可讀取 ===== */}
        <noscript>
          <div style={{padding:'2rem',color:'#fff',background:'#050510',fontFamily:'sans-serif',lineHeight:'1.8'}}>
            <h1>SNT 光躍星樞 | AI數位旗艦館 — 3D品牌展示 × 多語客服 × 跨境收款</h1>
            <p>打造專屬 AI 數位旗艦館，讓您的品牌透過中英日三語向全球展示。結合 AI客服、3D品牌展示、全球客戶接待與跨境付款。7~14天快速部署。</p>
            <h2>您的企業是否正在面臨這些問題？</h2>
            <ul>
              <li>網站流量來了卻很快離開</li>
              <li>品牌網站與競爭對手沒有差異</li>
              <li>無法完整展示產品與服務</li>
              <li>無法有效收集潛在名單</li>
            </ul>
            <h2>Orbit Tower 如何解決</h2>
            <ul>
              <li>AI Reception Agent — 24小時AI客服接待</li>
              <li>3D Brand Experience — 沉浸式品牌展示</li>
              <li>Global Multilingual — 中文 / English / 日本語</li>
              <li>Lead Collection System — 自動收集客戶資料</li>
            </ul>
            <h2>方案價格</h2>
            <ul>
              <li>Lite — USD $3,999：標準3D展示館、AI客服、品牌展示、三語支援</li>
              <li>Pro — USD $9,999：客製品牌館、AI客服、AI導購、名單收集、影音展示</li>
              <li>Enterprise — USD $29,999+：企業客製、API串接、CRM串接、專案開發</li>
            </ul>
            <h2>付款方式</h2>
            <p>台灣：ATM轉帳、銀行匯款。海外：Payoneer跨境收款、國際電匯。</p>
            <h2>常見問題 FAQ</h2>
            <p>Q: 這是元宇宙嗎？ A: 不是。這是一套企業專屬AI數位旗艦館。</p>
            <p>Q: 需要VR設備嗎？ A: 不需要。手機與電腦即可使用。</p>
            <p>Q: 支援哪些語言？ A: 繁體中文、English、日本語。</p>
            <p>Q: 如何付款？ A: ATM、銀行匯款、Payoneer。</p>
            <p>Q: 多久交付？ A: 7至14天。</p>
            <h2>展示館範例</h2>
            <ul>
              <li>房仲展示館 — Luxury Real Estate Pavilion</li>
              <li>醫美展示館 — Medical Beauty Pavilion</li>
              <li>顧問品牌館 — Consultant Brand Pavilion</li>
              <li>企業品牌館 — Corporate Business Pavilion</li>
            </ul>
            <h2>2026 自動化行銷矩陣</h2>
            <p>Botpress / Coze 商業機器人 | Surfer SEO / GrowthBar | ManyChat / Chatfuel 自動推播 | 裂變矩陣系統 | OMO 銷售閉環 | Make / Zapier 自動化 | AI 廣告素材生成</p>
            <p>Build Your AI Digital Flagship Store. AI-powered Brand Experience for Global Customers. Trilingual: Chinese, English, Japanese. Cross-border payments via Payoneer. Deploy in 7-14 days.</p>
            <p>AIデジタルブランド館を構築。世界へ向けたブランド展示空間。中英日三言語対応。越境決済対応。7〜14日で迅速デプロイ。</p>
          </div>
        </noscript>
        {/* Hidden SSR content for crawlers (visible to search engines, hidden visually) */}
        <div aria-hidden="true" style={{position:'absolute',width:'1px',height:'1px',overflow:'hidden',clip:'rect(0,0,0,0)',whiteSpace:'nowrap'}}>
          <h1>SNT 光躍星樞 | AI數位旗艦館 — 3D品牌展示 × 多語客服 × 跨境收款</h1>
          <p>打造專屬 AI 數位旗艦館，讓您的品牌透過中英日三語向全球展示。AI客服、3D品牌展示、全球客戶接待、ATM與Payoneer付款、7~14天快速部署。</p>
          <p>Build Your AI Digital Flagship Store. AI-powered Brand Experience for Global Customers.</p>
          <p>AIデジタルブランド館を構築。世界へ向けたブランド展示空間。</p>
          <nav>
            <a href="/disclaimer">免責聲明 Disclaimer</a>
            <a href="/terms">服務條款 Terms of Service</a>
            <a href="/privacy">隱私權政策 Privacy Policy</a>
          </nav>
          <div itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">SNT 光躍星樞</span>
            <span itemProp="alternateName">Orbit Tower</span>
            <span itemProp="url">https://orbit.xingdeng.tw</span>
            <span itemProp="description">AI數位旗艦館平台 — 3D品牌展示、中英日三語AI客服、全球客戶接待與跨境付款</span>
          </div>
          <div itemScope itemType="https://schema.org/Service">
            <span itemProp="serviceType">AI Digital Flagship Store Platform</span>
            <span itemProp="name">SNT 光躍星樞 — AI 數位旗艦館</span>
            <span itemProp="description">打造專屬 AI 數位旗艦館，結合 3D 品牌展示、中英日三語 AI 客服、全球客戶接待與跨境付款。7~14 天快速部署。</span>
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="name">Lite</span><span itemProp="price">3999</span><span itemProp="priceCurrency">USD</span>
            </div>
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="name">Pro</span><span itemProp="price">9999</span><span itemProp="priceCurrency">USD</span>
            </div>
            <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
              <span itemProp="name">Enterprise</span><span itemProp="price">29999</span><span itemProp="priceCurrency">USD</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
