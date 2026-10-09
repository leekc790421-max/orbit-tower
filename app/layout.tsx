import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://orbit.xingdeng.tw";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "SNT 光躍星樞 | 3D Cyber Luxury 專屬空間地產與自動化流量商場",
  description:
    "SNT 光躍星樞 (Orbit Tower) 結合 3D 空間展示、/drift 漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
  keywords: [
    "SNT 光躍星樞",
    "SNT 光躍星枢",
    "SNT Nexus",
    "Orbit Tower",
    "3D 空間展示",
    "3D空間展示",
    "3Dサイバーラグジュアリー",
    "漂流瓶",
    "漂流瓶エンゲージメント",
    "AI 廣告 Agent",
    "AI広告エージェント",
    "品牌進駐",
    "自動化流量",
    "Cyber Luxury",
    "仮想地産",
    "虛擬地產",
    "六角晶體",
    "Three.js",
    "企業虛擬辦公室",
    "網域綁定",
    "AI 樓管",
    "B2B 平台",
    "機密沙盒",
    "數位辦公",
  ],
  authors: [{ name: "SNT Nexus Team" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: "SNT 光躍星樞 | SNT Nexus",
    title: "SNT 光躍星樞 | 3D Cyber Luxury 專屬空間地產與自動化流量商場",
    description: "SNT 光躍星樞 (Orbit Tower) 結合 3D 空間展示、/drift 漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "SNT 光躍星樞 | 3D Cyber Luxury 專屬空間地產與自動化流量商場",
      },
    ],
    alternateLocale: ["en_US", "ja_JP"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SNT 光躍星樞 | 3D Cyber Luxury 專屬空間地產與自動化流量商場",
    description: "SNT 光躍星樞 (Orbit Tower) 結合 3D 空間展示、/drift 漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
    images: ["/og-image.svg"],
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
    "ja:title": "SNT 光躍星枢 | 3Dサイバーラグジュアリー空間地産＆自動化集客プラットフォーム",
    "ja:description": "SNT光躍星枢（Orbit Tower）は、3D空間展示、/drift漂流瓶エンゲージメント、AI広告エージェントを融合した、全自動化ブランド出店＆集客エコシステムです。",
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
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
                  name: "SNT 光躍星樞是什麼？什麼是 3D Cyber Luxury 地產？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT 光躍星樞 (Orbit Tower) 是一座六角晶體摩天樓形態的虛擬企業總部平台。企業可在此進駐虛擬戶別，獲得專屬網域、AI 運算資源與品牌展示空間。結合 3D 互動體驗、/drift 漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is SNT Orbit Tower?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT Orbit Tower is a hexagonal crystal skyscraper virtual corporate headquarters platform. Companies can occupy virtual units with dedicated domains, AI resources, and brand showcase spaces. Combined with 3D interactive experiences, /drift bottle engagement, and AI advertising agents, it creates a fully automated brand onboarding and traffic ecosystem.",
                  },
                },
                {
                  "@type": "Question",
                  name: "SNT 光躍星枢とは何ですか？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "SNT 光躍星枢 (Orbit Tower) は、3D空間展示、/drift漂流瓶エンゲージメント、AI広告エージェントを融合した、全自動化ブランド出店＆集客エコシステムです。六角結晶摩天楼の形態で、革新的なバーチャル企業本社プラットフォームを構築。",
                  },
                },
                {
                  "@type": "Question",
                  name: "進駐 SNT 光躍星樞需要多少費用？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "我們提供三種 B2B 方案：門戶體驗版 NT$35,000/次、成長升級版 NT$60,000/次、企業總部版 NT$120,000+/次（含 MRR 維護費 $3,000/月）。",
                  },
                },
                {
                  "@type": "Question",
                  name: "什麼是戶號實名制？如何綁定自己的網域？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "每戶具備唯一識別碼，需通過手機/Email 實名驗證開通。支援標準子網域自動配發與獨立頂級網域 CNAME 綁定。",
                  },
                },
                {
                  "@type": "Question",
                  name: "AI 樓管能做什麼？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "AI 樓管 24 小時在線，提供樓層導覽、B2B 方案說明、網域綁定教學、機密沙盒環境說明等服務。",
                  },
                },
                {
                  "@type": "Question",
                  name: "機密沙盒是什麼？資安如何保障？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "F 面機密沙盒實案專區專為需要高度資安防護的企業設計，具備獨立隔離運算環境、AES-256 加密、多重身份驗證。",
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
              description: "SNT 光躍星樞 (Orbit Tower) 結合 3D 空間展示、漂流瓶流量裂變與 AI 廣告 Agent，打造全自動化品牌進駐與商業變現樞紐。",
            }),
          }}
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
