import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://orbit-tower.vercel.app";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Orbit Tower — 賽博虛擬地產總部 | 六角晶體摩天樓 3D 互動體驗",
  description:
    "Orbit Tower 六角晶體摩天樓 3D 互動體驗。提供企業旗艦空間、網域對映、AI 樓管導覽、機密沙盒環境。B2B 虛擬地產平台，三種環境背景切換，支援 CNAME 網域綁定。",
  keywords: [
    "Orbit Tower",
    "賽博地產",
    "虛擬總部",
    "3D 互動",
    "六角晶體",
    "Three.js",
    "企業虛擬辦公室",
    "網域綁定",
    "AI 樓管",
    "B2B 平台",
    "機密沙盒",
    "Cyberpunk",
    "虛擬地產",
    "數位辦公",
  ],
  authors: [{ name: "Orbit Tower Team" }],
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: SITE_URL,
    siteName: "Orbit Tower — 賽博虛擬地產總部",
    title: "Orbit Tower — 賽博虛擬地產總部",
    description: "六角晶體摩天樓 3D 互動體驗。企業旗艦空間、網域對映、AI 樓管導覽。",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Orbit Tower — 賽博虛擬地產總部",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Tower — 賽博虛擬地產總部",
    description: "六角晶體摩天樓 3D 互動體驗。企業旗艦空間、網域對映、AI 樓管導覽。",
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
    <html lang="zh-TW" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
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
                  name: "Orbit Tower 是什麼？什麼是賽博虛擬地產？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Orbit Tower 是一座六角晶體摩天樓形態的虛擬企業總部平台。企業可在此進駐虛擬戶別，獲得專屬網域、AI 運算資源與品牌展示空間。結合 3D 互動體驗與實際 B2B 服務，打造獨特的數位商業地產模式。",
                  },
                },
                {
                  "@type": "Question",
                  name: "進駐 Orbit Tower 需要多少費用？",
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
              name: "Orbit Tower",
              alternateName: "賽博虛擬地產總部",
              url: SITE_URL,
              description: "六角晶體摩天樓 3D 互動體驗虛擬企業總部平台",
            }),
          }}
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
