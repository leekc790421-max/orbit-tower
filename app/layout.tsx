import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orbit Tower — 賽博虛擬地產總部",
  description:
    "六角晶體摩天樓 3D 互動體驗。Orbit Tower 賽博虛擬地產總部，提供企業旗艦空間、網域對映、AI 樓管導覽。",
  keywords: ["Orbit Tower", "賽博地產", "虛擬總部", "3D", "六角晶體", "Three.js"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
